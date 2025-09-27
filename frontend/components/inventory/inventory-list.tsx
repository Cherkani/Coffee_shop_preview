"use client"

import { useState } from "react"
import type { InventoryItem } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Package, Plus, Edit } from "lucide-react"
import { cn } from "@/lib/utils"

interface InventoryListProps {
  items: InventoryItem[]
  onEdit: (item: InventoryItem) => void
  onRestock: (itemId: string, quantity: number) => void
  onAdd: () => void
}

export function InventoryList({ items, onEdit, onRestock, onAdd }: InventoryListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAlertsOnly, setShowAlertsOnly] = useState(false)

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const isLowStock = item.currentStock <= item.minStock
    return matchesSearch && (!showAlertsOnly || isLowStock)
  })

  const getStockStatus = (item: InventoryItem) => {
    const percentage = (item.currentStock / item.maxStock) * 100
    if (item.currentStock === 0) return { status: "out", color: "bg-red-500", label: "Out of Stock" }
    if (item.currentStock <= item.minStock) return { status: "low", color: "bg-orange-500", label: "Low Stock" }
    if (percentage < 50) return { status: "medium", color: "bg-yellow-500", label: "Medium Stock" }
    return { status: "good", color: "bg-green-500", label: "Good Stock" }
  }

  const lowStockCount = items.filter((item) => item.currentStock <= item.minStock).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Inventory Management</h2>
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">{lowStockCount} items need attention</span>
            </div>
          )}
        </div>
        <Button onClick={onAdd} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant={showAlertsOnly ? "default" : "outline"} onClick={() => setShowAlertsOnly(!showAlertsOnly)}>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Alerts Only
        </Button>
      </div>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const stockStatus = getStockStatus(item)
          const stockPercentage = Math.min((item.currentStock / item.maxStock) * 100, 100)

          return (
            <Card key={item.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <Badge variant="secondary" className="mt-1">
                    {item.category}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Stock Level */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Stock Level</span>
                    <Badge className={`${stockStatus.color} text-white text-xs`}>{stockStatus.label}</Badge>
                  </div>
                  <Progress value={stockPercentage} className="h-2 mb-1" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {item.currentStock} {item.unit}
                    </span>
                    <span>
                      Max: {item.maxStock} {item.unit}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Min Stock:</span>
                    <span>
                      {item.minStock} {item.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost per {item.unit}:</span>
                    <span>${item.costPerUnit.toFixed(2)}</span>
                  </div>
                  {item.supplier && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Supplier:</span>
                      <span>{item.supplier}</span>
                    </div>
                  )}
                  {item.expiryDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires:</span>
                      <span
                        className={cn(
                          new Date(item.expiryDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                            ? "text-red-600"
                            : "",
                        )}
                      >
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Restock Button */}
                {item.currentStock <= item.minStock && (
                  <Button
                    size="sm"
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={() => onRestock(item.id, item.maxStock - item.currentStock)}
                  >
                    <Package className="h-3 w-3 mr-2" />
                    Restock to Max
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>

      {filteredItems.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">{showAlertsOnly ? "No low stock alerts" : "No inventory items found"}</p>
        </Card>
      )}
    </div>
  )
}
