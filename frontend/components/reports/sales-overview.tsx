"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { SALES_METRICS_CONFIG } from "@/lib/constants"
import ApiService from "@/lib/services/api-service"

interface SalesData {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  totalCustomers: number
  revenueChange: number
  ordersChange: number
  avgOrderTime: number
}

interface SalesOverviewProps {
  data: SalesData
  period: string
}

export function SalesOverview({ data, period }: SalesOverviewProps) {
  const [peakHours, setPeakHours] = useState<{ timeRange: string; description: string }>({ timeRange: "--", description: "--" })

  useEffect(() => {
    const load = async () => {
      try {
        const metrics = await ApiService.getMetrics()
        setPeakHours(metrics?.peakHours || { timeRange: "--", description: "--" })
      } catch (e) {
        console.error("Failed to load sales metrics:", e)
      }
    }
    load()
  }, [])
  const metrics = SALES_METRICS_CONFIG.map((config) => {
    const value = data[config.key as keyof SalesData]
    const change =
      config.key === "totalRevenue" ? data.revenueChange : config.key === "totalOrders" ? data.ordersChange : 0

    return {
      title: config.title,
      value: config.format === "currency" ? `$${value.toFixed(2)}` : value.toString(),
      change,
      icon: config.icon,
      color: config.color,
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Sales Overview</h2>
        <Badge variant="outline">{period}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const isPositive = metric.change > 0
          const isNegative = metric.change < 0

          return (
            <Card key={metric.title} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon className={cn("h-5 w-5", metric.color)} />
                {metric.change !== 0 && (
                  <div
                    className={cn("flex items-center gap-1 text-sm", isPositive ? "text-green-600" : "text-red-600")}
                  >
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(metric.change)}%
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Average Order Time</h3>
          </div>
          <p className="text-2xl font-bold">{data.avgOrderTime} min</p>
          <p className="text-sm text-muted-foreground">From order to completion</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Peak Hours</h3>
          </div>
          <p className="text-2xl font-bold">{peakHours.timeRange}</p>
          <p className="text-sm text-muted-foreground">{peakHours.description}</p>
        </Card>
      </div>
    </div>
  )
}
