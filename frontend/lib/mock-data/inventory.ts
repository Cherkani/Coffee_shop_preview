import type { InventoryItem } from "../types"
import { ApiService } from "../services/api-service"

// Fetch inventory items from JSON server
export const getMockInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const inventory = await ApiService.getInventory()
    return inventory.map(item => ({
      ...item,
      lastRestocked: new Date(item.lastRestocked)
    }))
  } catch (error) {
    console.error("Failed to fetch inventory from API:", error)
    // Fallback to empty array if API fails
    return []
  }
}

// For backward compatibility, export a function that returns the data
export const mockInventoryItems = getMockInventoryItems
