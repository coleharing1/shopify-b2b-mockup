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