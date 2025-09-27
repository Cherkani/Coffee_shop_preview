"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useUserPreferences } from "@/lib/hooks/use-user-preferences"
import { Bell, Monitor, Zap, Download, Upload, RotateCcw } from "lucide-react"
import { useRef } from "react"

interface UserPreferencesPanelProps {
  userId: string
}

export function UserPreferencesPanel({ userId }: UserPreferencesPanelProps) {
  const {
    preferences,
    isLoading,
    updateNotificationPreferences,
    updateDashboardPreferences,
    updatePosPreferences,
    resetToDefaults,
    exportPreferences,
    importPreferences,
  } = useUserPreferences(userId)

  const fileInputRef = useRef<HTMLInputElement>(null)

  if (isLoading) {
    return <div className="p-6">Loading preferences...</div>
  }

  if (!preferences) {
    return <div className="p-6">Failed to load preferences</div>
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      await importPreferences(file)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Import failed:", error)
      // You could show a toast notification here
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">User Preferences</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportPreferences}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />

      {/* Notification Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.notifications.email}
              onCheckedChange={(checked) =>
                updateNotificationPreferences({
                  ...preferences.notifications,
                  email: checked,
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Browser push notifications</p>
            </div>
            <Switch
              id="push-notifications"
              checked={preferences.notifications.push}
              onCheckedChange={(checked) =>
                updateNotificationPreferences({
                  ...preferences.notifications,
                  push: checked,
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-notifications">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Text message alerts</p>
            </div>
            <Switch
              id="sms-notifications"
              checked={preferences.notifications.sms}
              onCheckedChange={(checked) =>
                updateNotificationPreferences({
                  ...preferences.notifications,
                  sms: checked,
                })
              }
            />
          </div>
        </div>
      </Card>

      {/* Dashboard Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Dashboard</h3>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="default-view">Default View</Label>
            <Select
              value={preferences.dashboard.defaultView}
              onValueChange={(value: "overview" | "sales" | "orders" | "inventory") =>
                updateDashboardPreferences({
                  ...preferences.dashboard,
                  defaultView: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
                <SelectItem value="inventory">Inventory</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="compact-mode">Compact Mode</Label>
              <p className="text-sm text-muted-foreground">Reduce spacing and padding</p>
            </div>
            <Switch
              id="compact-mode"
              checked={preferences.dashboard.compactMode}
              onCheckedChange={(checked) =>
                updateDashboardPreferences({
                  ...preferences.dashboard,
                  compactMode: checked,
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="show-metrics">Show Metrics</Label>
              <p className="text-sm text-muted-foreground">Display performance metrics</p>
            </div>
            <Switch
              id="show-metrics"
              checked={preferences.dashboard.showMetrics}
              onCheckedChange={(checked) =>
                updateDashboardPreferences({
                  ...preferences.dashboard,
                  showMetrics: checked,
                })
              }
            />
          </div>
        </div>
      </Card>

      {/* POS Preferences */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Point of Sale</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound-enabled">Sound Effects</Label>
              <p className="text-sm text-muted-foreground">Play sounds for actions</p>
            </div>
            <Switch
              id="sound-enabled"
              checked={preferences.pos.soundEnabled}
              onCheckedChange={(checked) =>
                updatePosPreferences({
                  ...preferences.pos,
                  soundEnabled: checked,
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-complete">Auto Complete</Label>
              <p className="text-sm text-muted-foreground">Suggest products while typing</p>
            </div>
            <Switch
              id="auto-complete"
              checked={preferences.pos.autoComplete}
              onCheckedChange={(checked) =>
                updatePosPreferences({
                  ...preferences.pos,
                  autoComplete: checked,
                })
              }
            />
          </div>
          <div>
            <Label>Quick Actions</Label>
            <p className="text-sm text-muted-foreground mb-2">Frequently used items</p>
            <div className="flex flex-wrap gap-2">
              {preferences.pos.quickActions.map((action, index) => (
                <Badge key={index} variant="secondary">
                  {action}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Preference Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Preference Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Theme</p>
            <p className="text-muted-foreground">{preferences.selectedThemeId}</p>
          </div>
          <div>
            <p className="font-medium">Default Dashboard</p>
            <p className="text-muted-foreground capitalize">{preferences.dashboard.defaultView}</p>
          </div>
          <div>
            <p className="font-medium">Notifications</p>
            <p className="text-muted-foreground">
              {[
                preferences.notifications.email && "Email",
                preferences.notifications.push && "Push",
                preferences.notifications.sms && "SMS",
              ]
                .filter(Boolean)
                .join(", ") || "None"}
            </p>
          </div>
          <div>
            <p className="font-medium">Last Updated</p>
            <p className="text-muted-foreground">{preferences.updatedAt.toLocaleDateString()}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
