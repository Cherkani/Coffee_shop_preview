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
  addProduct as addProductService,
  updateProduct as updateProductService,
  deleteProduct as deleteProductService,
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
  initializeData: () => Promise<void>
  setCurrentUser: (user: User) => void
  setCurrentOrganization: (org: Organization) => void
  setCurrentLocation: (location: Location) => void
  setSelectedLocations: (locationIds: string[]) => void
  signOut: () => void
  signIn: (user: User) => void
  updateNavigationPermission: (permissionId: string, enabled: boolean) => void
  setNavigationSettings: (settings: OrganizationNavigationSettings) => void
  
  // Product management actions
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (productId: string, updates: Partial<Product>) => void
  deleteProduct: (productId: string) => void

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
  organizations: [],
  locations: [],
  isAuthenticated: false,
  navigationSettings: null,
  selectedLocations: [],

  setCurrentUser: (user) => set({ currentUser: user }),
  setCurrentOrganization: (org) => set({ currentOrganization: org }),
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setSelectedLocations: (locationIds) => set({ selectedLocations: locationIds }),

  initializeData: async () => {
    try {
      console.log("Initializing store data...")
      const [organizations, navigationSettings] = await Promise.all([
        mockOrganizations(),
        mockNavigationSettings()
      ])
      
      const locations = organizations.flatMap((org) => org.locations)
      
      set({ 
        organizations,
        locations,
        navigationSettings: navigationSettings[0] || null
      })
      
      console.log("Store data initialized:", { 
        organizations: organizations.length, 
        locations: locations.length 
      })
    } catch (error) {
      console.error("Failed to initialize store data:", error)
    }
  },

  signOut: () =>
    set({
      currentUser: null,
      currentOrganization: null,
      currentLocation: null,
      isAuthenticated: false,
    }),

  signIn: (user) => {
    const { organizations, navigationSettings } = get()
    const org = user.organizationId ? organizations.find((o) => o.id === user.organizationId) : null
    const location = user.locationId && org ? org.locations.find((l) => l.id === user.locationId) : null
    const userNavigationSettings = org ? navigationSettings || getDefaultNavigationSettings(org.id) : null

    // Initialize selected locations for owners (all their locations)
    const initialSelectedLocations = user.role === "owner" && org 
      ? org.locations.map(loc => loc.id)
      : []

    set({
      currentUser: user,
      currentOrganization: org,
      currentLocation: location,
      isAuthenticated: true,
      navigationSettings: userNavigationSettings,
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

  // Product management actions
  addProduct: (productData) => {
    const { currentUser } = get()
    console.log("Store addProduct called:", productData)
    console.log("Current user:", currentUser)
    
    if (!currentUser) {
      console.log("No current user, cannot add product")
      return
    }

    try {
      const newProduct = addProductService(productData, currentUser)
      console.log("Product added to mock data:", newProduct)
      console.log("Product will be available on next page refresh")
    } catch (error) {
      console.error("Error adding product:", error)
    }
  },

  updateProduct: (productId, updates) => {
    const { currentUser } = get()
    
    if (!currentUser) {
      console.log("No current user, cannot update product")
      return
    }

    try {
      const updatedProduct = updateProductService(productId, updates, currentUser)
      console.log("Product updated in mock data:", updatedProduct)
      console.log("Product will be available on next page refresh")
    } catch (error) {
      console.error("Error updating product:", error)
    }
  },

  deleteProduct: (productId) => {
    const { currentUser } = get()
    
    if (!currentUser) {
      console.log("No current user, cannot delete product")
      return
    }

    try {
      const success = deleteProductService(productId, currentUser)
      console.log("Product deleted from mock data:", success)
      console.log("Product will be removed on next page refresh")
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  },

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
    console.log("Store getProducts called:")
    console.log("- Current user:", currentUser)
    console.log("- Selected locations:", selectedLocations)
    
    // For now, return empty array - components should use the async service directly
    console.log("- Returning empty array (use async service directly)")
    return []
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
