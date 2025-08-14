"use client"

import { useState, useEffect } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { SizeMatrixGrid } from "@/components/products/size-matrix-grid"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Grid3X3, List, Package, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useCart } from "@/lib/cart-context"
import { getProducts, Product } from "@/lib/mock-data"

// Transform real products to size matrix format
const transformProductsToMatrix = (products: Product[]) => {
  // Filter for products with variants (gloves, apparel with sizes)
  const productsWithVariants = products.filter(p => 
    p.variants && p.variants.length > 0 && 
    (p.name.toLowerCase().includes('glove') || 
     p.name.toLowerCase().includes('shirt') ||
     p.name.toLowerCase().includes('boot') ||
     p.category === 'SMW' ||
     p.category === 'SMM')
  ).slice(0, 8) // Limit to 8 for demo

  return productsWithVariants.map(product => {
    // Group variants by color
    const colorGroups = new Map<string, any[]>()
    
    product.variants?.forEach(variant => {
      const color = variant.color || 'Default'
      if (!colorGroups.has(color)) {
        colorGroups.set(color, [])
      }
      colorGroups.get(color)?.push({
        size: variant.size || 'One Size',
        available: variant.inventory || Math.floor(Math.random() * 150) // Use real inventory or random
      })
    })

    // Convert to our format
    const variants = Array.from(colorGroups.entries()).map(([color, sizes]) => ({
      color,
      colorCode: getColorCode(color),
      sizes: sizes.map(s => ({
        size: s.size,
        available: s.available
      }))
    }))

    // Calculate wholesale price (use pricing tiers if available)
    let wholesalePrice = product.msrp * 0.5 // Default 50% of MSRP
    if (product.pricing?.['tier1']) {
      wholesalePrice = product.pricing['tier1'].price
    }

    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      image: product.images?.[0] || '/placeholder.svg',
      msrp: product.msrp,
      wholesalePrice,
      availableDate: product.orderTypeMetadata?.['at-once']?.expectedRestockDate,
      variants
    }
  })
}

// Helper to get color codes
const getColorCode = (color: string): string => {
  const colorMap: Record<string, string> = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Navy': '#000080',
    'Gray': '#808080',
    'Red': '#FF0000',
    'Blue': '#0000FF',
    'Green': '#008000',
    'Brown': '#8B4513',
    'Orange': '#FFA500',
    'Yellow': '#FFFF00',
    'L': '#4A5568', // Large - use gray
    'M': '#2D3748', // Medium - use darker gray
    'S': '#1A202C', // Small - use darkest gray
    'XL': '#718096', // XL - use light gray
    'Default': '#9CA3AF'
  }
  return colorMap[color] || '#9CA3AF'
}

// Mock products with size/color matrix data (fallback)
const mockProducts = [
  {
    id: "boot-001",
    sku: "BOOT-PREMIUM-16",
    name: "Men's Premium Knee Boot 16\" Black",
    image: "/placeholder.svg",
    msrp: 84.00,
    wholesalePrice: 42.00,
    availableDate: "8/13/2025",
    variants: [
      {
        color: "Black",
        colorCode: "#000000",
        sizes: [
          { size: "6", available: 31 },
          { size: "7", available: 42 },
          { size: "8", available: 0 },
          { size: "9", available: 100 },
          { size: "10", available: 100 },
          { size: "11", available: 42 },
          { size: "12", available: 100 },
          { size: "13", available: 95 },
          { size: "14", available: 22 },
          { size: "15", available: 0 }
        ]
      }
    ]
  },
  {
    id: "boot-002",
    sku: "BOOT-STORM-31",
    name: "Men's Insulated Storm Hip Boot 31\"",
    image: "/placeholder.svg",
    msrp: 105.00,
    wholesalePrice: 52.50,
    availableDate: "8/13/2025",
    variants: [
      {
        color: "Black",
        colorCode: "#000000",
        sizes: [
          { size: "6", available: 76 },
          { size: "7", available: 57 },
          { size: "8", available: 100 },
          { size: "9", available: 100 },
          { size: "10", available: 0 },
          { size: "11", available: 100 },
          { size: "12", available: 87 },
          { size: "13", available: 0 },
          { size: "14", available: 30 }
        ]
      }
    ]
  },
  {
    id: "shirt-001",
    sku: "SHIRT-TECH-LS",
    name: "UA Tech™ Long Sleeve Shirt",
    image: "/placeholder.svg",
    msrp: 35.00,
    wholesalePrice: 17.50,
    variants: [
      {
        color: "Black",
        colorCode: "#000000",
        sizes: [
          { size: "S", available: 120 },
          { size: "M", available: 200 },
          { size: "L", available: 180 },
          { size: "XL", available: 150 },
          { size: "XXL", available: 80 },
          { size: "XXXL", available: 40 }
        ]
      },
      {
        color: "Navy",
        colorCode: "#000080",
        sizes: [
          { size: "S", available: 100 },
          { size: "M", available: 180 },
          { size: "L", available: 200 },
          { size: "XL", available: 120 },
          { size: "XXL", available: 60 },
          { size: "XXXL", available: 30 }
        ]
      },
      {
        color: "Gray",
        colorCode: "#808080",
        sizes: [
          { size: "S", available: 80 },
          { size: "M", available: 150 },
          { size: "L", available: 170 },
          { size: "XL", available: 100 },
          { size: "XXL", available: 50 },
          { size: "XXXL", available: 20 }
        ]
      },
      {
        color: "Red",
        colorCode: "#FF0000",
        sizes: [
          { size: "S", available: 60 },
          { size: "M", available: 100 },
          { size: "L", available: 90 },
          { size: "XL", available: 70 },
          { size: "XXL", available: 30 },
          { size: "XXXL", available: 15 }
        ]
      }
    ]
  },
  {
    id: "jacket-001",
    sku: "JACKET-STORM",
    name: "Storm Fleece Jacket",
    image: "/placeholder.svg",
    msrp: 89.99,
    wholesalePrice: 44.99,
    variants: [
      {
        color: "Black",
        colorCode: "#000000",
        sizes: [
          { size: "XS", available: 50 },
          { size: "S", available: 100 },
          { size: "M", available: 150 },
          { size: "L", available: 120 },
          { size: "XL", available: 80 },
          { size: "XXL", available: 40 }
        ]
      },
      {
        color: "Olive",
        colorCode: "#556B2F",
        sizes: [
          { size: "XS", available: 30 },
          { size: "S", available: 80 },
          { size: "M", available: 120 },
          { size: "L", available: 100 },
          { size: "XL", available: 60 },
          { size: "XXL", available: 30 }
        ]
      }
    ]
  }
]

export default function SizeMatrixPage() {
  const { addToCart } = useCart()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cartItemsCount, setCartItemsCount] = useState(0)
  const [realProducts, setRealProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load real products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getProducts()
        const matrixProducts = transformProductsToMatrix(products)
        setRealProducts(matrixProducts.length > 0 ? matrixProducts : mockProducts)
      } catch (error) {
        console.error('Failed to load products:', error)
        setRealProducts(mockProducts)
      } finally {
        setIsLoading(false)
      }
    }
    loadProducts()
  }, [])

  const handleAddToCart = (items: any[]) => {
    items.forEach(item => {
      addToCart({
        productId: item.productId,
        product: {
          id: item.productId,
          sku: item.sku,
          name: item.name.split(" - ")[0],
          category: "Apparel",
          subcategory: "",
          description: "",
          msrp: item.msrp,
          images: ["/placeholder.svg"],
          pricing: {
            standard: { price: item.unitPrice, minQuantity: 1 }
          }
        },
        variantId: `${item.color}-${item.size}`,
        variant: {
          id: `${item.color}-${item.size}`,
          color: item.color,
          size: item.size,
          sku: item.sku,
          inventory: 100
        },
        quantity: item.quantity,
        unitPrice: item.unitPrice
      })
    })
    
    setCartItemsCount(prev => prev + items.length)
    toast.success(`Added ${items.length} items to cart`)
  }

  const productsToDisplay = realProducts.length > 0 ? realProducts : mockProducts
  
  const filteredProducts = selectedCategory === "all" 
    ? productsToDisplay 
    : productsToDisplay.filter(p => {
        if (selectedCategory === "gloves") return p.name.toLowerCase().includes("glove")
        if (selectedCategory === "apparel") return p.name.toLowerCase().includes("shirt") || p.name.toLowerCase().includes("sock")
        if (selectedCategory === "footwear") return p.name.toLowerCase().includes("boot") || p.name.toLowerCase().includes("wader")
        return true
      })

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Size Matrix Ordering</h1>
            <p className="text-gray-600 mt-1">Quick bulk ordering with size and color grids</p>
          </div>
          
          <div className="flex items-center gap-4">
            {cartItemsCount > 0 && (
              <Badge variant="default" className="px-3 py-1">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {cartItemsCount} items added
              </Badge>
            )}
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList>
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="gloves">FishMonkey Gloves</TabsTrigger>
            <TabsTrigger value="apparel">Apparel & Socks</TabsTrigger>
            <TabsTrigger value="footwear">Boots & Waders</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            {/* Instructions Card */}
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-900 mb-2">How to Use Size Matrix Ordering:</h3>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Enter quantities directly in the size cells</li>
                  <li>• Green numbers show available inventory</li>
                  <li>• Use Copy/Paste buttons to duplicate size runs across colors</li>
                  <li>• Row totals update automatically</li>
                  <li>• Click "Add to Cart" when ready</li>
                </ul>
              </CardContent>
            </Card>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading FishMonkey products...</span>
              </div>
            ) : filteredProducts.length > 0 ? (
              /* Product Grids */
              <div className={cn(
                "space-y-6",
                viewMode === "grid" && "grid grid-cols-1 gap-6 space-y-0"
              )}>
                {filteredProducts.map(product => (
                  <SizeMatrixGrid
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    compactMode={viewMode === "list"}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No products found in this category</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}

// Helper function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}