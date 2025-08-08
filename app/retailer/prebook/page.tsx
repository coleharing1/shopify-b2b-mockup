"use client"

import { useState, useEffect } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Calendar, Clock, Package, AlertCircle, TrendingUp, ChevronRight, Info, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePrebookCart } from "@/lib/contexts/prebook-cart-context"
import { ORDER_TYPE_COLORS, ORDER_TYPES, type Season } from "@/types/order-types"
import { formatCurrency, getCompanyById } from "@/lib/mock-data"
import { useAuth } from "@/lib/contexts/auth-context"
import { toast } from "sonner"
import Link from "next/link"
import { CatalogBadge } from "@/components/features/catalog-badge"
import { loadPriceListForCompany, getProductVolumeBreaks } from "@/lib/pricing-helpers"

interface PrebookProduct {
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
    prebook?: {
      season: string
      collection: string
      deliveryWindow: {
        start: string | Date
        end: string | Date
      }
      depositPercent: number
      minimumUnits: number
      requiresFullSizeRun?: boolean
    }
  }
}

export default function PrebookPage() {
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null)
  const [products, setProducts] = useState<PrebookProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [pricingTier, setPricingTier] = useState("tier-1")
  const [sortBy, setSortBy] = useState("name")
  const [availableSeasons, setAvailableSeasons] = useState<string[]>([])
  const [catalogInfo, setCatalogInfo] = useState<any>(null)
  const [priceList, setPriceList] = useState<any>(null)
  
  const { addToCart, getSeasonGroups, getDepositAmount, getItemCount } = usePrebookCart()
  const { user } = useAuth()
  const seasonGroups = getSeasonGroups()

  useEffect(() => {
    loadCompanyAndProducts()
  }, [user])

  useEffect(() => {
    if (selectedSeason) {
      fetchPrebookProducts(selectedSeason)
    }
  }, [selectedSeason])

  const loadCompanyAndProducts = async () => {
    // Get user's company pricing tier
    const companyId = user?.companyId || "company-1"
    const company = await getCompanyById(companyId)
    if (company) {
      setPricingTier(company.pricingTier)
    }
    
    // Load price list for volume pricing
    const companyPriceList = await loadPriceListForCompany(companyId)
    setPriceList(companyPriceList)
    
    // Fetch initial products
    fetchPrebookProducts()
  }

  const fetchPrebookProducts = async (season?: string) => {
    try {
      setLoading(true)
      
      // Try to fetch via catalog API first for filtering
      try {
        const catalogResponse = await fetch('/api/catalogs')
        if (catalogResponse.ok) {
          const catalogData = await catalogResponse.json()
          setCatalogInfo(catalogData.catalog)
          
          // Filter products to only prebook eligible
          const prebookProducts = catalogData.products.filter((p: any) => 
            p.orderTypes?.includes('prebook')
          )
          
          // Apply season filter if specified
          let filtered = prebookProducts
          if (season) {
            filtered = filtered.filter((p: any) => 
              p.orderTypeMetadata?.prebook?.season === season
            )
          }
          
          setProducts(filtered)
          
          // Extract available seasons
          const seasons = [...new Set(prebookProducts.map((p: any) => 
            p.orderTypeMetadata?.prebook?.season
          ).filter(Boolean))]
          setAvailableSeasons(seasons as string[])
          
          if (!selectedSeason && seasons.length > 0) {
            setSelectedSeason(seasons[0] as string)
          }
          
          return
        }
      } catch (catalogError) {
        console.warn('Catalog API failed, falling back to direct API:', catalogError)
      }
      
      // Fallback to direct prebook API
      const params = new URLSearchParams()
      if (season) params.append("season", season)
      
      const response = await fetch(`/api/products/prebook?${params}`)
      const data = await response.json()
      
      if (response.ok) {
        setProducts(data.products || [])
        
        if (data.filters?.seasons) {
          setAvailableSeasons(data.filters.seasons)
          if (!selectedSeason && data.filters.seasons.length > 0) {
            setSelectedSeason(data.filters.seasons[0])
          }
        }
      } else {
        toast.error(data.error || "Failed to load prebook products")
      }
    } catch (error) {
      console.error("Error fetching prebook products:", error)
      toast.error("Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAdd = (product: PrebookProduct) => {
    const metadata = product.orderTypeMetadata?.prebook
    if (!metadata) return
    
    const firstVariant = product.variants?.[0]
    if (!firstVariant) {
      toast.error("No variants available")
      return
    }
    
    // Check for volume pricing and minimum units
    const minUnits = metadata.minimumUnits || 1
    const volumeBreaks = getProductVolumeBreaks(product.id, priceList)
    let price = product.pricing[pricingTier]?.price || product.msrp
    
    // Apply volume break based on minimum units
    if (volumeBreaks.length > 0) {
      const applicableBreak = [...volumeBreaks]
        .sort((a, b) => b.minQty - a.minQty)
        .find(vb => minUnits >= vb.minQty)
      if (applicableBreak) {
        price = product.msrp * (1 - applicableBreak.discount)
      }
    }
    
    addToCart({
      productId: product.id,
      product: product as any,
      variantId: firstVariant.id,
      variant: firstVariant,
      quantity: minUnits,
      unitPrice: price,
      season: metadata.season,
      deliveryWindow: {
        start: new Date(metadata.deliveryWindow.start),
        end: new Date(metadata.deliveryWindow.end),
      },
      metadata: metadata as any
    })
    
    toast.success(`Added ${product.name} to prebook cart (Min: ${minUnits} units)`)
  }

  const sortProducts = (products: PrebookProduct[]) => {
    const sorted = [...products]
    switch (sortBy) {
      case "name":
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case "price-low":
        return sorted.sort((a, b) => 
          (a.pricing[pricingTier]?.price || 0) - (b.pricing[pricingTier]?.price || 0)
        )
      case "price-high":
        return sorted.sort((a, b) => 
          (b.pricing[pricingTier]?.price || 0) - (a.pricing[pricingTier]?.price || 0)
        )
      case "delivery":
        return sorted.sort((a, b) => {
          const aDate = new Date(a.orderTypeMetadata?.prebook?.deliveryWindow.start || 0)
          const bDate = new Date(b.orderTypeMetadata?.prebook?.deliveryWindow.start || 0)
          return aDate.getTime() - bDate.getTime()
        })
      default:
        return sorted
    }
  }

  const formatDeliveryWindow = (window: { start: string | Date; end: string | Date }) => {
    const start = new Date(window.start)
    const end = new Date(window.end)
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
  }

  const sortedProducts = sortProducts(products)

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prebook Orders</h1>
            <p className="text-gray-600 mt-1">
              Order future seasons in advance with special pricing
            </p>
            {catalogInfo && (
              <div className="mt-2">
                <CatalogBadge 
                  catalogName={catalogInfo.name}
                  features={catalogInfo.features}
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Badge 
              variant="secondary" 
              className="px-3 py-1"
              style={{ 
                backgroundColor: `${ORDER_TYPE_COLORS[ORDER_TYPES.PREBOOK].primary}20`,
                color: ORDER_TYPE_COLORS[ORDER_TYPES.PREBOOK].primary
              }}
            >
              <Calendar className="h-4 w-4 mr-1" />
              {getItemCount()} items in cart
            </Badge>
            <Button asChild>
              <Link href="/retailer/prebook/cart">
                View Cart ({formatCurrency(getDepositAmount())})
              </Link>
            </Button>
          </div>
        </div>

        {/* Season Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Season</CardTitle>
            <CardDescription>Choose which season's collection to browse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {availableSeasons.map((season) => (
                <Button
                  key={season}
                  variant={selectedSeason === season ? "default" : "outline"}
                  onClick={() => setSelectedSeason(season)}
                >
                  {season}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Prebook Benefits:</strong> Secure inventory for future seasons, 
            lock in special pricing, and pay only a {products[0]?.orderTypeMetadata?.prebook?.depositPercent || 30}% deposit now.
            Modifications allowed until cancellation deadline.
          </AlertDescription>
        </Alert>

        {/* Filters and Sort */}
        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="delivery">Delivery Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading prebook products...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products available for this season
              </h3>
              <p className="text-gray-600">
                {selectedSeason ? `Check back later for ${selectedSeason} products` : 'Select a season to view products'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => {
              const metadata = product.orderTypeMetadata?.prebook
              const price = product.pricing[pricingTier]?.price || product.msrp
              const depositAmount = price * (metadata?.depositPercent || 30) / 100
              
              return (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative bg-gray-50">
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
                    {metadata?.collection && (
                      <Badge className="absolute top-2 right-2">
                        {metadata.collection}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{product.sku}</p>
                    
                    {metadata && (
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center text-xs text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          Delivery: {formatDeliveryWindow(metadata.deliveryWindow)}
                        </div>
                        {metadata.minimumUnits > 1 && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Package className="h-3 w-3 mr-1" />
                            Min order: {metadata.minimumUnits} units
                          </div>
                        )}
                        {metadata.requiresFullSizeRun && (
                          <Badge variant="secondary" className="text-xs">
                            Full size run required
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-bold text-lg">{formatCurrency(price)}</p>
                        <p className="text-xs text-gray-500">
                          Deposit: {formatCurrency(depositAmount)}
                        </p>
                        {(() => {
                          const volumeBreaks = getProductVolumeBreaks(product.id, priceList)
                          if (volumeBreaks.length > 0) {
                            const maxDiscount = Math.max(...volumeBreaks.map(vb => vb.discount))
                            return (
                              <p className="text-xs text-green-600">
                                Up to {(maxDiscount * 100).toFixed(0)}% off with volume
                              </p>
                            )
                          }
                          return null
                        })()}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {metadata?.depositPercent || 30}% down
                      </Badge>
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
                        onClick={() => handleQuickAdd(product)}
                      >
                        Add to Cart
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