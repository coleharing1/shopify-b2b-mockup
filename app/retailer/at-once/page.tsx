"use client"

import { useState, useEffect } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Package, Truck, AlertCircle, CheckCircle2, Clock, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAtOnceCart } from "@/lib/contexts/at-once-cart-context"
import { EnhancedProduct, AtOnceMetadata, ORDER_TYPE_COLORS } from "@/types/order-types"
import { toast } from "sonner"
import { formatCurrency, getCompanyById } from "@/lib/mock-data"
import { useAuth } from "@/lib/contexts/auth-context"

export default function AtOncePage() {
  const [products, setProducts] = useState<EnhancedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [pricingTier, setPricingTier] = useState("tier-1")
  const { addToCart, getItemCount } = useAtOnceCart()
  const { user } = useAuth()

  useEffect(() => {
    loadCompanyAndProducts()
  }, [filter, user])

  const loadCompanyAndProducts = async () => {
    // Get user's company pricing tier
    if (user?.companyId) {
      const company = await getCompanyById(user.companyId)
      if (company) {
        setPricingTier(company.pricingTier)
      }
    }
    fetchAtOnceProducts()
  }

  const fetchAtOnceProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter === "evergreen") params.append("evergreen", "true")
      if (filter === "in-stock") params.append("inStock", "true")
      
      const response = await fetch(`/api/products/at-once?${params}`)
      const data = await response.json()
      setProducts(Array.isArray(data.products) ? data.products : [])
    } catch (error) {
      console.error("Error fetching products:", error)
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAdd = (product: EnhancedProduct) => {
    const firstVariant = product.variants?.[0]
    if (!firstVariant) return

    const metadata = product.orderTypeMetadata?.['at-once'] as AtOnceMetadata
    const price = product.pricing[pricingTier]?.price || product.msrp
    
    addToCart({
      productId: product.id,
      product,
      variantId: firstVariant.id,
      variant: firstVariant,
      quantity: 1,
      unitPrice: price,
      metadata
    })
  }

  const getStockStatus = (product: EnhancedProduct) => {
    const metadata = product.orderTypeMetadata?.['at-once'] as AtOnceMetadata
    const stock = metadata?.atsInventory || 0
    
    if (stock === 0) {
      return { label: "Out of Stock", color: "bg-gray-500", icon: <AlertCircle className="h-3 w-3" /> }
    } else if (stock < 50) {
      return { label: `Low Stock (${stock})`, color: "bg-orange-500", icon: <AlertCircle className="h-3 w-3" /> }
    } else {
      return { label: "In Stock", color: "bg-green-500", icon: <CheckCircle2 className="h-3 w-3" /> }
    }
  }

  const sortProducts = (products: EnhancedProduct[]) => {
    const sorted = [...products]
    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case "price-low":
        return sorted.sort((a, b) => (a.pricing[pricingTier]?.price || 0) - (b.pricing[pricingTier]?.price || 0))
      case "price-high":
        return sorted.sort((a, b) => (b.pricing[pricingTier]?.price || 0) - (a.pricing[pricingTier]?.price || 0))
      case "stock":
        return sorted.sort((a, b) => {
          const aStock = (a.orderTypeMetadata?.['at-once'] as AtOnceMetadata)?.atsInventory || 0
          const bStock = (b.orderTypeMetadata?.['at-once'] as AtOnceMetadata)?.atsInventory || 0
          return bStock - aStock
        })
      default:
        return sorted
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Package className={ORDER_TYPE_COLORS['at-once'].text} />
              Ready to Ship - Current Stock
            </h1>
            <p className="text-muted-foreground mt-1">
              Immediate fulfillment from available inventory • Ships within 1-5 business days
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={ORDER_TYPE_COLORS['at-once'].badge + " text-white"}>
              <Truck className="h-3 w-3 mr-1" />
              Fast Shipping
            </Badge>
            <Badge variant="outline">
              {getItemCount()} items in cart
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className={`border-l-4 ${ORDER_TYPE_COLORS['at-once'].border}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Total Available</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">Products ready to ship</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Evergreen Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {products.filter(p => (p.orderTypeMetadata?.['at-once'] as AtOnceMetadata)?.evergreenItem).length}
              </div>
              <p className="text-xs text-muted-foreground">Always in stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {products.filter(p => {
                  const stock = (p.orderTypeMetadata?.['at-once'] as AtOnceMetadata)?.atsInventory || 0
                  return stock > 0 && stock < 50
                }).length}
              </div>
              <p className="text-xs text-muted-foreground">Order soon</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Ship Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {products.filter(p => (p.orderTypeMetadata?.['at-once'] as AtOnceMetadata)?.shipWithin === 1).length}
              </div>
              <p className="text-xs text-muted-foreground">Same-day processing</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Tabs value={filter} onValueChange={setFilter} className="flex-1">
            <TabsList>
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="in-stock">In Stock Only</TabsTrigger>
              <TabsTrigger value="evergreen">
                <TrendingUp className="h-3 w-3 mr-1" />
                Evergreen
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="price-low">Price (Low to High)</SelectItem>
              <SelectItem value="price-high">Price (High to Low)</SelectItem>
              <SelectItem value="stock">Stock Level</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortProducts(products).map(product => {
              const metadata = product.orderTypeMetadata?.['at-once'] as AtOnceMetadata
              const stockStatus = getStockStatus(product)
              const price = product.pricing[pricingTier]?.price || product.msrp
              
              return (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100 relative">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {metadata?.evergreenItem && (
                      <Badge className="absolute top-2 left-2 bg-green-600 text-white">
                        Evergreen
                      </Badge>
                    )}
                    <Badge className={`absolute top-2 right-2 ${stockStatus.color} text-white`}>
                      {stockStatus.icon}
                      <span className="ml-1">{stockStatus.label}</span>
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{product.sku}</CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Ships in {metadata?.shipWithin || 3} business days
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-2xl font-bold">{formatCurrency(price)}</p>
                          <p className="text-xs text-muted-foreground">{pricingTier.replace('-', ' ')} tier pricing</p>
                        </div>
                        {metadata?.quickReorderEligible && (
                          <Badge variant="outline" className="text-xs">
                            Quick Reorder
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {product.variants?.length || 0} variants available
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1"
                          onClick={() => handleQuickAdd(product)}
                          disabled={stockStatus.label === "Out of Stock"}
                        >
                          Quick Add
                        </Button>
                        <Button 
                          variant="outline"
                          className="flex-1"
                          onClick={() => window.location.href = `/retailer/products/${product.id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Quick Reorder Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Reorder</CardTitle>
            <CardDescription>
              Frequently ordered items for fast replenishment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products
                .filter(p => (p.orderTypeMetadata?.['at-once'] as AtOnceMetadata)?.quickReorderEligible)
                .slice(0, 4)
                .map(product => (
                  <Button
                    key={product.id}
                    variant="outline"
                    className="h-auto flex-col p-4"
                    onClick={() => handleQuickAdd(product)}
                  >
                    <Package className="h-8 w-8 mb-2 text-muted-foreground" />
                    <span className="text-xs text-center">{product.name}</span>
                    <span className="text-xs font-bold mt-1">
                      {formatCurrency(product.pricing[pricingTier]?.price || product.msrp)}
                    </span>
                  </Button>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
