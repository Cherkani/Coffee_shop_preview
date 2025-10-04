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

// Peak hours data
export const PEAK_HOURS_DATA = {
  timeRange: "8-10 AM",
  description: "Highest order volume",
} as const

export type TransactionStatus = "paid" | "pending" | "overdue"
