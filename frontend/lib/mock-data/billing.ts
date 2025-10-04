import { ApiService } from "../services/api-service"

// Fetch billing data from JSON server
export const getSampleBillingTransactions = async () => {
  try {
    const billing = await ApiService.getBilling()
    return billing
  } catch (error) {
    console.error("Failed to fetch billing data from API:", error)
    return []
  }
}

// Fetch metrics from JSON server
export const getMetrics = async () => {
  try {
    const metrics = await ApiService.getMetrics()
    return metrics
  } catch (error) {
    console.error("Failed to fetch metrics from API:", error)
    return {}
  }
}

// For backward compatibility, export functions that return the data
export const SAMPLE_BILLING_TRANSACTIONS = getSampleBillingTransactions
export const SUBSCRIPTION_PLAN_BREAKDOWN = getMetrics
export const SYSTEM_HEALTH_METRICS = getMetrics
export const TRIAL_CONVERSION_METRICS = getMetrics
export const PEAK_HOURS_DATA = getMetrics

export type TransactionStatus = "paid" | "pending" | "overdue"
