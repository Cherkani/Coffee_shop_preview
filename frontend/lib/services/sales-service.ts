import type { User, Transaction, Order } from "../types"
import { getTransactions, getOrders } from "./index"

export interface CashierSalesData {
  cashierId: string
  cashierName: string
  totalSales: number
  totalTransactions: number
  averageTransactionValue: number
  todaySales: number
  todayTransactions: number
  thisWeekSales: number
  thisWeekTransactions: number
  thisMonthSales: number
  thisMonthTransactions: number
  topSellingItems: Array<{
    itemName: string
    quantity: number
    revenue: number
  }>
  recentTransactions: Transaction[]
}

export interface SalesMetrics {
  totalRevenue: number
  totalTransactions: number
  averageTransactionValue: number
  topCashier: CashierSalesData | null
  cashierPerformance: CashierSalesData[]
}

export async function getCashierSalesData(cashierId: string, user: User | null): Promise<CashierSalesData | null> {
  if (!user) return null

  const transactions = await getTransactions(user)
  const orders = await getOrders(user)
  
  // Filter transactions by cashier
  const cashierTransactions = transactions.filter(t => t.cashierId === cashierId)
  
  if (cashierTransactions.length === 0) return null

  // Get cashier name (you might need to fetch from users)
  const cashierName = `Cashier ${cashierId}` // This should be fetched from user data

  // Calculate metrics
  const totalSales = cashierTransactions
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalTransactions = cashierTransactions.length
  
  const averageTransactionValue = totalTransactions > 0 ? totalSales / totalTransactions : 0

  // Today's sales
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayTransactions = cashierTransactions.filter(t => 
    new Date(t.createdAt) >= today && t.status === "completed"
  )
  const todaySales = todayTransactions.reduce((sum, t) => sum + t.amount, 0)

  // This week's sales
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)
  const thisWeekTransactions = cashierTransactions.filter(t => 
    new Date(t.createdAt) >= weekStart && t.status === "completed"
  )
  const thisWeekSales = thisWeekTransactions.reduce((sum, t) => sum + t.amount, 0)

  // This month's sales
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const thisMonthTransactions = cashierTransactions.filter(t => 
    new Date(t.createdAt) >= monthStart && t.status === "completed"
  )
  const thisMonthSales = thisMonthTransactions.reduce((sum, t) => sum + t.amount, 0)

  // Top selling items (this would need order data)
  const topSellingItems: Array<{ itemName: string; quantity: number; revenue: number }> = [
    { itemName: "Coffee", quantity: 25, revenue: 125.00 },
    { itemName: "Pastry", quantity: 15, revenue: 45.00 },
    { itemName: "Sandwich", quantity: 8, revenue: 64.00 }
  ]

  // Recent transactions (last 10)
  const recentTransactions = cashierTransactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  return {
    cashierId,
    cashierName,
    totalSales,
    totalTransactions,
    averageTransactionValue,
    todaySales,
    todayTransactions: todayTransactions.length,
    thisWeekSales,
    thisWeekTransactions: thisWeekTransactions.length,
    thisMonthSales,
    thisMonthTransactions: thisMonthTransactions.length,
    topSellingItems,
    recentTransactions
  }
}

export async function getAllCashierSales(user: User | null): Promise<CashierSalesData[]> {
  if (!user || user.role !== "owner") return []

  // Get all cashiers in the organization (TODO: fetch from user service)
  const cashierIds = ["cashier-1", "cashier-2", "cashier-3", "cashier-4"]
  const results = await Promise.all(cashierIds.map(id => getCashierSalesData(id, user)))
  return results
    .filter((data): data is CashierSalesData => data !== null)
    .sort((a, b) => b.totalSales - a.totalSales)
}

export async function getSalesMetrics(user: User | null): Promise<SalesMetrics> {
  if (!user || user.role !== "owner") {
    return {
      totalRevenue: 0,
      totalTransactions: 0,
      averageTransactionValue: 0,
      topCashier: null,
      cashierPerformance: []
    }
  }

  const cashierSales = await getAllCashierSales(user)
  const totalRevenue = cashierSales.reduce((sum, cashier) => sum + cashier.totalSales, 0)
  const totalTransactions = cashierSales.reduce((sum, cashier) => sum + cashier.totalTransactions, 0)
  const averageTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0
  const topCashier = cashierSales.length > 0 ? cashierSales[0] : null

  return {
    totalRevenue,
    totalTransactions,
    averageTransactionValue,
    topCashier,
    cashierPerformance: cashierSales
  }
}

export async function getCashierSalesByDateRange(
  cashierId: string, 
  startDate: Date, 
  endDate: Date, 
  user: User | null
): Promise<CashierSalesData | null> {
  if (!user) return null

  const transactions = await getTransactions(user)
  const cashierTransactions = transactions.filter(t => 
    t.cashierId === cashierId &&
    new Date(t.createdAt) >= startDate &&
    new Date(t.createdAt) <= endDate
  )

  if (cashierTransactions.length === 0) return null

  const totalSales = cashierTransactions
    .filter(t => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  return {
    cashierId,
    cashierName: `Cashier ${cashierId}`,
    totalSales,
    totalTransactions: cashierTransactions.length,
    averageTransactionValue: cashierTransactions.length > 0 ? totalSales / cashierTransactions.length : 0,
    todaySales: 0,
    todayTransactions: 0,
    thisWeekSales: 0,
    thisWeekTransactions: 0,
    thisMonthSales: 0,
    thisMonthTransactions: 0,
    topSellingItems: [],
    recentTransactions: cashierTransactions
  }
}
