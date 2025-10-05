export type UserRole = "superuser" | "owner" | "admin" | "cashier"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  organizationId?: string
  locationId?: string
  isActive?: boolean
  createdAt?: Date
}

export interface Organization {
  id: string
  name: string
  ownerId: string
  adminId?: string
  locations: Location[]
  subscriptionPlan: "basic" | "pro" | "enterprise"
  status: "active" | "suspended" | "trial"
  createdAt: Date
  monthlyRevenue?: number
}

export interface Location {
  id: string
  name: string
  address: string
  organizationId: string
}

export interface Product {
  id: string
  name: string
  category: string
  basePrice: number
  sizes: ProductSize[]
  modifiers: Modifier[]
  image?: string
  available: boolean
  organizationId: string
  locationId: string
}

export interface ProductSize {
  id: string
  name: string
  price: number
}

export interface Modifier {
  id: string
  name: string
  price: number
  category: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  sizeId: string
  sizeName: string
  price: number
  modifiers: Modifier[]
  quantity: number
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: "queued" | "in-progress" | "ready" | "paid"
  customerName?: string
  createdAt: Date
  locationId: string
  cashierId: string
  organizationId: string
  statusHistory?: { status: "queued" | "in-progress" | "ready" | "paid"; at: Date }[]
}

export interface Ingredient {
  id: string
  name: string
  unit: string // oz, lb, count, etc.
  costPerUnit: number
  currentStock: number
  minStock: number
  supplier?: string
}

export interface Recipe {
  id: string
  productId: string
  ingredients: {
    ingredientId: string
    quantity: number
  }[]
  totalCost: number
  instructions?: string
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unit: string
  costPerUnit: number
  supplier?: string
  lastRestocked?: Date
  expiryDate?: Date
  organizationId: string
  locationId: string
}

export interface Supplier {
  id: string
  name: string
  contactEmail: string
  contactPhone: string
  address: string
  categories: string[]
  rating: number
  isActive: boolean
  paymentTerms: string
  deliveryTime: string
  organizationId: string
}

export interface MarketplaceItem {
  id: string
  name: string
  category: string
  description: string
  unit: string
  pricePerUnit: number
  availableQuantity: number
  minOrderQuantity: number
  sellerId: string
  sellerName: string
  sellerLocationId: string
  sellerLocationName: string
  quality: "Premium" | "Standard" | "Economy"
  certifications: string[]
  productionDate?: Date
  expiryDate?: Date
  isActive: boolean
  createdAt: Date
}

export interface PurchaseOrder {
  id: string
  orderNumber: string
  supplierId?: string
  supplierName?: string
  marketplaceItemId?: string
  buyerLocationId: string
  items: PurchaseOrderItem[]
  totalAmount: number
  status: "draft" | "sent" | "confirmed" | "shipped" | "delivered" | "cancelled"
  orderDate: Date
  expectedDelivery?: Date
  actualDelivery?: Date
  notes?: string
}

export interface PurchaseOrderItem {
  id: string
  itemName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  unit: string
}

export interface Production {
  id: string
  itemName: string
  category: string
  quantityProduced: number
  unit: string
  costPerUnit: number
  totalCost: number
  productionDate: Date
  expiryDate?: Date
  locationId: string
  producedBy: string
  status: "in-progress" | "completed" | "quality-check" | "ready-for-sale"
  notes?: string
}

export interface Transaction {
  id: string
  orderId: string
  amount: number
  paymentMethod: "cash" | "credit_card" | "debit_card" | "mobile_payment"
  status: "completed" | "pending" | "failed" | "refunded"
  customerName?: string
  locationId: string
  cashierId: string
  createdAt: Date
  organizationId: string
}

export interface MarketplaceListing {
  id: string
  sellerId: string
  sellerName: string
  sellerLocation: string
  productName: string
  category: string
  description: string
  unitPrice: number
  unit: string
  availableQuantity: number
  minOrderQty: number
  isActive: boolean
  createdAt: Date
  organizationId: string
  locationId: string
}

export interface NavigationPermission {
  id: string
  name: string
  href: string
  icon: string
  enabled: boolean
  role: UserRole
  organizationId: string
  createdAt: Date
  updatedAt: Date
}

export interface OrganizationNavigationSettings {
  id: string
  organizationId: string
  adminPermissions: NavigationPermission[]
  ownerPermissions: NavigationPermission[]
  cashierPermissions: NavigationPermission[]
  createdAt: Date
  updatedAt: Date
}

export interface DashboardMetrics {
  // Superuser metrics
  totalOrganizations?: number
  totalLocations?: number
  totalUsers?: number
  monthlyRevenue?: number
  activeSubscriptions?: number
  revenueGrowth?: number
  userGrowth?: number
  systemHealth?: number
  pendingIssues?: number

  // Owner metrics
  totalStaff?: number
  dailyRevenue?: number
  ordersToday?: number
  averageOrderValue?: number
  topSellingProduct?: string
  customerSatisfaction?: number

  // Admin metrics
  staffOnDuty?: number
  inventoryAlerts?: number
  peakHour?: string

  // Cashier metrics
  ordersProcessed?: number
  totalSales?: number
  ordersInQueue?: number
  currentShiftStart?: string
  hoursWorked?: number
}
