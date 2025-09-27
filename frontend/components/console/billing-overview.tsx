"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Download, CreditCard } from "lucide-react"
import {
  BILLING_METRICS_CONFIG,
  SAMPLE_BILLING_TRANSACTIONS,
  TRIAL_CONVERSION_METRICS,
  PAYMENT_ISSUE_TYPES,
} from "@/lib/constants"

interface BillingData {
  totalMRR: number
  totalARR: number
  churnRate: number
  averageRevenuePerUser: number
  overduePayments: number
  trialConversions: number
  revenueGrowth: number
}

interface BillingOverviewProps {
  data: BillingData
}

export function BillingOverview({ data }: BillingOverviewProps) {
  const recentTransactions = SAMPLE_BILLING_TRANSACTIONS

  const overduePaymentIssue = PAYMENT_ISSUE_TYPES[0]
  const failedPaymentIssue = PAYMENT_ISSUE_TYPES[1]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Billing & Revenue</h2>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {BILLING_METRICS_CONFIG.map((config) => {
          const value = data[config.key as keyof BillingData]
          const Icon = config.icon
          const showGrowth = config.key === "totalMRR"

          return (
            <Card key={config.key} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${config.color}`} />
                {showGrowth && (
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    {data.revenueGrowth}%
                  </div>
                )}
                {config.key === "churnRate" && data.overduePayments > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {data.overduePayments}
                  </Badge>
                )}
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {config.format === "currency"
                    ? `$${value.toLocaleString()}`
                    : config.format === "percentage"
                      ? `${value}%`
                      : `$${value}`}
                </p>
                <p className="text-sm text-muted-foreground">{config.title}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Trial Conversions</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Conversion Rate</span>
                <span>{data.trialConversions}%</span>
              </div>
              <Progress value={data.trialConversions} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Active Trials</p>
                <p className="font-semibold">{TRIAL_CONVERSION_METRICS.activeTrials}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Converted This Month</p>
                <p className="font-semibold">{TRIAL_CONVERSION_METRICS.convertedThisMonth}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Issues</h3>
          <div className="space-y-3">
            {data.overduePayments > 0 ? (
              <>
                <div className={`flex items-center justify-between p-3 ${overduePaymentIssue.bgColor} rounded-lg`}>
                  <div className="flex items-center gap-2">
                    <overduePaymentIssue.icon className={`h-4 w-4 ${overduePaymentIssue.color}`} />
                    <span className="text-sm font-medium">{overduePaymentIssue.type}</span>
                  </div>
                  <Badge variant="destructive">{data.overduePayments}</Badge>
                </div>
                <div className={`flex items-center justify-between p-3 ${failedPaymentIssue.bgColor} rounded-lg`}>
                  <div className="flex items-center gap-2">
                    <failedPaymentIssue.icon className={`h-4 w-4 ${failedPaymentIssue.color}`} />
                    <span className="text-sm font-medium">{failedPaymentIssue.type}</span>
                  </div>
                  <Badge variant="secondary">2</Badge>
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No payment issues</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium text-sm">{transaction.org}</p>
                  <p className="text-xs text-muted-foreground">{transaction.plan} Plan</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">${transaction.amount}</span>
                <Badge
                  variant={
                    transaction.status === "paid"
                      ? "default"
                      : transaction.status === "overdue"
                        ? "destructive"
                        : "secondary"
                  }
                  className="text-xs"
                >
                  {transaction.status.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">{transaction.date}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
