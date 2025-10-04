import type { DashboardMetrics } from "../types"
import { ApiService } from "../services/api-service"

// Fetch dashboard metrics from JSON server
export const getMockDashboardMetrics = async (): Promise<Record<string, DashboardMetrics>> => {
  try {
    const metrics = await ApiService.getMetrics()
    return metrics
  } catch (error) {
    console.error("Failed to fetch dashboard metrics from API:", error)
    // Fallback to empty object if API fails
    return {}
  }
}

// For backward compatibility, export a function that returns the data
export const mockDashboardMetrics = getMockDashboardMetrics
