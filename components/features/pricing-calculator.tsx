'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Calculator, 
  TrendingDown, 
  Package, 
  DollarSign,
  Info,
  Download
} from 'lucide-react'
import { VolumeBreak, PriceBreakdownItem } from '@/types/pricing-types'
import { formatCurrency } from '@/lib/utils'

interface PricingCalculatorProps {
  productId: string
  productName: string
  msrp: number
  volumeBreaks?: VolumeBreak[]
  currentQuantity?: number
  onQuantityChange?: (quantity: number) => void
  showBreakdown?: boolean
  companyTier?: string
  priceListName?: string
}

export function PricingCalculator({
  productId,
  productName,
  msrp,
  volumeBreaks = [],
  currentQuantity = 1,
  onQuantityChange,
  showBreakdown = true,
  companyTier = 'tier-1',
  priceListName
}: PricingCalculatorProps) {
  const [quantity, setQuantity] = useState(currentQuantity)
  const [calculation, setCalculation] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    calculatePrice(quantity)
  }, [quantity, productId])

  const calculatePrice = async (qty: number) => {
    setLoading(true)
    try {
      const response = await fetch('/api/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          msrp,
          quantity: qty
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setCalculation(data.calculation)
      }
    } catch (error) {
      console.error('Failed to calculate price:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (value: string) => {
    const qty = Math.max(1, parseInt(value) || 1)
    setQuantity(qty)
    onQuantityChange?.(qty)
  }

  const getApplicableVolumeBreak = (qty: number): VolumeBreak | null => {
    if (!volumeBreaks.length) return null
    const sorted = [...volumeBreaks].sort((a, b) => b.minQty - a.minQty)
    return sorted.find(b => qty >= b.minQty) || null
  }

  const currentBreak = getApplicableVolumeBreak(quantity)
  const nextBreak = volumeBreaks
    .filter(b => b.minQty > quantity)
    .sort((a, b) => a.minQty - b.minQty)[0]

  return (
    <div className="space-y-4">
      {/* Quantity Input */}
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="w-32"
          />
          {nextBreak && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuantityChange(String(nextBreak.minQty))}
            >
              Buy {nextBreak.minQty} for {(nextBreak.discount * 100).toFixed(0)}% off
            </Button>
          )}
        </div>
      </div>

      {/* Volume Breaks Table */}
      {volumeBreaks.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Volume Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {volumeBreaks.map((vb, idx) => {
                const isActive = currentBreak?.minQty === vb.minQty
                const unitPrice = msrp * (1 - vb.discount)
                
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 rounded ${
                      isActive ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">
                        {vb.minQty}+ units
                      </span>
                      {isActive && (
                        <Badge variant="secondary" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatCurrency(unitPrice)}/ea
                      </div>
                      <div className="text-xs text-green-600">
                        Save {(vb.discount * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Calculation Result */}
      {calculation && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Your Price
              {priceListName && (
                <Badge variant="outline" className="ml-2 text-xs">
                  {priceListName}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Summary */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(calculation.unitPrice)}
                    <span className="text-sm font-normal text-gray-500">/ea</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Total: {formatCurrency(calculation.totalPrice)} for {quantity} units
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100">
                  {calculation.savingsPercent.toFixed(0)}% OFF
                </Badge>
              </div>

              {/* Breakdown */}
              {showBreakdown && calculation.breakdown && (
                <div className="pt-3 border-t">
                  <div className="text-xs font-medium text-gray-600 mb-2 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Price Breakdown
                  </div>
                  <div className="space-y-1">
                    {calculation.breakdown.map((item: PriceBreakdownItem, idx: number) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-gray-600">{item.description}</span>
                        <span className={item.amount < 0 ? 'text-green-600' : ''}>
                          {item.amount < 0 ? '-' : ''}
                          {formatCurrency(Math.abs(item.amount))}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Savings */}
              <div className="pt-3 border-t">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">List Price</span>
                  <span className="text-sm line-through text-gray-400">
                    {formatCurrency(msrp * quantity)}
                  </span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-sm text-green-600">Your Savings</span>
                  <span className="text-sm text-green-600">
                    {formatCurrency(calculation.savings * quantity)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Quote Button */}
      <Button variant="outline" className="w-full">
        <Download className="h-4 w-4 mr-2" />
        Download Price Quote
      </Button>
    </div>
  )
}