import type { User } from "../types"
import { ApiService } from "../services/api-service"

// Fetch users from JSON server
export const getMockUsers = async (): Promise<User[]> => {
  try {
    const users = await ApiService.getUsers()
    return users.map(user => ({
      ...user,
      createdAt: new Date(user.createdAt)
    }))
  } catch (error) {
    console.error("Failed to fetch users from API:", error)
    // Fallback to empty array if API fails
    return []
  }
}

// For backward compatibility, export a function that returns the data
export const mockUsers = getMockUsers
