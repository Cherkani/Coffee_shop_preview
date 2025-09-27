"use client"

import { useState, useEffect } from "react"
import type { UserThemePreferences } from "@/lib/themes/types"

interface UserPreferencesData extends UserThemePreferences {
  // Additional user preferences can be added here
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  dashboard: {
    defaultView: "overview" | "sales" | "orders" | "inventory"
    compactMode: boolean
    showMetrics: boolean
  }
  pos: {
    soundEnabled: boolean
    autoComplete: boolean
    quickActions: string[]
  }
}

const defaultPreferences: Omit<UserPreferencesData, "userId" | "createdAt" | "updatedAt"> = {
  selectedThemeId: "classic-coffee",
  customizations: {},
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
  dashboard: {
    defaultView: "overview",
    compactMode: false,
    showMetrics: true,
  },
  pos: {
    soundEnabled: true,
    autoComplete: true,
    quickActions: ["cappuccino", "latte", "americano"],
  },
}

export function useUserPreferences(userId: string) {
  const [preferences, setPreferences] = useState<UserPreferencesData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load preferences from localStorage
  useEffect(() => {
    if (!userId) {
      setIsLoading(false)
      return
    }

    try {
      const stored = localStorage.getItem(`user-preferences-${userId}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        setPreferences({
          ...defaultPreferences,
          ...parsed,
          userId,
          createdAt: new Date(parsed.createdAt),
          updatedAt: new Date(parsed.updatedAt),
        })
      } else {
        // Create default preferences for new user
        const newPreferences: UserPreferencesData = {
          ...defaultPreferences,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        setPreferences(newPreferences)
        localStorage.setItem(`user-preferences-${userId}`, JSON.stringify(newPreferences))
      }
    } catch (err) {
      setError("Failed to load user preferences")
      console.error("Error loading preferences:", err)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const updatePreferences = (updates: Partial<UserPreferencesData>) => {
    if (!preferences) return

    const updatedPreferences = {
      ...preferences,
      ...updates,
      updatedAt: new Date(),
    }

    setPreferences(updatedPreferences)
    localStorage.setItem(`user-preferences-${userId}`, JSON.stringify(updatedPreferences))
  }

  const updateThemePreferences = (themeUpdates: Partial<UserThemePreferences>) => {
    updatePreferences(themeUpdates)
  }

  const updateNotificationPreferences = (notifications: UserPreferencesData["notifications"]) => {
    updatePreferences({ notifications })
  }

  const updateDashboardPreferences = (dashboard: UserPreferencesData["dashboard"]) => {
    updatePreferences({ dashboard })
  }

  const updatePosPreferences = (pos: UserPreferencesData["pos"]) => {
    updatePreferences({ pos })
  }

  const resetToDefaults = () => {
    const resetPreferences: UserPreferencesData = {
      ...defaultPreferences,
      userId,
      createdAt: preferences?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    setPreferences(resetPreferences)
    localStorage.setItem(`user-preferences-${userId}`, JSON.stringify(resetPreferences))
  }

  const exportPreferences = () => {
    if (!preferences) return null

    const exportData = {
      ...preferences,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `coffee-shop-preferences-${userId}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importPreferences = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string)

          // Validate imported data structure
          if (!imported.userId || !imported.selectedThemeId) {
            throw new Error("Invalid preferences file format")
          }

          const importedPreferences: UserPreferencesData = {
            ...defaultPreferences,
            ...imported,
            userId, // Always use current user ID
            createdAt: preferences?.createdAt || new Date(),
            updatedAt: new Date(),
          }

          setPreferences(importedPreferences)
          localStorage.setItem(`user-preferences-${userId}`, JSON.stringify(importedPreferences))
          resolve()
        } catch (err) {
          reject(new Error("Failed to import preferences: Invalid file format"))
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  return {
    preferences,
    isLoading,
    error,
    updatePreferences,
    updateThemePreferences,
    updateNotificationPreferences,
    updateDashboardPreferences,
    updatePosPreferences,
    resetToDefaults,
    exportPreferences,
    importPreferences,
  }
}
