"use client"

import { useAppStore } from "@/lib/services/store-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Download, Plus } from "lucide-react"

const payrollData = [
  {
    id: "1",
    employee: "Jane Manager",
    role: "Admin",
    hoursWorked: 40,
    hourlyRate: 22.5,
    overtime: 2,
    grossPay: 967.5,
    taxes: 193.5,
    netPay: 774.0,
    status: "processed",
  },
  {
    id: "2",
    employee: "Mike Cashier",
    role: "Cashier",
    hoursWorked: 35,
    hourlyRate: 16.0,
    overtime: 0,
    grossPay: 560.0,
    taxes: 112.0,
    netPay: 448.0,
    status: "processed",
  },
  {
    id: "3",
    employee: "Lisa Cashier",
    role: "Cashier",
    hoursWorked: 38,
    hourlyRate: 16.5,
    overtime: 3,
    grossPay: 701.25,
    taxes: 140.25,
    netPay: 561.0,
    status: "pending",
  },
  {
    id: "4",
    employee: "David Barista",
    role: "Cashier",
    hoursWorked: 42,
    hourlyRate: 17.0,
    overtime: 2,
    grossPay: 765.0,
    taxes: 153.0,
    netPay: 612.0,
    status: "pending",
  },
]

export default function PayrollPage() {
  const { currentUser } = useAppStore()

  if (!currentUser || currentUser.role !== "owner") {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Access denied. Payroll is only available to owners.</p>
      </div>
    )
  }

  const totalGrossPay = payrollData.reduce((sum, emp) => sum + emp.grossPay, 0)
  const totalNetPay = payrollData.reduce((sum, emp) => sum + emp.netPay, 0)
  const totalTaxes = payrollData.reduce((sum, emp) => sum + emp.taxes, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Manage employee payroll and compensation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Process Payroll
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gross Pay</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalGrossPay.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">This pay period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Net Pay</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalNetPay.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">After taxes & deductions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Taxes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalTaxes.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Tax withholdings</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Payroll</CardTitle>
          <CardDescription>Current pay period: March 1-15, 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Employee</th>
                  <th className="text-left p-2">Hours</th>
                  <th className="text-left p-2">Rate</th>
                  <th className="text-left p-2">Overtime</th>
                  <th className="text-left p-2">Gross Pay</th>
                  <th className="text-left p-2">Taxes</th>
                  <th className="text-left p-2">Net Pay</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payrollData.map((employee) => (
                  <tr key={employee.id} className="border-b">
                    <td className="p-2">
                      <div>
                        <div className="font-medium">{employee.employee}</div>
                        <div className="text-sm text-muted-foreground">{employee.role}</div>
                      </div>
                    </td>
                    <td className="p-2">{employee.hoursWorked}h</td>
                    <td className="p-2">${employee.hourlyRate}/hr</td>
                    <td className="p-2">{employee.overtime}h</td>
                    <td className="p-2">${employee.grossPay.toFixed(2)}</td>
                    <td className="p-2">${employee.taxes.toFixed(2)}</td>
                    <td className="p-2 font-medium">${employee.netPay.toFixed(2)}</td>
                    <td className="p-2">
                      <Badge variant={employee.status === "processed" ? "default" : "secondary"}>
                        {employee.status}
                      </Badge>
                    </td>
                    <td className="p-2">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
