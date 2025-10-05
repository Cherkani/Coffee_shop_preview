"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/services/store-service"
import { getOrders } from "@/lib/services"
import ApiService from "@/lib/services/api-service"
import type { Product, OrderItem, Order } from "@/lib/types"
import { ProductGrid } from "@/components/pos/product-grid"
import { ModifierDrawer } from "@/components/pos/modifier-drawer"
import { CartPanel } from "@/components/pos/cart-panel"
import { OrderStatus } from "@/components/pos/order-status"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function POSPage() {
  const { currentUser, currentLocation } = useAppStore()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [cartItems, setCartItems] = useState<OrderItem[]>([])
  const [isModifierDrawerOpen, setIsModifierDrawerOpen] = useState(false)

  useEffect(() => {
    const loadOrders = async () => {
      if (!currentUser) return

      try {
        setLoading(true)
        const ordersData = await getOrders(currentUser)
        setOrders(ordersData)
      } catch (error) {
        console.error("Failed to load orders:", error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [currentUser])

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

  const handleCheckout = async (customerName?: string, discount?: number) => {
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

    try {
      // Persist to server
      await ApiService.createOrder({
        ...newOrder,
        // Ensure dates are sent as ISO strings for json-server
        createdAt: newOrder.createdAt.toISOString(),
      })

      // Optimistically update local state so it appears immediately
      setOrders((prev) => [newOrder, ...prev])
    } catch (e) {
      console.error("Failed to create order:", e)
    } finally {
      setCartItems([])
    }
  }

  // Filter orders for current location
  const locationOrders = orders.filter((order) => order.locationId === currentLocation?.id)

  if (loading) {
    return (
      <div className="flex h-full">
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">Point of Sale</h1>
            <p className="text-muted-foreground">Loading products and orders...</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

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
