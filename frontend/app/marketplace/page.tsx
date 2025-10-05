"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/services/store-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, MapPin, Calendar, Award, ShoppingCart } from "lucide-react"
import ApiService from "@/lib/services/api-service"
import type { MarketplaceItem } from "@/lib/types"
import { getMarketplaceItems } from "@/lib/services"

export default function MarketplacePage() {
  const { currentUser } = useAppStore()
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [qualityFilter, setQualityFilter] = useState("all")
  const [isListingOpen, setIsListingOpen] = useState(false)
  const [newListing, setNewListing] = useState<any>({
    name: "",
    description: "",
    category: "Coffee Beans",
    unit: "lbs",
    pricePerUnit: 0,
    availableQuantity: 0,
    minOrderQuantity: 1,
    quality: "Standard",
  })
  const [editId, setEditId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!currentUser) return
      try {
        setLoading(true)
        const data = await getMarketplaceItems(currentUser)
        setItems(Array.isArray(data) ? data : [])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentUser])

  // Access control
  if (!currentUser || !["owner", "admin"].includes(currentUser.role)) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Access denied. Only owners and admins can access the marketplace.
            </p>
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
            <h1 className="text-3xl font-bold">Internal Marketplace</h1>
            <p className="text-muted-foreground">Loading items...</p>
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

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesQuality = qualityFilter === "all" || item.quality === qualityFilter
    return matchesSearch && matchesCategory && matchesQuality && item.isActive
  })

  const myItems = items.filter((item) => item.sellerId === currentUser.id)
  const allCategories = Array.from(new Set(items.map((item) => item.category)))

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Internal Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell between locations</p>
        </div>
        {["admin", "owner"].includes(currentUser.role) && (
          <Button onClick={() => setIsListingOpen((v) => !v)}>
            <Plus className="h-4 w-4 mr-2" />
            {isListingOpen ? "Close" : "List Item"}
          </Button>
        )}
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Items</TabsTrigger>
          {["admin", "owner"].includes(currentUser.role) && <TabsTrigger value="my-items">My Listings</TabsTrigger>}
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search marketplace..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
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
            <Select value={qualityFilter} onValueChange={setQualityFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quality</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Economy">Economy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    <Badge variant={item.quality === "Premium" ? "default" : "secondary"}>{item.quality}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold">${item.pricePerUnit}</span>
                    <span className="text-muted-foreground">per {item.unit}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {item.sellerLocationName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Available: {item.availableQuantity} {item.unit}
                    </div>
                  </div>

                  {item.certifications.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4" />
                        <span className="text-sm font-medium">Certifications</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {item.certifications.map((cert) => (
                          <Badge key={cert} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground">
                    Min order: {item.minOrderQuantity} {item.unit}
                  </div>

                  <Button className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {["admin", "owner"].includes(currentUser.role) && (
          <TabsContent value="my-items" className="space-y-6">
            {isListingOpen && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{editId ? "Edit Listing" : "Create Listing"}</CardTitle>
                  <CardDescription>{editId ? "Update your listing details" : "Sell inventory to other locations"}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">Name</label>
                      <Input value={newListing.name} onChange={(e) => setNewListing({ ...newListing, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Category</label>
                      <Input value={newListing.category} onChange={(e) => setNewListing({ ...newListing, category: e.target.value })} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs text-muted-foreground">Description</label>
                      <Input value={newListing.description} onChange={(e) => setNewListing({ ...newListing, description: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Unit</label>
                      <Input value={newListing.unit} onChange={(e) => setNewListing({ ...newListing, unit: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Quality</label>
                      <Select value={newListing.quality} onValueChange={(v) => setNewListing({ ...newListing, quality: v })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Quality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Premium">Premium</SelectItem>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Economy">Economy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Price per Unit</label>
                      <Input type="number" value={newListing.pricePerUnit} onChange={(e) => setNewListing({ ...newListing, pricePerUnit: parseFloat(e.target.value || "0") })} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Available Quantity</label>
                      <Input type="number" value={newListing.availableQuantity} onChange={(e) => setNewListing({ ...newListing, availableQuantity: parseInt(e.target.value || "0") })} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Min Order Quantity</label>
                      <Input type="number" value={newListing.minOrderQuantity} onChange={(e) => setNewListing({ ...newListing, minOrderQuantity: parseInt(e.target.value || "1") })} />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={async () => {
                        try {
                          if (editId) {
                            // update
                            const existing = items.find((i) => (i as any).id === editId) as any
                            if (!existing) return
                            const updated = {
                              ...existing,
                              ...newListing,
                            }
                            await ApiService.request(`/marketplace/${editId}`, { method: "PUT", body: JSON.stringify(updated) })
                            setItems((prev) => prev.map((i: any) => (i.id === editId ? updated : i)))
                          } else {
                            // create
                            const listing = {
                              id: Date.now().toString(),
                              name: newListing.name,
                              category: newListing.category,
                              description: newListing.description,
                              unit: newListing.unit,
                              pricePerUnit: newListing.pricePerUnit,
                              availableQuantity: newListing.availableQuantity,
                              minOrderQuantity: newListing.minOrderQuantity,
                              sellerId: currentUser.id,
                              sellerName: currentUser.name,
                              sellerLocationId: currentUser.locationId || "",
                              sellerLocationName: "",
                              quality: newListing.quality,
                              certifications: [],
                              productionDate: new Date().toISOString(),
                              expiryDate: undefined,
                              isActive: true,
                              createdAt: new Date().toISOString(),
                            }
                            await ApiService.request("/marketplace", { method: "POST", body: JSON.stringify(listing) })
                            setItems((prev) => [listing as any, ...prev])
                          }
                        } finally {
                          setIsListingOpen(false)
                          setEditId(null)
                          setNewListing({ name: "", description: "", category: "Coffee Beans", unit: "lbs", pricePerUnit: 0, availableQuantity: 0, minOrderQuantity: 1, quality: "Standard" })
                        }
                      }}
                    >
                      {editId ? "Save Changes" : "Publish Listing"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold">${item.pricePerUnit}</span>
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Available: {item.availableQuantity} {item.unit}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => {
                          setIsListingOpen(true)
                          setEditId(item.id)
                          setNewListing({
                            name: item.name,
                            description: item.description,
                            category: item.category,
                            unit: item.unit,
                            pricePerUnit: item.pricePerUnit,
                            availableQuantity: item.availableQuantity,
                            minOrderQuantity: item.minOrderQuantity,
                            quality: item.quality,
                          })
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={async () => {
                          const nextActive = !item.isActive
                          // optimistic update
                          setItems((prev) => prev.map((i: any) => (i.id === item.id ? { ...i, isActive: nextActive } : i)))
                          try {
                            await ApiService.request(`/marketplace/${item.id}`, {
                              method: "PATCH",
                              body: JSON.stringify({ isActive: nextActive }),
                            })
                          } catch (e) {
                            // revert on failure
                            setItems((prev) => prev.map((i: any) => (i.id === item.id ? { ...i, isActive: item.isActive } : i)))
                            console.error("Failed to toggle listing:", e)
                          }
                        }}
                      >
                        {item.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
