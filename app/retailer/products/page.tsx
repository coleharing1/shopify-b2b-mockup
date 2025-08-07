"use client"

import { useEffect, useState } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { ProductCard } from "@/components/features/product-card"
import { CategoryFilter } from "@/components/features/category-filter"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SearchBar } from "@/components/ui/search-bar"
import { EmptyState } from "@/components/ui/empty-state"
import { ProductCardSkeleton } from "@/components/ui/skeleton"
import { Search, Filter, ChevronLeft, ChevronRight, Package } from "lucide-react"
import { Product, getCompanyById } from "@/lib/mock-data"
import { useCart } from "@/lib/cart-context"

/**
 * @description Product catalog with search and filters
 * @fileoverview Main product browsing page with tier-specific pricing
 */
export default function ProductCatalogPage() {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [pricingTier, setPricingTier] = useState("tier-1")
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  const productsPerPage = 12

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Get company data to determine pricing tier
        const company = await getCompanyById("company-1")
        if (company) {
          setPricingTier(company.pricingTier)
        }

        // Load products
        const response = await fetch("/mockdata/products.json")
        const data = await response.json()
        setProducts(data.products)
        setFilteredProducts(data.products)
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.products.map((p: Product) => p.category))
        ) as string[]
        setCategories(uniqueCategories)
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading products:", error)
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    // Apply filters
    let filtered = [...products]

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category))
    }

    // Search filter
    if (searchTerm) {
      setIsSearching(true)
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      // Simulate search delay
      setTimeout(() => setIsSearching(false), 300)
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }, [products, selectedCategories, searchTerm])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-gray-600 mt-2">
            Showing your {pricingTier.replace('-', ' ').toUpperCase()} pricing
          </p>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <SearchBar
                  placeholder="Search products by name, SKU, or description..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  isLoading={isSearching}
                  className="w-full"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden md:block space-y-4">
            <CategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              onClearAll={() => setSelectedCategories([])}
            />
          </div>

          {/* Product Grid */}
          <div className="md:col-span-3">
            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
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
                description={searchTerm || selectedCategories.length > 0 ? "Try adjusting your search or filters" : "No products available"}
                action={searchTerm || selectedCategories.length > 0 ? {
                  label: "Clear all filters",
                  onClick: () => {
                    setSearchTerm("")
                    setSelectedCategories([])
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
              <CategoryFilter
                categories={categories}
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                onClearAll={() => setSelectedCategories([])}
              />
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  )
}