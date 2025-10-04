"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"
import { getOrders } from "@/lib/services"
import { OrderBoard } from "@/components/kds/order-board"
import { KDSHeader } from "@/components/kds/kds-header"

export default function KDSPage() {
  const { currentUser, currentLocation } = useAppStore()
  const orders = getOrders(currentUser)
  const [refreshKey, setRefreshKey] = useState(0)

  // Mock function for demo purposes
  const updateOrderStatus = (orderId: string, status: any) => {
    console.log("Updating order status:", orderId, status)
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshKey((prev) => prev + 1)
    }, 30000)
    return () => clearInterval(timer)
  }, [])

  // Filter orders for current location and exclude paid orders
  const locationOrders = orders.filter((order) => order.locationId === currentLocation?.id && order.status !== "paid")

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
  }

  // Play sound for new orders (in a real app, this would be more sophisticated)
  useEffect(() => {
    const newOrders = locationOrders.filter((order) => order.status === "queued")
    if (newOrders.length > 0) {
      // In a real app, you'd play a notification sound here
      console.log(`${newOrders.length} new orders`)
    }
  }, [locationOrders])

  return (
    <div className="h-full flex flex-col">
      <KDSHeader orders={locationOrders} locationName={currentLocation?.name} onRefresh={handleRefresh} />

      <div className="flex-1 p-6 overflow-hidden">
        <OrderBoard key={refreshKey} orders={locationOrders} onUpdateStatus={updateOrderStatus} />
      </div>
    </div>
  )
}
