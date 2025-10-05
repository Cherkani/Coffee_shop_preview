import type { Supplier, User } from "../types"
import { filterSuppliersByTenant } from "../multi-tenant-filtering"
import ApiService from "./api-service"

/**
 * Supplier Service
 * Handles all supplier-related data operations with multi-tenant filtering
 */

export async function getSuppliers(user: User | null): Promise<Supplier[]> {
  const suppliers = await ApiService.getSuppliers()
  return filterSuppliersByTenant(suppliers, user)
}

export async function getSupplierById(supplierId: string, user: User | null): Promise<Supplier | undefined> {
  const suppliers = await getSuppliers(user)
  return suppliers.find(supplier => supplier.id === supplierId)
}

export async function getSuppliersByCategory(category: string, user: User | null): Promise<Supplier[]> {
  const suppliers = await getSuppliers(user)
  return suppliers.filter(supplier => supplier.categories.includes(category))
}

export async function getActiveSuppliers(user: User | null): Promise<Supplier[]> {
  const suppliers = await getSuppliers(user)
  return suppliers.filter(supplier => supplier.isActive)
}

export async function getSuppliersByRating(minRating: number, user: User | null): Promise<Supplier[]> {
  const suppliers = await getSuppliers(user)
  return suppliers.filter(supplier => supplier.rating >= minRating)
}

export async function getSuppliersByPaymentTerms(paymentTerms: string, user: User | null): Promise<Supplier[]> {
  const suppliers = await getSuppliers(user)
  return suppliers.filter(supplier => supplier.paymentTerms === paymentTerms)
}

export async function searchSuppliers(searchTerm: string, user: User | null): Promise<Supplier[]> {
  const suppliers = await getSuppliers(user)
  const term = searchTerm.toLowerCase()
  
  return suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(term) ||
    supplier.contactEmail.toLowerCase().includes(term) ||
    supplier.categories.some(category => category.toLowerCase().includes(term))
  )
}

export async function getTopRatedSuppliers(limit: number, user: User | null): Promise<Supplier[]> {
  const suppliers = await getSuppliers(user)
  return suppliers
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

export async function getSuppliersByDeliveryTime(deliveryTime: string, user: User | null): Promise<Supplier[]> {
  const suppliers = await getSuppliers(user)
  return suppliers.filter(supplier => supplier.deliveryTime === deliveryTime)
}
