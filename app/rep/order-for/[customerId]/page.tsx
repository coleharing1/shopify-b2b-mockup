"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  Search, 
  Upload, 
  ShoppingCart,
  Plus,
  Minus,
  AlertCircle,
  Building
} from "lucide-react"
import { getProducts, Product, formatCurrency } from "@/lib/mock-data"
import Link from "next/link"

interface OrderItem {
  productId: string
  product: Product
  variants: Map<string, number> // variantId -> quantity
  totalQuantity: number
  totalPrice: number
}

interface CompanyInfo {
  id: string
  name: string
  pricingTier: string
  discount: number
}

/**
 * @description Order on behalf of customer page
 * @fileoverview Allows sales reps to place orders for their customers
 */
export default function OrderOnBehalfPage() {
  const params = useParams()
  const router = useRouter()
  const [company, setCompany] = useState<CompanyInfo | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [orderItems, setOrderItems] = useState<Map<string, OrderItem>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [quickOrderSku, setQuickOrderSku] = useState("")
  const [quickOrderQuantity, setQuickOrderQuantity] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate loading company and products
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock company data
        const mockCompany: CompanyInfo = {
          id: params.customerId as string,
          name: "Mountain Gear Outfitters",
          pricingTier: "tier-3",
          discount: 0.5 // 50% discount
        }
        
        // Load products
        const data = await getProducts()
        
        setCompany(mockCompany)
        setProducts(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.customerId])

  /**
   * @description Add product variant to order
   */
  const handleAddToOrder = (product: Product, variantId: string, quantity: number) => {
    const newItems = new Map(orderItems)
    const existingItem = newItems.get(product.id)
    
    if (existingItem) {
      const variantQuantities = new Map(existingItem.variants)
      const currentQuantity = variantQuantities.get(variantId) || 0
      variantQuantities.set(variantId, currentQuantity + quantity)
      
      const totalQuantity = Array.from(variantQuantities.values()).reduce((sum, q) => sum + q, 0)
      const unitPrice = product.pricing[company!.pricingTier].price
      
      newItems.set(product.id, {
        ...existingItem,
        variants: variantQuantities,
        totalQuantity,
        totalPrice: totalQuantity * unitPrice
      })
    } else {
      const variantQuantities = new Map<string, number>()
      variantQuantities.set(variantId, quantity)
      const unitPrice = product.pricing[company!.pricingTier].price
      
      newItems.set(product.id, {
        productId: product.id,
        product,
        variants: variantQuantities,
        totalQuantity: quantity,
        totalPrice: quantity * unitPrice
      })
    }
    
    setOrderItems(newItems)
  }

  /**
   * @description Update variant quantity in order
   */
  const handleUpdateQuantity = (productId: string, variantId: string, newQuantity: number) => {
    const newItems = new Map(orderItems)
    const item = newItems.get(productId)
    
    if (!item) return
    
    const variantQuantities = new Map(item.variants)
    
    if (newQuantity <= 0) {
      variantQuantities.delete(variantId)
    } else {
      variantQuantities.set(variantId, newQuantity)
    }
    
    const totalQuantity = Array.from(variantQuantities.values()).reduce((sum, q) => sum + q, 0)
    
    if (totalQuantity === 0) {
      newItems.delete(productId)
    } else {
      const unitPrice = item.product.pricing[company!.pricingTier].price
      newItems.set(productId, {
        ...item,
        variants: variantQuantities,
        totalQuantity,
        totalPrice: totalQuantity * unitPrice
      })
    }
    
    setOrderItems(newItems)
  }

  /**
   * @description Handle quick order by SKU
   */
  const handleQuickOrder = () => {
    const quantity = parseInt(quickOrderQuantity)
    if (!quickOrderSku || isNaN(quantity) || quantity <= 0) return
    
    // Find product by SKU
    const product = products.find(p => 
      p.variants?.some(v => v.sku.toLowerCase() === quickOrderSku.toLowerCase())
    )
    
    if (product) {
      const variant = product.variants?.find(v => 
        v.sku.toLowerCase() === quickOrderSku.toLowerCase()
      )
      
      if (variant) {
        handleAddToOrder(product, variant.id, quantity)
        setQuickOrderSku("")
        setQuickOrderQuantity("")
      }
    }
  }

  const filteredProducts = products.filter(product =>
    searchTerm === "" ||
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const orderTotal = Array.from(orderItems.values()).reduce((sum, item) => sum + item.totalPrice, 0)
  const itemCount = Array.from(orderItems.values()).reduce((sum, item) => sum + item.totalQuantity, 0)

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!company) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Company not found</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header with Customer Info */}
        <div className="bg-primary-light border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-gray-600">Ordering for:</p>
                  <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
                </div>
              </div>
              <span className="px-3 py-1 bg-white rounded-full text-sm font-medium">
                {Math.round(company.discount * 100)}% Discount Applied
              </span>
            </div>
            <Button variant="outline" asChild>
              <Link href={`/rep/customers/${company.id}`}>
                View Customer
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Order */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Order</CardTitle>
                <CardDescription>Add products by SKU for faster ordering</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter SKU"
                    value={quickOrderSku}
                    onChange={(e) => setQuickOrderSku(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={quickOrderQuantity}
                    onChange={(e) => setQuickOrderQuantity(e.target.value)}
                    className="w-24"
                  />
                  <Button onClick={handleQuickOrder}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <Button variant="outline" className="w-full mt-3">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSV Order
                </Button>
              </CardContent>
            </Card>

            {/* Product Search */}
            <Card>
              <CardHeader>
                <CardTitle>Browse Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredProducts.map((product) => {
                    const customerPrice = product.pricing[company.pricingTier].price
                    const msrp = product.pricing["tier-1"].price
                    
                    return (
                      <div key={product.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-primary">
                              {formatCurrency(customerPrice)}
                            </p>
                            <p className="text-sm text-gray-500 line-through">
                              MSRP: {formatCurrency(msrp)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Variant Grid */}
                        <div className="grid grid-cols-4 gap-2">
                          {product.variants?.map((variant) => {
                            const currentQuantity = orderItems.get(product.id)?.variants.get(variant.id) || 0
                            
                            return (
                              <div key={variant.id} className="text-center">
                                <p className="text-xs text-gray-600 mb-1">
                                  {variant.size} / {variant.color}
                                </p>
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 w-6 p-0"
                                    onClick={() => handleUpdateQuantity(product.id, variant.id, currentQuantity - 1)}
                                    disabled={currentQuantity === 0}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <Input
                                    type="number"
                                    value={currentQuantity}
                                    onChange={(e) => handleUpdateQuantity(product.id, variant.id, parseInt(e.target.value) || 0)}
                                    className="w-12 h-6 text-center p-0 text-xs"
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 w-6 p-0"
                                    onClick={() => handleUpdateQuantity(product.id, variant.id, currentQuantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  Stock: {variant.inventory}
                                </p>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Order Summary
                </CardTitle>
                <CardDescription>{itemCount} items</CardDescription>
              </CardHeader>
              <CardContent>
                {orderItems.size === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No items in order yet</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                      {Array.from(orderItems.values()).map((item) => (
                        <div key={item.productId} className="border-b pb-3">
                          <p className="font-medium text-sm">{item.product.name}</p>
                          <div className="mt-1 space-y-1">
                            {Array.from(item.variants.entries()).map(([variantId, quantity]) => {
                              const variant = item.product.variants?.find(v => v.id === variantId)
                              if (!variant) return null
                              
                              return (
                                <div key={variantId} className="flex justify-between text-xs text-gray-600">
                                  <span>{variant.size}/{variant.color} × {quantity}</span>
                                  <span>{formatCurrency(item.product.pricing[company.pricingTier].price * quantity)}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>{formatCurrency(orderTotal)}</span>
                      </div>
                      <div className="bg-green-50 text-green-700 text-sm p-2 rounded">
                        <AlertCircle className="h-4 w-4 inline mr-1" />
                        Customer saves {formatCurrency(orderTotal)} with their {Math.round(company.discount * 100)}% discount
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      <div>
                        <Label htmlFor="po-number">PO Number (Optional)</Label>
                        <Input
                          id="po-number"
                          placeholder="Enter customer's PO number"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Order Notes</Label>
                        <textarea
                          id="notes"
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                          rows={3}
                          placeholder="Add any special instructions..."
                        />
                      </div>
                      <Button className="w-full" size="lg">
                        Submit Order for Customer
                      </Button>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="send-confirmation" className="rounded" />
                        <Label htmlFor="send-confirmation" className="text-sm font-normal">
                          Send order confirmation to customer
                        </Label>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}