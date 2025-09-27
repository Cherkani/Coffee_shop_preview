"use client"

import { useAppStore } from "@/lib/store"
import { PlatformUsersManagement } from "@/components/console/platform-users-management"
import { hasPermission } from "@/lib/permissions"

export default function UsersPage() {
  const { currentUser, users, organizations, getVisibleUsers } = useAppStore()

  if (!currentUser || !hasPermission(currentUser, "canViewAllUsers")) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to access platform-wide user management.</p>
      </div>
    )
  }

  const visibleUsers = getVisibleUsers()

  const handleViewUser = (user: any) => {
    console.log("[v0] View user:", user)
    // Could open user details modal or navigate to user profile
  }

  const handleEditUser = (user: any) => {
    console.log("[v0] Edit user:", user)
    // Could open edit user modal or navigate to edit page
  }

  const handleAddUser = () => {
    console.log("[v0] Add new user")
    // Could open add user modal
  }

  return (
    <div className="p-6">
      <PlatformUsersManagement
        users={visibleUsers}
        organizations={organizations}
        onView={handleViewUser}
        onEdit={handleEditUser}
        onAdd={handleAddUser}
      />
    </div>
  )
}
