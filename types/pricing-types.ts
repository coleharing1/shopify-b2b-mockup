/**
 * @fileoverview TypeScript types for customer-specific pricing
 * @description Defines interfaces for price lists, volume breaks, and pricing rules
 */

export type PricingTier = 'tier-1' | 'tier-2' | 'tier-3'

/**
 * Volume break discount tier
 */
export interface VolumeBreak {
  minQty: number
  discount: number // Decimal (0.50 = 50% off)
  maxQty?: number
}

/**
 * Fixed price override
 */
export interface FixedPriceOverride {
  productId: string
  price: number
  currency?: string
  reason?: string
}

/**
 * Product-specific pricing rule
 */
export interface PriceRule {
  productId: string
  volumeBreaks: VolumeBreak[]
  fixedPrice: number | null
  notes?: string
  effectiveFrom?: string
  effectiveTo?: string
}

/**
 * Global volume break applied to entire order
 */
export interface GlobalVolumeBreak {
  minOrderValue: number
  additionalDiscount: number
}

/**
 * Clearance-specific pricing rules
 */
export interface ClearanceRules {
  additionalDiscount: number
  minOrderQty: number
  applyToCloseoutOnly: boolean
  maxDiscountPercent?: number
}

/**
 * Complete price list for a company
 */
export interface PriceList {
  id: string
  name: string
  description?: string
  companyId: string | null // null for global lists
  baseTier: PricingTier | null
  rules: PriceRule[]
  globalVolumeBreaks: GlobalVolumeBreak[]
  clearanceRules?: ClearanceRules
  currency?: string
  effectiveFrom: string
  effectiveTo: string
  createdAt?: string
  updatedAt?: string
  createdBy?: string
}

/**
 * Assignment of a price list to a company
 */
export interface PriceListAssignment {
  companyId: string
  priceListId: string
  assignedBy: string
  assignedAt: string
  priority: number // Lower number = higher priority
  notes?: string
}

/**
 * Price calculation input
 */
export interface PriceCalculationInput {
  productId: string
  msrp: number
  quantity: number
  companyId: string
  orderType?: 'at-once' | 'prebook' | 'closeout'
  orderTotal?: number
}

/**
 * Price calculation result with breakdown
 */
export interface PriceCalculation {
  productId: string
  quantity: number
  msrp: number
  listPrice: number
  tierDiscount: number
  volumeDiscount: number
  globalDiscount: number
  clearanceDiscount: number
  fixedPriceOverride: boolean
  finalPrice: number
  unitPrice: number
  totalPrice: number
  savings: number
  savingsPercent: number
  appliedRules: string[]
  priceListId?: string
  breakdown: PriceBreakdownItem[]
}

/**
 * Individual line in price breakdown
 */
export interface PriceBreakdownItem {
  type: 'base' | 'tier' | 'volume' | 'global' | 'clearance' | 'override'
  description: string
  amount: number
  discount?: number
  ruleId?: string
}

/**
 * Customer pricing context
 */
export interface CustomerPricingContext {
  companyId: string
  companyName: string
  baseTier: PricingTier
  priceList?: PriceList
  assignment?: PriceListAssignment
  effectiveDate: string
}

/**
 * Bulk pricing request
 */
export interface BulkPricingRequest {
  companyId: string
  items: Array<{
    productId: string
    quantity: number
  }>
  orderType?: 'at-once' | 'prebook' | 'closeout'
}

/**
 * Bulk pricing response
 */
export interface BulkPricingResponse {
  companyId: string
  calculations: PriceCalculation[]
  orderSubtotal: number
  totalDiscount: number
  orderTotal: number
  averageDiscount: number
}