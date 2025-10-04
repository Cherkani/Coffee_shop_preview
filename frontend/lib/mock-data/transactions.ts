import type { Transaction } from "../types"
import { ApiService } from "../services/api-service"

// Fetch transactions from JSON server
export const getMockTransactions = async (): Promise<Transaction[]> => {
  try {
    const transactions = await ApiService.getTransactions()
    return transactions.map(transaction => ({
      ...transaction,
      createdAt: new Date(transaction.createdAt)
    }))
  } catch (error) {
    console.error("Failed to fetch transactions from API:", error)
    // Fallback to empty array if API fails
    return []
  }
}

// For backward compatibility, export a function that returns the data
export const mockTransactions = getMockTransactions
