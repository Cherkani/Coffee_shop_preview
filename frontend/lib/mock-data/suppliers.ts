import type { Supplier } from "../types"

export const mockSuppliers: Supplier[] = [
  {
    id: "sup1",
    name: "Premium Coffee Beans Co.",
    contactEmail: "orders@premiumcoffee.com",
    contactPhone: "+1-555-0123",
    address: "123 Coffee Farm Rd, Colombia",
    category: "Coffee Beans",
    rating: 4.8,
    isActive: true,
    products: [
      {
        id: "p1",
        name: "Colombian Arabica Beans",
        category: "Coffee Beans",
        unitPrice: 12.5,
        unit: "lb",
        minOrderQty: 50,
      },
      {
        id: "p2",
        name: "Ethiopian Single Origin",
        category: "Coffee Beans",
        unitPrice: 15.75,
        unit: "lb",
        minOrderQty: 25,
      },
    ],
  },
  {
    id: "sup2",
    name: "Dairy Fresh Suppliers",
    contactEmail: "sales@dairyfresh.com",
    contactPhone: "+1-555-0456",
    address: "456 Farm Valley, Wisconsin",
    category: "Dairy Products",
    rating: 4.6,
    isActive: true,
    products: [
      { id: "p3", name: "Whole Milk", category: "Dairy", unitPrice: 3.25, unit: "gallon", minOrderQty: 10 },
      { id: "p4", name: "Oat Milk", category: "Alternative Milk", unitPrice: 4.5, unit: "gallon", minOrderQty: 5 },
    ],
  },
]
