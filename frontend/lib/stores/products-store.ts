import { create } from "zustand"
import { getProducts } from "../services"
import type { Product, User } from "../types"

interface ProductsStore {
  products: Product[]
  loading: boolean
  loadProducts: (user: User | null) => Promise<void>
  refreshProducts: (user: User | null) => Promise<void>
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  loading: false,

  loadProducts: async (user: User | null) => {
    if (!user) return

    try {
      set({ loading: true })
      const products = await getProducts(user)
      set({ products, loading: false })
    } catch (error) {
      console.error("Failed to load products:", error)
      set({ products: [], loading: false })
    }
  },

  refreshProducts: async (user: User | null) => {
    await get().loadProducts(user)
  }
}))
