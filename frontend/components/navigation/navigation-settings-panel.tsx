"use client"

import { useAppStore } from "@/lib/services/store-service"
import { canManageNavigation } from "@/lib/navigation-permissions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  MapPin, 
  BarChart3, 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign, 
  Calendar, 
  Truck, 
  Store, 
  ShoppingBag, 
  Settings,
  ShoppingCart,
  Monitor,
  Clock,
  Receipt,
  Eye,
  EyeOff
} from "lucide-react"

const iconMap = {
  LayoutDashboard,
  MapPin,
  BarChart3,
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Calendar,
  Truck,
  Store,
  ShoppingBag,
  Settings,
  ShoppingCart,
  Monitor,
  Clock,
  Receipt,
} as const

interface NavigationSettingsPanelProps {
  className?: string
}

export function NavigationSettingsPanel({ className }: NavigationSettingsPanelProps) {
  const { currentUser, navigationSettings, updateNavigationPermission } = useAppStore()

  if (!currentUser || !canManageNavigation(currentUser, "owner")) {
    return null
  }

  if (!navigationSettings) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Navigation Settings</CardTitle>
          <CardDescription>Loading settings...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const handlePermissionToggle = (permissionId: string, enabled: boolean) => {
    updateNavigationPermission(permissionId, enabled)
  }

  const enabledOwnerCount = navigationSettings.ownerPermissions.filter(p => p.enabled).length
  const enabledCashierCount = navigationSettings.cashierPermissions.filter(p => p.enabled).length

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Navigation Control
        </CardTitle>
        <CardDescription>
          Manage what users can see in their navigation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Owners</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {enabledOwnerCount} of {navigationSettings.ownerPermissions.length} enabled
            </p>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Cashiers</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {enabledCashierCount} of {navigationSettings.cashierPermissions.length} enabled
            </p>
          </div>
        </div>

        {/* Owner Quick Controls */}
        <div>
          <Label className="text-sm font-medium">Owner Navigation</Label>
          <div className="mt-2 space-y-2">
            {navigationSettings.ownerPermissions.slice(0, 3).map((permission) => {
              const Icon = iconMap[permission.icon as keyof typeof iconMap] || LayoutDashboard
              
              return (
                <div key={permission.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{permission.name}</span>
                  </div>
                  <Switch
                    checked={permission.enabled}
                    onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked)}
                    size="sm"
                  />
                </div>
              )
            })}
            {navigationSettings.ownerPermissions.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{navigationSettings.ownerPermissions.length - 3} more items
              </p>
            )}
          </div>
        </div>

        {/* Cashier Quick Controls */}
        <div>
          <Label className="text-sm font-medium">Cashier Navigation</Label>
          <div className="mt-2 space-y-2">
            {navigationSettings.cashierPermissions.slice(0, 3).map((permission) => {
              const Icon = iconMap[permission.icon as keyof typeof iconMap] || LayoutDashboard
              
              return (
                <div key={permission.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{permission.name}</span>
                  </div>
                  <Switch
                    checked={permission.enabled}
                    onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked)}
                    size="sm"
                  />
                </div>
              )
            })}
            {navigationSettings.cashierPermissions.length > 3 && (
              <p className="text-xs text-muted-foreground">
                +{navigationSettings.cashierPermissions.length - 3} more items
              </p>
            )}
          </div>
        </div>

        <Button variant="outline" className="w-full" asChild>
          <a href="/navigation-settings">
            Manage All Settings
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
