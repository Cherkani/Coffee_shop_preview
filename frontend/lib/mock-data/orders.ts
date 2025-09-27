import type { Order } from "../types"

export const mockOrders: Order[] = [
  {
    id: "1001",
    items: [
      {
        id: "i1",
        productId: "2",
        productName: "Cappuccino",
        sizeId: "s4",
        sizeName: "Medium",
        price: 5.6,
        modifiers: [{ id: "m3", name: "Oat Milk", price: 0.65, category: "Milk" }],
        quantity: 1,
      },
    ],
    total: 5.6,
    status: "queued",
    customerName: "Alice Johnson",
    createdAt: new Date(Date.now() - 5 * 60000),
    locationId: "1",
    cashierId: "4",
  },
  {
    id: "1002",
    items: [
      {
        id: "i2",
        productId: "1",
        productName: "Espresso",
        sizeId: "s2",
        sizeName: "Double",
        price: 3.5,
        modifiers: [],
        quantity: 2,
      },
      {
        id: "i3",
        productId: "9",
        productName: "Croissant",
        sizeId: "s6",
        sizeName: "Regular",
        price: 3.25,
        modifiers: [{ id: "m12", name: "Heated", price: 0, category: "Preparation" }],
        quantity: 1,
      },
    ],
    total: 10.25,
    status: "in-progress",
    customerName: "Bob Smith",
    createdAt: new Date(Date.now() - 12 * 60000),
    locationId: "1",
    cashierId: "4",
  },
]
