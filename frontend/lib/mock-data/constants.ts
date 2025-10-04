import { ApiService } from "../services/api-service"

// Fetch constants from JSON server
export const getConstants = async () => {
  try {
    const constants = await ApiService.getConstants()
    return constants
  } catch (error) {
    console.error("Failed to fetch constants from API:", error)
    // Fallback to empty object if API fails
    return {}
  }
}

// For backward compatibility, export functions that return the data
export const organizationNames = getConstants
export const locationNames = getConstants
export const roleColors = getConstants
export const roleDescriptions = getConstants
