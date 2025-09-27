"use client"

import { useState } from "react"
import type { User, Location } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Edit, Trash2, Search, Plus, Mail, MapPin } from "lucide-react"

interface StaffListProps {
  users: User[]
  locations: Location[]
  currentUserRole: string
  onEdit: (user: User) => void
  onDelete: (userId: string) => void
  onInvite: () => void
}

const roleColors = {
  superuser: "bg-purple-500",
  owner: "bg-blue-500",
  admin: "bg-green-500",
  cashier: "bg-orange-500",
}

const roleLabels = {
  superuser: "Super User",
  owner: "Owner",
  admin: "Admin",
  cashier: "Cashier",
}

export function StaffList({ users, locations, currentUserRole, onEdit, onDelete, onInvite }: StaffListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesLocation = locationFilter === "all" || user.locationId === locationFilter
    return matchesSearch && matchesRole && matchesLocation
  })

  const getLocationName = (locationId?: string) => {
    if (!locationId) return "All Locations"
    return locations.find((loc) => loc.id === locationId)?.name || "Unknown Location"
  }

  const canEditUser = (user: User) => {
    if (currentUserRole === "superuser") return true
    if (currentUserRole === "owner") return user.role !== "superuser"
    if (currentUserRole === "admin") return user.role === "cashier"
    return false
  }

  const canDeleteUser = (user: User) => {
    return canEditUser(user) && user.role !== "owner"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Staff Management</h2>
          <p className="text-muted-foreground mt-1">Manage team members and their roles</p>
        </div>
        <Button onClick={onInvite} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Invite Staff
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
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
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="cashier">Cashier</SelectItem>
          </SelectContent>
        </Select>
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-muted">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {canEditUser(user) && (
                  <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                )}
                {canDeleteUser(user) && (
                  <Button variant="outline" size="sm" onClick={() => onDelete(user.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Role:</span>
                <Badge className={`${roleColors[user.role]} text-white`}>{roleLabels[user.role]}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Location:</span>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-3 w-3" />
                  {getLocationName(user.locationId)}
                </div>
              </div>

              {user.role === "owner" && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Access:</span>
                  <Badge variant="secondary">All Locations</Badge>
                </div>
              )}

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last active:</span>
                  <span>2 hours ago</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No staff members found matching your criteria.</p>
        </Card>
      )}
    </div>
  )
}
