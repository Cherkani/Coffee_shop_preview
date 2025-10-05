"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/services/store-service"
import ApiService from "@/lib/services/api-service"
import { getInventoryItems } from "@/lib/services"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, DollarSign, Truck, Package } from "lucide-react"
import type { PurchaseOrder } from "@/lib/types"

const initialPurchaseOrders: PurchaseOrder[] = []

export default function ProcurementPage() {
  const { currentUser } = useAppStore()
  const [orders, setOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [inventory, setInventory] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      if (!currentUser) return
      try {
        const [poData, inv] = await Promise.all([
          ApiService.request<any>("/purchaseOrders") as any,
          getInventoryItems(currentUser),
        ])
        setOrders(Array.isArray(poData) ? poData : [])
        setInventory(Array.isArray(inv) ? inv : [])
      } catch (e) {
        setOrders([])
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
              Access denied. Only owners and admins can access procurement.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplierName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: PurchaseOrder["status"]) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "shipped":
        return "default"
      case "delivered":
        return "default"
      case "draft":
        return "secondary"
      case "sent":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const totalSpent = orders.filter((o: any) => o.status === "delivered").reduce((sum: number, o: any) => sum + o.totalAmount, 0)
  const pendingOrders = orders.filter((o) => ["sent", "confirmed", "shipped"].includes(o.status)).length

  // Current month stock tracker (items last restocked this month)
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const inMonthStockUnits = inventory
    .filter((it) => it.lastRestocked && new Date(it.lastRestocked) >= monthStart && new Date(it.lastRestocked) < monthEnd)
    .reduce((sum, it) => sum + (it.currentStock || 0), 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Procurement</h1>
          <p className="text-muted-foreground">Manage purchase orders and sourcing</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Purchase Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock (this month)</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inMonthStockUnits}</div>
            <p className="text-xs text-muted-foreground">Units restocked this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Awaiting delivery</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Orders</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.filter((o) => o.status === "draft").length}</div>
            <p className="text-xs text-muted-foreground">Need approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                  <CardDescription>{order.supplierName}</CardDescription>
                </div>
                <Badge variant={getStatusColor(order.status)}>{order.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Order Date</span>
                  <p className="font-medium">{new Date((order as any).orderDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Expected Delivery</span>
                  <p className="font-medium">{order.expectedDelivery ? new Date((order as any).expectedDelivery).toLocaleDateString() : "TBD"}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Total Amount</span>
                  <p className="text-xl font-bold">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium mb-2 block">Items ({order.items.length})</span>
                <div className="space-y-2">
                  {order.items.map((item) => {
                    const invItem = inventory.find((it) => it.name === item.itemName)
                    return (
                      <div key={item.id} className="p-2 bg-muted rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{item.itemName}</span>
                            <span className="text-muted-foreground ml-2">
                              {item.quantity} {item.unit} × ${item.unitPrice}
                            </span>
                          </div>
                          <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
                        </div>
                        {invItem && (
                          <div className="text-xs text-muted-foreground mt-1">
                            In stock: <span className="font-medium">{invItem.currentStock}</span> (min {invItem.minStock})
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {order.notes && (
                <div>
                  <span className="text-sm text-muted-foreground">Notes</span>
                  <p className="text-sm">{order.notes}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                {order.status === "draft" && <Button size="sm">Send Order</Button>}
                {order.status === "shipped" && <Button size="sm">Mark Delivered</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
