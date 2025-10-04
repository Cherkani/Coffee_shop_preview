import type { Transaction, User } from "../types"
import { mockTransactions } from "../mock-data"
import { filterTransactionsByTenant } from "../multi-tenant-filtering"

/**
 * Transaction Service
 * Handles all transaction-related data operations with multi-tenant filtering
 */

export function getTransactions(user: User | null, selectedLocations?: string[]): Transaction[] {
  return filterTransactionsByTenant(mockTransactions, user, selectedLocations)
}

export function getTransactionById(transactionId: string, user: User | null): Transaction | undefined {
  const transactions = getTransactions(user)
  return transactions.find(transaction => transaction.id === transactionId)
}

export function getTransactionsByStatus(status: Transaction["status"], user: User | null): Transaction[] {
  const transactions = getTransactions(user)
  return transactions.filter(transaction => transaction.status === status)
}

export function getTransactionsByPaymentMethod(paymentMethod: Transaction["paymentMethod"], user: User | null): Transaction[] {
  const transactions = getTransactions(user)
  return transactions.filter(transaction => transaction.paymentMethod === paymentMethod)
}

export function getTransactionsByDateRange(startDate: Date, endDate: Date, user: User | null): Transaction[] {
  const transactions = getTransactions(user)
  return transactions.filter(transaction => 
    transaction.createdAt >= startDate && transaction.createdAt <= endDate
  )
}

export function getTransactionsByLocation(locationId: string, user: User | null): Transaction[] {
  const transactions = getTransactions(user)
  return transactions.filter(transaction => transaction.locationId === locationId)
}

export function getTransactionsByCashier(cashierId: string, user: User | null): Transaction[] {
  const transactions = getTransactions(user)
  return transactions.filter(transaction => transaction.cashierId === cashierId)
}

export function getTodayTransactions(user: User | null): Transaction[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return getTransactionsByDateRange(today, tomorrow, user)
}

export function getTotalTransactionsValue(transactions: Transaction[]): number {
  return transactions.reduce((total, transaction) => total + transaction.amount, 0)
}

export function getTransactionsByAmountRange(minAmount: number, maxAmount: number, user: User | null): Transaction[] {
  const transactions = getTransactions(user)
  return transactions.filter(transaction => 
    transaction.amount >= minAmount && transaction.amount <= maxAmount
  )
}
