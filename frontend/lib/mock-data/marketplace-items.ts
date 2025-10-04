import type { MarketplaceItem } from "../types"
import { ApiService } from "../services/api-service"

// Fetch marketplace items from JSON server
export const getMockMarketplaceItems = async (): Promise<MarketplaceItem[]> => {
  try {
    const marketplace = await ApiService.getMarketplace()
    return marketplace.map(item => ({
      ...item,
      productionDate: new Date(item.productionDate),
      expiryDate: new Date(item.expiryDate),
      createdAt: new Date(item.createdAt)
    }))
  } catch (error) {
    console.error("Failed to fetch marketplace items from API:", error)
    // Fallback to empty array if API fails
    return []
  }
}

// For backward compatibility, export a function that returns the data
export const mockMarketplaceItems = getMockMarketplaceItems
