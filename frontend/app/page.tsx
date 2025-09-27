"use client"

import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function HomePage() {
  const { currentUser } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    if (currentUser) {
      // Redirect based on user role
      switch (currentUser.role) {
        case "superuser":
          router.push("/console")
          break
        case "owner":
          router.push("/dashboard")
          break
        case "admin":
          router.push("/dashboard")
          break
        case "cashier":
          router.push("/pos")
          break
        default:
          router.push("/pos")
      }
    }
  }, [currentUser, router])

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-2">Loading CoffeePOS...</h1>
        <p className="text-muted-foreground">Redirecting to your dashboard</p>
      </div>
    </div>
  )
}
