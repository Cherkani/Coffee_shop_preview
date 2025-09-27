"use client"

import type React from "react"

import { useState } from "react"
import type { Location, UserRole } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Send, X } from "lucide-react"

interface InviteFormProps {
  locations: Location[]
  currentUserRole: string
  onSend: (inviteData: {
    email: string
    name: string
    role: UserRole
    locationId?: string
    message?: string
  }) => void
  onCancel: () => void
}

export function InviteForm({ locations, currentUserRole, onSend, onCancel }: InviteFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "cashier" as UserRole,
    locationId: "",
    message: "",
  })

  const getAvailableRoles = (): UserRole[] => {
    if (currentUserRole === "superuser") return ["owner", "admin", "cashier"]
    if (currentUserRole === "owner") return ["admin", "cashier"]
    if (currentUserRole === "admin") return ["cashier"]
    return []
  }

  const roleDescriptions = {
    owner: "Full access to all locations and settings",
    admin: "Manage location operations, staff, and inventory",
    cashier: "Process orders and view basic reports",
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSend({
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
            <Mail className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Invite Staff Member</h2>
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
                placeholder="Enter full name"
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
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{role}</span>
                      <Badge variant="outline" className="text-xs">
                        {role === "owner" ? "All Access" : role === "admin" ? "Location Manager" : "Basic Access"}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.role && (
              <p className="text-sm text-muted-foreground mt-1">
                {roleDescriptions[formData.role as keyof typeof roleDescriptions]}
              </p>
            )}
          </div>

          {/* Location Assignment */}
          {(formData.role === "admin" || formData.role === "cashier") && (
            <div>
              <Label htmlFor="location">Assign to Location</Label>
              <Select
                value={formData.locationId}
                onValueChange={(value) => setFormData({ ...formData, locationId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                {formData.role === "admin" ? "Location they will manage" : "Location they will work at"}
              </p>
            </div>
          )}

          {/* Custom Message */}
          <div>
            <Label htmlFor="message">Custom Message (Optional)</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Add a personal message to the invitation..."
              rows={3}
            />
          </div>

          {/* Preview */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Invitation Preview:</h4>
            <div className="text-sm space-y-1">
              <p>
                <strong>To:</strong> {formData.name || "New Staff Member"} ({formData.email || "email@example.com"})
              </p>
              <p>
                <strong>Role:</strong> {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
              </p>
              {formData.locationId && (
                <p>
                  <strong>Location:</strong> {locations.find((l) => l.id === formData.locationId)?.name}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              <Send className="h-4 w-4 mr-2" />
              Send Invitation
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
