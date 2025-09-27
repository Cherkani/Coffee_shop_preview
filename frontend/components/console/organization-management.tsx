"use client"

import { useState } from "react"
import type { Organization, User } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building2, Users, MapPin, DollarSign, Settings, Search, Plus, Eye } from "lucide-react"

interface OrganizationWithDetails extends Organization {
  owner: User
  totalUsers: number
  monthlyRevenue: number
  subscriptionPlan: "basic" | "pro" | "enterprise"
  status: "active" | "suspended" | "trial"
}

interface OrganizationManagementProps {
  organizations: OrganizationWithDetails[]
  onView: (org: OrganizationWithDetails) => void
  onEdit: (org: OrganizationWithDetails) => void
  onAdd: () => void
}

export function OrganizationManagement({ organizations, onView, onEdit, onAdd }: OrganizationManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.owner.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || org.status === statusFilter
    const matchesPlan = planFilter === "all" || org.subscriptionPlan === planFilter
    return matchesSearch && matchesStatus && matchesPlan
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "trial":
        return "bg-blue-500"
      case "suspended":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "basic":
        return "bg-gray-500"
      case "pro":
        return "bg-blue-500"
      case "enterprise":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Organization Management</h2>
          <p className="text-muted-foreground mt-1">Manage all coffee shop organizations</p>
        </div>
        <Button onClick={onAdd} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plans</SelectItem>
            <SelectItem value="basic">Basic</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOrgs.map((org) => (
          <Card key={org.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Building2 className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{org.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`${getStatusColor(org.status)} text-white text-xs`}>
                      {org.status.toUpperCase()}
                    </Badge>
                    <Badge className={`${getPlanColor(org.subscriptionPlan)} text-white text-xs`}>
                      {org.subscriptionPlan.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onView(org)}>
                  <Eye className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onEdit(org)}>
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Owner Info */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {org.owner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{org.owner.name}</p>
                <p className="text-xs text-muted-foreground">{org.owner.email}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-lg font-semibold">{org.locations.length}</span>
                </div>
                <p className="text-xs text-muted-foreground">Locations</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-lg font-semibold">{org.totalUsers}</span>
                </div>
                <p className="text-xs text-muted-foreground">Users</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="text-lg font-semibold">${org.monthlyRevenue.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">Monthly</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredOrgs.length === 0 && (
        <Card className="p-12 text-center">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">No organizations found matching your criteria.</p>
        </Card>
      )}
    </div>
  )
}
