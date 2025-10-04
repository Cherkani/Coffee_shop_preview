import type { Supplier } from "../types"
import { ApiService } from "../services/api-service"

// Fetch suppliers from JSON server
export const getMockSuppliers = async (): Promise<Supplier[]> => {
  try {
    const suppliers = await ApiService.getSuppliers()
    return suppliers
  } catch (error) {
    console.error("Failed to fetch suppliers from API:", error)
    // Fallback to empty array if API fails
    return []
  }
}

// For backward compatibility, export a function that returns the data
export const mockSuppliers = getMockSuppliers
