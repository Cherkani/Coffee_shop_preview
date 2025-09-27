"use client"

import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
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
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
  const { currentUser } = useAppStore()
  const pathname = usePathname()

  if (!currentUser) return null

  const items = navigationItems[currentUser.role] || []

  return (
    <div className="w-64 bg-card border-r border-border h-full">
      <div className="p-6">
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
    </div>
  )
}
