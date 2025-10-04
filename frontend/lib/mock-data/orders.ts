import type { Order } from "../types"
import { ApiService } from "../services/api-service"

// Fetch orders from JSON server
export const getMockOrders = async (): Promise<Order[]> => {
  try {
    const orders = await ApiService.getOrders()
    return orders.map(order => ({
      ...order,
      createdAt: new Date(order.createdAt)
    }))
  } catch (error) {
    console.error("Failed to fetch orders from API:", error)
    // Fallback to empty array if API fails
    return []
  }
}

// For backward compatibility, export a function that returns the data
export const mockOrders = getMockOrders
