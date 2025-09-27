"use client"

import { useState } from "react"
import type { InventoryItem } from "@/lib/types"
import { InventoryList } from "@/components/inventory/inventory-list"

// Mock inventory data
const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Coffee Beans - Colombian",
    category: "Coffee",
    currentStock: 5,
    minStock: 20,
    maxStock: 100,
    unit: "lbs",
    costPerUnit: 12.5,
    supplier: "Premium Coffee Co.",
    lastRestocked: new Date("2024-01-15"),
    expiryDate: new Date("2024-06-15"),
  },
  {
    id: "2",
    name: "Oat Milk",
    category: "Dairy",
    currentStock: 8,
    minStock: 15,
    maxStock: 50,
    unit: "cartons",
    costPerUnit: 3.25,
    supplier: "Dairy Fresh",
    lastRestocked: new Date("2024-01-20"),
    expiryDate: new Date("2024-02-05"),
  },
  {
    id: "3",
    name: "Paper Cups - 12oz",
    category: "Supplies",
    currentStock: 0,
    minStock: 100,
    maxStock: 1000,
    unit: "count",
    costPerUnit: 0.15,
    supplier: "Supply Pro",
    lastRestocked: new Date("2024-01-10"),
  },
  {
    id: "4",
    name: "Sugar Packets",
    category: "Supplies",
    currentStock: 250,
    minStock: 100,
    maxStock: 500,
    unit: "count",
    costPerUnit: 0.02,
    supplier: "Sweet Supply",
    lastRestocked: new Date("2024-01-18"),
  },
  {
    id: "5",
    name: "Croissants",
    category: "Pastry",
    currentStock: 12,
    minStock: 20,
    maxStock: 50,
    unit: "count",
    costPerUnit: 1.25,
    supplier: "Local Bakery",
    lastRestocked: new Date("2024-01-22"),
    expiryDate: new Date("2024-01-24"),
  },
]

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)

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
