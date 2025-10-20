import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "http://localhost:8081"

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  console.log("[v0] GET request received, params:", params)
  return handleRequest(request, params.path, "GET")
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  console.log("[v0] POST request received, params:", params)
  return handleRequest(request, params.path, "POST")
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  console.log("[v0] PUT request received, params:", params)
  return handleRequest(request, params.path, "PUT")
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  console.log("[v0] DELETE request received, params:", params)
  return handleRequest(request, params.path, "DELETE")
}

async function handleRequest(request: NextRequest, pathSegments: string[], method: string) {
  try {
    console.log("[v0] handleRequest called with pathSegments:", pathSegments, "method:", method)

    const path = pathSegments.join("/")
    const url = `${API_BASE_URL}/${path}`

    // Get query parameters
    const searchParams = new URL(request.url).searchParams
    const queryString = searchParams.toString()
    const finalUrl = queryString ? `${url}?${queryString}` : url

    console.log(`[v0] Proxying ${method} request to: ${finalUrl}`)

    // Prepare headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      // Add any auth headers if needed
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers,
      redirect: "manual", // Don't follow redirects automatically
    }

    // Add body for POST/PUT requests
    if (method === "POST" || method === "PUT") {
      const body = await request.text()
      if (body) {
        requestOptions.body = body
      }
    }

    const response = await fetch(finalUrl, requestOptions)

    console.log(`[v0] API Response status: ${response.status}`)

    // Handle redirects (likely auth redirects)
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location")
      console.log(`[v0] API redirected to: ${location}`)

      // Return error for auth redirects instead of following them
      return NextResponse.json(
        {
          error: "Authentication required",
          message: "API requires authentication. Please check your backend auth configuration.",
          redirectUrl: location,
        },
        { status: 401 },
      )
    }

    // Get response data
    const contentType = response.headers.get("content-type")
    let data

    if (contentType?.includes("application/json")) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    console.log(`[v0] API Response data:`, data)

    // Return successful response with CORS headers
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })
  } catch (error) {
    console.error("[v0] Proxy error:", error)

    return NextResponse.json(
      {
        error: "Proxy error",
        message: error instanceof Error ? error.message : "Unknown error",
        details: "Failed to connect to backend API",
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      },
    )
  }
}

export async function OPTIONS() {
  console.log("[v0] OPTIONS request received")
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
