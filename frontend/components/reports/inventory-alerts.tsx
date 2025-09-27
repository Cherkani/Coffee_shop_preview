"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Package, TrendingDown } from "lucide-react"

interface InventoryAlert {
  id: string
  name: string
  currentStock: number
  minStock: number
  category: string
  status: "low" | "critical" | "out"
}

interface InventoryAlertsProps {
  alerts: InventoryAlert[]
}

export function InventoryAlerts({ alerts }: InventoryAlertsProps) {
  const getStatusColor = (status: InventoryAlert["status"]) => {
    switch (status) {
      case "low":
        return "bg-yellow-500"
      case "critical":
        return "bg-orange-500"
      case "out":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusLabel = (status: InventoryAlert["status"]) => {
    switch (status) {
      case "low":
        return "Low Stock"
      case "critical":
        return "Critical"
      case "out":
        return "Out of Stock"
      default:
        return "Unknown"
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold">Inventory Alerts</h3>
        </div>
        <Badge variant="destructive">{alerts.length}</Badge>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No inventory alerts</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <div>
                  <p className="font-medium">{alert.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {alert.currentStock} left • Min: {alert.minStock}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={`${getStatusColor(alert.status)} text-white`}>{getStatusLabel(alert.status)}</Badge>
                <Button size="sm" variant="outline">
                  Reorder
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
