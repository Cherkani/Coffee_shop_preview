"use client"

import type React from "react"

import { useAppStore } from "@/lib/store"
import { LoginScreen } from "./login-screen"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { ThemeProvider } from "@/lib/themes/theme-provider"

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, currentUser } = useAppStore()

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return (
    <ThemeProvider userId={currentUser?.id} defaultThemeId="classic-coffee">
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}
