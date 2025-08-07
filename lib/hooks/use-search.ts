"use client"

import { useState, useEffect, useCallback } from "react"
import { Product, Order, Company } from "@/lib/mock-data"

export interface SearchResult {
  id: string
  type: "product" | "order" | "customer" | "resource"
  title: string
  subtitle?: string
  description?: string
  image?: string
  url: string
  metadata?: Record<string, any>
}

export interface SearchState {
  query: string
  results: SearchResult[]
  isLoading: boolean
  recentSearches: string[]
  popularSearches: string[]
}

/**
 * @description Hook for managing global search functionality
 * @fileoverview Handles search state, history, and result fetching
 */
export function useSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [popularSearches] = useState<string[]>([
    "Alpine Jacket",
    "Hiking Boots", 
    "Trail Pants",
    "Winter Collection",
    "New Arrivals"
  ])

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("recent-searches")
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error("Error loading recent searches:", error)
      }
    }
  }, [])

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return
    
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s !== searchTerm)
      const updated = [searchTerm, ...filtered].slice(0, 5)
      localStorage.setItem("recent-searches", JSON.stringify(updated))
      return updated
    })
  }, [])

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem("recent-searches")
  }, [])

  // Perform search across all data types
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200))
      
      const searchResults: SearchResult[] = []
      const lowerQuery = searchQuery.toLowerCase()
      
      // Search products
      const productsResponse = await fetch('/mockdata/products.json')
      const productsData = await productsResponse.json()
      const productResults = productsData.products
        .filter((product: Product) => 
          product.name.toLowerCase().includes(lowerQuery) ||
          product.sku.toLowerCase().includes(lowerQuery) ||
          product.description?.toLowerCase().includes(lowerQuery) ||
          product.category?.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 5)
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
            category: product.category
          }
        }))
      
      searchResults.push(...productResults)
      
      // Search orders
      const ordersResponse = await fetch('/mockdata/orders.json')
      const ordersData = await ordersResponse.json()
      const orderResults = ordersData.orders
        .filter((order: Order) =>
          order.poNumber?.toLowerCase().includes(lowerQuery) ||
          order.id.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 3)
        .map((order: Order) => ({
          id: order.id,
          type: "order" as const,
          title: order.poNumber || order.id,
          subtitle: new Date(order.orderDate).toLocaleDateString(),
          description: `Total: $${order.total.toFixed(2)}`,
          url: `/retailer/orders`,
          metadata: {
            status: order.status,
            total: order.total
          }
        }))
      
      searchResults.push(...orderResults)
      
      // Search customers (for sales reps)
      const companiesResponse = await fetch('/mockdata/companies.json')
      const companiesData = await companiesResponse.json()
      const customerResults = companiesData.companies
        .filter((company: Company) =>
          company.name.toLowerCase().includes(lowerQuery) ||
          company.accountNumber?.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 3)
        .map((company: Company) => ({
          id: company.id,
          type: "customer" as const,
          title: company.name,
          subtitle: company.accountNumber,
          description: `${company.type} • ${company.status}`,
          url: `/rep/customers/${company.id}`,
          metadata: {
            type: company.type,
            status: company.status
          }
        }))
      
      searchResults.push(...customerResults)
      
      // Search resources
      const resourcesResponse = await fetch('/mockdata/resources.json')
      const resourcesData = await resourcesResponse.json()
      const resourceResults = resourcesData.resources
        .filter((resource: any) =>
          resource.title.toLowerCase().includes(lowerQuery) ||
          resource.description?.toLowerCase().includes(lowerQuery) ||
          resource.category?.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 2)
        .map((resource: any) => ({
          id: resource.id,
          type: "resource" as const,
          title: resource.title,
          subtitle: resource.category,
          description: resource.description,
          url: `/retailer/resources`,
          metadata: {
            fileType: resource.fileType,
            fileSize: resource.fileSize
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
  }, [])

  return {
    query,
    setQuery,
    results,
    isLoading,
    recentSearches,
    popularSearches,
    performSearch,
    saveRecentSearch,
    clearRecentSearches
  }
}

/**
 * @description Debounce hook for search input
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}