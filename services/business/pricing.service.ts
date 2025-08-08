/**
 * Pricing calculation service
 * Pure functions for price calculations - easily testable
 */

import { 
  PricingTier, 
  PRICING_TIERS, 
  TIER_CONFIG,
  OrderType,
  ORDER_TYPE_CONFIG
} from '@/config/order-types.config'
import {
  PriceList,
  PriceRule,
  VolumeBreak,
  PriceCalculation as DetailedPriceCalculation,
  PriceBreakdownItem,
  PriceCalculationInput
} from '@/types/pricing-types'

export interface PriceCalculation {
  msrp: number
  tierPrice: number
  discount: number
  discountPercent: number
  finalPrice: number
  savings: number
}

export interface BulkPricing {
  quantity: number
  unitPrice: number
  totalPrice: number
  bulkDiscount?: number
  bulkDiscountAmount?: number
}

/**
 * Calculate price for a specific tier
 */
export function calculateTierPrice(msrp: number, tier: PricingTier): PriceCalculation {
  const tierConfig = TIER_CONFIG[tier]
  if (!tierConfig) {
    throw new Error(`Invalid pricing tier: ${tier}`)
  }
  
  const tierPrice = msrp * (1 - tierConfig.discount)
  const discountAmount = msrp - tierPrice
  
  return {
    msrp,
    tierPrice,
    discount: discountAmount,
    discountPercent: tierConfig.discount * 100,
    finalPrice: tierPrice,
    savings: discountAmount
  }
}

/**
 * Calculate bulk pricing with quantity discounts
 */
export function calculateBulkPrice(
  unitPrice: number,
  quantity: number,
  bulkTiers?: Array<{ minQty: number; discount: number }>
): BulkPricing {
  let bulkDiscount = 0
  
  // Find applicable bulk discount tier
  if (bulkTiers && bulkTiers.length > 0) {
    const applicableTier = bulkTiers
      .filter(tier => quantity >= tier.minQty)
      .sort((a, b) => b.minQty - a.minQty)[0]
    
    if (applicableTier) {
      bulkDiscount = applicableTier.discount
    }
  }
  
  const discountedUnitPrice = unitPrice * (1 - bulkDiscount)
  const totalPrice = discountedUnitPrice * quantity
  const bulkDiscountAmount = bulkDiscount > 0 ? (unitPrice * quantity) - totalPrice : undefined
  
  return {
    quantity,
    unitPrice: discountedUnitPrice,
    totalPrice,
    bulkDiscount: bulkDiscount > 0 ? bulkDiscount : undefined,
    bulkDiscountAmount
  }
}

/**
 * Calculate closeout pricing with additional discount
 */
export function calculateCloseoutPrice(
  originalPrice: number,
  closeoutDiscountPercent: number
): PriceCalculation {
  const discountAmount = originalPrice * (closeoutDiscountPercent / 100)
  const finalPrice = originalPrice - discountAmount
  
  return {
    msrp: originalPrice,
    tierPrice: originalPrice,
    discount: discountAmount,
    discountPercent: closeoutDiscountPercent,
    finalPrice,
    savings: discountAmount
  }
}

/**
 * Calculate prebook deposit amount
 */
export function calculatePrebookDeposit(
  totalPrice: number,
  depositPercent: number = 30
): { depositAmount: number; remainingBalance: number } {
  const depositAmount = totalPrice * (depositPercent / 100)
  const remainingBalance = totalPrice - depositAmount
  
  return {
    depositAmount,
    remainingBalance
  }
}

/**
 * Get effective price for a product based on user's tier and order type
 */
export function getEffectivePrice(
  msrp: number,
  tier: PricingTier,
  orderType: OrderType,
  metadata?: {
    closeoutDiscount?: number
    bulkQuantity?: number
    bulkTiers?: Array<{ minQty: number; discount: number }>
  }
): number {
  // For closeout, apply closeout discount
  if (orderType === 'closeout' && metadata?.closeoutDiscount) {
    const closeoutCalc = calculateCloseoutPrice(msrp, metadata.closeoutDiscount)
    return closeoutCalc.finalPrice
  }
  
  // Calculate base tier price
  const tierCalc = calculateTierPrice(msrp, tier)
  
  // Apply bulk pricing if applicable
  if (metadata?.bulkQuantity && metadata?.bulkTiers) {
    const bulkCalc = calculateBulkPrice(
      tierCalc.tierPrice,
      metadata.bulkQuantity,
      metadata.bulkTiers
    )
    return bulkCalc.unitPrice
  }
  
  return tierCalc.tierPrice
}

/**
 * Validate minimum order value
 */
export function validateMinimumOrderValue(
  orderTotal: number,
  orderType: OrderType,
  tier?: PricingTier
): { isValid: boolean; minimumRequired?: number; shortfall?: number } {
  const orderConfig = ORDER_TYPE_CONFIG[orderType]
  const minOrderValue = orderConfig?.features?.minOrderValue || 0
  
  // Check tier-specific minimum if applicable
  let effectiveMinimum = minOrderValue
  if (tier) {
    const tierConfig = TIER_CONFIG[tier]
    if (tierConfig?.minOrderValue > effectiveMinimum) {
      effectiveMinimum = tierConfig.minOrderValue
    }
  }
  
  const isValid = orderTotal >= effectiveMinimum
  
  return {
    isValid,
    minimumRequired: !isValid ? effectiveMinimum : undefined,
    shortfall: !isValid ? effectiveMinimum - orderTotal : undefined
  }
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format discount percentage for display
 */
export function formatDiscountPercent(percent: number): string {
  return `${Math.round(percent)}% OFF`
}

/**
 * Calculate cart totals with all applicable discounts
 */
export function calculateCartTotals(
  items: Array<{
    unitPrice: number
    quantity: number
    discount?: number
  }>,
  shippingCost: number = 0,
  taxRate: number = 0
): {
  subtotal: number
  discountTotal: number
  shipping: number
  tax: number
  total: number
} {
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = item.unitPrice * item.quantity
    return sum + itemTotal
  }, 0)
  
  const discountTotal = items.reduce((sum, item) => {
    const discount = item.discount || 0
    return sum + (discount * item.quantity)
  }, 0)
  
  const afterDiscount = subtotal - discountTotal
  const tax = afterDiscount * taxRate
  const total = afterDiscount + shippingCost + tax
  
  return {
    subtotal,
    discountTotal,
    shipping: shippingCost,
    tax,
    total
  }
}

/**
 * Calculate customer-specific price with volume breaks
 */
export function calculateCustomerPrice(
  input: PriceCalculationInput,
  priceList?: PriceList
): DetailedPriceCalculation {
  const breakdown: PriceBreakdownItem[] = []
  let currentPrice = input.msrp
  let totalDiscount = 0

  // Start with MSRP
  breakdown.push({
    type: 'base',
    description: 'Manufacturer\'s Suggested Retail Price',
    amount: input.msrp
  })

  // Apply base tier discount if no price list or if price list has a base tier
  const baseTier = (priceList?.baseTier || 'tier-1') as PricingTier
  const tierConfig = TIER_CONFIG[baseTier]
  if (tierConfig) {
    const tierDiscount = input.msrp * tierConfig.discount
    currentPrice -= tierDiscount
    totalDiscount += tierDiscount
    
    breakdown.push({
      type: 'tier',
      description: `${tierConfig.label} Tier Discount (${tierConfig.discount * 100}%)`,
      amount: -tierDiscount,
      discount: tierConfig.discount
    })
  }

  // Check for fixed price override
  if (priceList) {
    const rule = priceList.rules.find(r => r.productId === input.productId)
    
    if (rule?.fixedPrice) {
      // Fixed price overrides everything
      const fixedDiscount = input.msrp - rule.fixedPrice
      breakdown.push({
        type: 'override',
        description: 'Contract Price Override',
        amount: -fixedDiscount,
        discount: fixedDiscount / input.msrp
      })
      currentPrice = rule.fixedPrice
      totalDiscount = fixedDiscount
    } else if (rule?.volumeBreaks && rule.volumeBreaks.length > 0) {
      // Apply volume breaks
      const applicableBreak = getApplicableVolumeBreak(input.quantity, rule.volumeBreaks)
      if (applicableBreak) {
        const volumeDiscount = input.msrp * (applicableBreak.discount - (tierConfig?.discount || 0))
        if (volumeDiscount > 0) {
          currentPrice -= volumeDiscount
          totalDiscount += volumeDiscount
          
          breakdown.push({
            type: 'volume',
            description: `Volume Discount (${input.quantity}+ units: ${applicableBreak.discount * 100}% total)`,
            amount: -volumeDiscount,
            discount: applicableBreak.discount
          })
        }
      }
    }

    // Apply global volume breaks based on order total
    if (priceList.globalVolumeBreaks && input.orderTotal) {
      const globalBreak = getApplicableGlobalBreak(input.orderTotal, priceList.globalVolumeBreaks)
      if (globalBreak) {
        const globalDiscount = currentPrice * globalBreak.additionalDiscount
        currentPrice -= globalDiscount
        totalDiscount += globalDiscount
        
        breakdown.push({
          type: 'global',
          description: `Order Volume Discount ($${input.orderTotal.toLocaleString()}+: ${globalBreak.additionalDiscount * 100}% extra)`,
          amount: -globalDiscount,
          discount: globalBreak.additionalDiscount
        })
      }
    }

    // Apply clearance discount if applicable
    if (input.orderType === 'closeout' && priceList.clearanceRules) {
      const clearanceDiscount = currentPrice * priceList.clearanceRules.additionalDiscount
      currentPrice -= clearanceDiscount
      totalDiscount += clearanceDiscount
      
      breakdown.push({
        type: 'clearance',
        description: `Clearance Additional Discount (${priceList.clearanceRules.additionalDiscount * 100}%)`,
        amount: -clearanceDiscount,
        discount: priceList.clearanceRules.additionalDiscount
      })
    }
  }

  const unitPrice = Math.max(currentPrice, 0.01) // Never go below 1 cent
  const totalPrice = unitPrice * input.quantity

  return {
    productId: input.productId,
    quantity: input.quantity,
    msrp: input.msrp,
    listPrice: input.msrp,
    tierDiscount: tierConfig?.discount || 0,
    volumeDiscount: 0, // Calculated above
    globalDiscount: 0, // Calculated above
    clearanceDiscount: 0, // Calculated above
    fixedPriceOverride: priceList?.rules.some(r => r.productId === input.productId && r.fixedPrice) || false,
    finalPrice: unitPrice,
    unitPrice,
    totalPrice,
    savings: input.msrp - unitPrice,
    savingsPercent: ((input.msrp - unitPrice) / input.msrp) * 100,
    appliedRules: breakdown.map(b => b.description),
    priceListId: priceList?.id,
    breakdown
  }
}

/**
 * Get applicable volume break for a quantity
 */
function getApplicableVolumeBreak(quantity: number, breaks: VolumeBreak[]): VolumeBreak | null {
  const sortedBreaks = [...breaks].sort((a, b) => b.minQty - a.minQty)
  return sortedBreaks.find(b => quantity >= b.minQty) || null
}

/**
 * Get applicable global volume break for order total
 */
function getApplicableGlobalBreak(orderTotal: number, breaks: { minOrderValue: number; additionalDiscount: number }[]): { minOrderValue: number; additionalDiscount: number } | null {
  const sortedBreaks = [...breaks].sort((a, b) => b.minOrderValue - a.minOrderValue)
  return sortedBreaks.find(b => orderTotal >= b.minOrderValue) || null
}

/**
 * Get volume breaks for a product
 */
export function getVolumeBreaks(productId: string, priceList?: PriceList): VolumeBreak[] {
  if (!priceList) return []
  
  const rule = priceList.rules.find(r => r.productId === productId)
  return rule?.volumeBreaks || []
}

/**
 * Get price breakdown for transparency
 */
export function getPriceBreakdown(
  product: { id: string; msrp: number },
  quantity: number,
  companyId: string,
  priceList?: PriceList,
  orderTotal?: number
): DetailedPriceCalculation {
  return calculateCustomerPrice({
    productId: product.id,
    msrp: product.msrp,
    quantity,
    companyId,
    orderTotal
  }, priceList)
}