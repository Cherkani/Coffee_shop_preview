import type { Production, User } from "../types"
import { filterProductionByTenant } from "../multi-tenant-filtering"
import ApiService from "./api-service"

/**
 * Production Service
 * Handles all production-related data operations with multi-tenant filtering
 */

export async function getProduction(user: User | null): Promise<Production[]> {
  const production = await ApiService.getProduction()
  return filterProductionByTenant(production, user)
}

export async function getProductionById(productionId: string, user: User | null): Promise<Production | undefined> {
  const productions = await getProduction(user)
  return productions.find(production => production.id === productionId)
}

export async function getProductionByStatus(status: Production["status"], user: User | null): Promise<Production[]> {
  const productions = await getProduction(user)
  return productions.filter(production => production.status === status)
}

export async function getProductionByCategory(category: string, user: User | null): Promise<Production[]> {
  const productions = await getProduction(user)
  return productions.filter(production => production.category === category)
}

export async function getProductionByLocation(locationId: string, user: User | null): Promise<Production[]> {
  const productions = await getProduction(user)
  return productions.filter(production => production.locationId === locationId)
}

export async function getProductionByDateRange(startDate: Date, endDate: Date, user: User | null): Promise<Production[]> {
  const productions = await getProduction(user)
  return productions.filter(production => 
    production.productionDate >= startDate && production.productionDate <= endDate
  )
}

export async function getProductionByProducer(producedBy: string, user: User | null): Promise<Production[]> {
  const productions = await getProduction(user)
  return productions.filter(production => production.producedBy === producedBy)
}

export async function getTodayProduction(user: User | null): Promise<Production[]> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  return getProductionByDateRange(today, tomorrow, user)
}

export async function getExpiringProduction(daysUntilExpiry: number, user: User | null): Promise<Production[]> {
  const productions = await getProduction(user)
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() + daysUntilExpiry)
  
  return productions.filter(production => 
    production.expiryDate && production.expiryDate <= cutoffDate
  )
}

export async function searchProduction(searchTerm: string, user: User | null): Promise<Production[]> {
  const productions = await getProduction(user)
  const term = searchTerm.toLowerCase()
  
  return productions.filter(production => 
    production.itemName.toLowerCase().includes(term) ||
    production.category.toLowerCase().includes(term) ||
    production.producedBy.toLowerCase().includes(term)
  )
}

export async function getTotalProductionValue(user: User | null): Promise<number> {
  const productions = await getProduction(user)
  return productions.reduce((total, production) => total + production.totalCost, 0)
}
