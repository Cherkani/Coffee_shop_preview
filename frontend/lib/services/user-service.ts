import type { User } from "../types"
import { mockUsers } from "../mock-data"
import { filterUsersByTenant } from "../multi-tenant-filtering"

/**
 * User Service
 * Handles all user-related data operations with multi-tenant filtering
 */

export function getUsers(user: User | null): User[] {
  return filterUsersByTenant(mockUsers, user)
}

export function getUserById(userId: string, currentUser: User | null): User | undefined {
  const users = getUsers(currentUser)
  return users.find(user => user.id === userId)
}

export function getUsersByRole(role: User["role"], currentUser: User | null): User[] {
  const users = getUsers(currentUser)
  return users.filter(user => user.role === role)
}

export function getUsersByOrganization(organizationId: string, currentUser: User | null): User[] {
  const users = getUsers(currentUser)
  return users.filter(user => user.organizationId === organizationId)
}

export function getUsersByLocation(locationId: string, currentUser: User | null): User[] {
  const users = getUsers(currentUser)
  return users.filter(user => user.locationId === locationId)
}

export function getActiveUsers(currentUser: User | null): User[] {
  const users = getUsers(currentUser)
  return users.filter(user => user.isActive)
}

export function getInactiveUsers(currentUser: User | null): User[] {
  const users = getUsers(currentUser)
  return users.filter(user => !user.isActive)
}

export function searchUsers(searchTerm: string, currentUser: User | null): User[] {
  const users = getUsers(currentUser)
  const term = searchTerm.toLowerCase()
  
  return users.filter(user => 
    user.name.toLowerCase().includes(term) ||
    user.email.toLowerCase().includes(term)
  )
}

export function getUsersByDateRange(startDate: Date, endDate: Date, currentUser: User | null): User[] {
  const users = getUsers(currentUser)
  return users.filter(user => 
    user.createdAt && user.createdAt >= startDate && user.createdAt <= endDate
  )
}

export function getStaffCount(currentUser: User | null): number {
  const users = getUsers(currentUser)
  return users.filter(user => user.role !== "superuser").length
}

export function getUsersByOrganizationAndRole(organizationId: string, role: User["role"], currentUser: User | null): User[] {
  const users = getUsers(currentUser)
  return users.filter(user => 
    user.organizationId === organizationId && user.role === role
  )
}
