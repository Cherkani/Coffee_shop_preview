import type { MarketplaceItem, MarketplaceListing, User } from "../types"
import { mockMarketplaceItems, mockMarketplaceListings } from "../mock-data"

/**
 * Marketplace Service
 * Handles all marketplace-related data operations with multi-tenant filtering
 */

export function getMarketplaceItems(user: User | null): MarketplaceItem[] {
  if (!user || !user.organizationId) return []
  
  // Superuser can see all marketplace items
  if (user.role === "superuser") return mockMarketplaceItems
  
  // Owner and admin can see marketplace items
  if (user.role === "owner" || user.role === "admin") {
    return mockMarketplaceItems
  }
  
  // Cashiers cannot see marketplace
  return []
}

export function getMarketplaceListings(user: User | null): MarketplaceListing[] {
  if (!user || !user.organizationId) return []
  
  // Superuser can see all marketplace listings
  if (user.role === "superuser") return mockMarketplaceListings
  
  // Owner and admin can see marketplace listings
  if (user.role === "owner" || user.role === "admin") {
    return mockMarketplaceListings
  }
  
  // Cashiers cannot see marketplace
  return []
}

export function getMarketplaceItemById(itemId: string, user: User | null): MarketplaceItem | undefined {
  const items = getMarketplaceItems(user)
  return items.find(item => item.id === itemId)
}

export function getMarketplaceItemsByCategory(category: string, user: User | null): MarketplaceItem[] {
  const items = getMarketplaceItems(user)
  return items.filter(item => item.category === category)
}

export function getMarketplaceItemsByQuality(quality: MarketplaceItem["quality"], user: User | null): MarketplaceItem[] {
  const items = getMarketplaceItems(user)
  return items.filter(item => item.quality === quality)
}

export function getActiveMarketplaceItems(user: User | null): MarketplaceItem[] {
  const items = getMarketplaceItems(user)
  return items.filter(item => item.isActive)
}

export function getMarketplaceItemsBySeller(sellerId: string, user: User | null): MarketplaceItem[] {
  const items = getMarketplaceItems(user)
  return items.filter(item => item.sellerId === sellerId)
}

export function searchMarketplaceItems(searchTerm: string, user: User | null): MarketplaceItem[] {
  const items = getMarketplaceItems(user)
  const term = searchTerm.toLowerCase()
  
  return items.filter(item => 
    item.name.toLowerCase().includes(term) ||
    item.category.toLowerCase().includes(term) ||
    item.description.toLowerCase().includes(term) ||
    item.sellerName.toLowerCase().includes(term)
  )
}

export function getMarketplaceItemsByPriceRange(minPrice: number, maxPrice: number, user: User | null): MarketplaceItem[] {
  const items = getMarketplaceItems(user)
  return items.filter(item => 
    item.pricePerUnit >= minPrice && item.pricePerUnit <= maxPrice
  )
}

export function getExpiringMarketplaceItems(daysUntilExpiry: number, user: User | null): MarketplaceItem[] {
  const items = getMarketplaceItems(user)
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() + daysUntilExpiry)
  
  return items.filter(item => 
    item.expiryDate && item.expiryDate <= cutoffDate
  )
}
