"use client"

import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, TrendingUp, Plus, Settings, BarChart3 } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function LocationsPage() {
  const { currentUser, locations } = useAppStore()
  const [isAddingLocation, setIsAddingLocation] = useState(false)

  if (!currentUser || currentUser.role !== "owner") {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
            <CardDescription>Only organization owners can manage locations.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Filter locations for current user's organization
  const userLocations = locations.filter((loc) => loc.organizationId === currentUser.organizationId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Locations</h1>
          <p className="text-muted-foreground">Manage your coffee shop locations</p>
        </div>
        <Dialog open={isAddingLocation} onOpenChange={setIsAddingLocation}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>Create a new coffee shop location for your organization.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Location Name</Label>
                <Input id="name" placeholder="Downtown Coffee Shop" />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" placeholder="123 Main St, City, State 12345" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingLocation(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddingLocation(false)}>Create Location</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {userLocations.map((location) => (
          <Card key={location.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-orange-500" />
                    {location.name}
                  </CardTitle>
                  <CardDescription className="mt-2">{location.address}</CardDescription>
                </div>
                <Badge variant={location.status === "active" ? "default" : "secondary"}>{location.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">5 Staff</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">$2,450/day</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {userLocations.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">No Locations Yet</CardTitle>
            <CardDescription className="mb-4">Get started by adding your first coffee shop location.</CardDescription>
            <Button onClick={() => setIsAddingLocation(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Location
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
