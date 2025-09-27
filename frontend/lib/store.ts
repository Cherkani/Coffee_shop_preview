import { create } from "zustand"
import type { User, Organization, Location, Product, Order } from "./types"
import {
  mockOrganizations,
  mockUsers,
  mockProducts,
  mockOrders,
  mockDashboardMetrics,
  mockTransactions,
  mockInventoryItems,
  mockSuppliers,
  mockMarketplaceListings,
} from "./data"
import { getVisibleOrganizations, getVisibleUsers, hasPermission } from "./permissions"

interface AppState {
  currentUser: User | null
  currentOrganization: Organization | null
  currentLocation: Location | null
  organizations: Organization[]
  locations: Location[]
  products: Product[]
  orders: Order[]
  users: User[]
  isAuthenticated: boolean

  // Actions
  setCurrentUser: (user: User) => void
  setCurrentOrganization: (org: Organization) => void
  setCurrentLocation: (location: Location) => void
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  signOut: () => void
  signIn: (user: User) => void

  // Data getters
  getDashboardMetrics: () => any
  getTransactions: () => any[]
  getInventoryItems: () => any[]
  getSuppliers: () => any[]
  getMarketplaceListings: () => any[]
  getVisibleOrganizations: () => Organization[]
  getVisibleUsers: () => User[]
  hasPermission: (permission: string) => boolean
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  currentOrganization: null,
  currentLocation: null,
  organizations: mockOrganizations,
  locations: mockOrganizations.flatMap((org) => org.locations),
  products: mockProducts,
  orders: mockOrders,
  users: mockUsers,
  isAuthenticated: false,

  setCurrentUser: (user) => set({ currentUser: user }),
  setCurrentOrganization: (org) => set({ currentOrganization: org }),
  setCurrentLocation: (location) => set({ currentLocation: location }),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((order) => (order.id === orderId ? { ...order, status } : order)),
    })),

  signOut: () =>
    set({
      currentUser: null,
      currentOrganization: null,
      currentLocation: null,
      isAuthenticated: false,
    }),

  signIn: (user) => {
    const org = user.organizationId ? mockOrganizations.find((o) => o.id === user.organizationId) : null
    const location = user.locationId && org ? org.locations.find((l) => l.id === user.locationId) : null

    set({
      currentUser: user,
      currentOrganization: org,
      currentLocation: location,
      isAuthenticated: true,
    })
  },

  getDashboardMetrics: () => {
    const { currentUser } = get()
    if (!currentUser) return null
    return mockDashboardMetrics[currentUser.role] || null
  },

  getTransactions: () => mockTransactions,
  getInventoryItems: () => mockInventoryItems,
  getSuppliers: () => mockSuppliers,
  getMarketplaceListings: () => mockMarketplaceListings,

  getVisibleOrganizations: () => {
    const { currentUser, organizations } = get()
    return getVisibleOrganizations(currentUser, organizations)
  },

  getVisibleUsers: () => {
    const { currentUser, users } = get()
    return getVisibleUsers(currentUser, users)
  },

  hasPermission: (permission: string) => {
    const { currentUser } = get()
    return hasPermission(currentUser, permission as any)
  },
}))
