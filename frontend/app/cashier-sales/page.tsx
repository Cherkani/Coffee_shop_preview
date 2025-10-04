"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { getAllCashierSales, getSalesMetrics, type CashierSalesData } from "@/lib/services"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Receipt, 
  Search,
  Calendar,
  Star,
  BarChart3,
  Clock,
  ShoppingCart
} from "lucide-react"

export default function CashierSalesPage() {
  const { currentUser } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("today")
  const [selectedCashier, setSelectedCashier] = useState<string>("all")

  if (!currentUser || currentUser.role !== "owner") {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">This page is only available to Owners.</p>
      </div>
    )
  }

  const cashierSales = getAllCashierSales(currentUser)
  const salesMetrics = getSalesMetrics(currentUser)

  // Filter cashiers based on search term
  const filteredCashiers = cashierSales.filter(cashier =>
    cashier.cashierName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPeriodData = (cashier: CashierSalesData) => {
    switch (selectedPeriod) {
      case "today":
        return { sales: cashier.todaySales, transactions: cashier.todayTransactions }
      case "week":
        return { sales: cashier.thisWeekSales, transactions: cashier.thisWeekTransactions }
      case "month":
        return { sales: cashier.thisMonthSales, transactions: cashier.thisMonthTransactions }
      default:
        return { sales: cashier.totalSales, transactions: cashier.totalTransactions }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cashier Sales Performance</h1>
          <p className="text-muted-foreground">Track and analyze individual cashier performance</p>
        </div>
      </div>

      {/* Sales Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${salesMetrics.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All cashiers combined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesMetrics.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">All cashiers combined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${salesMetrics.averageTransactionValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {salesMetrics.topCashier ? salesMetrics.topCashier.cashierName : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {salesMetrics.topCashier ? `$${salesMetrics.topCashier.totalSales.toFixed(2)}` : "No data"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search cashiers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedCashier} onValueChange={setSelectedCashier}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cashiers</SelectItem>
            {cashierSales.map((cashier) => (
              <SelectItem key={cashier.cashierId} value={cashier.cashierId}>
                {cashier.cashierName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cashier Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Cashier Performance
          </CardTitle>
          <CardDescription>
            Individual sales performance for each cashier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCashiers.map((cashier, index) => {
              const periodData = getPeriodData(cashier)
              const isTopPerformer = index === 0
              
              return (
                <div key={cashier.cashierId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold flex items-center gap-2">
                          {cashier.cashierName}
                          {isTopPerformer && (
                            <Badge variant="default" className="bg-yellow-500">
                              <Star className="h-3 w-3 mr-1" />
                              Top Performer
                            </Badge>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">ID: {cashier.cashierId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">${periodData.sales.toFixed(2)}</div>
                      <p className="text-sm text-muted-foreground">{periodData.transactions} transactions</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Today</div>
                      <div className="font-semibold">${cashier.todaySales.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">{cashier.todayTransactions} txns</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">This Week</div>
                      <div className="font-semibold">${cashier.thisWeekSales.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">{cashier.thisWeekTransactions} txns</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">This Month</div>
                      <div className="font-semibold">${cashier.thisMonthSales.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">{cashier.thisMonthTransactions} txns</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Avg Transaction</div>
                      <div className="font-semibold">${cashier.averageTransactionValue.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">per transaction</div>
                    </div>
                  </div>

                  {/* Top Selling Items */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Top Selling Items</h4>
                    <div className="flex gap-2 flex-wrap">
                      {cashier.topSellingItems.map((item, itemIndex) => (
                        <Badge key={itemIndex} variant="secondary" className="text-xs">
                          {item.itemName} ({item.quantity}) - ${item.revenue.toFixed(2)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
          <CardDescription>
            Latest transactions from all cashiers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {cashierSales.slice(0, 3).map(cashier => 
              cashier.recentTransactions.slice(0, 2).map((transaction, index) => (
                <div key={`${cashier.cashierId}-${transaction.id}-${index}`} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{transaction.customerName || "Guest"}</div>
                      <div className="text-sm text-muted-foreground">
                        {cashier.cashierName} • {transaction.createdAt.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${transaction.amount.toFixed(2)}</div>
                    <Badge variant={transaction.status === "completed" ? "default" : "destructive"}>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
