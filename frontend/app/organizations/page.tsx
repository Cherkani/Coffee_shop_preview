"use client"

import { useAppStore } from "@/lib/services/store-service"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { OrganizationManagement } from "@/components/console/organization-management"
import { hasPermission } from "@/lib/permissions"

export default function OrganizationsPage() {
  const { currentUser, organizations, getVisibleOrganizations: getVisibleOrgs, getVisibleUsers } = useAppStore()
  const users = getVisibleUsers()
  const router = useRouter()

  useEffect(() => {
    if (currentUser?.role === "superuser") {
      router.push("/console?tab=organizations")
      return
    }
  }, [currentUser, router])

  if (!currentUser || !hasPermission(currentUser, "canManageOwnOrganization")) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to access organization management.</p>
      </div>
    )
  }

  const visibleOrganizations = getVisibleOrgs()

  const enhancedOrganizations = visibleOrganizations.map((org) => ({
    ...org,
    owner:
      users.find((u) => u.id === org.ownerId) || users.find((u) => u.organizationId === org.id && u.role === "owner"),
    totalUsers: users.filter((u) => u.organizationId === org.id).length,
    monthlyRevenue: org.monthlyRevenue || 0,
  }))

  const handleViewOrg = (org: any) => {
    console.log("[v0] View organization:", org)
    // Navigate to organization details
    router.push(`/dashboard?org=${org.id}`)
  }

  const handleEditOrg = (org: any) => {
    console.log("[v0] Edit organization:", org)
    // Could open edit modal or navigate to edit page
  }

  const handleAddOrg = () => {
    console.log("[v0] Add new organization")
    // Could open add modal
  }

  return (
    <div className="p-6">
      <OrganizationManagement
        organizations={enhancedOrganizations}
        onView={handleViewOrg}
        onEdit={handleEditOrg}
        onAdd={handleAddOrg}
      />
    </div>
  )
}
