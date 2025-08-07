"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  DollarSign,
  Package,
  Palette,
  Ruler,
  Building,
  Star,
  RotateCcw
} from "lucide-react"

export interface FilterState {
  categories: string[]
  priceRange: { min: number; max: number }
  availability: string[]
  sizes: string[]
  colors: string[]
  brands: string[]
  rating: number | null
}

interface AdvancedFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  productCount?: number
  isMobile?: boolean
  categories?: string[]
  brands?: string[]
  maxPrice?: number
}

/**
 * @description Advanced product filtering component with multiple filter types
 * @fileoverview Provides category, price, availability, size, color, brand filters
 */
export function AdvancedFilters({
  filters,
  onFiltersChange,
  productCount = 0,
  isMobile = false,
  categories = [],
  brands = [],
  maxPrice = 1000
}: AdvancedFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters)
  const [isOpen, setIsOpen] = useState(false)

  // Sample data for filters (in production, these would come from the product data)
  const availabilityOptions = [
    { value: 'inStock', label: 'In Stock', count: 245 },
    { value: 'lowStock', label: 'Low Stock (<10)', count: 32 },
    { value: 'backorder', label: 'Backorder Available', count: 18 },
    { value: 'comingSoon', label: 'Coming Soon', count: 12 },
    { value: 'newArrival', label: 'New Arrivals', count: 28 }
  ]

  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL']
  
  const colorOptions = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#6B7280' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Yellow', hex: '#F59E0B' },
    { name: 'Purple', hex: '#8B5CF6' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Orange', hex: '#F97316' }
  ]

  const handleFilterChange = (newFilters: FilterState) => {
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = localFilters.categories.includes(category)
      ? localFilters.categories.filter(c => c !== category)
      : [...localFilters.categories, category]
    
    handleFilterChange({ ...localFilters, categories: newCategories })
  }

  const handleAvailabilityToggle = (availability: string) => {
    const newAvailability = localFilters.availability.includes(availability)
      ? localFilters.availability.filter(a => a !== availability)
      : [...localFilters.availability, availability]
    
    handleFilterChange({ ...localFilters, availability: newAvailability })
  }

  const handleSizeToggle = (size: string) => {
    const newSizes = localFilters.sizes.includes(size)
      ? localFilters.sizes.filter(s => s !== size)
      : [...localFilters.sizes, size]
    
    handleFilterChange({ ...localFilters, sizes: newSizes })
  }

  const handleColorToggle = (color: string) => {
    const newColors = localFilters.colors.includes(color)
      ? localFilters.colors.filter(c => c !== color)
      : [...localFilters.colors, color]
    
    handleFilterChange({ ...localFilters, colors: newColors })
  }

  const handleBrandToggle = (brand: string) => {
    const newBrands = localFilters.brands.includes(brand)
      ? localFilters.brands.filter(b => b !== brand)
      : [...localFilters.brands, brand]
    
    handleFilterChange({ ...localFilters, brands: newBrands })
  }

  const handlePriceChange = (value: number[]) => {
    handleFilterChange({
      ...localFilters,
      priceRange: { min: value[0], max: value[1] }
    })
  }

  const handleClearAll = () => {
    const clearedFilters: FilterState = {
      categories: [],
      priceRange: { min: 0, max: maxPrice },
      availability: [],
      sizes: [],
      colors: [],
      brands: [],
      rating: null
    }
    handleFilterChange(clearedFilters)
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (localFilters.categories.length > 0) count += localFilters.categories.length
    if (localFilters.availability.length > 0) count += localFilters.availability.length
    if (localFilters.sizes.length > 0) count += localFilters.sizes.length
    if (localFilters.colors.length > 0) count += localFilters.colors.length
    if (localFilters.brands.length > 0) count += localFilters.brands.length
    if (localFilters.priceRange.min > 0 || localFilters.priceRange.max < maxPrice) count++
    if (localFilters.rating) count++
    return count
  }

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Applied Filters Bar */}
      {getActiveFilterCount() > 0 && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Active Filters ({getActiveFilterCount()})</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-7 text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {localFilters.categories.map(cat => (
              <Badge key={cat} variant="secondary" className="pr-1">
                {cat}
                <button
                  onClick={() => handleCategoryToggle(cat)}
                  className="ml-1 hover:bg-gray-200 rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {(localFilters.priceRange.min > 0 || localFilters.priceRange.max < maxPrice) && (
              <Badge variant="secondary" className="pr-1">
                ${localFilters.priceRange.min} - ${localFilters.priceRange.max}
                <button
                  onClick={() => handleFilterChange({
                    ...localFilters,
                    priceRange: { min: 0, max: maxPrice }
                  })}
                  className="ml-1 hover:bg-gray-200 rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}

      <Accordion type="multiple" defaultValue={["categories", "price", "availability"]} className="w-full">
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Categories</span>
              {localFilters.categories.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {localFilters.categories.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ScrollArea className="h-48">
              <div className="space-y-2 pr-4">
                {categories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={localFilters.categories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                    />
                    <Label
                      htmlFor={category}
                      className="text-sm font-normal cursor-pointer flex-1"
                    >
                      {category}
                    </Label>
                    <span className="text-xs text-gray-500">
                      ({Math.floor(Math.random() * 50) + 10})
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span>Price Range</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={[localFilters.priceRange.min, localFilters.priceRange.max]}
                onValueChange={handlePriceChange}
                max={maxPrice}
                step={10}
                className="w-full"
              />
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={localFilters.priceRange.min}
                  onChange={(e) => handlePriceChange([parseInt(e.target.value) || 0, localFilters.priceRange.max])}
                  className="h-8"
                  min={0}
                  max={localFilters.priceRange.max}
                />
                <span className="text-gray-500">to</span>
                <Input
                  type="number"
                  value={localFilters.priceRange.max}
                  onChange={(e) => handlePriceChange([localFilters.priceRange.min, parseInt(e.target.value) || maxPrice])}
                  className="h-8"
                  min={localFilters.priceRange.min}
                  max={maxPrice}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>$0</span>
                <span>${maxPrice}</span>
              </div>
              {/* Quick price presets */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePriceChange([0, 50])}
                  className="h-7 text-xs"
                >
                  Under $50
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePriceChange([50, 100])}
                  className="h-7 text-xs"
                >
                  $50-$100
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePriceChange([100, 250])}
                  className="h-7 text-xs"
                >
                  $100-$250
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePriceChange([250, maxPrice])}
                  className="h-7 text-xs"
                >
                  $250+
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability */}
        <AccordionItem value="availability">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Availability</span>
              {localFilters.availability.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {localFilters.availability.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {availabilityOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.value}
                    checked={localFilters.availability.includes(option.value)}
                    onChange={() => handleAvailabilityToggle(option.value)}
                  />
                  <Label
                    htmlFor={option.value}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {option.label}
                  </Label>
                  <span className="text-xs text-gray-500">
                    ({option.count})
                  </span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Sizes */}
        <AccordionItem value="sizes">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              <span>Sizes</span>
              {localFilters.sizes.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {localFilters.sizes.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-4 gap-2">
              {sizeOptions.map(size => (
                <Button
                  key={size}
                  variant={localFilters.sizes.includes(size) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSizeToggle(size)}
                  className="h-8"
                >
                  {size}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Colors */}
        <AccordionItem value="colors">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Colors</span>
              {localFilters.colors.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {localFilters.colors.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-5 gap-2">
              {colorOptions.map(color => (
                <button
                  key={color.name}
                  onClick={() => handleColorToggle(color.name)}
                  className={`relative w-full aspect-square rounded-lg border-2 ${
                    localFilters.colors.includes(color.name)
                      ? 'border-primary ring-2 ring-primary ring-offset-2'
                      : 'border-gray-200'
                  }`}
                  title={color.name}
                >
                  <div
                    className="absolute inset-1 rounded"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name === 'White' && (
                    <div className="absolute inset-1 rounded border border-gray-200" />
                  )}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brands */}
        {brands.length > 0 && (
          <AccordionItem value="brands">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>Brands</span>
                {localFilters.brands.length > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 px-1">
                    {localFilters.brands.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-48">
                <div className="space-y-2 pr-4">
                  {brands.map(brand => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand}
                        checked={localFilters.brands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                      />
                      <Label
                        htmlFor={brand}
                        className="text-sm font-normal cursor-pointer flex-1"
                      >
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Rating Filter */}
        <AccordionItem value="rating">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>Rating</span>
              {localFilters.rating && (
                <Badge variant="secondary" className="ml-2 h-5 px-1">
                  {localFilters.rating}★+
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[4, 3, 2, 1].map(rating => (
                <button
                  key={rating}
                  onClick={() => handleFilterChange({
                    ...localFilters,
                    rating: localFilters.rating === rating ? null : rating
                  })}
                  className={`flex items-center gap-2 w-full p-2 rounded hover:bg-gray-50 ${
                    localFilters.rating === rating ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm">& up</span>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Results count */}
      <div className="pt-4 border-t">
        <p className="text-sm text-gray-600 text-center">
          Showing <span className="font-medium">{productCount}</span> products
        </p>
      </div>
    </div>
  )

  // Mobile Sheet
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[85%] sm:w-[400px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Filter Products</SheetTitle>
            <SheetDescription>
              Narrow down your search with filters
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-180px)] p-4">
            <FilterContent />
          </ScrollArea>
          <SheetFooter className="p-4 border-t">
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Apply Filters
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop Sidebar
  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </span>
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary">
              {getActiveFilterCount()} active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FilterContent />
      </CardContent>
    </Card>
  )
}