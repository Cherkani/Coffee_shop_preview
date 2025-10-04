import type { User, UserRole, NavigationPermission, OrganizationNavigationSettings } from "./types"

// Available navigation items that can be controlled by admin
export const AVAILABLE_NAVIGATION_ITEMS = {
  admin: [
    { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "Product Management", href: "/product-management", icon: "Package" },
    { name: "Staff Management", href: "/staff", icon: "Users" },
    { name: "Navigation Settings", href: "/navigation-settings", icon: "Settings" },
    { name: "Inventory", href: "/inventory", icon: "Package" },
    { name: "Reports", href: "/reports", icon: "BarChart3" },
    { name: "Transactions", href: "/transactions", icon: "Receipt" },
    { name: "KDS", href: "/kds", icon: "Monitor" },
    { name: "Time Clock", href: "/timeclock", icon: "Clock" },
  ],
  owner: [
    { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "Locations", href: "/locations", icon: "MapPin" },
    { name: "Product Management", href: "/product-management", icon: "Package" },
    { name: "POS", href: "/pos", icon: "ShoppingCart" },
    { name: "Cashier Sales", href: "/cashier-sales", icon: "TrendingUp" },
    { name: "Reports", href: "/reports", icon: "BarChart3" },
    { name: "Analytics", href: "/analytics", icon: "TrendingUp" },
    { name: "Catalog", href: "/catalog", icon: "Package" },
    { name: "Staff", href: "/staff", icon: "Users" },
    { name: "Payroll", href: "/payroll", icon: "DollarSign" },
    { name: "Scheduling", href: "/scheduling", icon: "Calendar" },
    { name: "Suppliers", href: "/suppliers", icon: "Truck" },
    { name: "Marketplace", href: "/marketplace", icon: "Store" },
    { name: "Procurement", href: "/procurement", icon: "ShoppingBag" },
    { name: "Settings", href: "/settings", icon: "Settings" },
  ],
  cashier: [
    { name: "POS", href: "/pos", icon: "ShoppingCart" },
    { name: "KDS", href: "/kds", icon: "Monitor" },
    { name: "Time Clock", href: "/timeclock", icon: "Clock" },
    { name: "My Sales", href: "/reports", icon: "BarChart3" },
    { name: "Transactions", href: "/transactions", icon: "Receipt" },
  ],
}

// Default navigation settings for new organizations
export function getDefaultNavigationSettings(organizationId: string): OrganizationNavigationSettings {
  return {
    id: `nav-settings-${organizationId}`,
    organizationId,
    adminPermissions: AVAILABLE_NAVIGATION_ITEMS.admin.map((item, index) => ({
      id: `admin-${item.href}-${organizationId}`,
      name: item.name,
      href: item.href,
      icon: item.icon,
      enabled: true, // Default to enabled
      role: "admin" as UserRole,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    ownerPermissions: AVAILABLE_NAVIGATION_ITEMS.owner.map((item, index) => ({
      id: `owner-${item.href}-${organizationId}`,
      name: item.name,
      href: item.href,
      icon: item.icon,
      enabled: true, // Default to enabled
      role: "owner" as UserRole,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    cashierPermissions: AVAILABLE_NAVIGATION_ITEMS.cashier.map((item, index) => ({
      id: `cashier-${item.href}-${organizationId}`,
      name: item.name,
      href: item.href,
      icon: item.icon,
      enabled: true, // Default to enabled
      role: "cashier" as UserRole,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

// Get navigation items for a specific role based on admin settings
export function getNavigationItemsForRole(
  user: User | null,
  navigationSettings: OrganizationNavigationSettings | null
): Array<{ name: string; href: string; icon: string }> {
  if (!user || !navigationSettings) {
    return []
  }

  if (user.role === "admin") {
    return navigationSettings.adminPermissions
      .filter(permission => permission.enabled)
      .map(permission => ({
        name: permission.name,
        href: permission.href,
        icon: permission.icon,
      }))
  }

  if (user.role === "owner") {
    return navigationSettings.ownerPermissions
      .filter(permission => permission.enabled)
      .map(permission => ({
        name: permission.name,
        href: permission.href,
        icon: permission.icon,
      }))
  }

  if (user.role === "cashier") {
    return navigationSettings.cashierPermissions
      .filter(permission => permission.enabled)
      .map(permission => ({
        name: permission.name,
        href: permission.href,
        icon: permission.icon,
      }))
  }

  // For admin and superuser, return default navigation
  return []
}

// Check if admin can manage navigation for a role
export function canManageNavigation(user: User | null, targetRole: UserRole): boolean {
  if (!user) return false
  
  // Only admin can manage navigation for admin, owner and cashier in their organization
  if (user.role === "admin") {
    return (targetRole === "admin" || targetRole === "owner" || targetRole === "cashier") && !!user.organizationId
  }
  
  // Superuser can manage all
  if (user.role === "superuser") {
    return true
  }
  
  return false
}

// Update navigation permission
export function updateNavigationPermission(
  settings: OrganizationNavigationSettings,
  permissionId: string,
  enabled: boolean
): OrganizationNavigationSettings {
  const updatedSettings = { ...settings }
  
  // Update owner permissions
  const ownerIndex = updatedSettings.ownerPermissions.findIndex(p => p.id === permissionId)
  if (ownerIndex !== -1) {
    updatedSettings.ownerPermissions[ownerIndex] = {
      ...updatedSettings.ownerPermissions[ownerIndex],
      enabled,
      updatedAt: new Date(),
    }
  }
  
  // Update cashier permissions
  const cashierIndex = updatedSettings.cashierPermissions.findIndex(p => p.id === permissionId)
  if (cashierIndex !== -1) {
    updatedSettings.cashierPermissions[cashierIndex] = {
      ...updatedSettings.cashierPermissions[cashierIndex],
      enabled,
      updatedAt: new Date(),
    }
  }
  
  updatedSettings.updatedAt = new Date()
  return updatedSettings
}
