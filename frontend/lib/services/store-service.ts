import { create } from "zustand"
import type { User, Organization, Location, Product, Order, OrganizationNavigationSettings } from "../types"
import { getVisibleOrganizations, hasPermission } from "../permissions"
import { getDefaultNavigationSettings, updateNavigationPermission } from "../navigation-permissions"
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
} from "./index"
import ApiService from "./api-service"

interface AppState {
  currentUser: User | null
  currentOrganization: Organization | null
  currentLocation: Location | null
  organizations: Organization[]
  locations: Location[]
  isAuthenticated: boolean
  navigationSettings: OrganizationNavigationSettings | null
  selectedLocations: string[]

  initializeData: () => Promise<void>
  setCurrentUser: (user: User) => void
  setCurrentOrganization: (org: Organization) => void
  setCurrentLocation: (location: Location) => void
  setSelectedLocations: (locationIds: string[]) => void
  signOut: () => void
  signIn: (user: User) => void
  updateNavigationPermission: (permissionId: string, enabled: boolean) => void
  setNavigationSettings: (settings: OrganizationNavigationSettings) => void

  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (productId: string, updates: Partial<Product>) => void
  deleteProduct: (productId: string) => void

  getDashboardMetrics: () => Promise<any>
  getTransactions: () => Promise<any[]>
  getInventoryItems: () => Promise<any[]>
  getSuppliers: () => Promise<any[]>
  getMarketplaceListings: () => Promise<any[]>
  getVisibleOrganizations: () => Organization[]
  getVisibleUsers: () => Promise<User[]>
  getProducts: () => Promise<Product[]>
  getOrders: () => Promise<Order[]>
  getProduction: () => Promise<any[]>
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
      const [orgs, nav] = await Promise.all([
        fetch("/api/organizations").then((r) => r.json()),
        fetch("/api/navigationSettings").then((r) => r.json()),
      ])
      const locations = orgs.flatMap((org: any) => org.locations)
      set({ organizations: orgs, locations, navigationSettings: nav[0] || null })
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

    const initialSelectedLocations = user.role === "owner" && org ? org.locations.map((loc) => loc.id) : []

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

  addProduct: (productData) => {
    const { currentUser } = get()
    if (!currentUser) return
    addProductService(productData, currentUser)
  },
  updateProduct: (productId, updates) => {
    const { currentUser } = get()
    if (!currentUser) return
    updateProductService(productId, updates, currentUser)
  },
  deleteProduct: (productId) => {
    const { currentUser } = get()
    if (!currentUser) return
    deleteProductService(productId, currentUser)
  },

  getDashboardMetrics: async () => {
    try {
      return await ApiService.getMetrics()
    } catch {
      return null
    }
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

  getVisibleUsers: async () => {
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


