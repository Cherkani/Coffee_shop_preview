"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { getOrders } from "@/lib/services"
import type { Product, OrderItem, Order } from "@/lib/types"
import { ProductGrid } from "@/components/pos/product-grid"
import { ModifierDrawer } from "@/components/pos/modifier-drawer"
import { CartPanel } from "@/components/pos/cart-panel"
import { OrderStatus } from "@/components/pos/order-status"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function POSPage() {
  const { currentUser, currentLocation } = useAppStore()
  
  // Get orders using service function
  const orders = getOrders(currentUser)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartItems, setCartItems] = useState<OrderItem[]>([])
  const [isModifierDrawerOpen, setIsModifierDrawerOpen] = useState(false)

  // Mock function for demo purposes
  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    console.log("Updating order status:", orderId, status)
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setIsModifierDrawerOpen(true)
  }

  const handleAddToCart = (item: Omit<OrderItem, "id">) => {
    const newItem: OrderItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }
    setCartItems((prev) => [...prev, newItem])
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(itemId)
      return
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const unitPrice = item.price / item.quantity
          return { ...item, quantity, price: unitPrice * quantity }
        }
        return item
      }),
    )
  }

  const handleRemoveItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handleCheckout = (customerName?: string, discount?: number) => {
    if (cartItems.length === 0) return

    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
    const discountAmount = discount ? (subtotal * discount) / 100 : 0
    const total = subtotal - discountAmount

    const newOrder: Order = {
      id: Date.now().toString(),
      items: cartItems,
      total,
      status: "queued",
      customerName,
      createdAt: new Date(),
      locationId: currentLocation?.id || "",
      cashierId: currentUser?.id || "",
      organizationId: currentUser?.organizationId || "",
    }

    // For demo purposes, we'll just log the order
    console.log("New order created:", newOrder)
    setCartItems([])
  }

  // Filter orders for current location
  const locationOrders = orders.filter((order) => order.locationId === currentLocation?.id)

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Point of Sale</h1>
          <p className="text-muted-foreground">
            {currentLocation?.name} - {currentUser?.name}
          </p>
        </div>

        <Tabs defaultValue="menu" className="h-full">
          <TabsList className="mb-4">
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="menu" className="h-full">
            <ProductGrid onProductSelect={handleProductSelect} />
          </TabsContent>

          <TabsContent value="orders" className="h-full">
            <OrderStatus orders={locationOrders} onUpdateStatus={updateOrderStatus} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Cart Panel */}
      <CartPanel
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        maxDiscount={currentUser?.role === "cashier" ? 10 : 50}
      />

      {/* Modifier Drawer */}
      <ModifierDrawer
        product={selectedProduct}
        isOpen={isModifierDrawerOpen}
        onClose={() => {
          setIsModifierDrawerOpen(false)
          setSelectedProduct(null)
        }}
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
