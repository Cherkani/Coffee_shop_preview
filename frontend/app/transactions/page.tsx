"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/services/store-service"
import { getTransactions } from "@/lib/services"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Receipt, Search, Filter, Download, CreditCard, DollarSign } from "lucide-react"
import type { Transaction } from "@/lib/types"

export default function TransactionsPage() {
  const { currentUser } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTransactions = async () => {
      if (!currentUser) return

      try {
        setLoading(true)
        const transactionsData = await getTransactions(currentUser)
        setTransactions(transactionsData)
      } catch (error) {
        console.error("Failed to load transactions:", error)
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [currentUser])

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Please sign in to view transactions.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Transactions</h1>
            <p className="text-muted-foreground">Loading transactions...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const isAdmin = currentUser.role === "admin" || currentUser.role === "owner"
  const filteredTransactions = transactions.filter(
    (transaction) =>
      (isAdmin || transaction.cashierId === currentUser.id) &&
      (transaction.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const totalRevenue = filteredTransactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0)

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
                      {transaction.customerName || "Guest"} • {transaction.createdAt.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Order #{transaction.orderId}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">${transaction.amount.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">{transaction.paymentMethod}</div>
                  {isAdmin && <div className="text-sm text-muted-foreground">Cashier ID: {transaction.cashierId}</div>}
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
