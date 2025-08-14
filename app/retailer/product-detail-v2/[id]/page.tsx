"use client"

/**
 * @fileoverview Enhanced product detail page inspired by Under Armour and B2B platforms
 * @description Professional product detail with size matrices, bulk ordering, and technical specs
 */

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Plus, 
  Minus,
  Star,
  TrendingUp,
  Package,
  Truck,
  Shield,
  Info
} from "lucide-react"
import { getProducts, Product } from "@/lib/mock-data"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface ProductVariant {
  id: string
  color: string
  size: string
  sku: string
  inventory: number
  price: number
  wholesalePrice: number
}

interface ExtendedProduct extends Product {
  variants: ProductVariant[]
  specifications: Record<string, string>
  features: string[]
  careInstructions: string[]
  wholesalePrice: number
  msrp: number
  margin: number
  minimumOrder: number
  packSize: number
}

export default function ProductDetailV2() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()

  const [product, setProduct] = useState<ExtendedProduct | null>(null)
  const [selectedColor, setSelectedColor] = useState("")
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [orderMode, setOrderMode] = useState<'single' | 'matrix'>('single')

  // Mock data enhancement
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true)
        const products = await getProducts()
        const baseProduct = products.find(p => p.id === params.id)
        
        if (!baseProduct) {
          router.push('/retailer/products')
          return
        }

        // Enhance with B2B data
        const enhanced: ExtendedProduct = {
          ...baseProduct,
          variants: [
            {
              id: '1',
              color: 'Castle Rock/Black',
              size: 'XS',
              sku: '1365972-025-XS',
              inventory: 50,
              price: baseProduct.msrp,
              wholesalePrice: baseProduct.msrp * 0.6
            },
            {
              id: '2',
              color: 'Castle Rock/Black',
              size: 'SM',
              sku: '1365972-025-SM',
              inventory: 100,
              price: baseProduct.msrp,
              wholesalePrice: baseProduct.msrp * 0.6
            },
            {
              id: '3',
              color: 'Castle Rock/Black',
              size: 'MD',
              sku: '1365972-025-MD',
              inventory: 75,
              price: baseProduct.msrp,
              wholesalePrice: baseProduct.msrp * 0.6
            },
            {
              id: '4',
              color: 'Castle Rock/Black',
              size: 'LG',
              sku: '1365972-025-LG',
              inventory: 120,
              price: baseProduct.msrp,
              wholesalePrice: baseProduct.msrp * 0.6
            },
            {
              id: '5',
              color: 'Castle Rock/Black',
              size: 'XL',
              sku: '1365972-025-XL',
              inventory: 90,
              price: baseProduct.msrp,
              wholesalePrice: baseProduct.msrp * 0.6
            },
            {
              id: '6',
              color: 'Black/Black',
              size: 'XS',
              sku: '1365972-001-XS',
              inventory: 30,
              price: baseProduct.msrp,
              wholesalePrice: baseProduct.msrp * 0.6
            },
            {
              id: '7',
              color: 'Black/Black',
              size: 'SM',
              sku: '1365972-001-SM',
              inventory: 85,
              price: baseProduct.msrp,
              wholesalePrice: baseProduct.msrp * 0.6
            },
            {
              id: '8',
              color: 'Black/Black',
              size: 'MD',
              sku: '1365972-001-MD',
              inventory: 65,
              price: baseProduct.msrp,
              wholesalePrice: baseProduct.msrp * 0.6
            }
          ],
          specifications: {
            'Material': 'Extra soft Speedpocket™ fleece placed on back of thumb',
            'Care': 'Tumble dry low',
            'Technology': 'Tech Touch on thumbs & index fingers',
            'Fit': 'Fitted',
            'Origin': 'Imported'
          },
          features: [
            'Extra soft Speedpocket™ fleece placed on back of thumb',
            'Tumble dry low',
            'Do not use softeners',
            'Tech Touch on thumbs & index fingers so you can use touch'
          ],
          careInstructions: [
            'Machine wash cold',
            'Do not bleach',
            'Tumble dry low',
            'Do not iron',
            'Do not dry clean'
          ],
          wholesalePrice: baseProduct.msrp * 0.6,
          msrp: baseProduct.msrp,
          margin: 40,
          minimumOrder: 6,
          packSize: 12
        }

        setProduct(enhanced)
        setSelectedColor(enhanced.variants[0]?.color || '')
      } catch (error) {
        console.error('Error loading product:', error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [params.id, router, toast])

  const availableColors = product?.variants 
    ? [...new Set(product.variants.map(v => v.color))]
    : []

  const currentVariants = product?.variants.filter(v => v.color === selectedColor) || []

  const updateQuantity = (variantId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[variantId] || 0
      const newQuantity = Math.max(0, current + delta)
      return { ...prev, [variantId]: newQuantity }
    })
  }

  const setQuantity = (variantId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [variantId]: Math.max(0, quantity)
    }))
  }

  const getTotalQuantity = () => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  }

  const getTotalPrice = () => {
    return Object.entries(quantities).reduce((total, [variantId, qty]) => {
      const variant = product?.variants.find(v => v.id === variantId)
      return total + (variant?.wholesalePrice || 0) * qty
    }, 0)
  }

  const handleAddToCart = () => {
    if (!product) return

    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([variantId, qty]) => {
        const variant = product.variants.find(v => v.id === variantId)!
        const baseProduct = { ...product } as any
        return {
          productId: product.id,
          product: baseProduct,
          variantId: variant.id,
          variant: {
            id: variant.id,
            color: variant.color,
            size: variant.size,
            inventory: variant.inventory,
            sku: variant.sku
          },
          quantity: qty,
          unitPrice: variant.wholesalePrice
        }
      })

    items.forEach(item => addToCart(item))

    toast({
      title: "Added to cart",
      description: `${items.length} item(s) added to your cart`,
    })

    // Reset quantities
    setQuantities({})
  }

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">Loading product details...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!product) {
    return (
      <AuthenticatedLayout>
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Product not found</h3>
          <Button onClick={() => router.push('/retailer/products')}>
            Back to Products
          </Button>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <span>/</span>
          <span>Products</span>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={product.images?.[0] || '/placeholder.svg'}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Thumbnail gallery would go here */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-gray-100 rounded border cursor-pointer hover:border-blue-500">
                  <Image
                    src={product.images?.[0] || '/placeholder.svg'}
                    alt={`${product.name} view ${i}`}
                    width={120}
                    height={120}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Badge>{product.category}</Badge>
                <Badge variant="secondary">SKU: {product.sku}</Badge>
              </div>

              <p className="text-gray-600 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Pricing */}
              <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-900">
                    ${product.wholesalePrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    MSRP ${product.msrp.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-green-600 font-medium">
                  {product.margin}% margin • Minimum order: {product.minimumOrder} units
                </div>
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <Label className="text-base font-medium mb-3 block">
                Color: {selectedColor}
              </Label>
              <div className="flex gap-2">
                {availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`
                      px-4 py-2 rounded-lg border text-sm font-medium transition-all
                      ${selectedColor === color 
                        ? 'border-blue-500 bg-blue-50 text-blue-900' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={orderMode === 'single' ? 'default' : 'outline'}
                onClick={() => setOrderMode('single')}
                size="sm"
              >
                Single Size
              </Button>
              <Button
                variant={orderMode === 'matrix' ? 'default' : 'outline'}
                onClick={() => setOrderMode('matrix')}
                size="sm"
              >
                Size Matrix
              </Button>
            </div>

            {/* Size and Quantity Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Size & Quantity</CardTitle>
              </CardHeader>
              <CardContent>
                {orderMode === 'matrix' ? (
                  <div className="space-y-4">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Size</TableHead>
                          <TableHead>SKU</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead className="text-center">Quantity</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentVariants.map(variant => (
                          <TableRow key={variant.id}>
                            <TableCell className="font-medium">{variant.size}</TableCell>
                            <TableCell className="text-sm text-gray-600">{variant.sku}</TableCell>
                            <TableCell>
                              <Badge variant={variant.inventory > 50 ? 'default' : 'secondary'}>
                                {variant.inventory}
                              </Badge>
                            </TableCell>
                            <TableCell>${variant.wholesalePrice.toFixed(2)}</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(variant.id, -1)}
                                  disabled={(quantities[variant.id] || 0) === 0}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={quantities[variant.id] || 0}
                                  onChange={(e) => setQuantity(variant.id, parseInt(e.target.value) || 0)}
                                  className="w-16 text-center"
                                  min="0"
                                  max={variant.inventory}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(variant.id, 1)}
                                  disabled={(quantities[variant.id] || 0) >= variant.inventory}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">Select a size to order individually</p>
                    <div className="grid grid-cols-5 gap-2">
                      {currentVariants.map(variant => (
                        <button
                          key={variant.id}
                          className="p-3 border rounded-lg text-center hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <div className="font-medium">{variant.size}</div>
                          <div className="text-xs text-gray-500">{variant.inventory}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            {getTotalQuantity() > 0 && (
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Total Quantity:</span>
                    <span className="font-bold">{getTotalQuantity()} units</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Total Price:</span>
                    <span className="font-bold text-green-700">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <Button onClick={handleAddToCart} className="w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Shipping Info */}
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="h-4 w-4 text-blue-500" />
                <span>Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-green-500" />
                <span>30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="details" className="mt-12">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Product Details</TabsTrigger>
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="care">Care Instructions</TabsTrigger>
            <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold mb-4">Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specs" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="care" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <ul className="space-y-2">
                  {product.careInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Standard Shipping</h4>
                      <p className="text-sm text-gray-600 mb-2">3-5 business days</p>
                      <p className="text-sm">$12.50 (Free on orders over $100)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Express Shipping</h4>
                      <p className="text-sm text-gray-600 mb-2">1-2 business days</p>
                      <p className="text-sm">$25.00</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}
