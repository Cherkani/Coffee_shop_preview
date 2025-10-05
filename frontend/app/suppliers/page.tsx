"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/services/store-service"
import { getSuppliers } from "@/lib/services"
import { getInventoryItems } from "@/lib/services"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Star, Phone, Mail, MapPin, Package } from "lucide-react"
import type { Supplier } from "@/lib/types"

export default function SuppliersPage() {
  const { currentUser } = useAppStore()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [inventory, setInventory] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    const loadSuppliers = async () => {
      if (!currentUser) return

      try {
        setLoading(true)
        const [suppliersData, inventoryData] = await Promise.all([
          getSuppliers(currentUser),
          getInventoryItems(currentUser),
        ])
        setSuppliers(suppliersData)
        setInventory(inventoryData)
      } catch (error) {
        console.error("Failed to load suppliers:", error)
        setSuppliers([])
      } finally {
        setLoading(false)
      }
    }

    loadSuppliers()
  }, [currentUser])

  // Access control
  if (!currentUser || currentUser.role !== "owner") {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Access denied. Only owners can manage suppliers.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Suppliers</h1>
            <p className="text-muted-foreground">Loading suppliers...</p>
          </div>
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

  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.categories?.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || supplier.categories.includes(categoryFilter)
    return matchesSearch && matchesCategory
  })

  const allCategories = Array.from(new Set((suppliers.flatMap((s) => s.categories || []))))

  const getDaysUntilReorder = (supplierName: string) => {
    const itemsFromSupplier = inventory.filter((it) => it.supplier === supplierName)
    if (itemsFromSupplier.length === 0) return null
    // Very simple heuristic: when currentStock <= minStock, show "Reorder now"
    const critical = itemsFromSupplier.filter((it) => it.currentStock <= it.minStock)
    return critical.length > 0 ? 0 : null
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">Manage your supply chain partners</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {allCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className={supplier.isActive ? "" : "opacity-60"}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{supplier.rating}</span>
                  </div>
                </div>
                <Badge variant={supplier.isActive ? "default" : "secondary"}>
                  {supplier.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {supplier.contactEmail}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {supplier.contactPhone}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {supplier.address}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4" />
                  <span className="text-sm font-medium">Categories</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {supplier.categories.map((category) => (
                    <Badge key={category} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Payment Terms:</span>
                  <p className="font-medium">{supplier.paymentTerms}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Delivery:</span>
                  <p className="font-medium">{supplier.deliveryTime}</p>
                </div>
                {getDaysUntilReorder(supplier.name) !== null && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Reorder:</span>
                    <p className="font-medium text-amber-600">Reorder now based on low stock</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Edit
                </Button>
                <Button size="sm" className="flex-1">
                  Create Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
