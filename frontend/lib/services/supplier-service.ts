import type { Supplier, User } from "../types"
import { mockSuppliers } from "../mock-data"
import { filterSuppliersByTenant } from "../multi-tenant-filtering"

/**
 * Supplier Service
 * Handles all supplier-related data operations with multi-tenant filtering
 */

export function getSuppliers(user: User | null): Supplier[] {
  return filterSuppliersByTenant(mockSuppliers, user)
}

export function getSupplierById(supplierId: string, user: User | null): Supplier | undefined {
  const suppliers = getSuppliers(user)
  return suppliers.find(supplier => supplier.id === supplierId)
}

export function getSuppliersByCategory(category: string, user: User | null): Supplier[] {
  const suppliers = getSuppliers(user)
  return suppliers.filter(supplier => supplier.categories.includes(category))
}

export function getActiveSuppliers(user: User | null): Supplier[] {
  const suppliers = getSuppliers(user)
  return suppliers.filter(supplier => supplier.isActive)
}

export function getSuppliersByRating(minRating: number, user: User | null): Supplier[] {
  const suppliers = getSuppliers(user)
  return suppliers.filter(supplier => supplier.rating >= minRating)
}

export function getSuppliersByPaymentTerms(paymentTerms: string, user: User | null): Supplier[] {
  const suppliers = getSuppliers(user)
  return suppliers.filter(supplier => supplier.paymentTerms === paymentTerms)
}

export function searchSuppliers(searchTerm: string, user: User | null): Supplier[] {
  const suppliers = getSuppliers(user)
  const term = searchTerm.toLowerCase()
  
  return suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(term) ||
    supplier.contactEmail.toLowerCase().includes(term) ||
    supplier.categories.some(category => category.toLowerCase().includes(term))
  )
}

export function getTopRatedSuppliers(limit: number, user: User | null): Supplier[] {
  const suppliers = getSuppliers(user)
  return suppliers
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

export function getSuppliersByDeliveryTime(deliveryTime: string, user: User | null): Supplier[] {
  const suppliers = getSuppliers(user)
  return suppliers.filter(supplier => supplier.deliveryTime === deliveryTime)
}
