import type { MarketplaceListing } from "../types"

export const mockMarketplaceListings: MarketplaceListing[] = [
  {
    id: "ml1",
    sellerId: "3",
    sellerName: "Jane Manager",
    sellerLocation: "Downtown Location",
    productName: "House Roasted Colombian Beans",
    category: "Coffee Beans",
    description: "Freshly roasted Colombian beans with notes of chocolate and caramel",
    unitPrice: 14.0,
    unit: "lb",
    availableQuantity: 200,
    minOrderQty: 10,
    isActive: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "ml2",
    sellerId: "12",
    sellerName: "Alex Manager",
    sellerLocation: "Main Street",
    productName: "Artisan Pastry Mix",
    category: "Baking Supplies",
    description: "Premium pastry flour blend perfect for croissants and muffins",
    unitPrice: 8.5,
    unit: "kg",
    availableQuantity: 50,
    minOrderQty: 5,
    isActive: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
]
