"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/services/store-service"
import { getInventoryItems } from "@/lib/services"
import type { InventoryItem } from "@/lib/types"
import { InventoryList } from "@/components/inventory/inventory-list"

export default function InventoryPage() {
  const { currentUser } = useAppStore()
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadInventory = async () => {
      if (!currentUser) return

      try {
        setLoading(true)
        const inventoryData = await getInventoryItems(currentUser)
        setInventory(inventoryData)
      } catch (error) {
        console.error("Failed to load inventory:", error)
        setInventory([])
      } finally {
        setLoading(false)
      }
    }

    loadInventory()
  }, [currentUser])

  const handleEdit = (item: InventoryItem) => {
    console.log("Edit item:", item)
    // In a real app, this would open an edit form
  }

  const handleRestock = (itemId: string, quantity: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, currentStock: item.currentStock + quantity, lastRestocked: new Date() } : item,
      ),
    )
  }

  const handleAdd = () => {
    console.log("Add new inventory item")
    // In a real app, this would open an add form
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Inventory Management</h1>
          <p className="text-muted-foreground">Loading inventory items...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <InventoryList items={inventory} onEdit={handleEdit} onRestock={handleRestock} onAdd={handleAdd} />
    </div>
  )
}
