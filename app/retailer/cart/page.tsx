"use client"

import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { CartLineItem } from "@/components/features/cart-line-item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/mock-data"

/**
 * @description Shopping cart page
 * @fileoverview Displays cart items with quantity controls and checkout button
 */
export default function ShoppingCartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, getCartTotal, getItemCount } = useCart()

  const subtotal = getCartTotal()
  const tax = subtotal * 0.08 // 8% tax
  const shipping = subtotal > 2500 ? 0 : 50 // Free shipping over $2,500
  const total = subtotal + tax + shipping

  if (items.length === 0) {
    return (
      <AuthenticatedLayout>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          
          <Card>
            <CardContent className="py-16 text-center">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
              <Button asChild>
                <Link href="/retailer/products">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Continue Shopping
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Shopping Cart ({getItemCount()} items)
          </h1>
          <Button variant="ghost" onClick={clearCart} className="text-red-600 hover:text-red-700">
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartLineItem
                key={`${item.productId}-${item.variantId}`}
                item={item}
                onUpdateQuantity={(quantity) => updateQuantity(item.productId, item.variantId, quantity)}
                onRemove={() => removeFromCart(item.productId, item.variantId)}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Estimated Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatCurrency(shipping)
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-600">
                      Free shipping on orders over $2,500
                    </p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full" size="lg" asChild>
                    <Link href="/retailer/checkout">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/retailer/products">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Continue Shopping
                    </Link>
                  </Button>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>• All prices include your tier discount</p>
                  <p>• Payment terms: Net 30</p>
                  <p>• PO Number required at checkout</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}