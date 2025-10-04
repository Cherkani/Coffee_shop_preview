import type { User } from "../types"
import { mockUsers } from "../mock-data"

/**
 * Login Service
 * Handles login screen data operations
 */

export async function getAllUsers(): Promise<User[]> {
  return await mockUsers()
}

export async function getSuperUser(): Promise<User | undefined> {
  const users = await mockUsers()
  return users.find(user => user.role === "superuser")
}

export async function getUsersByOrganization(organizationId: string): Promise<User[]> {
  const users = await mockUsers()
  return users.filter(user => user.organizationId === organizationId)
}

export async function getOrganizationUsers(): Promise<User[]> {
  const users = await mockUsers()
  return users.filter(user => user.organizationId)
}

export async function getUsersGroupedByOrganization(): Promise<Record<string, User[]>> {
  const organizationUsers = await getOrganizationUsers()
  
  return organizationUsers.reduce((acc, user) => {
    const orgId = user.organizationId!
    if (!acc[orgId]) {
      acc[orgId] = []
    }
    acc[orgId].push(user)
    return acc
  }, {} as Record<string, User[]>)
}
