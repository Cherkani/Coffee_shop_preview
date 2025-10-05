import type { InventoryItem, User } from "../types"
import { filterInventoryByTenant } from "../multi-tenant-filtering"
import ApiService from "./api-service"

/**
 * Inventory Service
 * Handles all inventory-related data operations with multi-tenant filtering
 */

export async function getInventoryItems(user: User | null, selectedLocations?: string[]): Promise<InventoryItem[]> {
  const inventory = await ApiService.getInventory()
  return filterInventoryByTenant(inventory, user, selectedLocations)
}

export async function getInventoryItemById(itemId: string, user: User | null): Promise<InventoryItem | undefined> {
  const items = await getInventoryItems(user)
  return items.find(item => item.id === itemId)
}

export async function getInventoryItemsByCategory(category: string, user: User | null): Promise<InventoryItem[]> {
  const items = await getInventoryItems(user)
  return items.filter(item => item.category === category)
}

export async function getInventoryItemsByLocation(locationId: string, user: User | null): Promise<InventoryItem[]> {
  const items = await getInventoryItems(user)
  return items.filter(item => item.locationId === locationId)
}

export async function getLowStockItems(user: User | null): Promise<InventoryItem[]> {
  const items = await getInventoryItems(user)
  return items.filter(item => item.currentStock <= item.minStock)
}

export async function getOutOfStockItems(user: User | null): Promise<InventoryItem[]> {
  const items = await getInventoryItems(user)
  return items.filter(item => item.currentStock === 0)
}

export async function getInventoryItemsBySupplier(supplier: string, user: User | null): Promise<InventoryItem[]> {
  const items = await getInventoryItems(user)
  return items.filter(item => item.supplier === supplier)
}

export async function getExpiringItems(daysUntilExpiry: number, user: User | null): Promise<InventoryItem[]> {
  const items = await getInventoryItems(user)
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() + daysUntilExpiry)
  
  return items.filter(item => 
    item.expiryDate && item.expiryDate <= cutoffDate
  )
}

export async function searchInventoryItems(searchTerm: string, user: User | null): Promise<InventoryItem[]> {
  const items = await getInventoryItems(user)
  const term = searchTerm.toLowerCase()
  
  return items.filter(item => 
    item.name.toLowerCase().includes(term) ||
    item.category.toLowerCase().includes(term) ||
    (item.supplier && item.supplier.toLowerCase().includes(term))
  )
}

export async function getTotalInventoryValue(user: User | null): Promise<number> {
  const items = await getInventoryItems(user)
  return items.reduce((total, item) => total + (item.currentStock * item.costPerUnit), 0)
}
