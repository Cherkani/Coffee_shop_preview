import type { User } from "../types"
import { mockUsers } from "../mock-data"

/**
 * Login Service
 * Handles login screen data operations
 */

export function getAllUsers(): User[] {
  return mockUsers
}

export function getSuperUser(): User | undefined {
  return mockUsers.find(user => user.role === "superuser")
}

export function getUsersByOrganization(organizationId: string): User[] {
  return mockUsers.filter(user => user.organizationId === organizationId)
}

export function getOrganizationUsers(): User[] {
  return mockUsers.filter(user => user.organizationId)
}

export function getUsersGroupedByOrganization(): Record<string, User[]> {
  const organizationUsers = getOrganizationUsers()
  
  return organizationUsers.reduce((acc, user) => {
    const orgId = user.organizationId!
    if (!acc[orgId]) {
      acc[orgId] = []
    }
    acc[orgId].push(user)
    return acc
  }, {} as Record<string, User[]>)
}
