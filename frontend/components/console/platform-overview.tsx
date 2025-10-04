"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { PLATFORM_METRICS_CONFIG } from "@/lib/constants"
import { SUBSCRIPTION_PLAN_BREAKDOWN, SYSTEM_HEALTH_METRICS } from "@/lib/mock-data"

interface PlatformMetrics {
  totalOrganizations: number
  totalLocations: number
  totalUsers: number
  monthlyRevenue: number
  activeSubscriptions: number
  revenueGrowth: number
  userGrowth: number
  systemHealth: number
  pendingIssues: number
}

interface PlatformOverviewProps {
  metrics: PlatformMetrics
}

export function PlatformOverview({ metrics }: PlatformOverviewProps) {
  const overviewCards = PLATFORM_METRICS_CONFIG.map((config) => {
    const value = metrics[config.key as keyof PlatformMetrics]
    const change =
      config.key === "totalOrganizations" || config.key === "totalUsers"
        ? metrics.userGrowth
        : config.key === "monthlyRevenue"
          ? metrics.revenueGrowth
          : 0

    return {
      title: config.title,
      value: config.format === "currency" ? `$${value.toLocaleString()}` : value.toString(),
      change,
      icon: config.icon,
      color: config.color,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Platform Overview</h2>
        <div className="flex items-center gap-2">
          <Badge variant={metrics.systemHealth > 95 ? "default" : "destructive"}>
            System Health: {metrics.systemHealth}%
          </Badge>
          {metrics.pendingIssues > 0 && (
            <Badge variant="destructive">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {metrics.pendingIssues} Issues
            </Badge>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((card) => {
          const Icon = card.icon
          const isPositive = card.change > 0
          const isNegative = card.change < 0

          return (
            <Card key={card.title} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon className={cn("h-5 w-5", card.color)} />
                {card.change !== 0 && (
                  <div
                    className={cn("flex items-center gap-1 text-sm", isPositive ? "text-green-600" : "text-red-600")}
                  >
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(card.change)}%
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.title}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Health</span>
                <span>{metrics.systemHealth}%</span>
              </div>
              <Progress value={metrics.systemHealth} className="h-2" />
            </div>
            {SYSTEM_HEALTH_METRICS.map((metric) => (
              <div key={metric.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{metric.name}</span>
                  <span>{metric.value}</span>
                </div>
                <Progress value={metric.progress} className="h-2" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Active Subscriptions</h3>
          <div className="space-y-4">
            {SUBSCRIPTION_PLAN_BREAKDOWN.map((plan) => (
              <div key={plan.plan} className="flex items-center justify-between">
                <span className="text-sm">{plan.plan}</span>
                <div className="text-right">
                  <span className="font-semibold">{plan.count}</span>
                  <span className="text-sm text-muted-foreground ml-2">{plan.label}</span>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between font-semibold">
                <span>Total Active</span>
                <span>{metrics.activeSubscriptions}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
