"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Receipt, Search, Filter, Download, CreditCard, DollarSign } from "lucide-react"
import { useState } from "react"

const transactionData = [
  {
    id: "TXN-1001",
    orderId: "1001",
    customer: "Alice Johnson",
    items: ["Cappuccino (Medium)"],
    total: 5.6,
    paymentMethod: "Credit Card",
    cashier: "Mike Cashier",
    timestamp: "2024-03-18 09:15 AM",
    status: "completed",
  },
  {
    id: "TXN-1002",
    orderId: "1002",
    customer: "Bob Smith",
    items: ["Espresso (Double) x2", "Croissant"],
    total: 10.25,
    paymentMethod: "Cash",
    cashier: "Mike Cashier",
    timestamp: "2024-03-18 09:32 AM",
    status: "completed",
  },
  {
    id: "TXN-1003",
    orderId: "1003",
    customer: "Carol Davis",
    items: ["Latte (Large)"],
    total: 6.8,
    paymentMethod: "Mobile Pay",
    cashier: "Lisa Cashier",
    timestamp: "2024-03-18 10:45 AM",
    status: "completed",
  },
  {
    id: "TXN-1004",
    orderId: "1004",
    customer: "Emma Wilson",
    items: ["Frappuccino (Large)", "Chocolate Muffin"],
    total: 11.4,
    paymentMethod: "Credit Card",
    cashier: "David Barista",
    timestamp: "2024-03-18 11:20 AM",
    status: "completed",
  },
  {
    id: "TXN-1005",
    orderId: "1005",
    customer: "Frank Miller",
    items: ["Avocado Toast", "Iced Coffee (Medium)"],
    total: 13.85,
    paymentMethod: "Debit Card",
    cashier: "Mike Cashier",
    timestamp: "2024-03-18 12:15 PM",
    status: "refunded",
  },
]

export default function TransactionsPage() {
  const { currentUser } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please sign in to view transactions.</p>
      </div>
    )
  }

  const isAdmin = currentUser.role === "admin" || currentUser.role === "owner"
  const filteredTransactions = transactionData.filter(
    (transaction) =>
      (isAdmin || transaction.cashier === currentUser.name) &&
      (transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const totalRevenue = filteredTransactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            {isAdmin ? "View all transaction history" : "View your transaction history"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">From completed transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredTransactions.length}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${filteredTransactions.length > 0 ? (totalRevenue / filteredTransactions.length).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Search and view transaction details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-secondary rounded-full">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{transaction.id}</div>
                    <div className="text-sm text-muted-foreground">
                      {transaction.customer} • {transaction.timestamp}
                    </div>
                    <div className="text-sm text-muted-foreground">{transaction.items.join(", ")}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${transaction.total.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">{transaction.paymentMethod}</div>
                  {isAdmin && <div className="text-sm text-muted-foreground">{transaction.cashier}</div>}
                  <Badge variant={transaction.status === "completed" ? "default" : "destructive"}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
