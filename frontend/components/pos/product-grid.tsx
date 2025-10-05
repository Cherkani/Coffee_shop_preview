"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/services/store-service"
import { getProducts } from "@/lib/services"
import type { Product } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ProductGridProps {
  onProductSelect: (product: Product) => void
  selectedCategory?: string
}

export function ProductGrid({ onProductSelect, selectedCategory }: ProductGridProps) {
  const { currentUser } = useAppStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const fetchedProducts = await getProducts(currentUser)
        setProducts(fetchedProducts)
        
        // Debug logging
        console.log("POS ProductGrid Debug:")
        console.log("- Current User:", currentUser)
        console.log("- Products from service:", fetchedProducts)
        console.log("- Products length:", fetchedProducts.length)
      } catch (error) {
        console.error("Failed to load products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (currentUser) {
      loadProducts()
    }
  }, [currentUser])

  if (loading) {
    return <div className="p-4 text-center">Loading products...</div>
  }

  const filteredProducts = selectedCategory ? products.filter((p) => p.category === selectedCategory) : products

  const categories = Array.from(new Set(products.map((p) => p.category)))

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <Badge variant={!selectedCategory ? "default" : "secondary"} className="cursor-pointer" onClick={() => {}}>
          All
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category}
            variant={selectedCategory === category ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => {}}
          >
            {category}
          </Badge>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <Card
            key={product.id}
            className={cn(
              "p-4 cursor-pointer transition-all hover:shadow-md",
              product.available ? "hover:bg-accent" : "opacity-50 cursor-not-allowed",
            )}
            onClick={() => product.available && onProductSelect(product)}
          >
            <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
              <span className="text-2xl">☕</span>
            </div>
            <h3 className="font-medium text-sm mb-1">{product.name}</h3>
            <p className="text-xs text-muted-foreground mb-2">{product.category}</p>
            <p className="font-semibold text-orange-500">${product.basePrice.toFixed(2)}</p>
            {!product.available && (
              <Badge variant="destructive" className="mt-2 text-xs">
                Out of Stock
              </Badge>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
