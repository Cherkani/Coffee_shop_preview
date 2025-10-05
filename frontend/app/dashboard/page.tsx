"use client"

import { useAppStore } from "@/lib/services/store-service"
import { OwnerDashboard } from "@/components/dashboard/owner-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, MapPin, DollarSign, ShoppingCart, Star, AlertTriangle, Coffee } from "lucide-react"

export default function DashboardPage() {
  const { currentUser, currentOrganization, currentLocation, getDashboardMetrics } = useAppStore()
  const metrics = getDashboardMetrics()

  if (!currentUser || !metrics) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    )
  }

  const renderOwnerDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Locations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalLocations}</div>
            <p className="text-xs text-muted-foreground">Across your organization</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalStaff}</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.monthlyRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />+{metrics.revenueGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.dailyRevenue}</div>
            <p className="text-xs text-muted-foreground">Today's total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Orders Today</span>
              <Badge variant="secondary">{metrics.ordersToday}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Average Order Value</span>
              <span className="font-semibold">${metrics.averageOrderValue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Customer Satisfaction</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="font-semibold">{metrics.customerSatisfaction}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3">
              <Coffee className="h-8 w-8 text-amber-600" />
              <div>
                <p className="font-semibold">{metrics.topSellingProduct}</p>
                <p className="text-sm text-muted-foreground">Best seller today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.dailyRevenue}</div>
            <p className="text-xs text-muted-foreground">Today at {currentLocation?.name}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.ordersToday}</div>
            <p className="text-xs text-muted-foreground">Peak hour: {metrics.peakHour}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff On Duty</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.staffOnDuty}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{metrics.inventoryAlerts}</div>
            <p className="text-xs text-muted-foreground">Items need restocking</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Location Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Average Order Value</span>
              <span className="font-semibold">${metrics.averageOrderValue}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Customer Satisfaction</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                <span className="font-semibold">{metrics.customerSatisfaction}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Top Product</span>
              <Badge variant="secondary">{metrics.topSellingProduct}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full bg-transparent" variant="outline">
              View Inventory Alerts
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              Manage Staff Schedule
            </Button>
            <Button className="w-full bg-transparent" variant="outline">
              Generate Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">
          {currentUser.role === "owner" ? "Owner Dashboard" : "Location Dashboard"}
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{currentUser.name}</Badge>
          {currentOrganization && <Badge variant="secondary">{currentOrganization.name}</Badge>}
          {currentLocation && <Badge variant="outline">{currentLocation.name}</Badge>}
        </div>
      </div>

      {currentUser.role === "owner" ? <OwnerDashboard /> : renderAdminDashboard()}
    </div>
  )
}
