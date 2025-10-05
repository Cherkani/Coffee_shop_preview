"use client"

import { useEffect, useMemo, useState } from "react"
import { useAppStore } from "@/lib/services/store-service"
import { getOrders, getProducts } from "@/lib/services"
import { SalesOverview } from "@/components/reports/sales-overview"
import { TopItems } from "@/components/reports/top-items"
import { SalesChart } from "@/components/reports/sales-chart"
import { InventoryAlerts } from "@/components/reports/inventory-alerts"
import { COGSAnalysis } from "@/components/reports/cogs-analysis"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Filter } from "lucide-react"

export default function ReportsPage() {
  const { currentUser } = useAppStore()
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!currentUser) return
      try {
        setLoading(true)
        const [o, p] = await Promise.all([getOrders(currentUser), getProducts(currentUser)])
        setOrders(o)
        setProducts(p)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentUser])

  // Calculate sales data from orders
  const salesData = useMemo(() => {
    const paidOrders = orders.filter((order) => order.status === "paid")
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0)
    const totalOrders = paidOrders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const uniqueCustomers = new Set(paidOrders.map((order) => order.customerName).filter(Boolean)).size

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalCustomers: uniqueCustomers,
      revenueChange: 12.5, // Mock data
      ordersChange: 8.3, // Mock data
      avgOrderTime: 8, // Mock data
    }
  }, [orders])

  // Mock data for charts and other components
  const chartData = [
    { name: "Mon", sales: 240, orders: 45 },
    { name: "Tue", sales: 300, orders: 52 },
    { name: "Wed", sales: 280, orders: 48 },
    { name: "Thu", sales: 350, orders: 61 },
    { name: "Fri", sales: 420, orders: 73 },
    { name: "Sat", sales: 380, orders: 68 },
    { name: "Sun", sales: 320, orders: 58 },
  ]

  const topItems = [
    { id: "1", name: "Cappuccino", category: "Coffee", quantity: 45, revenue: 202.5, percentage: 100 },
    { id: "2", name: "Espresso", category: "Coffee", quantity: 38, revenue: 133.0, percentage: 85 },
    { id: "3", name: "Croissant", category: "Pastry", quantity: 22, revenue: 71.5, percentage: 49 },
    { id: "4", name: "Latte", category: "Coffee", quantity: 31, revenue: 148.8, percentage: 69 },
    { id: "5", name: "Americano", category: "Coffee", quantity: 28, revenue: 112.0, percentage: 62 },
  ]

  const inventoryAlerts = [
    {
      id: "1",
      name: "Coffee Beans - Colombian",
      currentStock: 5,
      minStock: 20,
      category: "Coffee",
      status: "critical" as const,
    },
    { id: "2", name: "Oat Milk", currentStock: 8, minStock: 15, category: "Dairy", status: "low" as const },
    {
      id: "3",
      name: "Paper Cups - Large",
      currentStock: 0,
      minStock: 100,
      category: "Supplies",
      status: "out" as const,
    },
  ]

  const cogsData = {
    totalRevenue: salesData.totalRevenue,
    totalCOGS: salesData.totalRevenue * 0.35, // 35% COGS
    grossProfit: salesData.totalRevenue * 0.65,
    grossMargin: 65,
    categoryBreakdown: [
      { category: "Coffee Beans", cogs: salesData.totalRevenue * 0.2, percentage: 57 },
      { category: "Dairy Products", cogs: salesData.totalRevenue * 0.08, percentage: 23 },
      { category: "Pastries", cogs: salesData.totalRevenue * 0.05, percentage: 14 },
      { category: "Supplies", cogs: salesData.totalRevenue * 0.02, percentage: 6 },
    ],
  }

  const isFullAccess = currentUser?.role === "owner" || currentUser?.role === "admin"
  const isCashier = currentUser?.role === "cashier"

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Reports & Analytics</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Today</Badge>
            {!isFullAccess && <Badge variant="secondary">Limited Access</Badge>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {isCashier ? (
        /* Cashier - Limited Reports */
        <div className="space-y-6">
          <SalesOverview data={salesData} period="Today" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesChart data={chartData} title="Daily Sales" type="bar" />
            <TopItems items={topItems.slice(0, 3)} title="Top Selling Items" />
          </div>
        </div>
      ) : (
        /* Owner/Admin - Full Reports */
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="cogs">COGS Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <SalesOverview data={salesData} period="Today" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesChart data={chartData} title="Weekly Sales Trend" />
              <TopItems items={topItems} title="Top Selling Items" />
            </div>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesChart data={chartData} title="Daily Sales" type="bar" />
              <SalesChart data={chartData} title="Order Volume" />
            </div>
            <TopItems items={topItems} title="Best Performers" />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <InventoryAlerts alerts={inventoryAlerts} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopItems
                items={topItems.map((item) => ({ ...item, revenue: item.quantity }))}
                title="Most Used Ingredients"
              />
              <SalesChart data={chartData} title="Inventory Usage Trend" />
            </div>
          </TabsContent>

          <TabsContent value="cogs" className="space-y-6">
            <COGSAnalysis data={cogsData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SalesChart data={chartData} title="Profit Margin Trend" />
              <TopItems
                items={cogsData.categoryBreakdown.map((cat, idx) => ({
                  id: idx.toString(),
                  name: cat.category,
                  category: "Cost Center",
                  quantity: 0,
                  revenue: cat.cogs,
                  percentage: cat.percentage,
                }))}
                title="Cost Breakdown"
              />
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
