"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "@/lib/themes/theme-provider"
import { useThemeCustomizer } from "@/lib/hooks/use-theme-customizer"
import { Palette, Eye, EyeOff, Save, X, RotateCcw, Download, Wand2, Sun, Moon } from "lucide-react"

export function ThemeCustomizer() {
  const { availableThemes, setTheme, currentTheme } = useTheme()
  const {
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
  } = useThemeCustomizer()

  const [selectedColorKey, setSelectedColorKey] = useState<string>("primary")

  if (!isCustomizing) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Theme Customizer</h3>
          </div>
          <Button onClick={() => setIsCustomizing(true)}>
            <Wand2 className="h-4 w-4 mr-2" />
            Customize Theme
          </Button>
        </div>

        {/* Theme Presets */}
        <div className="space-y-4">
          <div>
            <Label>Current Theme</Label>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="default">{currentTheme.name}</Badge>
              <Badge variant="outline">{currentTheme.isDark ? "Dark" : "Light"}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{currentTheme.description}</p>
          </div>

          <div>
            <Label>Available Themes</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {availableThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    theme.id === currentTheme.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setTheme(theme.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{theme.name}</h4>
                    <div className="flex items-center gap-1">
                      {theme.isDark ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{theme.description}</p>
                  <div className="flex gap-1 mt-2">
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: theme.colors.primary }} />
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: theme.colors.secondary }} />
                    <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: theme.colors.accent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Customizing: {currentTheme.name}</h3>
            {previewMode && <Badge variant="secondary">Preview Mode</Badge>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={togglePreviewMode}>
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {previewMode ? "Stop Preview" : "Preview"}
            </Button>
            <Button variant="outline" size="sm" onClick={exportTheme}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={resetCustomizations}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={cancelCustomizations}>
              <X className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={applyCustomizations}>
              <Save className="h-4 w-4 mr-2" />
              Apply
            </Button>
          </div>
        </div>
      </Card>

      {/* Customization Tabs */}
      <Card className="p-6">
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="spacing">Spacing</TabsTrigger>
          </TabsList>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Color Picker */}
              <div className="space-y-4">
                <div>
                  <Label>Color Property</Label>
                  <Select value={selectedColorKey} onValueChange={setSelectedColorKey}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(currentTheme.colors).map((colorKey) => (
                        <SelectItem key={colorKey} value={colorKey}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded border"
                              style={{
                                backgroundColor:
                                  tempCustomizations.colors?.[colorKey as keyof typeof currentTheme.colors] ||
                                  currentTheme.colors[colorKey as keyof typeof currentTheme.colors],
                              }}
                            />
                            <span className="capitalize">{colorKey.replace(/([A-Z])/g, " $1").trim()}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color-input">Color Value</Label>
                  <div className="flex gap-2">
                    <Input
                      id="color-input"
                      type="color"
                      value={
                        tempCustomizations.colors?.[selectedColorKey as keyof typeof currentTheme.colors] ||
                        currentTheme.colors[selectedColorKey as keyof typeof currentTheme.colors]
                      }
                      onChange={(e) => updateColorCustomization(selectedColorKey as any, e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={
                        tempCustomizations.colors?.[selectedColorKey as keyof typeof currentTheme.colors] ||
                        currentTheme.colors[selectedColorKey as keyof typeof currentTheme.colors]
                      }
                      onChange={(e) => updateColorCustomization(selectedColorKey as any, e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const baseColor = tempCustomizations.colors?.primary || currentTheme.colors.primary
                      const palette = generateColorPalette(baseColor)
                      Object.entries(palette).forEach(([key, value]) => {
                        updateColorCustomization(key as any, value)
                      })
                    }}
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Palette
                  </Button>
                </div>
              </div>

              {/* Color Preview */}
              <div className="space-y-4">
                <Label>Color Preview</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(currentTheme.colors).map(([key, defaultValue]) => {
                    const currentValue =
                      tempCustomizations.colors?.[key as keyof typeof currentTheme.colors] || defaultValue
                    return (
                      <div
                        key={key}
                        className="p-3 rounded border cursor-pointer hover:border-primary"
                        style={{
                          backgroundColor: currentValue,
                          color: key.includes("foreground") ? undefined : "white",
                        }}
                        onClick={() => setSelectedColorKey(key)}
                      >
                        <div className="text-xs font-medium">{key.replace(/([A-Z])/g, " $1").trim()}</div>
                        <div className="text-xs opacity-75">{currentValue}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value="typography" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="font-family">Body Font Family</Label>
                  <Select
                    value={tempCustomizations.typography?.fontFamily || currentTheme.typography.fontFamily}
                    onValueChange={(value) => updateTypographyCustomization("fontFamily", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter, system-ui, sans-serif">Inter</SelectItem>
                      <SelectItem value="Roboto, system-ui, sans-serif">Roboto</SelectItem>
                      <SelectItem value="Poppins, system-ui, sans-serif">Poppins</SelectItem>
                      <SelectItem value="Open Sans, system-ui, sans-serif">Open Sans</SelectItem>
                      <SelectItem value="Lato, system-ui, sans-serif">Lato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="heading-font">Heading Font Family</Label>
                  <Select
                    value={tempCustomizations.typography?.headingFont || currentTheme.typography.headingFont}
                    onValueChange={(value) => updateTypographyCustomization("headingFont", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter, system-ui, sans-serif">Inter</SelectItem>
                      <SelectItem value="Playfair Display, serif">Playfair Display</SelectItem>
                      <SelectItem value="Crimson Text, serif">Crimson Text</SelectItem>
                      <SelectItem value="Merriweather, serif">Merriweather</SelectItem>
                      <SelectItem value="Poppins, system-ui, sans-serif">Poppins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Typography Preview</Label>
                <div className="space-y-3 p-4 border rounded">
                  <h1
                    className="text-3xl font-bold"
                    style={{
                      fontFamily: tempCustomizations.typography?.headingFont || currentTheme.typography.headingFont,
                    }}
                  >
                    Heading Example
                  </h1>
                  <h2
                    className="text-xl font-semibold"
                    style={{
                      fontFamily: tempCustomizations.typography?.headingFont || currentTheme.typography.headingFont,
                    }}
                  >
                    Subheading Example
                  </h2>
                  <p
                    style={{
                      fontFamily: tempCustomizations.typography?.fontFamily || currentTheme.typography.fontFamily,
                    }}
                  >
                    This is body text that shows how the selected font family looks in paragraphs. It should be readable
                    and comfortable for extended reading.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm">Primary Button</Button>
                    <Button variant="outline" size="sm">
                      Secondary Button
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Spacing Tab */}
          <TabsContent value="spacing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="border-radius">Border Radius</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[
                        Number.parseFloat(
                          (tempCustomizations.spacing?.radius || currentTheme.spacing.radius).replace("rem", ""),
                        ) * 16,
                      ]}
                      onValueChange={([value]) => updateSpacingCustomization("radius", `${value / 16}rem`)}
                      max={24}
                      min={0}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm w-16">
                      {tempCustomizations.spacing?.radius || currentTheme.spacing.radius}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Spacing Scale</Label>
                  {Object.entries(currentTheme.spacing.spacing).map(([key, defaultValue]) => (
                    <div key={key} className="flex items-center gap-4">
                      <Label className="w-12 text-sm">{key}</Label>
                      <Slider
                        value={[
                          Number.parseFloat(
                            (
                              tempCustomizations.spacing?.spacing?.[key as keyof typeof currentTheme.spacing.spacing] ||
                              defaultValue
                            ).replace("rem", ""),
                          ) * 16,
                        ]}
                        onValueChange={([value]) => {
                          const newSpacing = {
                            ...currentTheme.spacing.spacing,
                            ...tempCustomizations.spacing?.spacing,
                            [key]: `${value / 16}rem`,
                          }
                          updateSpacingCustomization("spacing", newSpacing)
                        }}
                        max={80}
                        min={0}
                        step={2}
                        className="flex-1"
                      />
                      <span className="text-sm w-16">
                        {tempCustomizations.spacing?.spacing?.[key as keyof typeof currentTheme.spacing.spacing] ||
                          defaultValue}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Spacing Preview</Label>
                <div className="space-y-3">
                  <Card
                    className="p-4"
                    style={{
                      borderRadius: tempCustomizations.spacing?.radius || currentTheme.spacing.radius,
                    }}
                  >
                    <h3 className="font-semibold mb-2">Card with Custom Radius</h3>
                    <p className="text-sm text-muted-foreground">This card shows the current border radius setting.</p>
                  </Card>

                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(currentTheme.spacing.spacing).map(([key, defaultValue]) => {
                      const currentValue =
                        tempCustomizations.spacing?.spacing?.[key as keyof typeof currentTheme.spacing.spacing] ||
                        defaultValue
                      return (
                        <div key={key} className="border rounded p-2 text-center" style={{ padding: currentValue }}>
                          <div className="bg-primary/10 rounded text-xs">{key}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
