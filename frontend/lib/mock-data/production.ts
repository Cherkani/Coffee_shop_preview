import type { Production } from "../types"
import { ApiService } from "../services/api-service"

// Fetch production data from JSON server
export const getMockProductions = async (): Promise<Production[]> => {
  try {
    const production = await ApiService.getProduction()
    return production.map(item => ({
      ...item,
      productionDate: new Date(item.productionDate),
      expiryDate: new Date(item.expiryDate)
    }))
  } catch (error) {
    console.error("Failed to fetch production data from API:", error)
    // Fallback to empty array if API fails
    return []
  }
}

// For backward compatibility, export a function that returns the data
export const mockProductions = getMockProductions
