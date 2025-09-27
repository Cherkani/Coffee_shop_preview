import type { InventoryItem } from "../types"

export const mockInventoryItems: InventoryItem[] = [
  {
    id: "inv1",
    name: "Colombian Coffee Beans",
    category: "Coffee Beans",
    currentStock: 45,
    minStock: 20,
    maxStock: 100,
    unit: "lb",
    costPerUnit: 12.5,
    supplierId: "sup1",
    locationId: "1",
    lastRestocked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "inv2",
    name: "Whole Milk",
    category: "Dairy",
    currentStock: 8,
    minStock: 15,
    maxStock: 50,
    unit: "gallon",
    costPerUnit: 3.25,
    supplierId: "sup2",
    locationId: "1",
    lastRestocked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
]
