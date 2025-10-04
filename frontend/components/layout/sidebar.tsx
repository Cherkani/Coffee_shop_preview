"use client"

import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { getNavigationItemsForRole } from "@/lib/navigation-permissions"
import {
  LayoutDashboard,
  ShoppingCart,
  Monitor,
  BarChart3,
  Package,
  Users,
  Settings,
  Coffee,
  Clock,
  TrendingUp,
  Warehouse,
  Receipt,
  Calendar,
  DollarSign,
  MapPin,
  Truck,
  Store,
  Factory,
  ShoppingBag,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Icon mapping for dynamic navigation
const iconMap = {
  LayoutDashboard,
  ShoppingCart,
  Monitor,
  BarChart3,
  Package,
  Users,
  Settings,
  Coffee,
  Clock,
  TrendingUp,
  Warehouse,
  Receipt,
  Calendar,
  DollarSign,
  MapPin,
  Truck,
  Store,
  Factory,
  ShoppingBag,
} as const

const navigationItems = {
  superuser: [
    { name: "Console", href: "/console", icon: LayoutDashboard },
    { name: "Organizations", href: "/organizations", icon: Coffee },
    { name: "Users", href: "/users", icon: Users },
    { name: "Analytics", href: "/analytics", icon: TrendingUp },
    { name: "Settings", href: "/settings", icon: Settings },
  ],
  owner: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Locations", href: "/locations", icon: MapPin },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Analytics", href: "/analytics", icon: TrendingUp },
    { name: "Catalog", href: "/catalog", icon: Package },
    { name: "Staff", href: "/staff", icon: Users },
    { name: "Payroll", href: "/payroll", icon: DollarSign },
    { name: "Scheduling", href: "/scheduling", icon: Calendar },
    { name: "Suppliers", href: "/suppliers", icon: Truck },
    { name: "Marketplace", href: "/marketplace", icon: Store },
    { name: "Procurement", href: "/procurement", icon: ShoppingBag },
    { name: "Settings", href: "/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Catalog", href: "/catalog", icon: Package },
    { name: "Inventory", href: "/inventory", icon: Warehouse },
    { name: "Staff", href: "/staff", icon: Users },
    { name: "Scheduling", href: "/scheduling", icon: Calendar },
    { name: "Time Clock", href: "/timeclock", icon: Clock },
    { name: "Transactions", href: "/transactions", icon: Receipt },
    { name: "Production", href: "/production", icon: Factory },
    { name: "Marketplace", href: "/marketplace", icon: Store },
    { name: "Procurement", href: "/procurement", icon: ShoppingBag },
  ],
  cashier: [
    { name: "POS", href: "/pos", icon: ShoppingCart },
    { name: "KDS", href: "/kds", icon: Monitor },
    { name: "Time Clock", href: "/timeclock", icon: Clock },
    { name: "My Sales", href: "/reports", icon: BarChart3 },
    { name: "Transactions", href: "/transactions", icon: Receipt },
  ],
}

export function Sidebar() {
  const { currentUser, signOut, navigationSettings } = useAppStore()
  const pathname = usePathname()

  if (!currentUser) return null

  // Get navigation items based on role and admin settings
  let items: Array<{ name: string; href: string; icon: any }> = []
  
  if (currentUser.role === "superuser") {
    // Superuser always gets full navigation
    items = navigationItems.superuser
  } else if (currentUser.role === "admin") {
    // Admin gets limited navigation focused on management
    items = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Staff Management", href: "/staff", icon: Users },
      { name: "Navigation Settings", href: "/navigation-settings", icon: Settings },
    ]
  } else {
    // Owner and cashier get navigation based on admin settings
    const dynamicItems = getNavigationItemsForRole(currentUser, navigationSettings)
    items = dynamicItems.map(item => ({
      ...item,
      icon: iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard
    }))
  }

  const handleLogout = () => {
    signOut()
  }

  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-center gap-2 mb-8">
          <Coffee className="h-8 w-8 text-orange-500" />
          <span className="text-xl font-semibold">CoffeePOS</span>
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>
      
      <div className="p-6 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors w-full"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}
