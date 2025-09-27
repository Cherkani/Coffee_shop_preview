import { mockOrganizations } from "./mock-data/organizations"
import { mockUsers } from "./mock-data/users"
import { mockProducts } from "./mock-data/products"
import { mockOrders } from "./mock-data/orders"
import { mockSuppliers } from "./mock-data/suppliers"
import { mockInventoryItems } from "./mock-data/inventory"
import { mockTransactions } from "./mock-data/transactions"
import { mockMarketplaceListings } from "./mock-data/marketplace"
import { mockDashboardMetrics } from "./mock-data/metrics"

// Re-export all mock data
export {
  mockOrganizations,
  mockUsers,
  mockProducts,
  mockOrders,
  mockSuppliers,
  mockInventoryItems,
  mockTransactions,
  mockMarketplaceListings,
  mockDashboardMetrics,
}

export const getDataByOrganization = (organizationId: string) => {
  return {
    users: mockUsers.filter((user) => user.organizationId === organizationId),
    products: mockProducts.filter((product) => product.organizationId === organizationId),
    orders: mockOrders.filter((order) => order.organizationId === organizationId),
    suppliers: mockSuppliers.filter((supplier) => supplier.organizationId === organizationId),
    inventory: mockInventoryItems.filter((item) => item.organizationId === organizationId),
    transactions: mockTransactions.filter((txn) => txn.organizationId === organizationId),
    marketplaceListings: mockMarketplaceListings.filter((listing) => listing.organizationId === organizationId),
  }
}

export const getDataByLocation = (organizationId: string, locationId: string) => {
  return {
    users: mockUsers.filter((user) => user.organizationId === organizationId && user.locationId === locationId),
    products: mockProducts.filter(
      (product) => product.organizationId === organizationId && product.locationId === locationId,
    ),
    orders: mockOrders.filter((order) => order.organizationId === organizationId && order.locationId === locationId),
    inventory: mockInventoryItems.filter(
      (item) => item.organizationId === organizationId && item.locationId === locationId,
    ),
    transactions: mockTransactions.filter(
      (txn) => txn.organizationId === organizationId && txn.locationId === locationId,
    ),
    marketplaceListings: mockMarketplaceListings.filter(
      (listing) => listing.organizationId === organizationId && listing.locationId === locationId,
    ),
  }
}
