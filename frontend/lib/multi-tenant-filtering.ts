import type { User, Product, Order, Transaction, InventoryItem, Supplier, MarketplaceItem, Production } from "./types"

/**
 * Multi-tenant data filtering utilities
 * Ensures users only see data from their organization and location
 */

// Filter products by organization and location
export function filterProductsByTenant(
  products: Product[], 
  user: User | null,
  selectedLocations?: string[]
): Product[] {
  if (!user || !user.organizationId) return []
  
  // Superuser can see all products
  if (user.role === "superuser") return products
  
  // Owner can see products in their organization, optionally filtered by selected locations
  if (user.role === "owner") {
    let filteredProducts = products.filter(product => product.organizationId === user.organizationId)
    
    // If specific locations are selected, filter by those locations
    if (selectedLocations && selectedLocations.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        product.locationId && selectedLocations.includes(product.locationId)
      )
    }
    
    return filteredProducts
  }
  
  // Admin and cashier can see all products in their organization
  // All users within the same organization can see all products from that organization
  if (user.role === "admin" || user.role === "cashier") {
    return products.filter(product => 
      product.organizationId === user.organizationId
    )
  }
  
  return []
}

// Filter orders by organization and location
export function filterOrdersByTenant(
  orders: Order[], 
  user: User | null,
  selectedLocations?: string[]
): Order[] {
  if (!user || !user.organizationId) return []
  
  // Superuser can see all orders
  if (user.role === "superuser") return orders
  
  // Owner can see orders in their organization, optionally filtered by selected locations
  if (user.role === "owner") {
    let filteredOrders = orders.filter(order => order.organizationId === user.organizationId)
    
    // If specific locations are selected, filter by those locations
    if (selectedLocations && selectedLocations.length > 0) {
      filteredOrders = filteredOrders.filter(order => 
        order.locationId && selectedLocations.includes(order.locationId)
      )
    }
    
    return filteredOrders
  }
  
  // Admin and cashier can see all orders in their organization
  if (user.role === "admin" || user.role === "cashier") {
    return orders.filter(order => 
      order.organizationId === user.organizationId
    )
  }
  
  return []
}

// Filter transactions by organization and location
export function filterTransactionsByTenant(
  transactions: Transaction[], 
  user: User | null,
  selectedLocations?: string[]
): Transaction[] {
  if (!user || !user.organizationId) return []
  
  // Superuser can see all transactions
  if (user.role === "superuser") return transactions
  
  // Owner can see transactions in their organization, optionally filtered by selected locations
  if (user.role === "owner") {
    let filteredTransactions = transactions.filter(transaction => transaction.organizationId === user.organizationId)
    
    // If specific locations are selected, filter by those locations
    if (selectedLocations && selectedLocations.length > 0) {
      filteredTransactions = filteredTransactions.filter(transaction => 
        transaction.locationId && selectedLocations.includes(transaction.locationId)
      )
    }
    
    return filteredTransactions
  }
  
  // Admin and cashier can see all transactions in their organization
  if (user.role === "admin" || user.role === "cashier") {
    return transactions.filter(transaction => 
      transaction.organizationId === user.organizationId
    )
  }
  
  return []
}

// Filter inventory by organization and location
export function filterInventoryByTenant(
  inventory: InventoryItem[], 
  user: User | null,
  selectedLocations?: string[]
): InventoryItem[] {
  if (!user || !user.organizationId) return []
  
  // Superuser can see all inventory
  if (user.role === "superuser") return inventory
  
  // Owner can see inventory in their organization, optionally filtered by selected locations
  if (user.role === "owner") {
    let filteredInventory = inventory.filter(item => item.organizationId === user.organizationId)
    
    // If specific locations are selected, filter by those locations
    if (selectedLocations && selectedLocations.length > 0) {
      filteredInventory = filteredInventory.filter(item => 
        item.locationId && selectedLocations.includes(item.locationId)
      )
    }
    
    return filteredInventory
  }
  
  // Admin and cashier can see all inventory in their organization
  if (user.role === "admin" || user.role === "cashier") {
    return inventory.filter(item => 
      item.organizationId === user.organizationId
    )
  }
  
  return []
}

// Filter suppliers by organization
export function filterSuppliersByTenant(
  suppliers: Supplier[], 
  user: User | null
): Supplier[] {
  if (!user || !user.organizationId) return []
  
  // Superuser can see all suppliers
  if (user.role === "superuser") return suppliers
  
  // Owner and admin can see suppliers in their organization
  if (user.role === "owner" || user.role === "admin") {
    return suppliers.filter(supplier => supplier.organizationId === user.organizationId)
  }
  
  // Cashiers cannot see suppliers
  return []
}

// Filter marketplace items by organization
export function filterMarketplaceItemsByTenant(
  items: MarketplaceItem[], 
  user: User | null
): MarketplaceItem[] {
  if (!user || !user.organizationId) return []
  
  // Superuser can see all marketplace items
  if (user.role === "superuser") return items
  
  // Owner and admin can see marketplace items
  if (user.role === "owner" || user.role === "admin") {
    return items
  }
  
  // Cashiers cannot see marketplace
  return []
}

// Filter production by organization and location
export function filterProductionByTenant(
  production: Production[], 
  user: User | null
): Production[] {
  if (!user || !user.organizationId) return []
  
  // Superuser can see all production
  if (user.role === "superuser") return production
  
  // Owner can see all production in their organization
  if (user.role === "owner") {
    return production.filter(item => item.locationId && user.organizationId)
  }
  
  // Admin can see production in their organization
  if (user.role === "admin") {
    return production.filter(item => item.locationId && user.organizationId)
  }
  
  // Cashiers cannot see production
  return []
}

// Filter users by organization and location
export function filterUsersByTenant(
  users: User[], 
  currentUser: User | null
): User[] {
  if (!currentUser) return []
  
  // Superuser can see all users
  if (currentUser.role === "superuser") return users
  
  // Owner can see all users in their organization
  if (currentUser.role === "owner") {
    return users.filter(user => user.organizationId === currentUser.organizationId)
  }
  
  // Admin can see users in their organization
  if (currentUser.role === "admin") {
    return users.filter(user => user.organizationId === currentUser.organizationId)
  }
  
  // Cashiers can only see themselves
  return [currentUser]
}
