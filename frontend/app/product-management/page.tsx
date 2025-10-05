"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/services/store-service"
import { addProduct, updateProduct, deleteProduct } from "@/lib/services"
import { useProductsStore } from "@/lib/stores/products-store"
import type { Product } from "@/lib/types"
import { ProductForm } from "@/components/catalog/product-form"
import { ProductList } from "@/components/catalog/product-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Filter,
  ShoppingCart,
  Lock,
  Settings
} from "lucide-react"

export default function ProductManagementPage() {
  const { currentUser } = useAppStore()
  const { products, loading, loadProducts, refreshProducts } = useProductsStore()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")

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
            <CardDescription>Product management is only available to Owners and Admins.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Badge variant="outline" className="mb-4">
              Current Role: {currentUser?.role?.toUpperCase()}
            </Badge>
            <p className="text-sm text-muted-foreground">
              Contact your administrator to request access to product management features.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Product Management</h1>
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

  // Filter products (additional client-side filtering)
  const clientFilteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesPrice = priceFilter === "all" || 
      (priceFilter === "low" && product.basePrice < 5) ||
      (priceFilter === "medium" && product.basePrice >= 5 && product.basePrice < 15) ||
      (priceFilter === "high" && product.basePrice >= 15)
    
    return matchesSearch && matchesCategory && matchesPrice
  })


  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingProduct(null)
    setShowForm(true)
  }

  const handleSave = async (productData: Omit<Product, "id"> & { id?: string }) => {
    console.log("Saving product:", productData)
    console.log("Is editing:", !!editingProduct)
    
    try {
      if (editingProduct) {
        // Update existing product
        console.log("Updating product:", editingProduct.id)
        await updateProduct(editingProduct.id, productData, currentUser)
      } else {
        // Add new product
        console.log("Adding new product")
        await addProduct(productData, currentUser)
      }
      
      // Refresh lists in both stores: product-management and catalog consumers
      await Promise.all([
        refreshProducts(currentUser),
        loadProducts(currentUser)
      ])
      
      setShowForm(false)
      setEditingProduct(null)
    } catch (error) {
      console.error("Failed to save product:", error)
    }
  }

  const handleDelete = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId, currentUser)
        
        // Refresh the products list for all consumers
        await Promise.all([
          refreshProducts(currentUser),
          loadProducts(currentUser)
        ])
      } catch (error) {
        console.error("Failed to delete product:", error)
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)))

  // Calculate stats
  const totalProducts = products.length
  const availableProducts = products.filter(p => p.available).length
  const averagePrice = products.length > 0 ? products.reduce((sum, p) => sum + p.basePrice, 0) / products.length : 0
  const totalValue = products.reduce((sum, p) => sum + p.basePrice, 0)

  if (showForm) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">{editingProduct ? "Edit Product" : "Add New Product"}</h1>
          <p className="text-muted-foreground">
            {editingProduct ? "Update product information" : "Create a new product for your cashiers to sell"}
          </p>
        </div>
        <ProductForm
          product={editingProduct || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage products that your cashiers can sell</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Products in catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableProducts}</div>
            <p className="text-xs text-muted-foreground">Currently available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averagePrice.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per product</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catalog Value</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">Under $5</SelectItem>
                <SelectItem value="medium">$5 - $15</SelectItem>
                <SelectItem value="high">Over $15</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products ({clientFilteredProducts.length})
          </CardTitle>
          <CardDescription>
            Manage your product catalog for cashiers to sell
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clientFilteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || categoryFilter !== "all" || priceFilter !== "all"
                  ? "Try adjusting your filters to see more products."
                  : "Get started by adding your first product."}
              </p>
              <Button onClick={handleAdd} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </div>
          ) : (
            <ProductList
              products={clientFilteredProducts}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
