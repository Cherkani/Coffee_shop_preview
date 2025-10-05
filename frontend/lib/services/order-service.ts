import type { Order, User } from "../types"
import { filterOrdersByTenant } from "../multi-tenant-filtering"
import ApiService from "./api-service"

/**
 * Order Service
 * Handles all order-related data operations with multi-tenant filtering
 */

export async function getOrders(user: User | null, selectedLocations?: string[]): Promise<Order[]> {
  const orders = await ApiService.getOrders()
  return filterOrdersByTenant(orders, user, selectedLocations)
}

export async function getOrderById(orderId: string, user: User | null): Promise<Order | undefined> {
  const orders = await getOrders(user)
  return orders.find(order => order.id === orderId)
}

export async function getOrdersByStatus(status: Order["status"], user: User | null): Promise<Order[]> {
  const orders = await getOrders(user)
  return orders.filter(order => order.status === status)
}

export async function getOrdersByDateRange(startDate: Date, endDate: Date, user: User | null): Promise<Order[]> {
  const orders = await getOrders(user)
  return orders.filter(order => 
    order.createdAt >= startDate && order.createdAt <= endDate
  )
}

export async function getOrdersByLocation(locationId: string, user: User | null): Promise<Order[]> {
  const orders = await getOrders(user)
  return orders.filter(order => order.locationId === locationId)
}

export async function getOrdersByCashier(cashierId: string, user: User | null): Promise<Order[]> {
  const orders = await getOrders(user)
  return orders.filter(order => order.cashierId === cashierId)
}

export async function getTodayOrders(user: User | null): Promise<Order[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return getOrdersByDateRange(today, tomorrow, user)
}

export function getTotalOrdersValue(orders: Order[]): number {
  return orders.reduce((total, order) => total + order.total, 0)
}
