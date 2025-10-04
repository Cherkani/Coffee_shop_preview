import type { Transaction, User } from "../types"
import { mockTransactions } from "../mock-data"
import { filterTransactionsByTenant } from "../multi-tenant-filtering"
import ApiService from "./api-service"

/**
 * Transaction Service
 * Handles all transaction-related data operations with multi-tenant filtering
 */

export async function getTransactions(user: User | null, selectedLocations?: string[]): Promise<Transaction[]> {
  try {
    // Try to get transactions from API first
    const transactions = await ApiService.getTransactions()
    return filterTransactionsByTenant(transactions, user, selectedLocations)
  } catch (error) {
    console.log("API failed, falling back to mock data:", error)
    const transactions = await mockTransactions()
    return filterTransactionsByTenant(transactions, user, selectedLocations)
  }
}

export async function getTransactionById(transactionId: string, user: User | null): Promise<Transaction | undefined> {
  const transactions = await getTransactions(user)
  return transactions.find(transaction => transaction.id === transactionId)
}

export async function getTransactionsByStatus(status: Transaction["status"], user: User | null): Promise<Transaction[]> {
  const transactions = await getTransactions(user)
  return transactions.filter(transaction => transaction.status === status)
}

export async function getTransactionsByPaymentMethod(paymentMethod: Transaction["paymentMethod"], user: User | null): Promise<Transaction[]> {
  const transactions = await getTransactions(user)
  return transactions.filter(transaction => transaction.paymentMethod === paymentMethod)
}

export async function getTransactionsByDateRange(startDate: Date, endDate: Date, user: User | null): Promise<Transaction[]> {
  const transactions = await getTransactions(user)
  return transactions.filter(transaction => 
    transaction.createdAt >= startDate && transaction.createdAt <= endDate
  )
}

export async function getTransactionsByLocation(locationId: string, user: User | null): Promise<Transaction[]> {
  const transactions = await getTransactions(user)
  return transactions.filter(transaction => transaction.locationId === locationId)
}

export async function getTransactionsByCashier(cashierId: string, user: User | null): Promise<Transaction[]> {
  const transactions = await getTransactions(user)
  return transactions.filter(transaction => transaction.cashierId === cashierId)
}

export async function getTodayTransactions(user: User | null): Promise<Transaction[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return getTransactionsByDateRange(today, tomorrow, user)
}

export function getTotalTransactionsValue(transactions: Transaction[]): number {
  return transactions.reduce((total, transaction) => total + transaction.amount, 0)
}

export async function getTransactionsByAmountRange(minAmount: number, maxAmount: number, user: User | null): Promise<Transaction[]> {
  const transactions = await getTransactions(user)
  return transactions.filter(transaction => 
    transaction.amount >= minAmount && transaction.amount <= maxAmount
  )
}
