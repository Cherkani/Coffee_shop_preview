"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { ThemeConfig, UserThemePreferences } from "./types"
import { themePresets } from "./presets"

interface ThemeContextType {
  currentTheme: ThemeConfig
  userPreferences: UserThemePreferences | null
  availableThemes: ThemeConfig[]
  setTheme: (themeId: string) => void
  updateCustomizations: (customizations: UserThemePreferences["customizations"]) => void
  resetToDefault: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: React.ReactNode
  userId?: string
  defaultThemeId?: string
}

export function ThemeProvider({ children, userId, defaultThemeId = "classic-coffee" }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(
    themePresets.find((theme) => theme.id === defaultThemeId) || themePresets[0],
  )
  const [userPreferences, setUserPreferences] = useState<UserThemePreferences | null>(null)

  // Load user preferences from localStorage
  useEffect(() => {
    if (userId) {
      const savedPreferences = localStorage.getItem(`theme-preferences-${userId}`)
      if (savedPreferences) {
        try {
          const preferences: UserThemePreferences = JSON.parse(savedPreferences)
          setUserPreferences(preferences)

          // Apply saved theme
          const savedTheme = themePresets.find((theme) => theme.id === preferences.selectedThemeId)
          if (savedTheme) {
            const customizedTheme = applyCustomizations(savedTheme, preferences.customizations)
            setCurrentTheme(customizedTheme)
          }
        } catch (error) {
          console.error("Failed to load theme preferences:", error)
        }
      }
    }
  }, [userId])

  // Apply theme to CSS variables
  useEffect(() => {
    applyThemeToDOM(currentTheme)
  }, [currentTheme])

  const setTheme = (themeId: string) => {
    const theme = themePresets.find((t) => t.id === themeId)
    if (!theme) return

    const customizedTheme = userPreferences ? applyCustomizations(theme, userPreferences.customizations) : theme

    setCurrentTheme(customizedTheme)

    if (userId) {
      const newPreferences: UserThemePreferences = {
        userId,
        selectedThemeId: themeId,
        customizations: userPreferences?.customizations || {},
        createdAt: userPreferences?.createdAt || new Date(),
        updatedAt: new Date(),
      }
      setUserPreferences(newPreferences)
      localStorage.setItem(`theme-preferences-${userId}`, JSON.stringify(newPreferences))
    }
  }

  const updateCustomizations = (customizations: UserThemePreferences["customizations"]) => {
    if (!userId) return

    const newPreferences: UserThemePreferences = {
      userId,
      selectedThemeId: userPreferences?.selectedThemeId || defaultThemeId,
      customizations,
      createdAt: userPreferences?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    const baseTheme = themePresets.find((t) => t.id === newPreferences.selectedThemeId) || themePresets[0]
    const customizedTheme = applyCustomizations(baseTheme, customizations)

    setCurrentTheme(customizedTheme)
    setUserPreferences(newPreferences)
    localStorage.setItem(`theme-preferences-${userId}`, JSON.stringify(newPreferences))
  }

  const resetToDefault = () => {
    const defaultTheme = themePresets.find((t) => t.id === defaultThemeId) || themePresets[0]
    setCurrentTheme(defaultTheme)

    if (userId) {
      localStorage.removeItem(`theme-preferences-${userId}`)
      setUserPreferences(null)
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        currentTheme,
        userPreferences,
        availableThemes: themePresets,
        setTheme,
        updateCustomizations,
        resetToDefault,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

// Helper function to apply customizations to a theme
function applyCustomizations(
  baseTheme: ThemeConfig,
  customizations: UserThemePreferences["customizations"],
): ThemeConfig {
  return {
    ...baseTheme,
    colors: { ...baseTheme.colors, ...customizations.colors },
    typography: { ...baseTheme.typography, ...customizations.typography },
    spacing: { ...baseTheme.spacing, ...customizations.spacing },
  }
}

// Helper function to apply theme to DOM CSS variables
function applyThemeToDOM(theme: ThemeConfig) {
  const root = document.documentElement

  // Apply color variables
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--${key}`, value)
  })

  // Apply typography variables
  root.style.setProperty("--font-family", theme.typography.fontFamily)
  root.style.setProperty("--heading-font", theme.typography.headingFont)

  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    root.style.setProperty(`--font-size-${key}`, value)
  })

  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    root.style.setProperty(`--font-weight-${key}`, value)
  })

  // Apply spacing variables
  root.style.setProperty("--radius", theme.spacing.radius)

  Object.entries(theme.spacing.spacing).forEach(([key, value]) => {
    root.style.setProperty(`--spacing-${key}`, value)
  })

  // Apply dark mode class
  if (theme.isDark) {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}
