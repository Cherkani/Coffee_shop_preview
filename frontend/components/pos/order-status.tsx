"use client"

import type { Order } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, DollarSign } from "lucide-react"

interface OrderStatusProps {
  orders: Order[]
  onUpdateStatus: (orderId: string, status: Order["status"]) => void
}

const statusConfig = {
  queued: { label: "Queued", color: "bg-yellow-500", icon: Clock },
  "in-progress": { label: "In Progress", color: "bg-blue-500", icon: Clock },
  ready: { label: "Ready", color: "bg-green-500", icon: CheckCircle },
  paid: { label: "Paid", color: "bg-gray-500", icon: DollarSign },
}

export function OrderStatus({ orders, onUpdateStatus }: OrderStatusProps) {
  const recentOrders = orders
    .filter((order) => order.status !== "paid")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Recent Orders</h3>

      {recentOrders.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          <p>No active orders</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {recentOrders.map((order) => {
            const config = statusConfig[order.status]
            const Icon = config.icon

            return (
              <Card key={order.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={`${config.color} text-white`}>
                      <Icon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                    <span className="font-medium">Order #{order.id.slice(-4)}</span>
                    {order.customerName && (
                      <span className="text-sm text-muted-foreground">- {order.customerName}</span>
                    )}
                  </div>
                  <span className="font-semibold">${order.total.toFixed(2)}</span>
                </div>

                <div className="text-sm text-muted-foreground mb-3">
                  {order.items.map((item) => (
                    <div key={item.id}>
                      {item.quantity}x {item.productName} ({item.sizeName})
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  {order.status === "queued" && (
                    <Button size="sm" variant="outline" onClick={() => onUpdateStatus(order.id, "in-progress")}>
                      Start Preparing
                    </Button>
                  )}
                  {order.status === "in-progress" && (
                    <Button size="sm" variant="outline" onClick={() => onUpdateStatus(order.id, "ready")}>
                      Mark Ready
                    </Button>
                  )}
                  {order.status === "ready" && (
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => onUpdateStatus(order.id, "paid")}
                    >
                      Complete Order
                    </Button>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
