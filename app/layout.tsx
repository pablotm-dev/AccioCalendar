import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/lib/auth"
import { MainLayout } from "@/components/layout/main-layout"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "TimeTracker - Gerenciamento de Calendário",
  description: "Sistema de gerenciamento de calendário e apontamentos de horas",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
