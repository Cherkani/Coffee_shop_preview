"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface TopItem {
  id: string
  name: string
  category: string
  quantity: number
  revenue: number
  percentage: number
}

interface TopItemsProps {
  items: TopItem[]
  title: string
}

export function TopItems({ items, title }: TopItemsProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center p-0">
                  {index + 1}
                </Badge>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${item.revenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">{item.quantity} sold</p>
              </div>
            </div>
            <Progress value={item.percentage} className="h-2" />
          </div>
        ))}
      </div>
    </Card>
  )
}
