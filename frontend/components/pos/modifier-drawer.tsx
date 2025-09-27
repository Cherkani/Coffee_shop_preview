"use client"

import { useState } from "react"
import type { Product, ProductSize, Modifier } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Plus, Minus } from "lucide-react"

interface ModifierDrawerProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: {
    productId: string
    productName: string
    sizeId: string
    sizeName: string
    price: number
    modifiers: Modifier[]
    quantity: number
  }) => void
}

export function ModifierDrawer({ product, isOpen, onClose, onAddToCart }: ModifierDrawerProps) {
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null)
  const [selectedModifiers, setSelectedModifiers] = useState<Modifier[]>([])
  const [quantity, setQuantity] = useState(1)

  if (!product || !isOpen) return null

  // Set default size when product changes
  if (selectedSize === null && product.sizes.length > 0) {
    setSelectedSize(product.sizes[0])
  }

  const toggleModifier = (modifier: Modifier) => {
    setSelectedModifiers((prev) => {
      const exists = prev.find((m) => m.id === modifier.id)
      if (exists) {
        return prev.filter((m) => m.id !== modifier.id)
      } else {
        return [...prev, modifier]
      }
    })
  }

  const calculateTotal = () => {
    const sizePrice = selectedSize?.price || product.basePrice
    const modifierPrice = selectedModifiers.reduce((sum, mod) => sum + mod.price, 0)
    return (sizePrice + modifierPrice) * quantity
  }

  const handleAddToCart = () => {
    if (!selectedSize) return

    onAddToCart({
      productId: product.id,
      productName: product.name,
      sizeId: selectedSize.id,
      sizeName: selectedSize.name,
      price: calculateTotal(),
      modifiers: selectedModifiers,
      quantity,
    })

    // Reset form
    setSelectedSize(product.sizes[0])
    setSelectedModifiers([])
    setQuantity(1)
    onClose()
  }

  const modifierCategories = Array.from(new Set(product.modifiers.map((m) => m.category)))

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <Card className="w-full max-w-md mx-4 mb-4 md:mb-0 max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Sizes */}
          {product.sizes.length > 1 && (
            <div className="mb-6">
              <Label className="text-sm font-medium mb-3 block">Size</Label>
              <div className="grid grid-cols-2 gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size.id}
                    variant={selectedSize?.id === size.id ? "default" : "outline"}
                    className="justify-between"
                    onClick={() => setSelectedSize(size)}
                  >
                    <span>{size.name}</span>
                    <span>${size.price.toFixed(2)}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Modifiers */}
          {modifierCategories.map((category) => (
            <div key={category} className="mb-6">
              <Label className="text-sm font-medium mb-3 block">{category}</Label>
              <div className="space-y-2">
                {product.modifiers
                  .filter((mod) => mod.category === category)
                  .map((modifier) => {
                    const isSelected = selectedModifiers.find((m) => m.id === modifier.id)
                    return (
                      <Button
                        key={modifier.id}
                        variant={isSelected ? "default" : "outline"}
                        className="w-full justify-between"
                        onClick={() => toggleModifier(modifier)}
                      >
                        <span>{modifier.name}</span>
                        <span>{modifier.price > 0 ? `+$${modifier.price.toFixed(2)}` : "Free"}</span>
                      </Button>
                    )
                  })}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Quantity</Label>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                className="w-20 text-center"
                min="1"
              />
              <Button variant="outline" size="sm" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleAddToCart}
            disabled={!selectedSize}
          >
            Add to Cart - ${calculateTotal().toFixed(2)}
          </Button>
        </div>
      </Card>
    </div>
  )
}
