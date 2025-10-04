import { useState, useEffect, useCallback } from "react"
import { useAppStore } from "../store"
import { getProducts } from "../services"
import type { Product } from "../types"

/**
 * Custom hook for managing products data
 * Provides products state and refresh functionality
 */
export function useProducts() {
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

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const refreshProducts = useCallback(async () => {
    await loadProducts()
  }, [loadProducts])

  return {
    products,
    loading,
    refreshProducts
  }
}
