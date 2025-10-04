"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Calendar, DollarSign, Package, CheckCircle } from "lucide-react"
import type { Production } from "@/lib/types"
import { getProduction } from "@/lib/services"

export default function ProductionPage() {
  const { currentUser } = useAppStore()
  const [productions, setProductions] = useState<Production[]>(getProduction(currentUser))
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Access control
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Access denied. Only admins can access production management.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredProductions = productions.filter((production) => {
    const matchesSearch =
      production.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      production.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || production.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Production["status"]) => {
    switch (status) {
      case "completed":
        return "default"
      case "ready-for-sale":
        return "default"
      case "in-progress":
        return "secondary"
      case "quality-check":
        return "outline"
      default:
        return "secondary"
    }
  }

  const totalProduction = productions.reduce((sum, p) => sum + p.totalCost, 0)
  const completedItems = productions.filter((p) => p.status === "completed" || p.status === "ready-for-sale").length

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Production Management</h1>
          <p className="text-muted-foreground">Track your in-house production</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Production
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Production Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalProduction.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Items</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedItems}</div>
            <p className="text-xs text-muted-foreground">Ready for sale</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Productions</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productions.filter((p) => p.status === "in-progress").length}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search productions..."
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
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="quality-check">Quality Check</SelectItem>
            <SelectItem value="ready-for-sale">Ready for Sale</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProductions.map((production) => (
          <Card key={production.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{production.itemName}</CardTitle>
                  <CardDescription>{production.category}</CardDescription>
                </div>
                <Badge variant={getStatusColor(production.status)}>{production.status.replace("-", " ")}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Quantity</span>
                  <p className="font-medium">
                    {production.quantityProduced} {production.unit}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Cost per Unit</span>
                  <p className="font-medium">${production.costPerUnit}</p>
                </div>
              </div>

              <div>
                <span className="text-sm text-muted-foreground">Total Cost</span>
                <p className="text-xl font-bold">${production.totalCost.toFixed(2)}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Produced: {production.productionDate.toLocaleDateString()}
                </div>
                {production.expiryDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Expires: {production.expiryDate.toLocaleDateString()}
                  </div>
                )}
              </div>

              {production.notes && (
                <div>
                  <span className="text-sm text-muted-foreground">Notes</span>
                  <p className="text-sm">{production.notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Edit
                </Button>
                {production.status === "ready-for-sale" && (
                  <Button size="sm" className="flex-1">
                    List in Marketplace
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
