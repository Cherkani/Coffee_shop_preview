"use client"

import type React from "react"

import { useState } from "react"
import type { Product, ProductSize, Modifier } from "@/lib/types"
import { PRODUCT_CATEGORIES, MODIFIER_CATEGORIES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Save, Upload } from "lucide-react"

interface ProductFormProps {
  product?: Product
  onSave: (product: Omit<Product, "id"> & { id?: string }) => void
  onCancel: () => void
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    category: product?.category || "",
    basePrice: product?.basePrice || 0,
    available: product?.available ?? true,
    image: product?.image || "",
  })

  const [sizes, setSizes] = useState<ProductSize[]>(product?.sizes || [{ id: "", name: "", price: 0 }])
  const [modifiers, setModifiers] = useState<Modifier[]>(product?.modifiers || [])

  const addSize = () => {
    setSizes([...sizes, { id: Date.now().toString(), name: "", price: 0 }])
  }

  const updateSize = (index: number, field: keyof ProductSize, value: string | number) => {
    const updated = sizes.map((size, i) => (i === index ? { ...size, [field]: value } : size))
    setSizes(updated)
  }

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index))
  }

  const addModifier = () => {
    setModifiers([...modifiers, { id: Date.now().toString(), name: "", price: 0, category: "Other" }])
  }

  const updateModifier = (index: number, field: keyof Modifier, value: string | number) => {
    const updated = modifiers.map((mod, i) => (i === index ? { ...mod, [field]: value } : mod))
    setModifiers(updated)
  }

  const removeModifier = (index: number) => {
    setModifiers(modifiers.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validSizes = sizes.filter((size) => size.name && size.price > 0)
    if (validSizes.length === 0) {
      alert("Please add at least one valid size")
      return
    }

    onSave({
      id: product?.id,
      ...formData,
      sizes: validSizes.map((size) => ({ ...size, id: size.id || Date.now().toString() })),
      modifiers: modifiers.filter((mod) => mod.name).map((mod) => ({ ...mod, id: mod.id || Date.now().toString() })),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="basePrice">Base Price ($)</Label>
            <Input
              id="basePrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.basePrice}
              onChange={(e) => setFormData({ ...formData, basePrice: Number.parseFloat(e.target.value) || 0 })}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="available"
              checked={formData.available}
              onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
            />
            <Label htmlFor="available">Available for sale</Label>
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="image">Product Image</Label>
          <div className="flex gap-2">
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Image URL or upload"
            />
            <Button type="button" variant="outline">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Sizes */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Sizes & Pricing</h3>
          <Button type="button" variant="outline" size="sm" onClick={addSize}>
            <Plus className="h-4 w-4 mr-2" />
            Add Size
          </Button>
        </div>
        <div className="space-y-3">
          {sizes.map((size, index) => (
            <div key={index} className="flex gap-3 items-end">
              <div className="flex-1">
                <Label>Size Name</Label>
                <Input
                  value={size.name}
                  onChange={(e) => updateSize(index, "name", e.target.value)}
                  placeholder="e.g., Small, Medium, Large"
                />
              </div>
              <div className="w-32">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={size.price}
                  onChange={(e) => updateSize(index, "price", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => removeSize(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Modifiers */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Modifiers</h3>
          <Button type="button" variant="outline" size="sm" onClick={addModifier}>
            <Plus className="h-4 w-4 mr-2" />
            Add Modifier
          </Button>
        </div>
        <div className="space-y-3">
          {modifiers.map((modifier, index) => (
            <div key={index} className="flex gap-3 items-end">
              <div className="flex-1">
                <Label>Modifier Name</Label>
                <Input
                  value={modifier.name}
                  onChange={(e) => updateModifier(index, "name", e.target.value)}
                  placeholder="e.g., Extra Shot, Oat Milk"
                />
              </div>
              <div className="w-32">
                <Label>Category</Label>
                <Select value={modifier.category} onValueChange={(value) => updateModifier(index, "category", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MODIFIER_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <Label>Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={modifier.price}
                  onChange={(e) => updateModifier(index, "price", Number.parseFloat(e.target.value) || 0)}
                />
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => removeModifier(index)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
          <Save className="h-4 w-4 mr-2" />
          Save Product
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
