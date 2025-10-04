"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { getProducts } from "@/lib/services"
import type { Product } from "@/lib/types"
import { ProductList } from "@/components/catalog/product-list"
import { ProductForm } from "@/components/catalog/product-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"

export default function CatalogPage() {
  const { currentUser } = useAppStore()
  const products = getProducts(currentUser)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

  const hasAccess = currentUser?.role === "owner" || currentUser?.role === "admin"

  if (!hasAccess) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto mt-20">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>Catalog management is only available to Owners and Admins.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Badge variant="outline" className="mb-4">
              Current Role: {currentUser?.role?.toUpperCase()}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Contact your administrator to request access to catalog management features.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleSave = (productData: Omit<Product, "id"> & { id?: string }) => {
    // In a real app, this would save to the backend
    console.log("Saving product:", productData)
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleDelete = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      // In a real app, this would delete from the backend
      console.log("Deleting product:", productId)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  if (showForm) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">{editingProduct ? "Edit Product" : "Add New Product"}</h1>
        </div>
        <ProductForm product={editingProduct || undefined} onSave={handleSave} onCancel={handleCancel} />
      </div>
    )
  }

  return (
    <div className="p-6">
      <ProductList products={products} onEdit={handleEdit} onDelete={handleDelete} onAdd={handleAdd} />
    </div>
  )
}
