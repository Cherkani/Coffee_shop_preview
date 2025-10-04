import type { Organization } from "../types"
import { ApiService } from "../services/api-service"

// Fetch organizations from JSON server
export const getMockOrganizations = async (): Promise<Organization[]> => {
  try {
    const organizations = await ApiService.getOrganizations()
    return organizations.map(org => ({
      ...org,
      createdAt: new Date(org.createdAt)
    }))
  } catch (error) {
    console.error("Failed to fetch organizations from API:", error)
    // Fallback to empty array if API fails
    return []
  }
}

// For backward compatibility, export a function that returns the data
export const mockOrganizations = getMockOrganizations
