import { type NextRequest, NextResponse } from "next/server"

const getApiBaseUrl = () => {
  const apiEnv = process.env.API_ENV || process.env.NODE_ENV

  console.log("[v0] API Environment:", apiEnv)
  console.log("[v0] NODE_ENV:", process.env.NODE_ENV)
  console.log("[v0] API_ENV:", process.env.API_ENV)

  if (apiEnv === "prod" || apiEnv === "production") {
    console.log("[v0] Using production API URL")
    return "http://179.190.40.40:8081"
  }

  console.log("[v0] Using development API URL")
  return "http://localhost:8081"
}

const API_BASE_URL = getApiBaseUrl()

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  const searchParams = request.nextUrl.searchParams.toString()
  const url = `${API_BASE_URL}/${path}${searchParams ? `?${searchParams}` : ""}`

  console.log("[v0] GET Request - URL:", url)
  console.log("[v0] GET Request - Path:", path)
  console.log("[v0] GET Request - Search Params:", searchParams)

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] API Response Status:", response.status)
    console.log("[v0] API Response OK:", response.ok)

    let data
    try {
      data = await response.json()
    } catch (jsonError) {
      console.error("[v0] Failed to parse JSON response:", jsonError)
      const textResponse = await response.text()
      console.log("[v0] Raw response:", textResponse)
      return NextResponse.json({ error: "Invalid JSON response from API", rawResponse: textResponse }, { status: 500 })
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[v0] API Proxy Error - Full details:", error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        error: "Failed to fetch data",
        details: error instanceof Error ? error.message : String(error),
        url: url,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  const url = `${API_BASE_URL}/${path}`
  const body = await request.text()

  console.log("[v0] POST Request - URL:", url)
  console.log("[v0] POST Request - Body:", body)

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })

    console.log("[v0] POST Response Status:", response.status)

    let data
    try {
      data = await response.json()
    } catch (jsonError) {
      console.error("[v0] Failed to parse POST JSON response:", jsonError)
      const textResponse = await response.text()
      return NextResponse.json({ error: "Invalid JSON response from API", rawResponse: textResponse }, { status: 500 })
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[v0] POST API Proxy Error:", error)
    return NextResponse.json(
      {
        error: "Failed to create data",
        details: error instanceof Error ? error.message : String(error),
        url: url,
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  const url = `${API_BASE_URL}/${path}`
  const body = await request.text()

  console.log("[v0] PUT Request - URL:", url)

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })

    console.log("[v0] PUT Response Status:", response.status)

    let data
    try {
      data = await response.json()
    } catch (jsonError) {
      console.error("[v0] Failed to parse PUT JSON response:", jsonError)
      const textResponse = await response.text()
      return NextResponse.json({ error: "Invalid JSON response from API", rawResponse: textResponse }, { status: 500 })
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[v0] PUT API Proxy Error:", error)
    return NextResponse.json(
      {
        error: "Failed to update data",
        details: error instanceof Error ? error.message : String(error),
        url: url,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/")
  const url = `${API_BASE_URL}/${path}`

  console.log("[v0] DELETE Request - URL:", url)

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] DELETE Response Status:", response.status)

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 })
    }

    let data
    try {
      data = await response.json()
    } catch (jsonError) {
      console.error("[v0] Failed to parse DELETE JSON response:", jsonError)
      const textResponse = await response.text()
      return NextResponse.json({ error: "Invalid JSON response from API", rawResponse: textResponse }, { status: 500 })
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("[v0] DELETE API Proxy Error:", error)
    return NextResponse.json(
      {
        error: "Failed to delete data",
        details: error instanceof Error ? error.message : String(error),
        url: url,
      },
      { status: 500 },
    )
  }
}
