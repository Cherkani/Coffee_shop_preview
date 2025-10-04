"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { getProducts, getOrders, getTransactions, getInventoryItems } from "@/lib/services"
import { LocationSelector } from "@/components/location-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, ShoppingCart, DollarSign } from "lucide-react"
import type { Product, Order, Transaction, InventoryItem } from "@/lib/types"

export function OwnerDashboard() {
  const { 
    currentUser, 
    selectedLocations, 
    setSelectedLocations
  } = useAppStore()

  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser || currentUser.role !== "owner") return

      try {
        setLoading(true)
        const [productsData, ordersData, transactionsData, inventoryData] = await Promise.all([
          getProducts(currentUser, selectedLocations),
          getOrders(currentUser, selectedLocations),
          getTransactions(currentUser, selectedLocations),
          getInventoryItems(currentUser, selectedLocations)
        ])

        setProducts(productsData)
        setOrders(ordersData)
        setTransactions(transactionsData)
        setInventory(inventoryData)
      } catch (error) {
        console.error("Failed to load dashboard data:", error)
        setProducts([])
        setOrders([])
        setTransactions([])
        setInventory([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [currentUser, selectedLocations])

  if (!currentUser || currentUser.role !== "owner") {
    return null
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">...</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalOrders = orders.length
  const totalProducts = products.length
  const totalInventory = inventory.length

  return (
    <div className="space-y-6">
      {/* Location Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your coffee shop operations
          </p>
        </div>
        <LocationSelector
          selectedLocations={selectedLocations}
          onLocationChange={setSelectedLocations}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {selectedLocations.length > 0 
                ? `From ${selectedLocations.length} selected location${selectedLocations.length > 1 ? 's' : ''}`
                : "From all locations"
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {selectedLocations.length > 0 
                ? `From ${selectedLocations.length} selected location${selectedLocations.length > 1 ? 's' : ''}`
                : "From all locations"
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {selectedLocations.length > 0 
                ? `From ${selectedLocations.length} selected location${selectedLocations.length > 1 ? 's' : ''}`
                : "From all locations"
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInventory}</div>
            <p className="text-xs text-muted-foreground">
              {selectedLocations.length > 0 
                ? `From ${selectedLocations.length} selected location${selectedLocations.length > 1 ? 's' : ''}`
                : "From all locations"
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Selected Locations Info */}
      {selectedLocations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Selected Locations
            </CardTitle>
            <CardDescription>
              Data is filtered to show only information from the selected locations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedLocations.map((locationId) => {
                const location = currentUser.organizationId 
                  ? useAppStore.getState().organizations
                      .find(org => org.id === currentUser.organizationId)
                      ?.locations.find(loc => loc.id === locationId)
                  : null
                
                return (
                  <Badge key={locationId} variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {location?.name || "Unknown Location"}
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
