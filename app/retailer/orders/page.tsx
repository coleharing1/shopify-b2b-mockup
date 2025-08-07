"use client"

import { useEffect, useState } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Download, 
  Eye, 
  RefreshCw,
  Package,
  Truck,
  CheckCircle,
  Clock,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Order, getOrdersByCompanyId, formatCurrency, formatDate } from "@/lib/mock-data"
import { useCart, CartItem } from "@/lib/cart-context"
import { useAuth } from "@/lib/contexts/auth-context"
import { toast } from "sonner"

/**
 * @description Order history page with search and filters
 * @fileoverview Displays past orders with status tracking and reorder functionality
 */
export default function OrderHistoryPage() {
  const { user } = useAuth()
  const { addToCart } = useCart()

  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showReorderSuccess, setShowReorderSuccess] = useState(false)

  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.companyId) {
        setIsLoading(false)
        return
      }
      
      try {
        const ordersData = await getOrdersByCompanyId(user.companyId)
        setOrders(ordersData)
        setFilteredOrders(ordersData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading orders:", error)
        setIsLoading(false)
      }
    }

    loadOrders()
  }, [user])

  useEffect(() => {
    let filtered = [...orders]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      shipped: <Truck className="h-4 w-4" />,
      delivered: <CheckCircle className="h-4 w-4" />,
      cancelled: <Package className="h-4 w-4" />
    }
    return icons[status as keyof typeof icons] || <Package className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      shipped: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const handleReorder = async (order: Order) => {
    // Add all items from the order to the cart
    if (order.items && order.items.length > 0) {
      let itemsAdded = 0
      
      order.items.forEach(item => {
        // Create a proper CartItem from the order item
        const unitPrice = item.lineTotal / item.quantity
        const cartItem: CartItem = {
          productId: item.sku || `product-${Date.now()}-${Math.random()}`,
          product: {
            id: item.sku || `product-${Date.now()}-${Math.random()}`,
            sku: item.sku || '',
            name: item.name,
            category: 'Reorder',
            subcategory: '',
            description: '',
            msrp: unitPrice,
            images: ['/placeholder.svg'],
            pricing: {
              tier1: { price: unitPrice, minQuantity: 1 },
              tier2: { price: unitPrice, minQuantity: 1 },
              tier3: { price: unitPrice, minQuantity: 1 }
            }
          },
          variantId: `variant-${Date.now()}-${Math.random()}`,
          variant: {
            id: `variant-${Date.now()}-${Math.random()}`,
            color: '',
            size: '',
            inventory: 100,
            sku: item.sku || ''
          },
          quantity: item.quantity,
          unitPrice: unitPrice
        }
        
        addToCart(cartItem)
        itemsAdded++
      })
      
      // Show success toast
      toast.success("Items Added to Cart", {
        description: `Successfully added ${itemsAdded} item${itemsAdded > 1 ? 's' : ''} from order #${order.id} to your cart.`,
      })
      
      setShowReorderSuccess(true)
      setTimeout(() => setShowReorderSuccess(false), 3000)
    } else {
      toast.error("No Items to Reorder", {
        description: "This order doesn't contain any items to reorder.",
      })
    }
  }

  const handleDownloadInvoice = (orderId: string) => {
    // Mock invoice download - in production would generate PDF
    toast.success(`Invoice for order ${orderId} would be downloaded here.`)
  }

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search by order # or PO number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        {showReorderSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
            ✓ Items added to cart successfully
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const isExpanded = expandedOrders.includes(order.id)
              
              return (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    {/* Order Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600">
                            PO: {order.poNumber}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-lg">{formatCurrency(order.total)}</p>
                        <p className="text-sm text-gray-600">{formatDate(order.orderDate)}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleOrderExpanded(order.id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {isExpanded ? "Hide" : "View"} Details
                        {isExpanded ? (
                          <ChevronUp className="ml-2 h-4 w-4" />
                        ) : (
                          <ChevronDown className="ml-2 h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReorder(order)}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reorder
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadInvoice(order.id)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Invoice
                      </Button>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && order.items && (
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-medium mb-3">Order Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <div className="flex-1">
                                <p className="font-medium">{item.name}</p>
                                {item.sku && (
                                  <p className="text-gray-600">SKU: {item.sku}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p>Qty: {item.quantity}</p>
                                <p className="font-medium">{formatCurrency(item.lineTotal)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {order.requestedShipDate && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Requested Ship Date:</span> {formatDate(order.requestedShipDate)}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}