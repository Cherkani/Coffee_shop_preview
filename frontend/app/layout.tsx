import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { AuthWrapper } from "@/components/auth/auth-wrapper"

export const metadata: Metadata = {
  title: "CoffeePOS - Coffee Shop Management System",
  description: "Complete POS and backoffice solution for coffee shops",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  )
}
