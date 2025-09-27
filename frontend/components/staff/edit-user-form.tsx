"use client"

import type React from "react"

import { useState } from "react"
import type { User, Location, UserRole } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Save, X, UserIcon } from "lucide-react"

interface EditUserFormProps {
  user: User
  locations: Location[]
  currentUserRole: string
  onSave: (userData: Partial<User>) => void
  onCancel: () => void
}

export function EditUserForm({ user, locations, currentUserRole, onSave, onCancel }: EditUserFormProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    locationId: user.locationId || "defaultLocationId", // Updated default value to handle undefined locationId properly
    active: true,
  })

  const getAvailableRoles = (): UserRole[] => {
    if (currentUserRole === "superuser") return ["owner", "admin", "cashier"]
    if (currentUserRole === "owner") return ["admin", "cashier"]
    if (currentUserRole === "admin") return ["cashier"]
    return []
  }

  const canEditRole = () => {
    if (currentUserRole === "superuser") return true
    if (currentUserRole === "owner" && user.role !== "superuser") return true
    if (currentUserRole === "admin" && user.role === "cashier") return true
    return false
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      ...formData,
      locationId: formData.locationId || undefined,
    })
  }

  const availableRoles = getAvailableRoles()

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Edit Staff Member</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <Label htmlFor="role">Role</Label>
            {canEditRole() ? (
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      <span className="capitalize">{role}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2">
                <Badge className="bg-muted text-muted-foreground">
                  {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">(Cannot modify this role)</span>
              </div>
            )}
          </div>

          {/* Location Assignment */}
          {(formData.role === "admin" || formData.role === "cashier") && (
            <div>
              <Label htmlFor="location">Location Assignment</Label>
              <Select
                value={formData.locationId}
                onValueChange={(value) => setFormData({ ...formData, locationId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="defaultLocationId">No specific location</SelectItem>{" "}
                  {/* Updated to use non-empty string for no location */}
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Account Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="active">Account Status</Label>
              <p className="text-sm text-muted-foreground">Inactive users cannot access the system</p>
            </div>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
          </div>

          {/* Current Permissions */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Current Permissions:</h4>
            <div className="space-y-2 text-sm">
              {formData.role === "owner" && (
                <>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      ✓
                    </Badge>
                    <span>Manage all locations and staff</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      ✓
                    </Badge>
                    <span>Full access to reports and analytics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      ✓
                    </Badge>
                    <span>Manage catalog and inventory</span>
                  </div>
                </>
              )}
              {formData.role === "admin" && (
                <>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      ✓
                    </Badge>
                    <span>Manage assigned location operations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      ✓
                    </Badge>
                    <span>Access to detailed reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      ✓
                    </Badge>
                    <span>Manage catalog and inventory</span>
                  </div>
                </>
              )}
              {formData.role === "cashier" && (
                <>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      ✓
                    </Badge>
                    <span>Process orders via POS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      ✓
                    </Badge>
                    <span>View kitchen display system</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      ✓
                    </Badge>
                    <span>Access to basic sales reports</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}
