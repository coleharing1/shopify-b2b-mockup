"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, ArrowLeft, Package, CreditCard, Truck } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/mock-data"

/**
 * @description B2B checkout page
 * @fileoverview Multi-section checkout with PO number and ship date
 */
export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, getCartTotal, getItemCount } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  // Form state
  const [poNumber, setPoNumber] = useState("")
  const [shipDate, setShipDate] = useState<Date>()
  const [selectedAddress, setSelectedAddress] = useState("addr-1")
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({})

  const subtotal = getCartTotal()
  const tax = subtotal * 0.08
  const shipping = subtotal > 2500 ? 0 : 50
  const total = subtotal + tax + shipping

  // Mock shipping addresses
  const shippingAddresses = [
    {
      id: "addr-1",
      label: "Main Store",
      address1: "123 Mountain View Dr",
      address2: "Suite 100",
      city: "Denver",
      state: "CO",
      zip: "80202"
    },
    {
      id: "addr-2",
      label: "Warehouse",
      address1: "456 Industrial Pkwy",
      city: "Aurora",
      state: "CO",
      zip: "80010"
    }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!poNumber.trim()) {
      newErrors.poNumber = "PO Number is required"
    }
    
    if (!shipDate) {
      newErrors.shipDate = "Requested ship date is required"
    }
    
    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    // Simulate order submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Clear cart and show confirmation
    clearCart()
    setShowConfirmation(true)
    
    // Redirect after 3 seconds
    setTimeout(() => {
      router.push("/retailer/orders")
    }, 3000)
  }

  if (items.length === 0 && !showConfirmation) {
    return (
      <AuthenticatedLayout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Add items to your cart before checking out</p>
              <Button asChild>
                <Link href="/retailer/products">
                  Return to Products
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (showConfirmation) {
    return (
      <AuthenticatedLayout>
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
              <p className="text-gray-600 mb-4">
                Your order has been successfully placed.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Order #ORD-2024-{Math.floor(Math.random() * 10000)}
              </p>
              <p className="text-sm text-gray-600">
                Redirecting to order history...
              </p>
            </CardContent>
          </Card>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/retailer/cart">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cart
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* PO Number Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-red-500">*</span>
                    Purchase Order Information
                  </CardTitle>
                  <CardDescription>
                    PO Number is required for all B2B orders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="po-number">
                      PO Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="po-number"
                      placeholder="Enter your PO number"
                      value={poNumber}
                      onChange={(e) => setPoNumber(e.target.value)}
                      className={errors.poNumber ? "border-red-500" : ""}
                    />
                    {errors.poNumber && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.poNumber}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>
                      Requested Ship Date <span className="text-red-500">*</span>
                    </Label>
                    <DatePicker
                      date={shipDate}
                      onSelect={setShipDate}
                      placeholder="Select ship date"
                    />
                    {errors.shipDate && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.shipDate}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Standard processing time is 2-3 business days
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Ship To Address</Label>
                    <div className="space-y-2">
                      {shippingAddresses.map((address) => (
                        <label
                          key={address.id}
                          className={cn(
                            "flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors",
                            selectedAddress === address.id
                              ? "border-primary bg-primary-light"
                              : "border-gray-200 hover:border-gray-300"
                          )}
                        >
                          <input
                            type="radio"
                            name="shipping-address"
                            value={address.id}
                            checked={selectedAddress === address.id}
                            onChange={(e) => setSelectedAddress(e.target.value)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{address.label}</p>
                            <p className="text-sm text-gray-600">
                              {address.address1}
                              {address.address2 && `, ${address.address2}`}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.state} {address.zip}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                    <textarea
                      id="instructions"
                      className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Delivery instructions, receiving hours, etc."
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Terms */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Terms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium mb-2">Net 30 Terms</p>
                    <p className="text-sm text-gray-600">
                      Payment is due within 30 days of invoice date. 
                      A 1.5% late fee may apply to overdue balances.
                    </p>
                  </div>
                  
                  <div className="mt-4 flex items-start gap-2">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                    />
                    <label htmlFor="terms" className="text-sm cursor-pointer">
                      I agree to the payment terms and conditions
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
                      <AlertCircle className="h-3 w-3" />
                      {errors.terms}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>{getItemCount()} items</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items List */}
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {items.map((item) => (
                      <div
                        key={`${item.productId}-${item.variantId}`}
                        className="flex justify-between text-sm"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-gray-600">
                            {item.variant.color} / {item.variant.size} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
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
                    <div className="border-t pt-2 flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Place Order"}
                  </Button>

                  <p className="text-xs text-gray-600 text-center">
                    By placing this order, you agree to our terms of service
                    and acknowledge that all orders are subject to credit approval.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}