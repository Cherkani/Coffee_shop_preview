"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { useAppStore } from "../store"
import { getProducts } from "../services"
import type { Product } from "../types"

interface ProductsContextType {
  products: Product[]
  loading: boolean
  refreshProducts: () => Promise<void>
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function ProductsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAppStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const loadProducts = useCallback(async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      const productsData = await getProducts(currentUser)
      setProducts(productsData)
    } catch (error) {
      console.error("Failed to load products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  const refreshProducts = useCallback(async () => {
    await loadProducts()
  }, [loadProducts])

  // Load products on mount and when currentUser changes
  React.useEffect(() => {
    loadProducts()
  }, [loadProducts])

  return (
    <ProductsContext.Provider value={{ products, loading, refreshProducts }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductsProvider")
  }
  return context
}
