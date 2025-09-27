"use client"

import { useEffect, useState } from "react"
import type { Order } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Volume2, VolumeX } from "lucide-react"

interface KDSHeaderProps {
  orders: Order[]
  locationName?: string
  onRefresh?: () => void
}

export function KDSHeader({ orders, locationName, onRefresh }: KDSHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const activeOrders = orders.filter((order) => order.status !== "paid")
  const urgentOrders = orders.filter((order) => {
    const orderAge = (currentTime.getTime() - new Date(order.createdAt).getTime()) / 60000
    return orderAge > 15 && order.status !== "ready" && order.status !== "paid"
  })

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Kitchen Display</h1>
          {locationName && (
            <Badge variant="outline" className="text-sm">
              {locationName}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Order Stats */}
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-lg font-semibold">{activeOrders.length}</div>
              <div className="text-xs text-muted-foreground">Active</div>
            </div>
            {urgentOrders.length > 0 && (
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600 animate-pulse">{urgentOrders.length}</div>
                <div className="text-xs text-red-600">Urgent</div>
              </div>
            )}
          </div>

          {/* Current Time */}
          <div className="text-right">
            <div className="text-lg font-mono font-semibold">
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentTime.toLocaleDateString([], {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={soundEnabled ? "text-green-600" : "text-muted-foreground"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
