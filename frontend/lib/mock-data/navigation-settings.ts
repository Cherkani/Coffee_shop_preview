import type { OrganizationNavigationSettings } from "../types"
import { ApiService } from "../services/api-service"

// Fetch navigation settings from JSON server
export const getMockNavigationSettings = async (): Promise<OrganizationNavigationSettings[]> => {
  try {
    const settings = await ApiService.getNavigationSettings()
    return settings.map(setting => ({
      ...setting,
      createdAt: new Date(setting.createdAt),
      updatedAt: new Date(setting.updatedAt),
      adminPermissions: setting.adminPermissions.map(perm => ({
        ...perm,
        createdAt: new Date(perm.createdAt),
        updatedAt: new Date(perm.updatedAt)
      })),
      ownerPermissions: setting.ownerPermissions.map(perm => ({
        ...perm,
        createdAt: new Date(perm.createdAt),
        updatedAt: new Date(perm.updatedAt)
      })),
      cashierPermissions: setting.cashierPermissions.map(perm => ({
        ...perm,
        createdAt: new Date(perm.createdAt),
        updatedAt: new Date(perm.updatedAt)
      }))
    }))
  } catch (error) {
    console.error("Failed to fetch navigation settings from API:", error)
    // Fallback to empty array if API fails
    return []
  }
}

// For backward compatibility, export a function that returns the data
export const mockNavigationSettings = getMockNavigationSettings