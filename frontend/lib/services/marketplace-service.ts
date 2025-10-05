import type { MarketplaceItem, MarketplaceListing, User } from "../types"
import ApiService from "./api-service"
import { filterMarketplaceItemsByTenant } from "../multi-tenant-filtering"

/**
 * Marketplace Service
 * Handles all marketplace-related data operations with multi-tenant filtering
 */

export async function getMarketplaceItems(user: User | null): Promise<MarketplaceItem[]> {
  const items = await ApiService.getMarketplace()
  return filterMarketplaceItemsByTenant(items, user)
}

export async function getMarketplaceListings(user: User | null): Promise<MarketplaceListing[]> {
  // If you later add marketplace listings endpoint, fetch here.
  const items = await ApiService.getMarketplace()
  // Map items to listings shape if needed; for now return empty list
  return [] as MarketplaceListing[]
}

export async function getMarketplaceItemById(itemId: string, user: User | null): Promise<MarketplaceItem | undefined> {
  const items = await getMarketplaceItems(user)
  return items.find(item => item.id === itemId)
}

export async function getMarketplaceItemsByCategory(category: string, user: User | null): Promise<MarketplaceItem[]> {
  const items = await getMarketplaceItems(user)
  return items.filter(item => item.category === category)
}

export async function getMarketplaceItemsByQuality(quality: MarketplaceItem["quality"], user: User | null): Promise<MarketplaceItem[]> {
  const items = await getMarketplaceItems(user)
  return items.filter(item => item.quality === quality)
}

export async function getActiveMarketplaceItems(user: User | null): Promise<MarketplaceItem[]> {
  const items = await getMarketplaceItems(user)
  return items.filter(item => item.isActive)
}

export async function getMarketplaceItemsBySeller(sellerId: string, user: User | null): Promise<MarketplaceItem[]> {
  const items = await getMarketplaceItems(user)
  return items.filter(item => item.sellerId === sellerId)
}

export async function searchMarketplaceItems(searchTerm: string, user: User | null): Promise<MarketplaceItem[]> {
  const items = await getMarketplaceItems(user)
  const term = searchTerm.toLowerCase()
  
  return items.filter(item => 
    item.name.toLowerCase().includes(term) ||
    item.category.toLowerCase().includes(term) ||
    item.description.toLowerCase().includes(term) ||
    item.sellerName.toLowerCase().includes(term)
  )
}

export async function getMarketplaceItemsByPriceRange(minPrice: number, maxPrice: number, user: User | null): Promise<MarketplaceItem[]> {
  const items = await getMarketplaceItems(user)
  return items.filter(item => 
    item.pricePerUnit >= minPrice && item.pricePerUnit <= maxPrice
  )
}

export async function getExpiringMarketplaceItems(daysUntilExpiry: number, user: User | null): Promise<MarketplaceItem[]> {
  const items = await getMarketplaceItems(user)
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() + daysUntilExpiry)
  
  return items.filter(item => 
    item.expiryDate && item.expiryDate <= cutoffDate
  )
}
