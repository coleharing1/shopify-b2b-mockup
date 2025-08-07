"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Save,
  Search,
  Star,
  Edit,
  Trash2,
  Plus,
  Filter,
  Clock,
  TrendingUp,
  Package,
  DollarSign,
  AlertCircle,
  Sparkles,
  ChevronDown,
  MoreVertical
} from "lucide-react"
import { useRouter } from 'next/navigation'
import { FilterState } from './advanced-filters'
import { useToast } from '@/hooks/use-toast'

export interface SavedSearch {
  id: string
  name: string
  query?: string
  filters?: FilterState
  createdAt: string
  lastUsed?: string
  useCount: number
  isDefault?: boolean
  icon?: string
}

interface SavedSearchesProps {
  currentQuery?: string
  currentFilters?: FilterState
  onLoadSearch?: (search: SavedSearch) => void
}

/**
 * @description Saved searches and filter presets management
 * @fileoverview Allows users to save, manage, and quickly access searches
 */
export function SavedSearches({ 
  currentQuery, 
  currentFilters,
  onLoadSearch 
}: SavedSearchesProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [editingSearch, setEditingSearch] = useState<SavedSearch | null>(null)

  // Load saved searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('savedSearches')
    if (stored) {
      setSavedSearches(JSON.parse(stored))
    } else {
      // Initialize with default presets
      const defaultPresets: SavedSearch[] = [
        {
          id: 'preset-1',
          name: 'New This Month',
          filters: {
            categories: [],
            priceRange: { min: 0, max: 1000 },
            availability: ['newArrival'],
            sizes: [],
            colors: [],
            brands: [],
            rating: null
          },
          createdAt: new Date().toISOString(),
          useCount: 0,
          icon: 'sparkles'
        },
        {
          id: 'preset-2',
          name: 'On Sale',
          filters: {
            categories: [],
            priceRange: { min: 0, max: 100 },
            availability: ['inStock'],
            sizes: [],
            colors: [],
            brands: [],
            rating: null
          },
          createdAt: new Date().toISOString(),
          useCount: 0,
          icon: 'dollar'
        },
        {
          id: 'preset-3',
          name: 'Best Sellers',
          query: 'best seller',
          filters: {
            categories: [],
            priceRange: { min: 0, max: 1000 },
            availability: ['inStock'],
            sizes: [],
            colors: [],
            brands: [],
            rating: 4
          },
          createdAt: new Date().toISOString(),
          useCount: 0,
          icon: 'trending'
        },
        {
          id: 'preset-4',
          name: 'Low Stock Alert',
          filters: {
            categories: [],
            priceRange: { min: 0, max: 1000 },
            availability: ['lowStock'],
            sizes: [],
            colors: [],
            brands: [],
            rating: null
          },
          createdAt: new Date().toISOString(),
          useCount: 0,
          icon: 'alert'
        },
        {
          id: 'preset-5',
          name: 'Quick Reorder',
          query: 'frequently ordered',
          filters: {
            categories: [],
            priceRange: { min: 0, max: 1000 },
            availability: ['inStock'],
            sizes: [],
            colors: [],
            brands: [],
            rating: null
          },
          createdAt: new Date().toISOString(),
          useCount: 0,
          icon: 'package'
        }
      ]
      setSavedSearches(defaultPresets)
      localStorage.setItem('savedSearches', JSON.stringify(defaultPresets))
    }
  }, [])

  const saveSearch = () => {
    if (!searchName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your saved search",
        variant: "destructive"
      })
      return
    }

    const newSearch: SavedSearch = {
      id: editingSearch?.id || `search-${Date.now()}`,
      name: searchName,
      query: currentQuery,
      filters: currentFilters,
      createdAt: editingSearch?.createdAt || new Date().toISOString(),
      useCount: editingSearch?.useCount || 0,
      isDefault: false
    }

    let updated: SavedSearch[]
    if (editingSearch) {
      updated = savedSearches.map(s => 
        s.id === editingSearch.id ? newSearch : s
      )
    } else {
      updated = [...savedSearches, newSearch]
    }

    setSavedSearches(updated)
    localStorage.setItem('savedSearches', JSON.stringify(updated))
    
    toast({
      title: editingSearch ? "Search Updated" : "Search Saved",
      description: `"${searchName}" has been ${editingSearch ? 'updated' : 'saved'} successfully`
    })
    
    setIsDialogOpen(false)
    setSearchName('')
    setEditingSearch(null)
  }

  const loadSearch = (search: SavedSearch) => {
    // Update use count and last used
    const updated = savedSearches.map(s => 
      s.id === search.id 
        ? { ...s, useCount: s.useCount + 1, lastUsed: new Date().toISOString() }
        : s
    )
    setSavedSearches(updated)
    localStorage.setItem('savedSearches', JSON.stringify(updated))

    // Load the search
    if (onLoadSearch) {
      onLoadSearch(search)
    } else {
      // Navigate to search page with parameters
      const params = new URLSearchParams()
      if (search.query) params.set('q', search.query)
      if (search.filters) params.set('filters', JSON.stringify(search.filters))
      router.push(`/search?${params.toString()}`)
    }
  }

  const deleteSearch = (searchId: string) => {
    const updated = savedSearches.filter(s => s.id !== searchId)
    setSavedSearches(updated)
    localStorage.setItem('savedSearches', JSON.stringify(updated))
    
    toast({
      title: "Search Deleted",
      description: "The saved search has been removed"
    })
  }

  const setDefaultSearch = (searchId: string) => {
    const updated = savedSearches.map(s => ({
      ...s,
      isDefault: s.id === searchId
    }))
    setSavedSearches(updated)
    localStorage.setItem('savedSearches', JSON.stringify(updated))
    
    toast({
      title: "Default Search Set",
      description: "This search will be loaded when you log in"
    })
  }

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'sparkles':
        return <Sparkles className="h-4 w-4" />
      case 'dollar':
        return <DollarSign className="h-4 w-4" />
      case 'trending':
        return <TrendingUp className="h-4 w-4" />
      case 'alert':
        return <AlertCircle className="h-4 w-4" />
      case 'package':
        return <Package className="h-4 w-4" />
      default:
        return <Search className="h-4 w-4" />
    }
  }

  // Quick access dropdown for header
  const QuickAccessDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Star className="h-4 w-4 mr-2" />
          Saved Searches
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Quick Access</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {savedSearches.slice(0, 5).map(search => (
          <DropdownMenuItem 
            key={search.id}
            onClick={() => loadSearch(search)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {getIcon(search.icon)}
                <span>{search.name}</span>
              </div>
              {search.isDefault && (
                <Badge variant="secondary" className="text-xs">
                  Default
                </Badge>
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => setIsDialogOpen(true)}
          className="cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" />
          Save Current Search
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <>
      {/* Quick Access Dropdown */}
      <QuickAccessDropdown />

      {/* Save Search Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingSearch ? 'Edit Saved Search' : 'Save Current Search'}
            </DialogTitle>
            <DialogDescription>
              Save your current search and filters for quick access later
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="search-name">Search Name</Label>
              <Input
                id="search-name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="e.g., Winter Collection 2024"
                className="mt-1"
              />
            </div>
            {currentQuery && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Query:</span> {currentQuery}
                </p>
              </div>
            )}
            {currentFilters && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 font-medium mb-2">Active Filters:</p>
                <div className="flex flex-wrap gap-2">
                  {currentFilters.categories.length > 0 && (
                    <Badge variant="secondary">
                      {currentFilters.categories.length} categories
                    </Badge>
                  )}
                  {(currentFilters.priceRange.min > 0 || currentFilters.priceRange.max < 1000) && (
                    <Badge variant="secondary">
                      Price: ${currentFilters.priceRange.min}-${currentFilters.priceRange.max}
                    </Badge>
                  )}
                  {currentFilters.availability.length > 0 && (
                    <Badge variant="secondary">
                      {currentFilters.availability.length} availability filters
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false)
              setSearchName('')
              setEditingSearch(null)
            }}>
              Cancel
            </Button>
            <Button onClick={saveSearch}>
              <Save className="h-4 w-4 mr-2" />
              {editingSearch ? 'Update' : 'Save'} Search
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Saved Searches Management Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Saved Searches & Presets</span>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {savedSearches.map(search => (
              <div 
                key={search.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <button
                  onClick={() => loadSearch(search)}
                  className="flex-1 flex items-center gap-3 text-left"
                >
                  <div className="p-2 bg-gray-100 rounded">
                    {getIcon(search.icon)}
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {search.name}
                      {search.isDefault && (
                        <Badge variant="secondary" className="text-xs">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Used {search.useCount} times
                      {search.lastUsed && (
                        <> • Last: {new Date(search.lastUsed).toLocaleDateString()}</>
                      )}
                    </div>
                  </div>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => loadSearch(search)}>
                      <Search className="h-4 w-4 mr-2" />
                      Load Search
                    </DropdownMenuItem>
                    {!search.id.startsWith('preset-') && (
                      <>
                        <DropdownMenuItem onClick={() => {
                          setEditingSearch(search)
                          setSearchName(search.name)
                          setIsDialogOpen(true)
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDefaultSearch(search.id)}>
                          <Star className="h-4 w-4 mr-2" />
                          Set as Default
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => deleteSearch(search.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}