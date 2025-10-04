import type { Production, User } from "../types"
import { mockProductions } from "../mock-data"
import { filterProductionByTenant } from "../multi-tenant-filtering"

/**
 * Production Service
 * Handles all production-related data operations with multi-tenant filtering
 */

export function getProduction(user: User | null): Production[] {
  return filterProductionByTenant(mockProductions, user)
}

export function getProductionById(productionId: string, user: User | null): Production | undefined {
  const productions = getProduction(user)
  return productions.find(production => production.id === productionId)
}

export function getProductionByStatus(status: Production["status"], user: User | null): Production[] {
  const productions = getProduction(user)
  return productions.filter(production => production.status === status)
}

export function getProductionByCategory(category: string, user: User | null): Production[] {
  const productions = getProduction(user)
  return productions.filter(production => production.category === category)
}

export function getProductionByLocation(locationId: string, user: User | null): Production[] {
  const productions = getProduction(user)
  return productions.filter(production => production.locationId === locationId)
}

export function getProductionByDateRange(startDate: Date, endDate: Date, user: User | null): Production[] {
  const productions = getProduction(user)
  return productions.filter(production => 
    production.productionDate >= startDate && production.productionDate <= endDate
  )
}

export function getProductionByProducer(producedBy: string, user: User | null): Production[] {
  const productions = getProduction(user)
  return productions.filter(production => production.producedBy === producedBy)
}

export function getTodayProduction(user: User | null): Production[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return getProductionByDateRange(today, tomorrow, user)
}

export function getExpiringProduction(daysUntilExpiry: number, user: User | null): Production[] {
  const productions = getProduction(user)
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() + daysUntilExpiry)
  
  return productions.filter(production => 
    production.expiryDate && production.expiryDate <= cutoffDate
  )
}

export function searchProduction(searchTerm: string, user: User | null): Production[] {
  const productions = getProduction(user)
  const term = searchTerm.toLowerCase()
  
  return productions.filter(production => 
    production.itemName.toLowerCase().includes(term) ||
    production.category.toLowerCase().includes(term) ||
    production.producedBy.toLowerCase().includes(term)
  )
}

export function getTotalProductionValue(user: User | null): number {
  const productions = getProduction(user)
  return productions.reduce((total, production) => total + production.totalCost, 0)
}
