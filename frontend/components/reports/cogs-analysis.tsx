"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface COGSData {
  totalRevenue: number
  totalCOGS: number
  grossProfit: number
  grossMargin: number
  categoryBreakdown: {
    category: string
    cogs: number
    percentage: number
  }[]
}

interface COGSAnalysisProps {
  data: COGSData
}

export function COGSAnalysis({ data }: COGSAnalysisProps) {
  const isHealthyMargin = data.grossMargin >= 60 // 60% is considered healthy for coffee shops

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Cost of Goods Sold (COGS) Analysis</h3>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <DollarSign className="h-5 w-5 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold">${data.totalRevenue.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
        </div>

        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <TrendingDown className="h-5 w-5 mx-auto mb-2 text-red-600" />
          <p className="text-2xl font-bold">${data.totalCOGS.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Total COGS</p>
        </div>

        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <TrendingUp className={cn("h-5 w-5 mx-auto mb-2", isHealthyMargin ? "text-green-600" : "text-orange-600")} />
          <p className={cn("text-2xl font-bold", isHealthyMargin ? "text-green-600" : "text-orange-600")}>
            {data.grossMargin.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">Gross Margin</p>
        </div>
      </div>

      {/* Gross Profit */}
      <div className="mb-6 p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium">Gross Profit</span>
          <span className="text-xl font-bold text-green-600">${data.grossProfit.toFixed(2)}</span>
        </div>
        <Progress value={data.grossMargin} className="h-3" />
        <p className="text-sm text-muted-foreground mt-1">
          {isHealthyMargin ? "Healthy margin" : "Consider optimizing costs"}
        </p>
      </div>

      {/* Category Breakdown */}
      <div>
        <h4 className="font-medium mb-3">COGS by Category</h4>
        <div className="space-y-3">
          {data.categoryBreakdown.map((category) => (
            <div key={category.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{category.category}</span>
                <div className="text-right">
                  <span className="font-semibold">${category.cogs.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground ml-2">({category.percentage.toFixed(1)}%)</span>
                </div>
              </div>
              <Progress value={category.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
