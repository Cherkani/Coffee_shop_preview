import type { InventoryItem, User } from "../types"
import { mockInventoryItems } from "../mock-data"
import { filterInventoryByTenant } from "../multi-tenant-filtering"

/**
 * Inventory Service
 * Handles all inventory-related data operations with multi-tenant filtering
 */

export function getInventoryItems(user: User | null, selectedLocations?: string[]): InventoryItem[] {
  return filterInventoryByTenant(mockInventoryItems, user, selectedLocations)
}

export function getInventoryItemById(itemId: string, user: User | null): InventoryItem | undefined {
  const items = getInventoryItems(user)
  return items.find(item => item.id === itemId)
}

export function getInventoryItemsByCategory(category: string, user: User | null): InventoryItem[] {
  const items = getInventoryItems(user)
  return items.filter(item => item.category === category)
}

export function getInventoryItemsByLocation(locationId: string, user: User | null): InventoryItem[] {
  const items = getInventoryItems(user)
  return items.filter(item => item.locationId === locationId)
}

export function getLowStockItems(user: User | null): InventoryItem[] {
  const items = getInventoryItems(user)
  return items.filter(item => item.currentStock <= item.minStock)
}

export function getOutOfStockItems(user: User | null): InventoryItem[] {
  const items = getInventoryItems(user)
  return items.filter(item => item.currentStock === 0)
}

export function getInventoryItemsBySupplier(supplier: string, user: User | null): InventoryItem[] {
  const items = getInventoryItems(user)
  return items.filter(item => item.supplier === supplier)
}

export function getExpiringItems(daysUntilExpiry: number, user: User | null): InventoryItem[] {
  const items = getInventoryItems(user)
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() + daysUntilExpiry)
  
  return items.filter(item => 
    item.expiryDate && item.expiryDate <= cutoffDate
  )
}

export function searchInventoryItems(searchTerm: string, user: User | null): InventoryItem[] {
  const items = getInventoryItems(user)
  const term = searchTerm.toLowerCase()
  
  return items.filter(item => 
    item.name.toLowerCase().includes(term) ||
    item.category.toLowerCase().includes(term) ||
    (item.supplier && item.supplier.toLowerCase().includes(term))
  )
}

export function getTotalInventoryValue(user: User | null): number {
  const items = getInventoryItems(user)
  return items.reduce((total, item) => total + (item.currentStock * item.costPerUnit), 0)
}
