import { DollarSign, ShoppingCart, TrendingUp, Users, Building2, MapPin, CreditCard, AlertTriangle } from "lucide-react"

// Sample billing transactions data
export const SAMPLE_BILLING_TRANSACTIONS = [
  {
    id: "1",
    org: "Brew & Bean Coffee Co.",
    amount: 299,
    plan: "Pro",
    status: "paid" as const,
    date: "2024-01-22",
  },
  {
    id: "2",
    org: "Morning Grind Coffee",
    amount: 99,
    plan: "Basic",
    status: "paid" as const,
    date: "2024-01-22",
  },
  {
    id: "3",
    org: "Coffee Corner",
    amount: 599,
    plan: "Enterprise",
    status: "overdue" as const,
    date: "2024-01-20",
  },
  {
    id: "4",
    org: "Artisan Roasters",
    amount: 299,
    plan: "Pro",
    status: "paid" as const,
    date: "2024-01-21",
  },
  {
    id: "5",
    org: "Morning Grind Coffee",
    amount: 99,
    plan: "Basic",
    status: "pending" as const,
    date: "2024-01-22",
  },
] as const

// Subscription plan breakdown for platform overview
export const SUBSCRIPTION_PLAN_BREAKDOWN = [
  { plan: "Basic Plan", count: 45, label: "orgs" },
  { plan: "Pro Plan", count: 28, label: "orgs" },
  { plan: "Enterprise", count: 12, label: "orgs" },
] as const

// System health metrics
export const SYSTEM_HEALTH_METRICS = [
  { name: "API Response Time", value: "98ms avg", progress: 85 },
  { name: "Database Performance", value: "Excellent", progress: 95 },
] as const

// Trial conversion metrics
export const TRIAL_CONVERSION_METRICS = {
  activeTrials: 23,
  convertedThisMonth: 8,
} as const

// Payment issue types
export const PAYMENT_ISSUE_TYPES = [
  { type: "Overdue Payments", icon: AlertTriangle, color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-950/20" },
  {
    type: "Failed Payments",
    icon: CreditCard,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
  },
] as const

// Peak hours data
export const PEAK_HOURS_DATA = {
  timeRange: "8-10 AM",
  description: "Highest order volume",
} as const

// Platform overview metrics configuration
export const PLATFORM_METRICS_CONFIG = [
  {
    key: "totalOrganizations",
    title: "Organizations",
    icon: Building2,
    color: "text-blue-600",
  },
  {
    key: "totalLocations",
    title: "Locations",
    icon: MapPin,
    color: "text-green-600",
  },
  {
    key: "totalUsers",
    title: "Total Users",
    icon: Users,
    color: "text-purple-600",
  },
  {
    key: "monthlyRevenue",
    title: "Monthly Revenue",
    icon: DollarSign,
    color: "text-orange-600",
    format: "currency",
  },
] as const

// Billing metrics configuration
export const BILLING_METRICS_CONFIG = [
  {
    key: "totalMRR",
    title: "Monthly Recurring Revenue",
    icon: DollarSign,
    color: "text-green-600",
    format: "currency",
  },
  {
    key: "totalARR",
    title: "Annual Recurring Revenue",
    icon: TrendingUp,
    color: "text-blue-600",
    format: "currency",
  },
  {
    key: "averageRevenuePerUser",
    title: "Average Revenue Per User",
    icon: CreditCard,
    color: "text-purple-600",
    format: "currency",
  },
  {
    key: "churnRate",
    title: "Churn Rate",
    icon: AlertTriangle,
    color: "text-red-600",
    format: "percentage",
  },
] as const

// Sales metrics configuration for reports
export const SALES_METRICS_CONFIG = [
  {
    key: "totalRevenue",
    title: "Total Revenue",
    icon: DollarSign,
    color: "text-green-600",
    format: "currency",
  },
  {
    key: "totalOrders",
    title: "Total Orders",
    icon: ShoppingCart,
    color: "text-blue-600",
    format: "number",
  },
  {
    key: "averageOrderValue",
    title: "Average Order Value",
    icon: TrendingUp,
    color: "text-purple-600",
    format: "currency",
  },
  {
    key: "totalCustomers",
    title: "Unique Customers",
    icon: Users,
    color: "text-orange-600",
    format: "number",
  },
] as const

export type TransactionStatus = "paid" | "pending" | "overdue"
