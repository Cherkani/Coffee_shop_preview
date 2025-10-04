import type { Product } from "../types"
import { ApiService } from "../services/api-service"

// Fetch products from JSON server
export const getMockProducts = async (): Promise<Product[]> => {
  try {
    const products = await ApiService.getProducts()
    return products
  } catch (error) {
    console.error("Failed to fetch products from API:", error)
    // Fallback to empty array if API fails
    return []
  }
}

// For backward compatibility, export a function that returns the data
export const mockProducts = getMockProducts

