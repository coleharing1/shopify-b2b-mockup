"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { VariantSelector } from "@/components/features/variant-selector"
import { QuantityMatrix } from "@/components/features/quantity-matrix"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ShoppingCart, 
  ArrowLeft, 
  Package, 
  Shield, 
  Truck,
  ChevronLeft,
  ChevronRight 
} from "lucide-react"
import Link from "next/link"
import { Product, getCompanyById, formatCurrency } from "@/lib/mock-data"
import { useCart } from "@/lib/cart-context"

/**
 * @description Product detail page with variants and bulk ordering
 * @fileoverview Displays full product info with B2B ordering features
 */
export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<{
    id: string
    color: string
    size: string
    inventory: number
    sku: string
    weight?: string
  } | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [pricingTier, setPricingTier] = useState("tier-1")
  const [isLoading, setIsLoading] = useState(true)
  const [orderMode, setOrderMode] = useState<"single" | "matrix">("single")
  const [showAddedMessage, setShowAddedMessage] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        // Get company pricing tier
        const company = await getCompanyById("company-1")
        if (company) {
          setPricingTier(company.pricingTier)
        }

        // Load products and find the one we need
        const response = await fetch("/mockdata/products.json")
        const data = await response.json()
        const foundProduct = data.products.find((p: Product) => p.id === params.id)
        
        if (foundProduct) {
          setProduct(foundProduct)
          // Select first available variant
          if (foundProduct.variants && foundProduct.variants.length > 0) {
            setSelectedVariant(foundProduct.variants[0])
          }
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading product:", error)
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  const handleQuantityChange = (variantId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [variantId]: quantity
    }))
  }

  const handleAddToCart = () => {
    if (!product) return

    if (orderMode === "single" && selectedVariant) {
      const quantity = quantities[selectedVariant.id] || 1
      const tierPrice = product.pricing[pricingTier].price
      
      addToCart({
        productId: product.id,
        product: product,
        variantId: selectedVariant.id,
        variant: selectedVariant,
        quantity: quantity,
        unitPrice: tierPrice
      })
      
      setShowAddedMessage(true)
      setTimeout(() => setShowAddedMessage(false), 3000)
    } else {
      // Add all quantities from matrix
      const tierPrice = product.pricing[pricingTier].price
      Object.entries(quantities)
        .filter(([, qty]) => qty > 0)
        .forEach(([variantId, qty]) => {
          const variant = product.variants?.find(v => v.id === variantId)
          if (variant) {
            addToCart({
              productId: product.id,
              product: product,
              variantId: variantId,
              variant: variant,
              quantity: qty,
              unitPrice: tierPrice
            })
          }
        })
      
      setShowAddedMessage(true)
      setTimeout(() => setShowAddedMessage(false), 3000)
    }
  }

  const getTotalQuantity = () => {
    return Object.values(quantities).reduce((sum, q) => sum + q, 0)
  }

  const getTotalPrice = () => {
    if (!product) return 0
    const tierPrice = product.pricing[pricingTier].price
    return getTotalQuantity() * tierPrice
  }

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading product...</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!product) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Product not found</p>
            <Button variant="outline" onClick={() => router.push("/retailer/products")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalog
            </Button>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  const tierPricing = product.pricing[pricingTier]
  const images = product.images.length > 0 ? product.images : ["/api/placeholder/600/600"]

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-600">
          <Link href="/retailer/products" className="hover:text-primary">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden bg-gray-100 rounded-lg">
              <Image
                src={images[currentImageIndex]}
                alt={product.name}
                width={600}
                height={600}
                className="object-cover w-full h-full"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === 0 ? images.length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === images.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-gray-600 mt-2">SKU: {product.sku}</p>
            </div>

            {/* Pricing */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatCurrency(tierPricing.price)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      MSRP {formatCurrency(product.msrp)}
                    </span>
                  </div>
                  <p className="text-green-600 font-medium">
                    You save {formatCurrency(product.msrp - tierPricing.price)} ({((1 - tierPricing.price / product.msrp) * 100).toFixed(0)}%)
                  </p>
                  <p className="text-sm text-gray-600">
                    Your {pricingTier.replace('-', ' ').toUpperCase()} pricing
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Mode Toggle */}
            {product.variants && product.variants.length > 1 && (
              <div className="flex gap-2">
                <Button
                  variant={orderMode === "single" ? "default" : "outline"}
                  onClick={() => setOrderMode("single")}
                  className="flex-1"
                >
                  Single Variant
                </Button>
                <Button
                  variant={orderMode === "matrix" ? "default" : "outline"}
                  onClick={() => setOrderMode("matrix")}
                  className="flex-1"
                >
                  Bulk Matrix
                </Button>
              </div>
            )}

            {/* Single Variant Ordering */}
            {orderMode === "single" && product.variants && (
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-3 block">Select Variant</Label>
                  <VariantSelector
                    variants={product.variants}
                    selectedVariant={selectedVariant}
                    onVariantSelect={setSelectedVariant}
                  />
                </div>

                {selectedVariant && (
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <div className="flex gap-4">
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max={selectedVariant.inventory}
                        value={quantities[selectedVariant.id] || 1}
                        onChange={(e) => handleQuantityChange(
                          selectedVariant.id, 
                          parseInt(e.target.value) || 1
                        )}
                        className="w-24"
                      />
                      <span className="text-sm text-gray-600 self-center">
                        {selectedVariant.inventory} available
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-3">
              <Button 
                size="lg" 
                className="w-full"
                onClick={handleAddToCart}
                disabled={orderMode === "single" && !selectedVariant}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
                {getTotalQuantity() > 0 && (
                  <span className="ml-2">
                    ({getTotalQuantity()} items • {formatCurrency(getTotalPrice())})
                  </span>
                )}
              </Button>
              
              {showAddedMessage && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-md text-sm text-center">
                  ✓ Added to cart successfully
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">Secure Checkout</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Package className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Matrix Ordering */}
        {orderMode === "matrix" && product.variants && (
          <QuantityMatrix
            variants={product.variants}
            quantities={quantities}
            onQuantityChange={handleQuantityChange}
          />
        )}

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mt-8">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-4">
            <Card>
              <CardContent className="p-6 prose prose-sm max-w-none">
                <p>{product.description}</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="features" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-2">
                  {product.features ? (
                    product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))
                  ) : (
                    <li>Premium quality construction</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shipping" className="mt-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Shipping Information</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Free shipping on orders over $2,500</li>
                    <li>• Standard delivery: 5-7 business days</li>
                    <li>• Express delivery: 2-3 business days</li>
                    <li>• Ships from multiple warehouses</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Return Policy</h4>
                  <p className="text-sm text-gray-600">
                    30-day return policy for unused items in original packaging. 
                    Contact your sales representative for RMA authorization.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}