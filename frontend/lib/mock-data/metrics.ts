import type { DashboardMetrics } from "../types"

export const mockDashboardMetrics: Record<string, DashboardMetrics> = {
  superuser: {
    totalOrganizations: 4,
    totalLocations: 11,
    totalUsers: 19,
    monthlyRevenue: 42500,
    activeSubscriptions: 4,
    revenueGrowth: 12.5,
    userGrowth: 8.3,
    systemHealth: 98,
    pendingIssues: 2,
  },
  owner: {
    totalLocations: 4,
    totalStaff: 6,
    monthlyRevenue: 15750,
    dailyRevenue: 525,
    ordersToday: 127,
    averageOrderValue: 8.45,
    topSellingProduct: "Cappuccino",
    revenueGrowth: 8.2,
    customerSatisfaction: 4.7,
  },
  admin: {
    dailyRevenue: 1250,
    ordersToday: 89,
    averageOrderValue: 7.85,
    staffOnDuty: 3,
    inventoryAlerts: 2,
    customerSatisfaction: 4.6,
    topSellingProduct: "Latte",
    peakHour: "9:00 AM",
  },
  cashier: {
    ordersProcessed: 23,
    totalSales: 195.5,
    averageOrderValue: 8.5,
    ordersInQueue: 3,
    currentShiftStart: "8:00 AM",
    hoursWorked: 4.5,
  },
}
