"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Search,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Package,
  FileText,
  Users,
  Tag
} from "lucide-react"

interface SearchSuggestionsProps {
  query: string
  onSuggestionClick?: (suggestion: string) => void
  isVisible?: boolean
}

/**
 * @description Search suggestions and autocomplete component
 * @fileoverview Provides intelligent search suggestions based on query
 */
export function SearchSuggestions({ 
  query, 
  onSuggestionClick,
  isVisible = true 
}: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<{
    products: string[]
    categories: string[]
    popular: string[]
    recent: string[]
    didYouMean?: string
  }>({
    products: [],
    categories: [],
    popular: [],
    recent: []
  })

  // Load recent searches from localStorage
  useEffect(() => {
    const recentSearches = JSON.parse(
      localStorage.getItem('recentSearches') || '[]'
    ).slice(0, 5)
    
    setSuggestions(prev => ({
      ...prev,
      recent: recentSearches
    }))
  }, [])

  // Generate suggestions based on query
  useEffect(() => {
    if (query.length < 2) {
      // Show popular searches when no query
      setSuggestions(prev => ({
        ...prev,
        products: [],
        categories: [],
        popular: [
          'Alpine Pro Jacket',
          'Trail Running Shoes',
          'Camping Gear',
          'Winter Collection',
          'Backpacks'
        ]
      }))
      return
    }

    // Simulate autocomplete suggestions
    const lowerQuery = query.toLowerCase()
    
    // Product suggestions
    const productSuggestions = [
      'Alpine Pro Jacket - Men\'s',
      'Alpine Pro Jacket - Women\'s',
      'Alpine Trail Boots',
      'Alpine Fleece Pullover',
      'Trail Runner Pro Shoes',
      'Trail Blazer Backpack',
      'Summit Series Jacket',
      'Summit Climbing Harness',
      'Urban Explorer Daypack',
      'Urban Commuter Bag'
    ].filter(p => p.toLowerCase().includes(lowerQuery)).slice(0, 5)

    // Category suggestions
    const categorySuggestions = [
      'Outdoor Apparel',
      'Footwear',
      'Camping Equipment',
      'Climbing Gear',
      'Backpacks & Bags',
      'Winter Sports',
      'Running Gear',
      'Accessories'
    ].filter(c => c.toLowerCase().includes(lowerQuery)).slice(0, 3)

    // Check for typos and suggest corrections
    let didYouMean = undefined
    const typoMap: Record<string, string> = {
      'jakect': 'jacket',
      'shoos': 'shoes',
      'beckpack': 'backpack',
      'runing': 'running',
      'climing': 'climbing',
      'geer': 'gear',
      'apperal': 'apparel'
    }
    
    if (typoMap[lowerQuery]) {
      didYouMean = typoMap[lowerQuery]
    }

    setSuggestions(prev => ({
      ...prev,
      products: productSuggestions,
      categories: categorySuggestions,
      didYouMean
    }))
  }, [query])

  if (!isVisible) return null

  const handleSuggestionClick = (suggestion: string) => {
    // Save to recent searches
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]')
    const updated = [suggestion, ...recent.filter((s: string) => s !== suggestion)].slice(0, 10)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
    
    if (onSuggestionClick) {
      onSuggestionClick(suggestion)
    }
  }

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
      <CardContent className="p-0">
        {/* Did you mean */}
        {suggestions.didYouMean && (
          <div className="p-3 border-b bg-yellow-50">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-yellow-600" />
              <span className="text-gray-600">Did you mean:</span>
              <button
                onClick={() => handleSuggestionClick(suggestions.didYouMean!)}
                className="font-medium text-primary hover:underline"
              >
                {suggestions.didYouMean}
              </button>
            </div>
          </div>
        )}

        {/* Product Suggestions */}
        {suggestions.products.length > 0 && (
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 font-medium uppercase">
              <Package className="h-3 w-3" />
              Products
            </div>
            <div className="space-y-1">
              {suggestions.products.map((product, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-50 rounded flex items-center justify-between group"
                >
                  <span className="text-gray-700">{product}</span>
                  <ArrowRight className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Suggestions */}
        {suggestions.categories.length > 0 && (
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 font-medium uppercase">
              <Tag className="h-3 w-3" />
              Categories
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.categories.map((category, idx) => (
                <Badge
                  key={idx}
                  variant="secondary"
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSuggestionClick(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches (when no query) */}
        {query.length < 2 && suggestions.popular.length > 0 && (
          <div className="p-3 border-b">
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 font-medium uppercase">
              <TrendingUp className="h-3 w-3" />
              Popular Searches
            </div>
            <div className="space-y-1">
              {suggestions.popular.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                >
                  <Search className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {suggestions.recent.length > 0 && (
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2 text-xs text-gray-500 font-medium uppercase">
              <Clock className="h-3 w-3" />
              Recent Searches
            </div>
            <div className="space-y-1">
              {suggestions.recent.map((search, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(search)}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-gray-50 rounded flex items-center gap-2"
                >
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-700">{search}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Tips */}
        {query.length === 0 && (
          <div className="p-3 bg-gray-50 text-xs text-gray-600">
            <div className="font-medium mb-1">Search Tips:</div>
            <ul className="space-y-0.5">
              <li>• Use product SKU for exact matches</li>
              <li>• Try category names like "Footwear" or "Camping"</li>
              <li>• Search by order number (e.g., "ORD-2024-")</li>
            </ul>
          </div>
        )}

        {/* Quick Links */}
        <div className="p-3 bg-gray-50 border-t flex items-center justify-between">
          <div className="flex gap-3">
            <Link 
              href="/retailer/products" 
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <Package className="h-3 w-3" />
              All Products
            </Link>
            <Link 
              href="/retailer/orders" 
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <FileText className="h-3 w-3" />
              Order History
            </Link>
            <Link 
              href="/rep/customers" 
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              <Users className="h-3 w-3" />
              Customers
            </Link>
          </div>
          {query && (
            <Link 
              href={`/search?q=${encodeURIComponent(query)}`}
              className="text-xs text-primary hover:underline font-medium"
            >
              See all results →
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}