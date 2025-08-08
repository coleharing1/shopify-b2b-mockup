"use client"

import { useEffect, useState } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { ProductCard } from "@/components/features/product-card"
import { AdvancedFilters, FilterState } from "@/components/features/advanced-filters"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/ui/search-bar"
import { EmptyState } from "@/components/ui/empty-state"
import { ProductCardSkeleton } from "@/components/ui/skeleton"
import { Search, Filter, ChevronLeft, ChevronRight, Package, Grid, List, Book, Info } from "lucide-react"
import { getProducts, getCompanyById, Product } from "@/lib/mock-data"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/contexts/auth-context"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { CatalogBadge } from "@/components/features/catalog-badge"
import { loadPriceListForCompany } from "@/lib/pricing-helpers"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/**
 * @description Product catalog with search and filters
 * @fileoverview Main product browsing page with tier-specific pricing
 */
export default function ProductCatalogPage() {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [pricingTier, setPricingTier] = useState("tier-1")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [maxPrice, setMaxPrice] = useState(1000)
  const [showFilters, setShowFilters] = useState(false)
  const [catalogInfo, setCatalogInfo] = useState<any>(null)
  const [priceList, setPriceList] = useState<any>(null)
  
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: { min: 0, max: 1000 },
    availability: [],
    sizes: [],
    colors: [],
    brands: [],
    rating: null
  })
  
  const productsPerPage = viewMode === 'grid' ? 12 : 10

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Get company data to determine pricing tier
        const companyId = user?.companyId || "company-1"
        const company = await getCompanyById(companyId)
        if (company) {
          setPricingTier(company.pricingTier)
        }

        // Load price list for company
        const companyPriceList = await loadPriceListForCompany(companyId)
        setPriceList(companyPriceList)

        // Fetch catalog and filtered products
        try {
          const catalogResponse = await fetch('/api/catalogs')
          if (catalogResponse.ok) {
            const catalogData = await catalogResponse.json()
            setCatalogInfo(catalogData.catalog)
            
            // Use catalog-filtered products
            const catalogProducts = catalogData.products
            setProducts(catalogProducts)
            setFilteredProducts(catalogProducts)
            
            // Extract unique categories from visible products
            const uniqueCategories = Array.from(
              new Set(catalogProducts.map((p: Product) => p.category))
            ) as string[]
            setCategories(uniqueCategories)
            
            // Extract unique brands
            const uniqueBrands = Array.from(
              new Set(catalogProducts.map((p: Product) => p.category || 'Generic').filter(Boolean))
            ) as string[]
            setBrands(uniqueBrands)
            
            // Calculate max price for slider
            const prices = catalogProducts.map((p: Product) => p.msrp)
            const maxProductPrice = prices.length > 0 ? Math.max(...prices) : 1000
            setMaxPrice(Math.ceil(maxProductPrice / 100) * 100)
            
            // Update filters with max price
            setFilters(prev => ({
              ...prev,
              priceRange: { min: 0, max: Math.ceil(maxProductPrice / 100) * 100 }
            }))
          } else {
            throw new Error('Catalog API failed')
          }
        } catch (catalogError) {
          // Fallback to all products if catalog API fails
          console.warn('Falling back to all products:', catalogError)
          const data = await getProducts()
          setProducts(data)
          setFilteredProducts(data)
          
          const uniqueCategories = Array.from(
            new Set(data.map((p: Product) => p.category))
          ) as string[]
          setCategories(uniqueCategories)
          
          const uniqueBrands = Array.from(
            new Set(data.map((p: Product) => p.category || 'Generic').filter(Boolean))
          ) as string[]
          setBrands(uniqueBrands)
          
          const prices = data.map((p: Product) => p.msrp)
          const maxProductPrice = prices.length > 0 ? Math.max(...prices) : 1000
          setMaxPrice(Math.ceil(maxProductPrice / 100) * 100)
          
          setFilters(prev => ({
            ...prev,
            priceRange: { min: 0, max: Math.ceil(maxProductPrice / 100) * 100 }
          }))
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading products:", error)
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [user])

  useEffect(() => {
    // Apply all filters
    let filtered = [...products]

    // Search filter
    if (searchTerm) {
      setIsSearching(true)
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setTimeout(() => setIsSearching(false), 300)
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p => filters.categories.includes(p.category))
    }

    // Price range filter
    filtered = filtered.filter(p => {
      const price = p.msrp
      return price >= filters.priceRange.min && price <= filters.priceRange.max
    })

    // Availability filter
    if (filters.availability.length > 0) {
      filtered = filtered.filter(p => {
        // Use variant inventory to determine stock status
        const totalStock = p.variants?.reduce((sum, v) => sum + (v.inventory || 0), 0) || 0
        
        if (filters.availability.includes('inStock') && totalStock > 10) return true
        if (filters.availability.includes('lowStock') && totalStock > 0 && totalStock <= 10) return true
        if (filters.availability.includes('backorder') && totalStock === 0) return true
        if (filters.availability.includes('newArrival')) {
          // Check if product was added in last 30 days
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          // For demo, randomly assign some products as new
          return Math.random() > 0.7
        }
        return false
      })
    }

    // Brand filter (using category as fallback)
    if (filters.brands.length > 0) {
      filtered = filtered.filter(p => 
        filters.brands.includes(p.category || 'Generic')
      )
    }

    // Size filter (check variants)
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.variants) return false
        return p.variants.some(v => 
          filters.sizes.includes(v.size || '')
        )
      })
    }

    // Color filter (check variants)
    if (filters.colors.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.variants) return false
        return p.variants.some(v => 
          filters.colors.some(color => 
            v.color?.toLowerCase().includes(color.toLowerCase())
          )
        )
      })
    }

    // Apply sorting
    switch (sortBy) {
      case 'priceAsc':
        filtered.sort((a, b) => a.msrp - b.msrp)
        break
      case 'priceDesc':
        filtered.sort((a, b) => b.msrp - a.msrp)
        break
      case 'nameAsc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'nameDesc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'newest':
        // For demo, reverse the array to simulate newest first
        filtered.reverse()
        break
      case 'featured':
      default:
        // Keep original order
        break
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [products, filters, searchTerm, sortBy])

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleAddToCart = (product: Product) => {
    // Add first available variant to cart
    const firstVariant = product.variants?.[0]
    if (firstVariant) {
      const tierPrice = product.pricing[pricingTier].price
      addToCart({
        productId: product.id,
        product: product,
        variantId: firstVariant.id,
        variant: firstVariant,
        quantity: 1,
        unitPrice: tierPrice
      })
    }
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading products...</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
            {catalogInfo && (
              <div className="mt-2 flex items-center gap-3">
                <CatalogBadge 
                  catalogName={catalogInfo.name}
                  features={catalogInfo.features}
                />
                {catalogInfo.description && (
                  <p className="text-sm text-gray-600">{catalogInfo.description}</p>
                )}
              </div>
            )}
            <p className="text-gray-600 mt-2">
              Showing your {pricingTier.replace('-', ' ').toUpperCase()} pricing
            </p>
          </div>
          <div className="flex items-center gap-2">
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
        </div>

        {/* Search and Sort Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SearchBar
                  placeholder="Search products by name, SKU, or description..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  isLoading={isSearching}
                  className="w-full"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                  <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                  <SelectItem value="nameAsc">Name: A to Z</SelectItem>
                  <SelectItem value="nameDesc">Name: Z to A</SelectItem>
                </SelectContent>
              </Select>
              {isMobile && (
                <AdvancedFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  productCount={filteredProducts.length}
                  isMobile={true}
                  categories={categories}
                  brands={brands}
                  maxPrice={maxPrice}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters - Desktop */}
          {!isMobile && (
            <div className="hidden lg:block">
              <AdvancedFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                productCount={filteredProducts.length}
                isMobile={false}
                categories={categories}
                brands={brands}
                maxPrice={maxPrice}
              />
            </div>
          )}

          {/* Product Grid */}
          <div className={isMobile ? 'col-span-1' : 'lg:col-span-3'}>
            {/* Results Count and Active Filters Summary */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                </span>
                {(filters.categories.length > 0 || 
                  filters.availability.length > 0 || 
                  filters.brands.length > 0 ||
                  filters.sizes.length > 0 ||
                  filters.colors.length > 0 ||
                  (filters.priceRange.min > 0 || filters.priceRange.max < maxPrice)) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilters({
                      categories: [],
                      priceRange: { min: 0, max: maxPrice },
                      availability: [],
                      sizes: [],
                      colors: [],
                      brands: [],
                      rating: null
                    })}
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            </div>

            {/* Products */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : currentProducts.length === 0 ? (
              <EmptyState
                icon={<Package className="h-12 w-12 text-gray-400" />}
                title="No products found"
                description={searchTerm || filters.categories.length > 0 ? "Try adjusting your search or filters" : "No products available"}
                action={searchTerm || filters.categories.length > 0 ? {
                  label: "Clear all filters",
                  onClick: () => {
                    setSearchTerm("")
                    setFilters(prev => ({ ...prev, categories: [] }))
                  }
                } : undefined}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    pricingTier={pricingTier}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <span className="text-sm text-gray-600 px-4">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowFilters(false)} />
            <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  Done
                </Button>
              </div>
              <AdvancedFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                productCount={filteredProducts.length}
                isMobile={true}
                categories={categories}
                brands={brands}
                maxPrice={maxPrice}
              />
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}