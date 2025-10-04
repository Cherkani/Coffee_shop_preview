import { DollarSign, ShoppingCart, TrendingUp, Users, Building2, MapPin, CreditCard, AlertTriangle } from "lucide-react"

// Product categories for catalog management
export const PRODUCT_CATEGORIES = ["Coffee", "Tea", "Pastry", "Sandwich", "Beverage", "Other"] as const

// Modifier categories for product customization
export const MODIFIER_CATEGORIES = ["Coffee", "Milk", "Syrup", "Preparation", "Other"] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]
export type ModifierCategory = (typeof MODIFIER_CATEGORIES)[number]

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

