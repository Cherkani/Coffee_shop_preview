import type { Order, User } from "../types"
import { mockOrders } from "../mock-data"
import { filterOrdersByTenant } from "../multi-tenant-filtering"

/**
 * Order Service
 * Handles all order-related data operations with multi-tenant filtering
 */

export function getOrders(user: User | null, selectedLocations?: string[]): Order[] {
  return filterOrdersByTenant(mockOrders, user, selectedLocations)
}

export function getOrderById(orderId: string, user: User | null): Order | undefined {
  const orders = getOrders(user)
  return orders.find(order => order.id === orderId)
}

export function getOrdersByStatus(status: Order["status"], user: User | null): Order[] {
  const orders = getOrders(user)
  return orders.filter(order => order.status === status)
}

export function getOrdersByDateRange(startDate: Date, endDate: Date, user: User | null): Order[] {
  const orders = getOrders(user)
  return orders.filter(order => 
    order.createdAt >= startDate && order.createdAt <= endDate
  )
}

export function getOrdersByLocation(locationId: string, user: User | null): Order[] {
  const orders = getOrders(user)
  return orders.filter(order => order.locationId === locationId)
}

export function getOrdersByCashier(cashierId: string, user: User | null): Order[] {
  const orders = getOrders(user)
  return orders.filter(order => order.cashierId === cashierId)
}

export function getTodayOrders(user: User | null): Order[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return getOrdersByDateRange(today, tomorrow, user)
}

export function getTotalOrdersValue(orders: Order[]): number {
  return orders.reduce((total, order) => total + order.total, 0)
}
