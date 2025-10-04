"use client"

import { useAppStore } from "@/lib/store"
import { canManageNavigation } from "@/lib/navigation-permissions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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
  Receipt
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

export default function NavigationSettingsPage() {
  const { currentUser, navigationSettings, updateNavigationPermission } = useAppStore()

  if (!currentUser || !canManageNavigation(currentUser, "owner")) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to manage navigation settings for this organization.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!navigationSettings) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
            <CardDescription>
              Loading navigation settings...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const handlePermissionToggle = (permissionId: string, enabled: boolean) => {
    updateNavigationPermission(permissionId, enabled)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Navigation Settings</h1>
        <p className="text-muted-foreground">
          Control what navigation items are visible to owner and cashier roles in your organization.
        </p>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Organization Scope:</strong> These settings only affect users in your organization. 
            Each organization has its own independent navigation settings.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Admin Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Admin Permissions
            </CardTitle>
            <CardDescription>
              Control what navigation items admins can see in their sidebar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {navigationSettings?.adminPermissions.map((permission) => {
              const IconComponent = iconMap[permission.icon as keyof typeof iconMap] || Settings
              return (
                <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label htmlFor={permission.id} className="text-sm font-medium">
                        {permission.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">{permission.href}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={permission.enabled ? "default" : "secondary"}>
                      {permission.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      id={permission.id}
                      checked={permission.enabled}
                      onCheckedChange={(enabled) => updateNavigationPermission(permission.id, enabled)}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Owner Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Owner Permissions
            </CardTitle>
            <CardDescription>
              Control what navigation items owners can see in their sidebar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {navigationSettings.ownerPermissions.map((permission) => {
              const Icon = iconMap[permission.icon as keyof typeof iconMap] || LayoutDashboard
              
              return (
                <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label htmlFor={permission.id} className="text-sm font-medium">
                        {permission.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {permission.href}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={permission.enabled ? "default" : "secondary"}>
                      {permission.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      id={permission.id}
                      checked={permission.enabled}
                      onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked)}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Cashier Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Cashier Permissions
            </CardTitle>
            <CardDescription>
              Control what navigation items cashiers can see in their sidebar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {navigationSettings.cashierPermissions.map((permission) => {
              const Icon = iconMap[permission.icon as keyof typeof iconMap] || LayoutDashboard
              
              return (
                <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label htmlFor={permission.id} className="text-sm font-medium">
                        {permission.name}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {permission.href}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={permission.enabled ? "default" : "secondary"}>
                      {permission.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      id={permission.id}
                      checked={permission.enabled}
                      onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked)}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>Owner permissions:</strong> Control what navigation items organization owners can access</p>
          <p>• <strong>Cashier permissions:</strong> Control what navigation items cashiers can access</p>
          <p>• <strong>Real-time updates:</strong> Changes take effect immediately for all users</p>
          <p>• <strong>Admin access:</strong> As an admin, you have access to Dashboard, Staff Management, and Navigation Settings</p>
        </CardContent>
      </Card>
    </div>
  )
}
