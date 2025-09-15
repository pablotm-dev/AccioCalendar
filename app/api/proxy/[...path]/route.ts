import { NextResponse } from "next/server"

export async function GET() {
  const apiEnv = process.env.API_ENV || process.env.NODE_ENV
  const prodUrl = "http://179.190.40.40:8081"
  const devUrl = "http://localhost:8081"

  const apiUrl = apiEnv === "prod" || apiEnv === "production" ? prodUrl : devUrl

  console.log("[v0] Test Connection - Environment:", apiEnv)
  console.log("[v0] Test Connection - API URL:", apiUrl)
  console.log("[v0] Test Connection - All env vars:", Object.keys(process.env))

  try {
    // Teste simples de conectividade
    const testUrl = `${apiUrl}/tasks`
    console.log("[v0] Testing connection to:", testUrl)

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Timeout de 10 segundos
      signal: AbortSignal.timeout(10000),
    })

    console.log("[v0] Connection test response status:", response.status)
    console.log("[v0] Connection test response headers:", Object.fromEntries(response.headers.entries()))

    const responseText = await response.text()
    console.log("[v0] Connection test response body:", responseText)

    return NextResponse.json({
      success: true,
      environment: apiEnv,
      apiUrl: apiUrl,
      testUrl: testUrl,
      status: response.status,
      responsePreview: responseText.substring(0, 200),
      headers: Object.fromEntries(response.headers.entries()),
    })
  } catch (error) {
    console.error("[v0] Connection test failed:", error)

    return NextResponse.json(
      {
        success: false,
        environment: apiEnv,
        apiUrl: apiUrl,
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
