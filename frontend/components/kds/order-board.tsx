"use client"

import { useEffect, useState } from "react"
import type { Order } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, ChefHat, CheckCircle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderBoardProps {
  orders: Order[]
  onUpdateStatus: (orderId: string, status: Order["status"]) => void
}

const statusConfig = {
  queued: {
    label: "New Orders",
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    icon: Clock,
  },
  "in-progress": {
    label: "In Progress",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    icon: ChefHat,
  },
  ready: {
    label: "Ready for Pickup",
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    icon: CheckCircle,
  },
}

export function OrderBoard({ orders, onUpdateStatus }: OrderBoardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  const getOrderAge = (createdAt: Date) => {
    const diffMs = currentTime.getTime() - new Date(createdAt).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    return diffMins
  }

  const getOrdersByStatus = (status: Order["status"]) => {
    return orders
      .filter((order) => order.status === status)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  }

  const renderOrderCard = (order: Order) => {
    const config = statusConfig[order.status as keyof typeof statusConfig]
    if (!config) return null

    const Icon = config.icon
    const orderAge = getOrderAge(order.createdAt)
    const isUrgent = orderAge > 15 // Orders older than 15 minutes are urgent

    return (
      <Card
        key={order.id}
        className={cn(
          "p-4 transition-all duration-200",
          config.bgColor,
          config.borderColor,
          isUrgent && order.status !== "ready" && "ring-2 ring-red-500 ring-opacity-50",
        )}
      >
        {/* Order Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge className={`${config.color} text-white`}>
              <Icon className="h-3 w-3 mr-1" />#{order.id.slice(-4)}
            </Badge>
            {order.customerName && <span className="font-medium text-sm">{order.customerName}</span>}
            {isUrgent && order.status !== "ready" && (
              <Badge variant="destructive" className="animate-pulse">
                <AlertTriangle className="h-3 w-3 mr-1" />
                URGENT
              </Badge>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">
              {new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className={cn("text-xs font-medium", isUrgent ? "text-red-600" : "text-muted-foreground")}>
              {orderAge}m ago
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="space-y-2 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="bg-background/50 rounded-md p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">
                  {item.quantity}x {item.productName}
                </span>
                <span className="text-xs text-muted-foreground">{item.sizeName}</span>
              </div>
              {item.modifiers.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.modifiers.map((mod) => (
                    <Badge key={mod.id} variant="outline" className="text-xs">
                      {mod.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {order.status === "queued" && (
            <Button
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onUpdateStatus(order.id, "in-progress")}
            >
              <ChefHat className="h-3 w-3 mr-1" />
              Start Preparing
            </Button>
          )}
          {order.status === "in-progress" && (
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onUpdateStatus(order.id, "ready")}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Mark Ready
            </Button>
          )}
          {order.status === "ready" && (
            <div className="flex-1 text-center py-2">
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Waiting for pickup...</span>
            </div>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* New Orders Column */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-600" />
          <h2 className="text-lg font-semibold">New Orders</h2>
          <Badge variant="secondary">{getOrdersByStatus("queued").length}</Badge>
        </div>
        <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          {getOrdersByStatus("queued").map(renderOrderCard)}
          {getOrdersByStatus("queued").length === 0 && (
            <Card className="p-6 text-center text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No new orders</p>
            </Card>
          )}
        </div>
      </div>

      {/* In Progress Column */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ChefHat className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">In Progress</h2>
          <Badge variant="secondary">{getOrdersByStatus("in-progress").length}</Badge>
        </div>
        <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          {getOrdersByStatus("in-progress").map(renderOrderCard)}
          {getOrdersByStatus("in-progress").length === 0 && (
            <Card className="p-6 text-center text-muted-foreground">
              <ChefHat className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No orders in progress</p>
            </Card>
          )}
        </div>
      </div>

      {/* Ready Column */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold">Ready for Pickup</h2>
          <Badge variant="secondary">{getOrdersByStatus("ready").length}</Badge>
        </div>
        <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          {getOrdersByStatus("ready").map(renderOrderCard)}
          {getOrdersByStatus("ready").length === 0 && (
            <Card className="p-6 text-center text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No orders ready</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
