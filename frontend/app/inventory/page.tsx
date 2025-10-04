"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { getInventoryItems } from "@/lib/services"
import type { InventoryItem } from "@/lib/types"
import { InventoryList } from "@/components/inventory/inventory-list"


export default function InventoryPage() {
  const { currentUser } = useAppStore()
  const [inventory, setInventory] = useState<InventoryItem[]>(getInventoryItems(currentUser))

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

  return (
    <div className="p-6">
      <InventoryList items={inventory} onEdit={handleEdit} onRestock={handleRestock} onAdd={handleAdd} />
    </div>
  )
}
