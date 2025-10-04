import { create } from "zustand"
import type { User, Organization, Location, Product, Order, OrganizationNavigationSettings } from "./types"
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
import { mockNavigationSettings, mockProductions } from "./mock-data"
import { getVisibleOrganizations, getVisibleUsers, hasPermission } from "./permissions"
import { getDefaultNavigationSettings, updateNavigationPermission } from "./navigation-permissions"
import {
  getProducts,
  getOrders,
  getTransactions,
  getInventoryItems,
  getSuppliers,
  getMarketplaceItems,
  getMarketplaceListings,
  getProduction,
  getUsers,
} from "./services"

interface AppState {
  currentUser: User | null
  currentOrganization: Organization | null
  currentLocation: Location | null
  organizations: Organization[]
  locations: Location[]
  isAuthenticated: boolean
  navigationSettings: OrganizationNavigationSettings | null
  selectedLocations: string[] // For owners to filter by multiple locations

  // Actions
  setCurrentUser: (user: User) => void
  setCurrentOrganization: (org: Organization) => void
  setCurrentLocation: (location: Location) => void
  setSelectedLocations: (locationIds: string[]) => void
  signOut: () => void
  signIn: (user: User) => void
  updateNavigationPermission: (permissionId: string, enabled: boolean) => void
  setNavigationSettings: (settings: OrganizationNavigationSettings) => void

  // Data getters
  getDashboardMetrics: () => any
  getTransactions: () => any[]
  getInventoryItems: () => any[]
  getSuppliers: () => any[]
  getMarketplaceListings: () => any[]
  getVisibleOrganizations: () => Organization[]
  getVisibleUsers: () => User[]
  getProducts: () => Product[]
  getOrders: () => Order[]
  getProduction: () => any[]
  hasPermission: (permission: string) => boolean
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  currentOrganization: null,
  currentLocation: null,
  organizations: mockOrganizations,
  locations: mockOrganizations.flatMap((org) => org.locations),
  isAuthenticated: false,
  navigationSettings: null,
  selectedLocations: [],

  setCurrentUser: (user) => set({ currentUser: user }),
  setCurrentOrganization: (org) => set({ currentOrganization: org }),
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setSelectedLocations: (locationIds) => set({ selectedLocations: locationIds }),

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
    const navigationSettings = org ? mockNavigationSettings.find((s: OrganizationNavigationSettings) => s.organizationId === org.id) || getDefaultNavigationSettings(org.id) : null

    // Initialize selected locations for owners (all their locations)
    const initialSelectedLocations = user.role === "owner" && org 
      ? org.locations.map(loc => loc.id)
      : []

    set({
      currentUser: user,
      currentOrganization: org,
      currentLocation: location,
      isAuthenticated: true,
      navigationSettings,
      selectedLocations: initialSelectedLocations,
    })
  },

  updateNavigationPermission: (permissionId, enabled) => {
    const { navigationSettings } = get()
    if (navigationSettings) {
      const updatedSettings = updateNavigationPermission(navigationSettings, permissionId, enabled)
      set({ navigationSettings: updatedSettings })
    }
  },

  setNavigationSettings: (settings) => set({ navigationSettings: settings }),

  getDashboardMetrics: () => {
    const { currentUser } = get()
    if (!currentUser) return null
    return mockDashboardMetrics[currentUser.role] || null
  },

  getTransactions: () => {
    const { currentUser, selectedLocations } = get()
    return getTransactions(currentUser, selectedLocations)
  },
  getInventoryItems: () => {
    const { currentUser, selectedLocations } = get()
    return getInventoryItems(currentUser, selectedLocations)
  },
  getSuppliers: () => {
    const { currentUser } = get()
    return getSuppliers(currentUser)
  },
  getMarketplaceListings: () => {
    const { currentUser } = get()
    return getMarketplaceListings(currentUser)
  },

  getVisibleOrganizations: () => {
    const { currentUser, organizations } = get()
    return getVisibleOrganizations(currentUser, organizations)
  },

  getVisibleUsers: () => {
    const { currentUser } = get()
    return getUsers(currentUser)
  },

  getProducts: () => {
    const { currentUser, selectedLocations } = get()
    return getProducts(currentUser, selectedLocations)
  },

  getOrders: () => {
    const { currentUser, selectedLocations } = get()
    return getOrders(currentUser, selectedLocations)
  },

  getProduction: () => {
    const { currentUser } = get()
    return getProduction(currentUser)
  },

  hasPermission: (permission: string) => {
    const { currentUser } = get()
    return hasPermission(currentUser, permission as any)
  },
}))
