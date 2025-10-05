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
  const [period, setPeriod] = useState<"day" | "week" | "month">("day")

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

  const isCashier = currentUser?.role === "cashier"

  // Calculate sales data from orders (scoped per role; cashiers see only their own)
  const salesData = useMemo(() => {
    const scoped = isCashier && currentUser
      ? orders.filter((o) => o.cashierId === currentUser.id)
      : orders
    // date window by period
    const now = new Date()
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    if (period === "week") {
      const day = start.getDay()
      const diff = (day === 0 ? 6 : day - 1) // start from Monday
      start.setDate(start.getDate() - diff)
    }
    if (period === "month") {
      start.setDate(1)
    }
    const end = new Date(start)
    if (period === "day") end.setDate(end.getDate() + 1)
    if (period === "week") end.setDate(end.getDate() + 7)
    if (period === "month") end.setMonth(end.getMonth() + 1)

    const paidOrders = scoped
      .filter((order) => order.status === "paid")
      .filter((o) => {
        const d = new Date(o.createdAt)
        return d >= start && d < end
      })
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

  // Build weekly chart data dynamically from paid orders (scoped per role)
  const chartData = useMemo(() => {
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const init = weekDays.map((name) => ({ name, sales: 0, orders: 0 }))

    const scoped = isCashier && currentUser
      ? orders.filter((o) => o.cashierId === currentUser.id)
      : orders
    // date window by period
    const now = new Date()
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    if (period === "week") {
      const day = start.getDay()
      const diff = (day === 0 ? 6 : day - 1)
      start.setDate(start.getDate() - diff)
    }
    if (period === "month") {
      start.setDate(1)
    }
    const end = new Date(start)
    if (period === "day") end.setDate(end.getDate() + 1)
    if (period === "week") end.setDate(end.getDate() + 7)
    if (period === "month") end.setMonth(end.getMonth() + 1)

    const paid = scoped
      .filter((o) => o.status === "paid")
      .filter((o) => {
        const d = new Date(o.createdAt)
        return d >= start && d < end
      })
    paid.forEach((o) => {
      const d = new Date(o.createdAt)
      // getDay: 0=Sun..6=Sat; map to our Mon..Sun labels
      const jsDay = d.getDay()
      const idx = jsDay === 0 ? 6 : jsDay - 1
      init[idx].sales += o.total
      init[idx].orders += 1
    })

    return init
  }, [orders, isCashier, currentUser, period])

  // Compute top items from paid orders (by quantity and revenue), scoped per role
  const topItems = useMemo(() => {
    const scoped = isCashier && currentUser
      ? orders.filter((o) => o.cashierId === currentUser.id)
      : orders
    // date window by period
    const now = new Date()
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    if (period === "week") {
      const day = start.getDay()
      const diff = (day === 0 ? 6 : day - 1)
      start.setDate(start.getDate() - diff)
    }
    if (period === "month") {
      start.setDate(1)
    }
    const end = new Date(start)
    if (period === "day") end.setDate(end.getDate() + 1)
    if (period === "week") end.setDate(end.getDate() + 7)
    if (period === "month") end.setMonth(end.getMonth() + 1)

    const paid = scoped
      .filter((o) => o.status === "paid")
      .filter((o) => {
        const d = new Date(o.createdAt)
        return d >= start && d < end
      })
    const map: Record<string, { id: string; name: string; category: string; quantity: number; revenue: number }> = {}

    paid.forEach((o) => {
      o.items.forEach((it: any) => {
        const key = it.productId || it.productName
        if (!map[key]) {
          map[key] = {
            id: key,
            name: it.productName,
            category: it.category || "",
            quantity: 0,
            revenue: 0,
          }
        }
        map[key].quantity += it.quantity || 1
        map[key].revenue += it.price || 0
      })
    })

    const list = Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .map((item, idx, arr) => ({
        ...item,
        percentage: arr.length ? Math.round((item.revenue / (arr[0].revenue || 1)) * 100) : 0,
      }))

    return list
  }, [orders, isCashier, currentUser, period])

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Reports & Analytics</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{period === "day" ? "Today" : period === "week" ? "This Week" : "This Month"}</Badge>
            {!isFullAccess && <Badge variant="secondary">Limited Access</Badge>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <div className="flex items-center bg-secondary rounded p-1">
            <Button variant={period === "day" ? "default" : "ghost"} size="sm" onClick={() => setPeriod("day")}>Day</Button>
            <Button variant={period === "week" ? "default" : "ghost"} size="sm" onClick={() => setPeriod("week")}>Week</Button>
            <Button variant={period === "month" ? "default" : "ghost"} size="sm" onClick={() => setPeriod("month")}>Month</Button>
          </div>
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
