"use client"

import { useState, useEffect } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Clock, Package, AlertCircle, TrendingDown, Percent, Timer, Zap, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCloseoutCart } from "@/lib/contexts/closeout-cart-context"
import { ORDER_TYPE_COLORS, ORDER_TYPES } from "@/types/order-types"
import { formatCurrency, getCompanyById } from "@/lib/mock-data"
import { useAuth } from "@/lib/contexts/auth-context"
import { toast } from "sonner"
import Link from "next/link"

interface CloseoutProduct {
  id: string
  name: string
  sku: string
  category: string
  subcategory: string
  description: string
  msrp: number
  images: string[]
  variants?: Array<{
    id: string
    color: string
    size: string
    sku: string
    inventory: number
  }>
  pricing: Record<string, { price: number; minQuantity: number }>
  orderTypeMetadata?: {
    closeout?: {
      listId: string
      originalPrice: number
      discountPercent: number
      expiresAt: string | Date
      remainingQuantity: number
      finalSale: boolean
      urgency: 'critical' | 'high' | 'normal'
      reason?: string
    }
  }
}

interface CloseoutList {
  id: string
  name: string
  description: string
  status: string
  expiresAt: Date
  productsCount?: number
}

export default function CloseoutsPage() {
  const [selectedList, setSelectedList] = useState<string | null>(null)
  const [products, setProducts] = useState<CloseoutProduct[]>([])
  const [lists, setLists] = useState<CloseoutList[]>([])
  const [loading, setLoading] = useState(true)
  const [pricingTier, setPricingTier] = useState("tier-1")
  const [sortBy, setSortBy] = useState("discount")
  const [filterUrgency, setFilterUrgency] = useState<string>("all")
  
  const { addToCart, getItemCount, getCartTotal } = useCloseoutCart()
  const { user } = useAuth()

  useEffect(() => {
    loadCompanyAndProducts()
  }, [user])

  useEffect(() => {
    if (selectedList) {
      fetchCloseoutProducts(selectedList)
    }
  }, [selectedList])

  const loadCompanyAndProducts = async () => {
    // Get user's company pricing tier
    if (user?.companyId) {
      const company = await getCompanyById(user.companyId)
      if (company) {
        setPricingTier(company.pricingTier)
      }
    }
    
    // Fetch initial products
    fetchCloseoutProducts()
  }

  const fetchCloseoutProducts = async (listId?: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (listId) params.append("listId", listId)
      if (filterUrgency !== "all") params.append("urgent", "true")
      
      const response = await fetch(`/api/products/closeout?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setProducts(data.products || [])
        setLists(data.lists || [])
        
        // Auto-select first list if none selected
        if (!selectedList && data.lists?.length > 0) {
          setSelectedList(data.lists[0].id)
        }
      } else {
        toast.error(data.error || "Failed to load closeout products")
      }
    } catch (error) {
      console.error("Error fetching closeout products:", error)
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAdd = (product: CloseoutProduct) => {
    const metadata = product.orderTypeMetadata?.closeout
    if (!metadata) return
    
    const firstVariant = product.variants?.[0]
    if (!firstVariant) {
      toast.error("No variants available")
      return
    }
    
    // Use closeout price from metadata
    const closeoutPrice = metadata.originalPrice * (1 - metadata.discountPercent / 100)
    
    addToCart({
      productId: product.id,
      product: product as any,
      variantId: firstVariant.id,
      variant: firstVariant,
      quantity: 1,
      unitPrice: closeoutPrice,
      originalPrice: metadata.originalPrice,
      discountPercent: metadata.discountPercent,
      expiresAt: metadata.expiresAt,
      finalSale: metadata.finalSale,
      metadata: metadata as any
    })
    
    toast.success(`Added ${product.name} to closeout cart (${metadata.discountPercent}% off)`)
  }

  const sortProducts = (products: CloseoutProduct[]) => {
    const sorted = [...products]
    switch (sortBy) {
      case "discount":
        return sorted.sort((a, b) => 
          (b.orderTypeMetadata?.closeout?.discountPercent || 0) - 
          (a.orderTypeMetadata?.closeout?.discountPercent || 0)
        )
      case "expiring":
        return sorted.sort((a, b) => {
          const aDate = new Date(a.orderTypeMetadata?.closeout?.expiresAt || Date.now())
          const bDate = new Date(b.orderTypeMetadata?.closeout?.expiresAt || Date.now())
          return aDate.getTime() - bDate.getTime()
        })
      case "price-low":
        return sorted.sort((a, b) => {
          const aPrice = (a.orderTypeMetadata?.closeout?.originalPrice || 0) * 
            (1 - (a.orderTypeMetadata?.closeout?.discountPercent || 0) / 100)
          const bPrice = (b.orderTypeMetadata?.closeout?.originalPrice || 0) * 
            (1 - (b.orderTypeMetadata?.closeout?.discountPercent || 0) / 100)
          return aPrice - bPrice
        })
      case "quantity":
        return sorted.sort((a, b) => 
          (a.orderTypeMetadata?.closeout?.remainingQuantity || 0) - 
          (b.orderTypeMetadata?.closeout?.remainingQuantity || 0)
        )
      default:
        return sorted
    }
  }

  const getTimeRemaining = (expiresAt: string | Date) => {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diff = expiry.getTime() - now.getTime()
    
    if (diff <= 0) return "Expired"
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days} days`
    if (hours > 0) return `${hours} hours`
    return "< 1 hour"
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      default: return 'text-blue-600 bg-blue-50'
    }
  }

  const filteredProducts = filterUrgency === "all" 
    ? products 
    : products.filter(p => p.orderTypeMetadata?.closeout?.urgency === 'critical')
    
  const sortedProducts = sortProducts(filteredProducts)

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Closeout Deals</h1>
            <p className="text-gray-600 mt-1">
              Limited-time clearance items with deep discounts
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge 
              variant="secondary" 
              className="px-3 py-1"
              style={{ 
                backgroundColor: `${ORDER_TYPE_COLORS[ORDER_TYPES.CLOSEOUT]}20`,
                color: ORDER_TYPE_COLORS[ORDER_TYPES.CLOSEOUT]
              }}
            >
              <Zap className="h-4 w-4 mr-1" />
              {getItemCount()} items • {formatCurrency(getCartTotal())}
            </Badge>
            <Button asChild>
              <Link href="/retailer/closeouts/cart">
                View Cart
              </Link>
            </Button>
          </div>
        </div>

        {/* Urgent Alert */}
        {sortedProducts.some(p => p.orderTypeMetadata?.closeout?.urgency === 'critical') && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Flash Sale Alert!</strong> Some items expire in less than 6 hours. 
              Act fast to secure these deals before they're gone.
            </AlertDescription>
          </Alert>
        )}

        {/* List Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Active Closeout Lists</CardTitle>
            <CardDescription>Select a list to view available products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lists.map((list) => {
                const timeRemaining = getTimeRemaining(list.expiresAt)
                const isExpiringSoon = timeRemaining.includes('hour')
                
                return (
                  <Card 
                    key={list.id}
                    className={`cursor-pointer transition-all ${
                      selectedList === list.id 
                        ? 'ring-2 ring-primary' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedList(list.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{list.name}</h3>
                        {isExpiringSoon && (
                          <Badge variant="destructive" className="text-xs">
                            Ending Soon
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{list.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {list.productsCount || 0} items
                        </span>
                        <span className={`font-medium ${isExpiringSoon ? 'text-red-600' : 'text-gray-600'}`}>
                          <Clock className="h-3 w-3 inline mr-1" />
                          {timeRemaining}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Filters and Sort */}
        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="discount">Highest Discount</SelectItem>
              <SelectItem value="expiring">Expiring Soon</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="quantity">Limited Quantity</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterUrgency} onValueChange={setFilterUrgency}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="critical">Critical Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading closeout deals...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No closeout deals available
              </h3>
              <p className="text-gray-600">
                {selectedList ? 'No products in this list' : 'Select a list to view deals'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => {
              const metadata = product.orderTypeMetadata?.closeout
              if (!metadata) return null
              
              const closeoutPrice = metadata.originalPrice * (1 - metadata.discountPercent / 100)
              const timeRemaining = getTimeRemaining(metadata.expiresAt)
              const isExpiringSoon = timeRemaining.includes('hour')
              
              return (
                <Card key={product.id} className="hover:shadow-lg transition-shadow relative overflow-hidden">
                  {/* Urgency Indicator */}
                  {metadata.urgency === 'critical' && (
                    <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-xs py-1 px-2 text-center z-10">
                      <Zap className="h-3 w-3 inline mr-1" />
                      FLASH DEAL - {timeRemaining} left
                    </div>
                  )}
                  
                  <div className={`aspect-square relative bg-gray-50 ${metadata.urgency === 'critical' ? 'mt-6' : ''}`}>
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Package className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                    <Badge 
                      className="absolute top-2 left-2 text-lg font-bold"
                      variant="destructive"
                    >
                      {metadata.discountPercent}% OFF
                    </Badge>
                    {metadata.finalSale && (
                      <Badge className="absolute top-2 right-2" variant="secondary">
                        Final Sale
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
                    
                    {metadata.reason && (
                      <p className="text-xs text-gray-600 mb-2 italic">
                        {metadata.reason}
                      </p>
                    )}
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-500 line-through">
                            {formatCurrency(metadata.originalPrice)}
                          </p>
                          <p className="font-bold text-lg text-red-600">
                            {formatCurrency(closeoutPrice)}
                          </p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getUrgencyColor(metadata.urgency)}`}
                        >
                          {metadata.remainingQuantity} left
                        </Badge>
                      </div>
                      
                      {!isExpiringSoon && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Timer className="h-3 w-3 mr-1" />
                          Expires in {timeRemaining}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        asChild
                      >
                        <Link href={`/retailer/products/${product.id}`}>
                          View
                        </Link>
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        variant={metadata.urgency === 'critical' ? 'destructive' : 'default'}
                        onClick={() => handleQuickAdd(product)}
                      >
                        {metadata.urgency === 'critical' ? 'Buy Now!' : 'Add to Cart'}
                      </Button>
                    </div>
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
