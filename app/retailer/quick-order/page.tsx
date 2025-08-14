"use client"

import { useState, useMemo, useEffect } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { QuickOrderCard } from "@/components/products/quick-order-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  SlidersHorizontal, 
  Grid3X3, 
  List, 
  Heart,
  ShoppingCart,
  Package,
  TrendingUp,
  Loader2
} from "lucide-react"
import { toast } from "sonner"
import { useCart } from "@/lib/cart-context"
import { getProducts, Product } from "@/lib/mock-data"

// Transform real products to quick order format
const transformProductsForQuickOrder = (products: Product[]) => {
  return products.map(product => {
    // Calculate wholesale price
    let wholesalePrice = product.msrp * 0.5
    if (product.pricing?.['tier1']) {
      wholesalePrice = product.pricing['tier1'].price
    }

    // Transform variants
    const variants = product.variants?.map(v => ({
      id: v.id || `${product.id}-${v.color}-${v.size}`,
      color: v.color || 'Default',
      colorCode: getColorCode(v.color || 'Default'),
      size: v.size,
      inventory: v.inventory || Math.floor(Math.random() * 100)
    }))

    // Determine tags and flags
    const isNew = Math.random() > 0.7 // 30% chance of being new
    const isTrending = Math.random() > 0.8 // 20% chance of trending
    const discountPercent = product.name.toLowerCase().includes('clearance') || 
                           product.name.toLowerCase().includes('closeout') 
                           ? Math.floor(Math.random() * 30 + 20) // 20-50% off
                           : undefined

    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      category: product.category || 'General',
      images: product.images || ['/placeholder.svg'],
      msrp: product.msrp,
      wholesalePrice,
      variants,
      tags: product.tags || [],
      availableDate: product.orderTypeMetadata?.['at-once']?.expectedRestockDate,
      isNew,
      isTrending,
      discountPercent
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
    'Camo': '#7F8C3A',
    'Default': '#9CA3AF'
  }
  return colorMap[color] || '#9CA3AF'
}

// Mock products data (fallback)
const mockProducts = [
  {
    id: "prod-1",
    sku: "HG-COMP-LS",
    name: "HeatGear® Compression Long Sleeve",
    category: "Men's Shirts",
    images: ["/placeholder.svg"],
    msrp: 35.00,
    wholesalePrice: 17.50,
    variants: [
      { id: "v1", color: "Black", colorCode: "#000000", inventory: 150 },
      { id: "v2", color: "White", colorCode: "#FFFFFF", inventory: 120 },
      { id: "v3", color: "Navy", colorCode: "#000080", inventory: 80 },
      { id: "v4", color: "Red", colorCode: "#FF0000", inventory: 15 }
    ],
    isNew: true,
    isTrending: false,
    tags: ["compression", "training"]
  },
  {
    id: "prod-2",
    sku: "CG-FITTED-MOCK",
    name: "ColdGear® Fitted Mock",
    category: "Men's Shirts",
    images: ["/placeholder.svg"],
    msrp: 55.00,
    wholesalePrice: 27.50,
    variants: [
      { id: "v5", color: "Black", colorCode: "#000000", inventory: 200 },
      { id: "v6", color: "Gray", colorCode: "#808080", inventory: 180 }
    ],
    isNew: false,
    isTrending: true,
    discountPercent: 20,
    tags: ["cold weather", "fitted"]
  },
  {
    id: "prod-3",
    sku: "UA-TECH-ZIP",
    name: "UA Tech™ ½ Zip Long Sleeve",
    category: "Men's Outerwear",
    images: ["/placeholder.svg"],
    msrp: 45.00,
    wholesalePrice: 20.00,
    variants: [
      { id: "v7", color: "Black", colorCode: "#000000", inventory: 100 },
      { id: "v8", color: "Blue", colorCode: "#0000FF", inventory: 90 },
      { id: "v9", color: "Green", colorCode: "#008000", inventory: 8 }
    ],
    availableDate: "8/20/2025",
    tags: ["tech", "training"]
  },
  {
    id: "prod-4",
    sku: "STORM-FLEECE",
    name: "Storm Fleece Gloves",
    category: "Accessories",
    images: ["/placeholder.svg"],
    msrp: 30.00,
    wholesalePrice: 15.00,
    variants: [
      { id: "v10", color: "Black", size: "S", inventory: 50 },
      { id: "v11", color: "Black", size: "M", inventory: 100 },
      { id: "v12", color: "Black", size: "L", inventory: 80 },
      { id: "v13", color: "Black", size: "XL", inventory: 40 }
    ],
    isNew: true,
    tags: ["winter", "gloves"]
  },
  {
    id: "prod-5",
    sku: "RUN-SHORT-7",
    name: "Launch Run 7\" Shorts",
    category: "Men's Bottoms",
    images: ["/placeholder.svg"],
    msrp: 40.00,
    wholesalePrice: 20.00,
    variants: [
      { id: "v14", color: "Black", colorCode: "#000000", inventory: 250 },
      { id: "v15", color: "Navy", colorCode: "#000080", inventory: 200 },
      { id: "v16", color: "Gray", colorCode: "#808080", inventory: 180 }
    ],
    isTrending: true,
    tags: ["running", "shorts"]
  },
  {
    id: "prod-6",
    sku: "TRAIN-TANK",
    name: "Training Tank Top",
    category: "Men's Shirts",
    images: ["/placeholder.svg"],
    msrp: 25.00,
    wholesalePrice: 12.50,
    variants: [
      { id: "v17", color: "White", colorCode: "#FFFFFF", inventory: 300 },
      { id: "v18", color: "Black", colorCode: "#000000", inventory: 280 },
      { id: "v19", color: "Blue", colorCode: "#0000FF", inventory: 150 }
    ],
    discountPercent: 15,
    tags: ["training", "tank"]
  }
]

export default function QuickOrderPage() {
  const { addToCart } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [cartCount, setCartCount] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [realProducts, setRealProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load real products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await getProducts()
        const quickOrderProducts = transformProductsForQuickOrder(products)
        // Take first 20 products for demo
        setRealProducts(quickOrderProducts.slice(0, 20))
      } catch (error) {
        console.error('Failed to load products:', error)
        setRealProducts(mockProducts)
      } finally {
        setIsLoading(false)
      }
    }
    loadProducts()
  }, [])

  // Filter products
  const filteredProducts = useMemo(() => {
    const productsToFilter = realProducts.length > 0 ? realProducts : mockProducts
    let filtered = [...productsToFilter]
    
    // Category filter
    if (selectedCategory !== "all") {
      if (selectedCategory === "new") {
        filtered = filtered.filter(p => p.isNew)
      } else if (selectedCategory === "trending") {
        filtered = filtered.filter(p => p.isTrending)
      } else if (selectedCategory === "sale") {
        filtered = filtered.filter(p => p.discountPercent)
      } else if (selectedCategory === "gloves") {
        filtered = filtered.filter(p => p.name.toLowerCase().includes("glove"))
      }
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.tags?.some((tag: string) => tag.toLowerCase().includes(query))
      )
    }
    
    return filtered
  }, [searchQuery, selectedCategory, realProducts])

  const handleQuickAdd = (product: any, quantity: number, variant?: any) => {
    // Add to cart logic
    const cartItem = {
      productId: product.id,
      product: {
        ...product,
        subcategory: "",
        description: "",
        pricing: {
          standard: { price: product.wholesalePrice, minQuantity: 1 }
        }
      },
      variantId: variant?.id || "default",
      variant: variant || {
        id: "default",
        color: "Default",
        size: "",
        sku: product.sku,
        inventory: 100
      },
      quantity,
      unitPrice: product.wholesalePrice
    }
    
    addToCart(cartItem)
    setCartCount(prev => prev + quantity)
  }

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
        toast.info("Removed from favorites")
      } else {
        newFavorites.add(productId)
        toast.success("Added to favorites")
      }
      return newFavorites
    })
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quick Order</h1>
            <p className="text-gray-600 mt-1">Add products to cart directly from the grid</p>
          </div>
          
          <div className="flex items-center gap-4">
            {cartCount > 0 && (
              <Badge variant="default" className="px-3 py-1 text-sm">
                <ShoppingCart className="w-4 h-4 mr-2" />
                {cartCount} items in cart
              </Badge>
            )}
            
            {favorites.size > 0 && (
              <Badge variant="outline" className="px-3 py-1 text-sm">
                <Heart className="w-4 h-4 mr-2" />
                {favorites.size} favorites
              </Badge>
            )}
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search products, SKUs, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList>
            <TabsTrigger value="all">
              All Products
              <Badge variant="secondary" className="ml-2">
                {filteredProducts.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="gloves">
              FishMonkey Gloves
            </TabsTrigger>
            <TabsTrigger value="new">
              <Package className="w-4 h-4 mr-2" />
              New Arrivals
            </TabsTrigger>
            <TabsTrigger value="trending">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="sale">
              Sale Items
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            {/* Products Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading FishMonkey products...</span>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className={cn(
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              )}>
                {filteredProducts.map(product => (
                  <QuickOrderCard
                    key={product.id}
                    product={product}
                    onQuickAdd={handleQuickAdd}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={favorites.has(product.id)}
                    compactMode={viewMode === "list"}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No products found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                >
                  Clear Filters
                </Button>
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