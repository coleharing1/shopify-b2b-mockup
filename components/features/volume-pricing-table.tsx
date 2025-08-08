'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingDown, Package, Star } from 'lucide-react'
import { VolumeBreak } from '@/types/pricing-types'
import { formatCurrency } from '@/lib/utils'

interface VolumePricingTableProps {
  msrp: number
  volumeBreaks: VolumeBreak[]
  currentQuantity?: number
  baseTierDiscount?: number
  className?: string
}

export function VolumePricingTable({
  msrp,
  volumeBreaks,
  currentQuantity = 1,
  baseTierDiscount = 0,
  className = ''
}: VolumePricingTableProps) {
  if (!volumeBreaks || volumeBreaks.length === 0) {
    return null
  }

  const getActiveBreak = () => {
    const sorted = [...volumeBreaks].sort((a, b) => b.minQty - a.minQty)
    return sorted.find(b => currentQuantity >= b.minQty)
  }

  const activeBreak = getActiveBreak()

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Volume Pricing Available
          </span>
          <Badge variant="secondary" className="text-xs">
            Buy More, Save More
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Base Price */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <span className="text-sm">1+ units</span>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">
                {formatCurrency(msrp * (1 - baseTierDiscount))}
                <span className="text-xs text-gray-500">/ea</span>
              </div>
              {baseTierDiscount > 0 && (
                <div className="text-xs text-gray-500">
                  {(baseTierDiscount * 100).toFixed(0)}% off MSRP
                </div>
              )}
            </div>
          </div>

          {/* Volume Breaks */}
          {volumeBreaks.map((vb, idx) => {
            const isActive = activeBreak?.minQty === vb.minQty
            const unitPrice = msrp * (1 - vb.discount)
            const additionalSavings = vb.discount - baseTierDiscount
            
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium">
                    {vb.minQty}+ units
                  </span>
                  {isActive && (
                    <Badge variant="secondary" className="text-xs bg-blue-100">
                      Current
                    </Badge>
                  )}
                  {idx === 0 && (
                    <Star className="h-3 w-3 text-yellow-500" />
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {formatCurrency(unitPrice)}
                    <span className="text-xs text-gray-500">/ea</span>
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    Total {(vb.discount * 100).toFixed(0)}% off
                    {additionalSavings > 0 && (
                      <span className="text-gray-500">
                        {' '}(+{(additionalSavings * 100).toFixed(0)}%)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Savings Message */}
        {volumeBreaks.length > 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-green-800">
              <strong>💰 Maximum Savings:</strong> Order {volumeBreaks[volumeBreaks.length - 1].minQty}+ units 
              to save {((volumeBreaks[volumeBreaks.length - 1].discount) * 100).toFixed(0)}% off MSRP
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}