"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/services/store-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, MapPin, Calendar, Award, ShoppingCart } from "lucide-react"
import type { MarketplaceItem } from "@/lib/types"
import { getMarketplaceItems } from "@/lib/services"

export default function MarketplacePage() {
  const { currentUser } = useAppStore()
  const [items, setItems] = useState<MarketplaceItem[]>(getMarketplaceItems(currentUser))
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [qualityFilter, setQualityFilter] = useState("all")

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
        {currentUser.role === "admin" && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            List Item
          </Button>
        )}
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Items</TabsTrigger>
          {currentUser.role === "admin" && <TabsTrigger value="my-items">My Listings</TabsTrigger>}
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

        {currentUser.role === "admin" && (
          <TabsContent value="my-items" className="space-y-6">
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
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
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
