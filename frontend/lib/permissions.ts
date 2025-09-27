import type { User, UserRole } from "./types"

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  superuser: 4,
  owner: 3,
  admin: 2,
  cashier: 1,
}

export const ROLE_PERMISSIONS = {
  superuser: {
    name: "Super Administrator",
    description: "Platform-level administrator with global access",
    canManageAllOrganizations: true,
    canManageSubscriptions: true,
    canViewAllUsers: true,
    canViewPlatformMetrics: true,
    canAccessConsole: true,
    canManageOwnOrganization: false, // Superuser doesn't own organizations
    canManageStaff: false,
    canAccessPOS: false,
  },
  owner: {
    name: "Organization Owner",
    description: "Full control over their organization and all locations",
    canManageAllOrganizations: false,
    canManageSubscriptions: false,
    canViewAllUsers: false,
    canViewPlatformMetrics: false,
    canAccessConsole: false,
    canManageOwnOrganization: true,
    canManageStaff: true,
    canViewAllLocations: true,
    canViewOrganizationMetrics: true,
    canManageInventory: true,
    canManageSuppliers: true,
    canAccessReports: true,
    canAccessPOS: true,
  },
  admin: {
    name: "Store Administrator",
    description: "Manages specific store operations and staff",
    canManageAllOrganizations: false,
    canManageSubscriptions: false,
    canViewAllUsers: false,
    canViewPlatformMetrics: false,
    canAccessConsole: false,
    canManageOwnOrganization: false,
    canManageStaff: true,
    canViewAllLocations: false,
    canViewLocationMetrics: true,
    canManageInventory: true,
    canAccessReports: true,
    canAccessPOS: true,
    canManageScheduling: true,
  },
  cashier: {
    name: "Cashier",
    description: "Front-line operations with POS and basic access",
    canManageAllOrganizations: false,
    canManageSubscriptions: false,
    canViewAllUsers: false,
    canViewPlatformMetrics: false,
    canAccessConsole: false,
    canManageOwnOrganization: false,
    canManageStaff: false,
    canViewAllLocations: false,
    canViewLocationMetrics: false,
    canManageInventory: false,
    canAccessReports: false,
    canAccessPOS: true,
    canViewTimeClock: true,
  },
}

export function hasPermission(user: User | null, permission: keyof typeof ROLE_PERMISSIONS.superuser): boolean {
  if (!user) return false
  const rolePermissions = ROLE_PERMISSIONS[user.role]
  return rolePermissions[permission] === true
}

export function canAccessRoute(user: User | null, route: string): boolean {
  if (!user) return false

  const routePermissions: Record<string, keyof typeof ROLE_PERMISSIONS.superuser> = {
    "/console": "canAccessConsole",
    "/organizations": "canManageAllOrganizations",
    "/users": "canViewAllUsers",
    "/staff": "canManageStaff",
    "/analytics": "canViewOrganizationMetrics",
    "/reports": "canAccessReports",
    "/suppliers": "canManageSuppliers",
    "/inventory": "canManageInventory",
    "/scheduling": "canManageScheduling",
  }

  const requiredPermission = routePermissions[route]
  return requiredPermission ? hasPermission(user, requiredPermission) : true
}

export function getVisibleOrganizations(user: User | null, allOrganizations: any[]) {
  if (!user) return []

  if (hasPermission(user, "canManageAllOrganizations")) {
    return allOrganizations
  }

  if (user.organizationId) {
    return allOrganizations.filter((org) => org.id === user.organizationId)
  }

  return []
}

export function getVisibleUsers(user: User | null, allUsers: User[]) {
  if (!user) return []

  // Superuser can see all users
  if (hasPermission(user, "canViewAllUsers")) {
    return allUsers
  }

  // Owner can see users in their organization
  if (user.role === "owner" && user.organizationId) {
    return allUsers.filter((u) => u.organizationId === user.organizationId)
  }

  // Admin can see users in their location
  if (user.role === "admin" && user.locationId) {
    return allUsers.filter((u) => u.locationId === user.locationId)
  }

  // Cashier can only see themselves
  return [user]
}
