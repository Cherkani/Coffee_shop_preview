"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  ShoppingCart,
  Monitor,
  BarChart3,
  Package,
  Users,
  Settings,
  Coffee,
  Lock,
  CheckCircle,
  XCircle,
} from "lucide-react"

const rolePermissions = {
  superuser: {
    name: "Superuser",
    description: "Platform-level administrator with global access",
    color: "bg-purple-500",
    permissions: [
      { name: "Platform Console", icon: LayoutDashboard, allowed: true },
      { name: "Organization Management", icon: Coffee, allowed: true },
      { name: "Global User Management", icon: Users, allowed: true },
      { name: "Billing & Subscriptions", icon: Settings, allowed: true },
      { name: "Global Metrics", icon: BarChart3, allowed: true },
      { name: "POS Operations", icon: ShoppingCart, allowed: false },
      { name: "KDS Operations", icon: Monitor, allowed: false },
    ],
  },
  owner: {
    name: "Owner",
    description: "Organization-level control across all locations",
    color: "bg-blue-500",
    permissions: [
      { name: "Multi-Location Dashboard", icon: LayoutDashboard, allowed: true },
      { name: "Location Management", icon: Coffee, allowed: true },
      { name: "Full Reports & Analytics", icon: BarChart3, allowed: true },
      { name: "Catalog Management", icon: Package, allowed: true },
      { name: "Staff Management", icon: Users, allowed: true },
      { name: "Inventory Control", icon: Package, allowed: true },
      { name: "COGS Analysis", icon: BarChart3, allowed: true },
    ],
  },
  admin: {
    name: "Admin",
    description: "Location-level management with full operational control",
    color: "bg-green-500",
    permissions: [
      { name: "Location Dashboard", icon: LayoutDashboard, allowed: true },
      { name: "Full Reports & COGS", icon: BarChart3, allowed: true },
      { name: "Catalog Management", icon: Package, allowed: true },
      { name: "Inventory Management", icon: Package, allowed: true },
      { name: "Cashier Management", icon: Users, allowed: true },
      { name: "Order Void/Refund", icon: ShoppingCart, allowed: true },
      { name: "Recipe Management", icon: Coffee, allowed: true },
    ],
  },
  cashier: {
    name: "Cashier",
    description: "Front-line operations with POS and KDS access",
    color: "bg-orange-500",
    permissions: [
      { name: "POS Interface", icon: ShoppingCart, allowed: true },
      { name: "KDS Operations", icon: Monitor, allowed: true },
      { name: "Lite Reports Only", icon: BarChart3, allowed: true },
      { name: "Order Processing", icon: Coffee, allowed: true },
      { name: "Catalog Management", icon: Package, allowed: false },
      { name: "Staff Management", icon: Users, allowed: false },
      { name: "COGS/Financial Data", icon: Lock, allowed: false },
      { name: "Inventory Management", icon: Lock, allowed: false },
    ],
  },
}

export function RoleDemo() {
  const { currentUser, users, setCurrentUser } = useAppStore()

  if (!currentUser) return null

  const currentRole = rolePermissions[currentUser.role]

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">CoffeeShop POS Role Demonstration</h1>
        <p className="text-muted-foreground">
          Switch between different user roles to see how the interface changes based on permissions
        </p>
      </div>

      {/* Current Role Display */}
      <Card className="border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full ${currentRole.color}`} />
              <div>
                <CardTitle className="flex items-center gap-2">
                  Currently Viewing as: {currentRole.name}
                  <Badge className={`${currentRole.color} text-white`}>{currentUser.role.toUpperCase()}</Badge>
                </CardTitle>
                <CardDescription>{currentRole.description}</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentRole.permissions.map((permission, index) => {
              const Icon = permission.icon
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    permission.allowed
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{permission.name}</span>
                  {permission.allowed ? (
                    <CheckCircle className="h-4 w-4 ml-auto" />
                  ) : (
                    <XCircle className="h-4 w-4 ml-auto" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Role Switcher */}
      <Card>
        <CardHeader>
          <CardTitle>Switch User Role</CardTitle>
          <CardDescription>Click on any user below to experience their interface and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {users.map((user) => {
              const role = rolePermissions[user.role]
              const isActive = currentUser.id === user.id

              return (
                <Button
                  key={user.id}
                  variant={isActive ? "default" : "outline"}
                  className={`h-auto p-4 flex flex-col items-start gap-2 ${isActive ? role.color : ""}`}
                  onClick={() => setCurrentUser(user)}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className={`w-3 h-3 rounded-full ${role.color}`} />
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <Badge variant={isActive ? "secondary" : "outline"} className="text-xs">
                    {role.name}
                  </Badge>
                  <p className="text-xs text-left opacity-75">{role.description}</p>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Available Navigation for {currentRole.name}</CardTitle>
          <CardDescription>These are the menu items visible in the sidebar for this role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {currentUser.role === "superuser" &&
              [
                { name: "Console", icon: LayoutDashboard },
                { name: "Organizations", icon: Coffee },
                { name: "Users", icon: Users },
                { name: "Settings", icon: Settings },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2 p-3 bg-secondary rounded-lg">
                  <item.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              ))}

            {currentUser.role === "owner" &&
              [
                { name: "Dashboard", icon: LayoutDashboard },
                { name: "Locations", icon: Coffee },
                { name: "Reports", icon: BarChart3 },
                { name: "Catalog", icon: Package },
                { name: "Staff", icon: Users },
                { name: "Settings", icon: Settings },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2 p-3 bg-secondary rounded-lg">
                  <item.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              ))}

            {currentUser.role === "admin" &&
              [
                { name: "Dashboard", icon: LayoutDashboard },
                { name: "Reports", icon: BarChart3 },
                { name: "Catalog", icon: Package },
                { name: "Inventory", icon: Package },
                { name: "Staff", icon: Users },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2 p-3 bg-secondary rounded-lg">
                  <item.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              ))}

            {currentUser.role === "cashier" &&
              [
                { name: "POS", icon: ShoppingCart },
                { name: "KDS", icon: Monitor },
                { name: "Reports", icon: BarChart3 },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-2 p-3 bg-secondary rounded-lg">
                  <item.icon className="h-6 w-6" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
