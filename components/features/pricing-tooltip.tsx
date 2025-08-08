'use client'

import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Info, TrendingDown, Tag, Percent, Calculator } from 'lucide-react'
import { formatCurrency } from '@/lib/mock-data'
import { PriceBreakdownItem } from '@/types/pricing-types'

interface PricingTooltipProps {
  msrp: number
  finalPrice: number
  breakdown?: PriceBreakdownItem[]
  quantity?: number
  tier?: string
  children?: React.ReactNode
}

export function PricingTooltip({
  msrp,
  finalPrice,
  breakdown,
  quantity = 1,
  tier = 'tier-1',
  children
}: PricingTooltipProps) {
  const [open, setOpen] = useState(false)
  const totalDiscount = ((msrp - finalPrice) / msrp * 100).toFixed(1)
  const savings = msrp - finalPrice

  // Generate breakdown if not provided
  const priceBreakdown = breakdown || [
    {
      type: 'base',
      description: 'MSRP',
      amount: msrp,
      discount: 0
    },
    {
      type: 'tier',
      description: `${tier.replace('-', ' ').toUpperCase()} tier discount`,
      amount: finalPrice,
      discount: parseFloat(totalDiscount)
    }
  ]

  return (
    <TooltipProvider>
      <Tooltip open={open}>
        <TooltipTrigger asChild>
          {children || (
            <button className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors">
              <Info className="h-3 w-3" />
              <span className="underline underline-offset-2">Price details</span>
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent className="w-80 p-0">
          <div className="p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b">
              <h4 className="font-medium flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Price Calculation
              </h4>
              {quantity > 1 && (
                <Badge variant="secondary" className="text-xs">
                  Qty: {quantity}
                </Badge>
              )}
            </div>

            {/* Breakdown */}
            <div className="space-y-2">
              {priceBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {item.type === 'base' && <Tag className="h-3 w-3 text-gray-400" />}
                    {item.type === 'tier' && <TrendingDown className="h-3 w-3 text-blue-500" />}
                    {item.type === 'volume' && <Percent className="h-3 w-3 text-green-500" />}
                    {item.type === 'clearance' && <TrendingDown className="h-3 w-3 text-red-500" />}
                    <span className={item.type === 'base' ? 'text-gray-500' : ''}>
                      {item.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {typeof item.discount === 'number' && item.discount > 0 && (
                      <Badge variant="outline" className="text-xs">
                        -{item.discount}%
                      </Badge>
                    )}
                    <span className={item.type === 'base' ? 'line-through text-gray-400' : 'font-medium'}>
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="pt-3 border-t space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Your Price</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(finalPrice)}
                </span>
              </div>
              {quantity > 1 && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Unit price</span>
                  <span>{formatCurrency(finalPrice / quantity)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">You save</span>
                <span className="text-green-600 font-medium">
                  {formatCurrency(savings * quantity)} ({totalDiscount}%)
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500">
                Pricing based on your account tier and order quantity. 
                Additional discounts may apply for bulk orders.
              </p>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Simplified version for inline use
export function PriceInfoIcon({ 
  msrp, 
  finalPrice,
  className = "" 
}: { 
  msrp: number
  finalPrice: number
  className?: string 
}) {
  return (
    <PricingTooltip msrp={msrp} finalPrice={finalPrice}>
      <Info className={`h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help transition-colors ${className}`} />
    </PricingTooltip>
  )
}