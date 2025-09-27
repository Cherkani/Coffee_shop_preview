"use client"

import type { OrderItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Minus } from "lucide-react"
import { useState } from "react"

interface CartPanelProps {
  items: OrderItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onCheckout: (customerName?: string, discount?: number) => void
  maxDiscount?: number
}

export function CartPanel({ items, onUpdateQuantity, onRemoveItem, onCheckout, maxDiscount = 10 }: CartPanelProps) {
  const [customerName, setCustomerName] = useState("")
  const [discount, setDiscount] = useState(0)

  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount

  const handleCheckout = () => {
    onCheckout(customerName || undefined, discount > 0 ? discount : undefined)
    setCustomerName("")
    setDiscount(0)
  }

  return (
    <Card className="w-80 h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Current Order</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No items in cart</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.productName}</h4>
                    <p className="text-xs text-muted-foreground">{item.sizeName}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                {item.modifiers.length > 0 && (
                  <div className="mb-2">
                    {item.modifiers.map((mod) => (
                      <Badge key={mod.id} variant="secondary" className="text-xs mr-1 mb-1">
                        {mod.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="h-6 w-6 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="font-semibold text-sm">${item.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="p-4 border-t border-border space-y-4">
          {/* Customer Name */}
          <div>
            <Label htmlFor="customer-name" className="text-sm">
              Customer Name (Optional)
            </Label>
            <Input
              id="customer-name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter customer name"
              className="mt-1"
            />
          </div>

          {/* Discount */}
          <div>
            <Label htmlFor="discount" className="text-sm">
              Discount % (Max {maxDiscount}%)
            </Label>
            <Input
              id="discount"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Math.min(maxDiscount, Math.max(0, Number.parseInt(e.target.value) || 0)))}
              placeholder="0"
              min="0"
              max={maxDiscount}
              className="mt-1"
            />
          </div>

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({discount}%):</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg border-t border-border pt-2">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={handleCheckout}>
            Process Payment
          </Button>
        </div>
      )}
    </Card>
  )
}
