"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { useProductsStore } from "@/lib/stores/products-store"
import type { Product } from "@/lib/types"
import { ProductList } from "@/components/catalog/product-list"
import { ProductForm } from "@/components/catalog/product-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock } from "lucide-react"

export default function CatalogPage() {
  const { currentUser } = useAppStore()
  const { products, loading, loadProducts } = useProductsStore()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadProducts(currentUser)
  }, [currentUser, loadProducts])

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
    const productWithTenantInfo = {
      ...productData,
      organizationId: currentUser?.organizationId || "",
      locationId: currentUser?.locationId || "",
    }
    console.log("Saving product:", productWithTenantInfo)
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Product Catalog</h1>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
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
