"use client"

import { useState } from "react"
import type { User, Organization } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Search, Plus, Eye, Settings, Building2, MapPin, Calendar } from "lucide-react"

interface PlatformUsersManagementProps {
  users: User[]
  organizations: Organization[]
  onView: (user: User) => void
  onEdit: (user: User) => void
  onAdd: () => void
}

export function PlatformUsersManagement({ users, organizations, onView, onEdit, onAdd }: PlatformUsersManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [orgFilter, setOrgFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesOrg = orgFilter === "all" || user.organizationId === orgFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.isActive !== false) ||
      (statusFilter === "inactive" && user.isActive === false)
    return matchesSearch && matchesRole && matchesOrg && matchesStatus
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "superuser":
        return "bg-purple-500"
      case "owner":
        return "bg-blue-500"
      case "admin":
        return "bg-green-500"
      case "cashier":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getOrganizationName = (orgId?: string) => {
    if (!orgId) return "Platform Level"
    const org = organizations.find((o) => o.id === orgId)
    return org?.name || "Unknown Organization"
  }

  const getLocationName = (orgId?: string, locationId?: string) => {
    if (!orgId || !locationId) return null
    const org = organizations.find((o) => o.id === orgId)
    const location = org?.locations.find((l) => l.id === locationId)
    return location?.name
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Platform Users Management</h2>
          <p className="text-muted-foreground mt-1">Manage all users across the platform</p>
        </div>
        <Button onClick={onAdd} className="bg-purple-500 hover:bg-purple-600">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="superuser">Superuser</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="cashier">Cashier</SelectItem>
          </SelectContent>
        </Select>
        <Select value={orgFilter} onValueChange={setOrgFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by organization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Organizations</SelectItem>
            <SelectItem value="platform">Platform Level</SelectItem>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-sm">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onView(user)}>
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Role and Status */}
            <div className="flex items-center gap-2 mb-4">
              <Badge className={`${getRoleColor(user.role)} text-white text-xs`}>{user.role.toUpperCase()}</Badge>
              <Badge variant={user.isActive !== false ? "default" : "secondary"} className="text-xs">
                {user.isActive !== false ? "ACTIVE" : "INACTIVE"}
              </Badge>
            </div>

            {/* Organization Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Organization:</span>
                <span className="font-medium">{getOrganizationName(user.organizationId)}</span>
              </div>
              {user.locationId && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{getLocationName(user.organizationId, user.locationId)}</span>
                </div>
              )}
              {user.createdAt && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined:</span>
                  <span className="font-medium">{user.createdAt.toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No users found matching your criteria.</p>
        </Card>
      )}
    </div>
  )
}
