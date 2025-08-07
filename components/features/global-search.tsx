"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  X, 
  Package, 
  Users, 
  FileText, 
  ShoppingBag,
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock search data
const mockSearchData = {
  products: [
    { id: "prod-1", name: "Alpine Performance Jacket", sku: "JKT-ALPINE-001", type: "product", category: "Apparel" },
    { id: "prod-2", name: "Trail Runner Pants", sku: "PNT-TRAIL-002", type: "product", category: "Apparel" },
    { id: "prod-3", name: "Summit Hiking Boots", sku: "BOOT-SUMMIT-003", type: "product", category: "Footwear" }
  ],
  orders: [
    { id: "order-1001", poNumber: "MGO-PO-2025-0805", customer: "Mountain Gear Outfitters", type: "order", status: "shipped" },
    { id: "order-1002", poNumber: "SSR-PO-2025-0804", customer: "Summit Sports Retail", type: "order", status: "delivered" }
  ],
  customers: [
    { id: "company-1", name: "Mountain Gear Outfitters", accountNumber: "MGO-10234", type: "customer" },
    { id: "company-2", name: "Summit Sports Retail", accountNumber: "SSR-10235", type: "customer" }
  ],
  documents: [
    { id: "doc-1", name: "2025 Product Catalog", type: "document", category: "Marketing" },
    { id: "doc-2", name: "Price List - Tier 2", type: "document", category: "Pricing" }
  ]
}

interface GlobalSearchProps {
  className?: string
  onClose?: () => void
}

/**
 * @description Global search component with instant results
 * @fileoverview Searches across products, orders, customers, and documents
 */
export function GlobalSearch({ className, onClose }: GlobalSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
        inputRef.current?.focus()
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Search results
  const searchResults = useMemo(() => {
    if (query.length < 2) return null

    const results = {
      products: mockSearchData.products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase())
      ),
      orders: mockSearchData.orders.filter(o => 
        o.poNumber.toLowerCase().includes(query.toLowerCase()) ||
        o.customer.toLowerCase().includes(query.toLowerCase())
      ),
      customers: mockSearchData.customers.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.accountNumber.toLowerCase().includes(query.toLowerCase())
      ),
      documents: mockSearchData.documents.filter(d => 
        d.name.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Filter by category if selected
    if (selectedCategory) {
      return {
        products: selectedCategory === "products" ? results.products : [],
        orders: selectedCategory === "orders" ? results.orders : [],
        customers: selectedCategory === "customers" ? results.customers : [],
        documents: selectedCategory === "documents" ? results.documents : []
      }
    }

    return results
  }, [query, selectedCategory])

  const handleSearch = (searchTerm: string) => {
    // Save to recent searches
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
    
    setIsOpen(false)
    if (onClose) onClose()
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "product": return <Package className="h-4 w-4" />
      case "order": return <FileText className="h-4 w-4" />
      case "customer": return <Users className="h-4 w-4" />
      case "document": return <FileText className="h-4 w-4" />
      default: return <Search className="h-4 w-4" />
    }
  }

  const navigate = (type: string, id: string) => {
    switch (type) {
      case "product":
        router.push(`/retailer/products/${id}`)
        break
      case "order":
        router.push(`/retailer/orders/${id}`)
        break
      case "customer":
        router.push(`/rep/customers/${id}`)
        break
      case "document":
        router.push(`/retailer/resources#${id}`)
        break
    }
    handleSearch(query)
  }

  const hasResults = searchResults && (
    searchResults.products.length > 0 ||
    searchResults.orders.length > 0 ||
    searchResults.customers.length > 0 ||
    searchResults.documents.length > 0
  )

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          ref={inputRef}
          placeholder="Search products, orders, customers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuery("")}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <kbd className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">⌘K</kbd>
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 max-h-[600px] overflow-hidden z-50 shadow-lg">
          {/* Category Filters */}
          <div className="p-3 border-b flex gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            <Button
              variant={selectedCategory === "products" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("products")}
            >
              <Package className="mr-1 h-3 w-3" />
              Products
            </Button>
            <Button
              variant={selectedCategory === "orders" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("orders")}
            >
              <FileText className="mr-1 h-3 w-3" />
              Orders
            </Button>
            <Button
              variant={selectedCategory === "customers" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("customers")}
            >
              <Users className="mr-1 h-3 w-3" />
              Customers
            </Button>
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  Recent Searches
                </h3>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-lg"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {query.length >= 2 && (
              <>
                {!hasResults ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No results found for "{query}"</p>
                    <p className="text-sm text-gray-400 mt-1">Try searching with different keywords</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {/* Products */}
                    {searchResults.products.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-600 px-2 py-1">Products</h3>
                        {searchResults.products.map(product => (
                          <button
                            key={product.id}
                            onClick={() => navigate(product.type, product.id)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3">
                              {getIcon(product.type)}
                              <div>
                                <p className="text-sm font-medium">{product.name}</p>
                                <p className="text-xs text-gray-500">SKU: {product.sku} • {product.category}</p>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Orders */}
                    {searchResults.orders.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-600 px-2 py-1">Orders</h3>
                        {searchResults.orders.map(order => (
                          <button
                            key={order.id}
                            onClick={() => navigate(order.type, order.id)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3">
                              {getIcon(order.type)}
                              <div>
                                <p className="text-sm font-medium">{order.poNumber}</p>
                                <p className="text-xs text-gray-500">{order.customer}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {order.status}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Customers */}
                    {searchResults.customers.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-600 px-2 py-1">Customers</h3>
                        {searchResults.customers.map(customer => (
                          <button
                            key={customer.id}
                            onClick={() => navigate(customer.type, customer.id)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3">
                              {getIcon(customer.type)}
                              <div>
                                <p className="text-sm font-medium">{customer.name}</p>
                                <p className="text-xs text-gray-500">Account: {customer.accountNumber}</p>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Documents */}
                    {searchResults.documents.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 px-2 py-1">Documents</h3>
                        {searchResults.documents.map(doc => (
                          <button
                            key={doc.id}
                            onClick={() => navigate(doc.type, doc.id)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3">
                              {getIcon(doc.type)}
                              <div>
                                <p className="text-sm font-medium">{doc.name}</p>
                                <p className="text-xs text-gray-500">{doc.category}</p>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Popular Searches */}
          {!query && (
            <div className="p-4 border-t bg-gray-50">
              <h3 className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                <TrendingUp className="h-3 w-3" />
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {["Alpine Jacket", "Order Status", "Mountain Gear", "Price List"].map(term => (
                  <Button
                    key={term}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(term)}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}