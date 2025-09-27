"use client"

import { useState, useCallback } from "react"
import { useTheme } from "@/lib/themes/theme-provider"
import type { ThemeColors, ThemeTypography, ThemeSpacing } from "@/lib/themes/types"

export function useThemeCustomizer() {
  const { currentTheme, updateCustomizations, userPreferences } = useTheme()
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [tempCustomizations, setTempCustomizations] = useState(userPreferences?.customizations || {})

  const updateColorCustomization = useCallback(
    (colorKey: keyof ThemeColors, value: string) => {
      const newCustomizations = {
        ...tempCustomizations,
        colors: {
          ...tempCustomizations.colors,
          [colorKey]: value,
        },
      }
      setTempCustomizations(newCustomizations)

      if (previewMode) {
        updateCustomizations(newCustomizations)
      }
    },
    [tempCustomizations, previewMode, updateCustomizations],
  )

  const updateTypographyCustomization = useCallback(
    (
      typographyKey: keyof ThemeTypography,
      value: string | ThemeTypography["fontSize"] | ThemeTypography["fontWeight"],
    ) => {
      const newCustomizations = {
        ...tempCustomizations,
        typography: {
          ...tempCustomizations.typography,
          [typographyKey]: value,
        },
      }
      setTempCustomizations(newCustomizations)

      if (previewMode) {
        updateCustomizations(newCustomizations)
      }
    },
    [tempCustomizations, previewMode, updateCustomizations],
  )

  const updateSpacingCustomization = useCallback(
    (spacingKey: keyof ThemeSpacing, value: string | ThemeSpacing["spacing"]) => {
      const newCustomizations = {
        ...tempCustomizations,
        spacing: {
          ...tempCustomizations.spacing,
          [spacingKey]: value,
        },
      }
      setTempCustomizations(newCustomizations)

      if (previewMode) {
        updateCustomizations(newCustomizations)
      }
    },
    [tempCustomizations, previewMode, updateCustomizations],
  )

  const applyCustomizations = useCallback(() => {
    updateCustomizations(tempCustomizations)
    setIsCustomizing(false)
    setPreviewMode(false)
  }, [tempCustomizations, updateCustomizations])

  const cancelCustomizations = useCallback(() => {
    setTempCustomizations(userPreferences?.customizations || {})
    setIsCustomizing(false)
    setPreviewMode(false)

    // Reset to saved customizations
    if (userPreferences?.customizations) {
      updateCustomizations(userPreferences.customizations)
    }
  }, [userPreferences, updateCustomizations])

  const resetCustomizations = useCallback(() => {
    const emptyCustomizations = {}
    setTempCustomizations(emptyCustomizations)
    updateCustomizations(emptyCustomizations)
  }, [updateCustomizations])

  const togglePreviewMode = useCallback(() => {
    const newPreviewMode = !previewMode
    setPreviewMode(newPreviewMode)

    if (newPreviewMode) {
      updateCustomizations(tempCustomizations)
    } else {
      // Reset to saved customizations
      if (userPreferences?.customizations) {
        updateCustomizations(userPreferences.customizations)
      }
    }
  }, [previewMode, tempCustomizations, updateCustomizations, userPreferences])

  const generateColorPalette = useCallback((baseColor: string) => {
    // Simple color palette generation based on HSL manipulation
    const hsl = hexToHsl(baseColor)
    if (!hsl) return {}

    const { h, s, l } = hsl

    return {
      primary: baseColor,
      secondary: hslToHex(h, Math.max(0, s - 20), Math.min(100, l + 30)),
      accent: hslToHex((h + 30) % 360, s, l),
      muted: hslToHex(h, Math.max(0, s - 40), Math.min(100, l + 40)),
      mutedForeground: hslToHex(h, Math.max(0, s - 20), Math.max(0, l - 40)),
    }
  }, [])

  const exportTheme = useCallback(() => {
    const themeExport = {
      baseTheme: currentTheme.id,
      customizations: tempCustomizations,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    }

    const blob = new Blob([JSON.stringify(themeExport, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `custom-theme-${currentTheme.id}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [currentTheme.id, tempCustomizations])

  return {
    isCustomizing,
    setIsCustomizing,
    previewMode,
    tempCustomizations,
    updateColorCustomization,
    updateTypographyCustomization,
    updateSpacingCustomization,
    applyCustomizations,
    cancelCustomizations,
    resetCustomizations,
    togglePreviewMode,
    generateColorPalette,
    exportTheme,
  }
}

// Helper functions for color manipulation
function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return null

  const r = Number.parseInt(result[1], 16) / 255
  const g = Number.parseInt(result[2], 16) / 255
  const b = Number.parseInt(result[3], 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

function hslToHex(h: number, s: number, l: number): string {
  h /= 360
  s /= 100
  l /= 100

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16)
    return hex.length === 1 ? "0" + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
