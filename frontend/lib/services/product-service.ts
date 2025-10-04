import type { Product, User } from "../types"
import { mockProducts } from "../mock-data"
import { filterProductsByTenant } from "../multi-tenant-filtering"

/**
 * Product Service
 * Handles all product-related data operations with multi-tenant filtering
 */

export function getProducts(user: User | null, selectedLocations?: string[]): Product[] {
  return filterProductsByTenant(mockProducts, user, selectedLocations)
}

export function getProductById(productId: string, user: User | null): Product | undefined {
  const products = getProducts(user)
  return products.find(product => product.id === productId)
}

export function getProductsByCategory(category: string, user: User | null): Product[] {
  const products = getProducts(user)
  return products.filter(product => product.category === category)
}

export function getProductsByLocation(locationId: string, user: User | null): Product[] {
  const products = getProducts(user)
  return products.filter(product => product.locationId === locationId)
}

export function getAvailableProducts(user: User | null): Product[] {
  const products = getProducts(user)
  return products.filter(product => product.available)
}

export function searchProducts(searchTerm: string, user: User | null): Product[] {
  const products = getProducts(user)
  const term = searchTerm.toLowerCase()
  
  return products.filter(product => 
    product.name.toLowerCase().includes(term) ||
    product.category.toLowerCase().includes(term)
  )
}
