/**
 * Centralized order types configuration
 * Single source of truth for order type behavior and styling
 */

export const ORDER_TYPES = {
  AT_ONCE: 'at-once',
  PREBOOK: 'prebook',
  CLOSEOUT: 'closeout'
} as const

export type OrderType = typeof ORDER_TYPES[keyof typeof ORDER_TYPES]

// Order type display configuration
export const ORDER_TYPE_CONFIG = {
  [ORDER_TYPES.AT_ONCE]: {
    label: 'At Once',
    description: 'Immediate stock for quick delivery',
    color: '#10b981', // emerald-500
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    borderColor: 'border-emerald-200',
    icon: 'Package',
    features: {
      immediateStock: true,
      allowBackorder: true,
      requiresDeposit: false,
      allowMixedSizes: true,
      minOrderValue: 500
    }
  },
  [ORDER_TYPES.PREBOOK]: {
    label: 'Prebook',
    description: 'Reserve future season inventory',
    color: '#6366f1', // indigo-500
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    borderColor: 'border-indigo-200',
    icon: 'Calendar',
    features: {
      immediateStock: false,
      allowBackorder: false,
      requiresDeposit: true,
      depositPercent: 30,
      allowCancellation: true,
      cancellationDeadlineDays: 30,
      requiresFullSizeRun: true,
      minOrderValue: 1000
    }
  },
  [ORDER_TYPES.CLOSEOUT]: {
    label: 'Closeout',
    description: 'Limited-time clearance deals',
    color: '#ef4444', // red-500
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    borderColor: 'border-red-200',
    icon: 'Zap',
    features: {
      immediateStock: true,
      allowBackorder: false,
      requiresDeposit: false,
      finalSale: true,
      noReturns: true,
      limitedQuantity: true,
      minOrderValue: 250
    }
  }
}

// Pricing tier configuration
export const PRICING_TIERS = {
  TIER_1: 'tier-1',
  TIER_2: 'tier-2', 
  TIER_3: 'tier-3'
} as const

export type PricingTier = typeof PRICING_TIERS[keyof typeof PRICING_TIERS]

export const TIER_CONFIG = {
  [PRICING_TIERS.TIER_1]: {
    label: 'Bronze',
    discount: 0.3, // 30% off MSRP
    minOrderValue: 500,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  [PRICING_TIERS.TIER_2]: {
    label: 'Silver',
    discount: 0.4, // 40% off MSRP
    minOrderValue: 2500,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  },
  [PRICING_TIERS.TIER_3]: {
    label: 'Gold',
    discount: 0.5, // 50% off MSRP
    minOrderValue: 5000,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  }
}

// Helper functions
export function getTierPrice(msrp: number, tier: PricingTier): number {
  const config = TIER_CONFIG[tier]
  return msrp * (1 - config.discount)
}

export function getTierLabel(tier: PricingTier): string {
  return TIER_CONFIG[tier]?.label || 'Unknown'
}

export function getOrderTypeColor(orderType: OrderType): string {
  return ORDER_TYPE_CONFIG[orderType]?.color || '#6b7280'
}

export function getOrderTypeFeatures(orderType: OrderType) {
  return ORDER_TYPE_CONFIG[orderType]?.features || {}
}

// Validation rules per order type
export const ORDER_VALIDATION_RULES = {
  [ORDER_TYPES.AT_ONCE]: {
    minQuantity: 1,
    maxQuantity: 9999,
    allowPartialShipment: true,
    requiresApproval: false
  },
  [ORDER_TYPES.PREBOOK]: {
    minQuantity: 12, // Full size run
    maxQuantity: 999,
    allowPartialShipment: false,
    requiresApproval: true,
    leadTimeDays: 90
  },
  [ORDER_TYPES.CLOSEOUT]: {
    minQuantity: 1,
    maxQuantity: 100, // Limited availability
    allowPartialShipment: false,
    requiresApproval: false,
    expirationHours: 48
  }
}