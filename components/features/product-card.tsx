import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Product } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/mock-data"

interface ProductCardProps {
  product: Product
  pricingTier: string
  onAddToCart?: () => void
}

/**
 * @description Product display card for catalog grid
 * @fileoverview Shows product info with account-specific pricing
 */
export function ProductCard({ product, pricingTier, onAddToCart }: ProductCardProps) {
  const tierPricing = product.pricing[pricingTier]
  const hasLowInventory = product.variants?.some(v => v.inventory < 10)
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Link href={`/retailer/products/${product.id}`}>
        <div className="aspect-square relative overflow-hidden bg-gray-100">
          <Image
            src={product.images[0] || "/api/placeholder/400/400"}
            alt={product.name}
            width={400}
            height={400}
            className="object-cover w-full h-full hover:scale-105 transition-transform"
          />
          {hasLowInventory && (
            <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Low Stock
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4 space-y-3">
        <Link href={`/retailer/products/${product.id}`}>
          <h3 className="font-medium text-gray-900 hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600">SKU: {product.sku}</p>
        
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(tierPricing.price)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              MSRP {formatCurrency(product.msrp)}
            </span>
          </div>
          <p className="text-xs text-green-600 font-medium">
            You save {((1 - tierPricing.price / product.msrp) * 100).toFixed(0)}%
          </p>
        </div>
        
        <Button 
          className="w-full" 
          onClick={(e) => {
            e.preventDefault()
            onAddToCart?.()
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  )
}