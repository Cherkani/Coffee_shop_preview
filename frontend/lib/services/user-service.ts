import type { User } from "../types"
import { mockUsers } from "../mock-data"
import { filterUsersByTenant } from "../multi-tenant-filtering"
import ApiService from "./api-service"

/**
 * User Service
 * Handles all user-related data operations with multi-tenant filtering
 */

export async function getUsers(user: User | null): Promise<User[]> {
  try {
    // Try to get users from API first
    const users = await ApiService.getUsers()
    return filterUsersByTenant(users, user)
  } catch (error) {
    console.log("API failed, falling back to mock data:", error)
    const users = await mockUsers()
    return filterUsersByTenant(users, user)
  }
}

export async function getUserById(userId: string, currentUser: User | null): Promise<User | undefined> {
  const users = await getUsers(currentUser)
  return users.find(user => user.id === userId)
}

export async function getUsersByRole(role: User["role"], currentUser: User | null): Promise<User[]> {
  const users = await getUsers(currentUser)
  return users.filter(user => user.role === role)
}

export async function getUsersByOrganization(organizationId: string, currentUser: User | null): Promise<User[]> {
  const users = await getUsers(currentUser)
  return users.filter(user => user.organizationId === organizationId)
}

export async function getUsersByLocation(locationId: string, currentUser: User | null): Promise<User[]> {
  const users = await getUsers(currentUser)
  return users.filter(user => user.locationId === locationId)
}

export async function getActiveUsers(currentUser: User | null): Promise<User[]> {
  const users = await getUsers(currentUser)
  return users.filter(user => user.isActive)
}

export async function getInactiveUsers(currentUser: User | null): Promise<User[]> {
  const users = await getUsers(currentUser)
  return users.filter(user => !user.isActive)
}

export async function searchUsers(searchTerm: string, currentUser: User | null): Promise<User[]> {
  const users = await getUsers(currentUser)
  const term = searchTerm.toLowerCase()
  
  return users.filter(user => 
    user.name.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term)
  )
}

export async function getUsersByDateRange(startDate: Date, endDate: Date, currentUser: User | null): Promise<User[]> {
  const users = await getUsers(currentUser)
  return users.filter(user => 
    user.createdAt && user.createdAt >= startDate && user.createdAt <= endDate
  )
}

export async function getStaffCount(currentUser: User | null): Promise<number> {
  const users = await getUsers(currentUser)
  return users.filter(user => user.role !== "superuser").length
}

export async function getUsersByOrganizationAndRole(organizationId: string, role: User["role"], currentUser: User | null): Promise<User[]> {
  const users = await getUsers(currentUser)
  return users.filter(user => 
    user.organizationId === organizationId && user.role === role
  )
}
