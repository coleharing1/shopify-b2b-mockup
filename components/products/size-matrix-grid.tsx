"use client"

import React, { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Copy, Clipboard, Check, AlertCircle, Package } from "lucide-react"
import { toast } from "sonner"

interface SizeInventory {
  size: string
  available: number
  ordered?: number
}

interface ColorVariant {
  color: string
  colorCode: string
  sizes: SizeInventory[]
}

interface SizeMatrixProduct {
  id: string
  sku: string
  name: string
  image: string
  msrp: number
  wholesalePrice: number
  availableDate?: string
  variants: ColorVariant[]
}

interface SizeMatrixGridProps {
  product: SizeMatrixProduct
  onAddToCart: (items: any[]) => void
  compactMode?: boolean
}

export function SizeMatrixGrid({ product, onAddToCart, compactMode = false }: SizeMatrixGridProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [copiedRow, setCopiedRow] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // All unique sizes across all color variants
  const allSizes = useMemo(() => {
    const sizeSet = new Set<string>()
    product.variants.forEach(variant => {
      variant.sizes.forEach(size => sizeSet.add(size.size))
    })
    return Array.from(sizeSet).sort((a, b) => {
      // Custom size sorting (XS, S, M, L, XL, XXL, then numeric)
      const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']
      const aIndex = sizeOrder.indexOf(a)
      const bIndex = sizeOrder.indexOf(b)
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1
      
      // Numeric comparison for shoe sizes
      const aNum = parseFloat(a)
      const bNum = parseFloat(b)
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum
      
      return a.localeCompare(b)
    })
  }, [product.variants])

  // Calculate row total for a color variant
  const getRowTotal = useCallback((color: string) => {
    let total = 0
    allSizes.forEach(size => {
      const key = `${color}-${size}`
      total += quantities[key] || 0
    })
    return total
  }, [quantities, allSizes])

  // Calculate grand total
  const grandTotal = useMemo(() => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  }, [quantities])

  // Calculate total price
  const totalPrice = useMemo(() => {
    return grandTotal * product.wholesalePrice
  }, [grandTotal, product.wholesalePrice])

  // Get inventory status color
  const getInventoryColor = (available: number) => {
    if (available === 0) return "bg-red-100 text-red-800"
    if (available < 10) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  // Get cell background based on inventory
  const getCellBackground = (available: number, hasQuantity: boolean) => {
    if (hasQuantity) return "bg-blue-50 border-blue-300"
    if (available === 0) return "bg-gray-50"
    return ""
  }

  // Handle quantity change
  const handleQuantityChange = (color: string, size: string, value: string) => {
    const key = `${color}-${size}`
    const numValue = parseInt(value) || 0
    
    if (numValue >= 0) {
      setQuantities(prev => ({
        ...prev,
        [key]: numValue
      }))
    }
  }

  // Copy row quantities
  const copyRow = (color: string) => {
    const rowData: Record<string, number> = {}
    allSizes.forEach(size => {
      const key = `${color}-${size}`
      if (quantities[key]) {
        rowData[size] = quantities[key]
      }
    })
    
    // Store in clipboard as JSON
    navigator.clipboard.writeText(JSON.stringify(rowData))
    setCopiedRow(color)
    toast.success("Row copied to clipboard")
    
    setTimeout(() => setCopiedRow(null), 2000)
  }

  // Paste row quantities
  const pasteRow = async (color: string) => {
    try {
      const text = await navigator.clipboard.readText()
      const rowData = JSON.parse(text)
      
      const newQuantities = { ...quantities }
      Object.entries(rowData).forEach(([size, qty]) => {
        const key = `${color}-${size}`
        newQuantities[key] = qty as number
      })
      
      setQuantities(newQuantities)
      toast.success("Row pasted successfully")
    } catch (error) {
      toast.error("Failed to paste. Make sure you've copied a row first.")
    }
  }

  // Add to cart
  const handleAddToCart = () => {
    const items: any[] = []
    
    product.variants.forEach(variant => {
      variant.sizes.forEach(sizeInfo => {
        const key = `${variant.color}-${sizeInfo.size}`
        const qty = quantities[key]
        
        if (qty && qty > 0) {
          items.push({
            productId: product.id,
            sku: `${product.sku}-${variant.color}-${sizeInfo.size}`,
            name: `${product.name} - ${variant.color} / ${sizeInfo.size}`,
            color: variant.color,
            size: sizeInfo.size,
            quantity: qty,
            unitPrice: product.wholesalePrice,
            msrp: product.msrp
          })
        }
      })
    })
    
    if (items.length > 0) {
      onAddToCart(items)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      
      // Clear quantities after adding
      setQuantities({})
    } else {
      toast.error("Please enter quantities before adding to cart")
    }
  }

  return (
    <Card className={cn("w-full", compactMode && "text-sm")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            {!compactMode && (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
            )}
            <div>
              <CardTitle className={cn("text-lg", compactMode && "text-base")}>
                {product.name}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">SKU: {product.sku}</p>
              <div className="flex gap-4 mt-2">
                <span className="text-sm">
                  MSRP: <span className="font-semibold">${product.msrp.toFixed(2)}</span>
                </span>
                <span className="text-sm">
                  Wholesale: <span className="font-semibold text-green-600">
                    ${product.wholesalePrice.toFixed(2)}
                  </span>
                </span>
              </div>
              {product.availableDate && (
                <Badge variant="outline" className="mt-2">
                  <Package className="w-3 h-3 mr-1" />
                  Ships: {product.availableDate}
                </Badge>
              )}
            </div>
          </div>
          
          {grandTotal > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Units</p>
              <p className="text-2xl font-bold">{grandTotal}</p>
              <p className="text-sm text-green-600 font-semibold">
                ${totalPrice.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 border-b-2 border-gray-300 sticky left-0 bg-white z-10">
                  Color
                </th>
                {allSizes.map(size => (
                  <th key={size} className="text-center p-2 border-b-2 border-gray-300 min-w-[70px]">
                    {size}
                  </th>
                ))}
                <th className="text-center p-2 border-b-2 border-gray-300 min-w-[80px]">
                  Total
                </th>
                <th className="text-center p-2 border-b-2 border-gray-300 min-w-[120px]">
                  Actions
                </th>
              </tr>
            </thead>
            
            <tbody>
              {product.variants.map((variant, variantIndex) => {
                const rowTotal = getRowTotal(variant.color)
                
                return (
                  <tr key={variant.color} className={variantIndex % 2 === 0 ? "bg-gray-50" : ""}>
                    <td className="p-2 border-b sticky left-0 bg-inherit font-medium">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded border"
                          style={{ backgroundColor: variant.colorCode }}
                        />
                        {variant.color}
                      </div>
                    </td>
                    
                    {allSizes.map(size => {
                      const sizeInfo = variant.sizes.find(s => s.size === size)
                      const key = `${variant.color}-${size}`
                      const qty = quantities[key] || 0
                      const available = sizeInfo?.available || 0
                      
                      if (!sizeInfo) {
                        return (
                          <td key={size} className="p-1 border-b text-center">
                            <div className="h-10 bg-gray-100" />
                          </td>
                        )
                      }
                      
                      return (
                        <td 
                          key={size} 
                          className={cn(
                            "p-1 border-b",
                            getCellBackground(available, qty > 0)
                          )}
                        >
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              max={available}
                              value={qty || ""}
                              onChange={(e) => handleQuantityChange(variant.color, size, e.target.value)}
                              className={cn(
                                "w-full h-10 text-center",
                                available === 0 && "opacity-50 cursor-not-allowed"
                              )}
                              disabled={available === 0}
                              placeholder="0"
                            />
                            <div className={cn(
                              "absolute -top-2 -right-2 text-xs px-1 rounded",
                              getInventoryColor(available)
                            )}>
                              {available}
                            </div>
                          </div>
                        </td>
                      )
                    })}
                    
                    <td className="p-2 border-b text-center font-semibold">
                      {rowTotal > 0 && rowTotal}
                    </td>
                    
                    <td className="p-2 border-b">
                      <div className="flex gap-1 justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyRow(variant.color)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedRow === variant.color ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => pasteRow(variant.color)}
                          className="h-8 w-8 p-0"
                        >
                          <Clipboard className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded" />
              <span>In Stock</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 rounded" />
              <span>Low Stock</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded" />
              <span>Out of Stock</span>
            </div>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            disabled={grandTotal === 0}
            className={cn(
              "min-w-[200px]",
              showSuccess && "bg-green-600 hover:bg-green-700"
            )}
          >
            {showSuccess ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Added to Cart!
              </>
            ) : (
              <>
                Add {grandTotal > 0 && `${grandTotal} Units`} to Cart
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}