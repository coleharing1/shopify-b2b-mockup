"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Package, 
  FileText, 
  Users, 
  File, 
  Filter,
  Grid,
  List,
  ArrowRight,
  TrendingUp,
  ShoppingCart
} from "lucide-react"
import Link from "next/link"
import { ProductCard } from "@/components/features/product-card"
import { getProducts, getOrdersByCompanyId, getCompanies, getResources, formatCurrency, Product, Order, Company } from "@/lib/mock-data"

interface Resource {
  id: string
  title: string
  description?: string
  category?: string
  fileType?: string
  fileSize?: string
  updatedDate?: string
}

interface SearchResult {
  id: string
  type: "product" | "order" | "customer" | "resource"
  title: string
  subtitle?: string
  description?: string
  image?: string
  url: string
  metadata?: Record<string, any>
}

/**
 * @fileoverview Unified search results page
 * @description Displays search results across all data types with filtering
 */
function SearchResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  
  // Perform search when query changes
  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])
  
  const performSearch = async (searchQuery: string) => {
    setIsLoading(true)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const searchResults: SearchResult[] = []
      const lowerQuery = searchQuery.toLowerCase()
      
      // Search products
      const allProducts = await getProducts()
      const productResults = allProducts
        .filter((product: Product) => 
          product.name.toLowerCase().includes(lowerQuery) ||
          product.sku?.toLowerCase().includes(lowerQuery) ||
          product.description?.toLowerCase().includes(lowerQuery) ||
          product.category?.toLowerCase().includes(lowerQuery)
        )
        .map((product: Product) => ({
          id: product.id,
          type: "product" as const,
          title: product.name,
          subtitle: product.sku,
          description: product.description,
          image: product.images?.[0],
          url: `/retailer/products/${product.id}`,
          metadata: {
            price: product.msrp,
            category: product.category,
            variants: product.variants
          }
        }))
      
      searchResults.push(...productResults)
      
      // Search orders
      const allOrders = await getOrdersByCompanyId('*') // Get all for search
      const orderResults = allOrders
        .filter((order: Order) =>
          order.poNumber?.toLowerCase().includes(lowerQuery) ||
          order.id.toLowerCase().includes(lowerQuery)
        )
        .map((order: Order) => ({
          id: order.id,
          type: "order" as const,
          title: order.poNumber || order.id,
          subtitle: new Date(order.orderDate).toLocaleDateString(),
          description: `Order Total: ${formatCurrency(order.total)}`,
          url: `/retailer/orders`,
          metadata: {
            status: order.status,
            total: order.total,
            date: order.orderDate
          }
        }))
      
      searchResults.push(...orderResults)
      
      // Search customers
      const allCompanies = await getCompanies()
      const customerResults = allCompanies
        .filter((company: Company) =>
          company.name.toLowerCase().includes(lowerQuery) ||
          company.accountNumber?.toLowerCase().includes(lowerQuery)
        )
        .map((company: Company) => ({
          id: company.id,
          type: "customer" as const,
          title: company.name,
          subtitle: company.accountNumber,
          description: `${company.type} • ${company.paymentTerms}`,
          url: `/rep/customers/${company.id}`,
          metadata: {
            type: company.type,
            status: company.status,
            creditLimit: company.creditLimit
          }
        }))
      
      searchResults.push(...customerResults)
      
      // Search resources
      const allResources = await getResources()
      const resourceResults = allResources
        .filter((resource: Resource) =>
          resource.title.toLowerCase().includes(lowerQuery) ||
          resource.description?.toLowerCase().includes(lowerQuery) ||
          resource.category?.toLowerCase().includes(lowerQuery)
        )
        .map((resource: Resource) => ({
          id: resource.id,
          type: "resource" as const,
          title: resource.title,
          subtitle: resource.category,
          description: resource.description,
          url: `/retailer/resources`,
          metadata: {
            fileType: resource.fileType,
            fileSize: resource.fileSize,
            updatedDate: resource.updatedDate
          }
        }))
      
      searchResults.push(...resourceResults)
      
      setResults(searchResults)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }
  
  // Filter results by type
  const filteredResults = selectedTab === "all" 
    ? results 
    : results.filter(r => r.type === selectedTab)
  
  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = []
    }
    acc[result.type].push(result)
    return acc
  }, {} as Record<string, SearchResult[]>)
  
  const getIcon = (type: string) => {
    switch (type) {
      case "product": return Package
      case "order": return FileText
      case "customer": return Users
      case "resource": return File
      default: return Package
    }
  }
  
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      shipped: "default",
      delivered: "secondary",
      pending: "outline"
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }
  
  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Search Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
              <p className="text-gray-600 mt-1">
                {isLoading ? (
                  "Searching..."
                ) : (
                  <>Found {results.length} results for "<span className="font-medium">{query}</span>"</>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="search"
              defaultValue={query}
              placeholder="Refine your search..."
              className="pl-10 pr-4 h-12"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const target = e.target as HTMLInputElement
                  window.location.href = `/search?q=${encodeURIComponent(target.value)}`
                }
              }}
            />
          </div>
        </div>
        
        {/* Results Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              All
              <Badge variant="secondary" className="ml-1">
                {results.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="product" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
              <Badge variant="secondary" className="ml-1">
                {groupedResults.product?.length || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="order" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Orders
              <Badge variant="secondary" className="ml-1">
                {groupedResults.order?.length || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers
              <Badge variant="secondary" className="ml-1">
                {groupedResults.customer?.length || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="resource" className="flex items-center gap-2">
              <File className="h-4 w-4" />
              Resources
              <Badge variant="secondary" className="ml-1">
                {groupedResults.resource?.length || 0}
              </Badge>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={selectedTab} className="mt-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2 text-gray-500">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  Searching...
                </div>
              </div>
            ) : filteredResults.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or filters
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
                {filteredResults.map((result) => {
                  const Icon = getIcon(result.type)
                  
                  if (result.type === "product" && viewMode === "grid") {
                    // Use ProductCard for products in grid view
                    return (
                      <div key={result.id}>
                        <ProductCard
                          pricingTier="tier-1"
                          product={{
                            id: result.id,
                            name: result.title,
                            sku: result.subtitle || "",
                            msrp: result.metadata?.price || 0,
                            images: result.image ? [result.image] : [],
                            category: result.metadata?.category || "",
                            subcategory: "",
                            description: result.description || "",
                            pricing: {
                              "tier-1": { price: result.metadata?.price * 0.7 || 0, minQuantity: 1 }
                            }
                          }}
                        />
                      </div>
                    )
                  }
                  
                  return (
                    <Card key={result.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <Link href={result.url} className="block">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              <Icon className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 mb-1">
                                {result.title}
                              </h3>
                              {result.subtitle && (
                                <p className="text-sm text-gray-600">{result.subtitle}</p>
                              )}
                              {result.description && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {result.description}
                                </p>
                              )}
                              
                              {/* Type-specific metadata */}
                              <div className="mt-2 flex items-center gap-2">
                                {result.type === "order" && result.metadata?.status && (
                                  getStatusBadge(result.metadata.status)
                                )}
                                {result.type === "customer" && result.metadata?.type && (
                                  <Badge variant="outline">{result.metadata.type}</Badge>
                                )}
                                {result.type === "resource" && result.metadata?.fileType && (
                                  <Badge variant="secondary">{result.metadata.fileType}</Badge>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Related Searches */}
        {!isLoading && results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Related Searches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Winter Collection", "New Arrivals", "Hiking Gear", "Trail Equipment"].map((term) => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `/search?q=${encodeURIComponent(term)}`}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AuthenticatedLayout>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <AuthenticatedLayout>
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            Loading search...
          </div>
        </div>
      </AuthenticatedLayout>
    }>
      <SearchResultsContent />
    </Suspense>
  )
}