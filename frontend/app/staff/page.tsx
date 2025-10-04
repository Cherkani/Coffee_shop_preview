"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import type { User } from "@/lib/types"
import { StaffList } from "@/components/staff/staff-list"
import { InviteForm } from "@/components/staff/invite-form"
import { EditUserForm } from "@/components/staff/edit-user-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"

export default function StaffPage() {
  const { getVisibleUsers, locations, currentUser } = useAppStore()
  const users = getVisibleUsers()
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const hasAccess = currentUser?.role === "owner" || currentUser?.role === "admin"

  if (!hasAccess) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto mt-20">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>Staff management is only available to Owners and Admins.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Badge variant="outline" className="mb-4">
              Current Role: {currentUser?.role?.toUpperCase()}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Contact your administrator to request access to staff management features.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleInvite = () => {
    setShowInviteForm(true)
  }

  const handleSendInvite = (inviteData: any) => {
    // In a real app, this would send the invitation email
    console.log("Sending invitation:", inviteData)
    setShowInviteForm(false)
    // Show success message
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
  }

  const handleSaveUser = (userData: Partial<User>) => {
    // In a real app, this would update the user in the backend
    console.log("Updating user:", userData)
    setEditingUser(null)
    // Show success message
  }

  const handleDelete = (userId: string) => {
    if (confirm("Are you sure you want to remove this staff member?")) {
      // In a real app, this would delete the user from the backend
      console.log("Deleting user:", userId)
    }
  }

  const handleCancel = () => {
    setShowInviteForm(false)
    setEditingUser(null)
  }

  if (showInviteForm) {
    return (
      <div className="p-6">
        <InviteForm
          locations={locations}
          currentUserRole={currentUser?.role || "cashier"}
          onSend={handleSendInvite}
          onCancel={handleCancel}
        />
      </div>
    )
  }

  if (editingUser) {
    return (
      <div className="p-6">
        <EditUserForm
          user={editingUser}
          locations={locations}
          currentUserRole={currentUser?.role || "cashier"}
          onSave={handleSaveUser}
          onCancel={handleCancel}
        />
      </div>
    )
  }

  return (
    <div className="p-6">
      <StaffList
        users={users}
        locations={locations}
        currentUserRole={currentUser?.role || "cashier"}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onInvite={handleInvite}
      />
    </div>
  )
}
