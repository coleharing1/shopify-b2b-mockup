"use client"

/**
 * @fileoverview Enhanced product catalog inspired by Under Armour and LaCrosse B2B platforms
 * @description Modern B2B product grid with advanced filtering, size matrices, and wholesale pricing
 */

import { useEffect, useState, useMemo } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Heart,
  ShoppingCart,
  Package,
  Zap,
  Star,
  TrendingUp,
  ArrowUpDown
} from "lucide-react"
import { getProducts, Product } from "@/lib/mock-data"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface ProductWithMetrics extends Product {
  salesVelocity?: number
  trending?: boolean
  bestseller?: boolean
  wholesalePrice?: number
  margin?: number
}

export default function ProductCatalogV2() {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [products, setProducts] = useState<ProductWithMetrics[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(true)

  // Filter options derived from products
  const filterOptions = useMemo(() => {
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))]
    const brands: string[] = [] // Products don't have brand field
    const colors = [...new Set(products.flatMap(p => p.variants?.map(v => v.color) || []).filter(Boolean))]
    
    return { categories, brands, colors }
  }, [products])

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(product.category)
      
      const matchesBrand = selectedBrands.length === 0 // No brand field in products
      
      const matchesColor = selectedColors.length === 0 || 
        product.variants?.some(v => selectedColors.includes(v.color))
      
      const price = product.wholesalePrice || product.msrp
      const matchesPrice = price >= priceRange.min && price <= priceRange.max
      
      return matchesSearch && matchesCategory && matchesBrand && matchesColor && matchesPrice
    })

    // Sort products
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => (a.wholesalePrice || a.msrp) - (b.wholesalePrice || b.msrp))
      case 'price-high':
        return filtered.sort((a, b) => (b.wholesalePrice || b.msrp) - (a.wholesalePrice || a.msrp))
      case 'name':
        return filtered.sort((a, b) => a.name.localeCompare(b.name))
      case 'trending':
        return filtered.sort((a, b) => (b.salesVelocity || 0) - (a.salesVelocity || 0))
      default:
        return filtered
    }
  }, [products, searchTerm, selectedCategories, selectedBrands, selectedColors, priceRange, sortBy])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        const data = await getProducts()
        
        // Enhance products with B2B metrics
        const enhanced = data.map(product => ({
          ...product,
          wholesalePrice: product.msrp * 0.6, // 40% markup
          margin: 40,
          salesVelocity: Math.floor(Math.random() * 100),
          trending: Math.random() > 0.8,
          bestseller: Math.random() > 0.9
        }))
        
        setProducts(enhanced)
      } catch (error) {
        console.error('Error loading products:', error)
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [toast])

  const handleQuickAdd = (product: ProductWithMetrics) => {
    addToCart({
      productId: product.id,
      product: product as any,
      variantId: 'default',
      variant: {
        id: 'default',
        color: 'Default',
        size: '',
        inventory: 100,
        sku: product.sku
      },
      quantity: 1,
      unitPrice: product.wholesalePrice || product.msrp
    })
    
    toast({
      title: "Added to cart",
      description: `${product.name} added to your cart`
    })
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedColors([])
    setPriceRange({ min: 0, max: 1000 })
    setSearchTerm("")
  }

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600">Loading products...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="flex gap-6">
        {/* Sidebar Filters */}
        {showFilters && (
          <div className="w-80 shrink-0">
            <Card className="sticky top-6">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Search</Label>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Separator />

                {/* Categories */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Category</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filterOptions.categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                        />
                        <Label 
                          htmlFor={`category-${category}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Brands */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Brand</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {filterOptions.brands.map(brand => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`brand-${brand}`}
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                        />
                        <Label 
                          htmlFor={`brand-${brand}`}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {brand}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Colors */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {filterOptions.colors.slice(0, 12).map(color => (
                      <button
                        key={color}
                        onClick={() => toggleColor(color)}
                        className={`
                          w-8 h-8 rounded-full border-2 transition-all
                          ${selectedColors.includes(color) 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Wholesale Price</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} products • Wholesale pricing
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price Low to High</SelectItem>
                  <SelectItem value="price-high">Price High to Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCategories.length > 0 || selectedBrands.length > 0 || selectedColors.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map(category => (
                <Badge key={category} variant="secondary" className="gap-1">
                  {category}
                  <button onClick={() => toggleCategory(category)} className="ml-1 hover:text-red-500">
                    ×
                  </button>
                </Badge>
              ))}
              {selectedBrands.map(brand => (
                <Badge key={brand} variant="secondary" className="gap-1">
                  {brand}
                  <button onClick={() => toggleBrand(brand)} className="ml-1 hover:text-red-500">
                    ×
                  </button>
                </Badge>
              ))}
              {selectedColors.map(color => (
                <Badge key={color} variant="secondary" className="gap-1">
                  {color}
                  <button onClick={() => toggleColor(color)} className="ml-1 hover:text-red-500">
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Product Grid */}
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
            }
          `}>
            {filteredProducts.map(product => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-square overflow-hidden rounded-t-lg bg-gray-100">
                    <Image
                      src={product.images?.[0] || '/placeholder.svg'}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {product.trending && (
                      <Badge className="bg-orange-500 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                    {product.bestseller && (
                      <Badge className="bg-green-500 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Bestseller
                      </Badge>
                    )}
                  </div>

                  {/* Heart Icon */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                        {product.name}
                      </h3>
                    </div>

                    <div className="text-xs text-gray-500">
                      {product.category}
                    </div>

                    {/* Color variants */}
                    {product.variants && (
                      <div className="flex gap-1">
                        {product.variants.slice(0, 5).map((variant, idx) => (
                          <div
                            key={idx}
                            className="w-4 h-4 rounded-full border border-gray-200"
                            style={{ backgroundColor: variant.color.toLowerCase() }}
                            title={variant.color}
                          />
                        ))}
                        {product.variants.length > 5 && (
                          <div className="text-xs text-gray-500 ml-1">
                            +{product.variants.length - 5}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">
                          ${product.wholesalePrice?.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          MSRP ${product.msrp?.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-green-600">
                        {product.margin}% margin
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleQuickAdd(product)}
                        className="flex-1"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Quick Add
                      </Button>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
              <Button onClick={clearFilters}>Clear all filters</Button>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
