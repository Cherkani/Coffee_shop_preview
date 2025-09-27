"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { PlatformOverview } from "@/components/console/platform-overview"
import { OrganizationManagement } from "@/components/console/organization-management"
import { BillingOverview } from "@/components/console/billing-overview"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Settings, Bell } from "lucide-react"
import { hasPermission } from "@/lib/permissions"

export default function ConsolePage() {
  const { currentUser, organizations, users, getDashboardMetrics } = useAppStore()
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  const metrics = getDashboardMetrics()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tab = urlParams.get("tab")
    if (tab && ["overview", "organizations", "billing", "system"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [])

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
    console.log("[v0] Console data refreshed")
  }

  const handleViewOrg = (org: any) => {
    console.log("[v0] View organization:", org)
  }

  const handleEditOrg = (org: any) => {
    console.log("[v0] Edit organization:", org)
  }

  const handleAddOrg = () => {
    console.log("[v0] Add new organization")
  }

  if (!currentUser || !hasPermission(currentUser, "canAccessConsole")) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to access the superuser console.</p>
      </div>
    )
  }

  const enhancedOrganizations = organizations.map((org) => ({
    ...org,
    owner: users.find((u) => u.id === org.ownerId),
    totalUsers: users.filter((u) => u.organizationId === org.id).length,
    monthlyRevenue: org.monthlyRevenue || 0,
  }))

  const billingData = {
    totalMRR: metrics?.monthlyRevenue || 0,
    totalARR: (metrics?.monthlyRevenue || 0) * 12,
    churnRate: 3.2,
    averageRevenuePerUser: Math.floor((metrics?.monthlyRevenue || 0) / (metrics?.totalUsers || 1)),
    overduePayments: metrics?.pendingIssues || 0,
    trialConversions: 65,
    revenueGrowth: metrics?.revenueGrowth || 0,
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-2">Superuser Console</h1>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500 text-white">Platform Administrator</Badge>
            <Badge variant="outline">Last updated: 2 min ago</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Alerts
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Console Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Platform Overview</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="billing">Billing & Revenue</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PlatformOverview metrics={metrics} />
        </TabsContent>

        <TabsContent value="organizations" className="space-y-6">
          <OrganizationManagement
            organizations={enhancedOrganizations}
            onView={handleViewOrg}
            onEdit={handleEditOrg}
            onAdd={handleAddOrg}
          />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <BillingOverview data={billingData} />
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">System Health Dashboard</h3>
            <p className="text-muted-foreground">
              Advanced system monitoring and diagnostics would be implemented here.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
