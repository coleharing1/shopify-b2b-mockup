"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  ShoppingCart, 
  Heart, 
  Eye, 
  Plus, 
  Minus, 
  Check,
  Zap,
  TrendingUp,
  Package
} from "lucide-react"
import { toast } from "sonner"

interface ProductVariant {
  id: string
  color: string
  colorCode?: string
  size?: string
  inventory: number
}

interface QuickOrderProduct {
  id: string
  sku: string
  name: string
  category: string
  images: string[]
  msrp: number
  wholesalePrice: number
  variants?: ProductVariant[]
  tags?: string[]
  availableDate?: string
  isNew?: boolean
  isTrending?: boolean
  discountPercent?: number
}

interface QuickOrderCardProps {
  product: QuickOrderProduct
  onQuickAdd: (product: QuickOrderProduct, quantity: number, variant?: ProductVariant) => void
  onToggleFavorite?: (productId: string) => void
  isFavorite?: boolean
  compactMode?: boolean
}

export function QuickOrderCard({ 
  product, 
  onQuickAdd, 
  onToggleFavorite,
  isFavorite = false,
  compactMode = false 
}: QuickOrderCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  )
  const [isAdding, setIsAdding] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const handleQuickAdd = async () => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      toast.error("Please select a variant")
      return
    }

    setIsAdding(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    onQuickAdd(product, quantity, selectedVariant)
    
    setIsAdding(false)
    setShowSuccess(true)
    
    // Reset after 2 seconds
    setTimeout(() => {
      setShowSuccess(false)
      setQuantity(1)
    }, 2000)
    
    toast.success(`Added ${quantity} × ${product.name} to cart`)
  }

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  const savings = product.msrp - product.wholesalePrice
  const savingsPercent = Math.round((savings / product.msrp) * 100)

  // Calculate if low stock
  const totalInventory = selectedVariant?.inventory || 
    product.variants?.reduce((sum, v) => sum + v.inventory, 0) || 100
  const isLowStock = totalInventory < 20

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        isHovered && "shadow-xl",
        compactMode && "max-w-sm"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {product.isNew && (
          <Badge className="bg-blue-500 text-white">NEW</Badge>
        )}
        {product.isTrending && (
          <Badge className="bg-orange-500 text-white">
            <TrendingUp className="w-3 h-3 mr-1" />
            TRENDING
          </Badge>
        )}
        {product.discountPercent && (
          <Badge className="bg-red-500 text-white">
            -{product.discountPercent}%
          </Badge>
        )}
        {isLowStock && (
          <Badge variant="destructive">
            <Zap className="w-3 h-3 mr-1" />
            Low Stock
          </Badge>
        )}
      </div>

      {/* Favorite Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur hover:bg-white"
        onClick={(e) => {
          e.preventDefault()
          onToggleFavorite?.(product.id)
        }}
      >
        <Heart 
          className={cn(
            "w-5 h-5",
            isFavorite && "fill-red-500 text-red-500"
          )} 
        />
      </Button>

      {/* Product Image */}
      <Link href={`/retailer/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.images[imageIndex] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Quick View Button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault()
              toast.info("Quick view coming soon!")
            }}
          >
            <Eye className="w-4 h-4 mr-1" />
            Quick View
          </Button>
        </div>
      </Link>

      <CardContent className="p-4">
        {/* Product Info */}
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
          <Link href={`/retailer/products/${product.id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
        </div>

        {/* Pricing */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-green-600">
              ${product.wholesalePrice.toFixed(2)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              MSRP: ${product.msrp.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-green-600">
            Save ${savings.toFixed(2)} ({savingsPercent}%)
          </p>
        </div>

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 mb-2">
              Select Variant:
            </p>
            <div className="flex flex-wrap gap-1">
              {product.variants.map((variant) => (
                <Button
                  key={variant.id}
                  variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                  size="sm"
                  className="h-8 px-2"
                  onClick={() => setSelectedVariant(variant)}
                >
                  {variant.colorCode && (
                    <div 
                      className="w-4 h-4 rounded-full mr-1 border"
                      style={{ backgroundColor: variant.colorCode }}
                    />
                  )}
                  <span className="text-xs">
                    {variant.color}
                    {variant.size && ` / ${variant.size}`}
                  </span>
                  {variant.inventory < 10 && (
                    <Badge variant="destructive" className="ml-1 px-1 py-0 text-[10px]">
                      {variant.inventory}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
            {product.variants.length > 5 && (
              <p className="text-xs text-gray-500 mt-1">
                +{product.variants.length - 5} more options
              </p>
            )}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={decrementQuantity}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 h-8 text-center border-0 focus:ring-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={incrementQuantity}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Quick Add Button */}
          <Button
            className={cn(
              "flex-1",
              showSuccess && "bg-green-600 hover:bg-green-700"
            )}
            onClick={handleQuickAdd}
            disabled={isAdding}
          >
            {showSuccess ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Added!
              </>
            ) : isAdding ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 mr-2" />
                Quick Add
              </>
            )}
          </Button>
        </div>

        {/* Additional Info */}
        {product.availableDate && (
          <div className="pt-3 border-t">
            <p className="text-xs text-gray-600 flex items-center">
              <Package className="w-3 h-3 mr-1" />
              Ships: {product.availableDate}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}