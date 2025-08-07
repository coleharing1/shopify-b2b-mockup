/**
 * @description B2B Order Types System - Type Definitions
 * @fileoverview Core interfaces for At-Once, Prebook, and Closeout order types
 */

// Core Order Type Definition
export type OrderTypeValue = 'at-once' | 'prebook' | 'closeout'

export interface OrderType {
  type: OrderTypeValue
  metadata: AtOnceMetadata | PrebookMetadata | CloseoutMetadata
  restrictions: OrderRestrictions
  terms: OrderTerms
}

// At-Once Order Metadata (Immediate fulfillment)
export interface AtOnceMetadata {
  shipWithin: number // business days (industry avg: 1-5 days)
  stockLocation: string[]
  backorderAvailable: boolean
  expectedRestockDate?: Date
  reservationWindow?: number // minutes to hold inventory
  atsInventory: number // Available-to-ship quantity
  realTimeSync: boolean // ERP inventory sync status
  evergreenItem?: boolean // Part of always-available collection
  quickReorderEligible: boolean // Can be reordered with one click
}

// Prebook Order Metadata (Future seasons)
export interface PrebookMetadata {
  season: string // "Fall 2025"
  collection: string // "Core", "Fashion", "Limited"
  deliveryWindow: {
    start: Date
    end: Date
    isFlexible: boolean
  }
  multiDateDeliveries?: { // Support multiple delivery dates within single order
    date: Date
    quantity: number
    location?: string
  }[]
  cancellationDeadline: Date
  modificationDeadline: Date
  depositPercent: number // Industry standard: 30-50%
  requiresFullSizeRun: boolean
  minimumUnits: number
  productionStatus: 'planning' | 'confirmed' | 'in-production' | 'complete'
  linesheetId?: string // Reference to digital linesheet
  showroomId?: string // Virtual showroom association
  marketAppointment?: { // For collaborative ordering
    scheduledDate: Date
    repId: string
    notes: string
  }
}

// Closeout Order Metadata (Clearance)
export interface CloseoutMetadata {
  listId: string
  expiresAt: Date
  startedAt: Date
  availableQuantity: number
  originalQuantity: number
  discountPercent: number
  finalSale: boolean
  minimumOrderQuantity: number
  maximumPerCustomer?: number
  tierRestrictions: string[]
  bulkPricing?: {
    quantity: number
    additionalDiscount: number
  }[]
  progressiveDiscounts?: {
    timeElapsed: number // hours
    discountPercent: number
  }[]
}

// Order Restrictions
export interface OrderRestrictions {
  canMixWithOtherTypes: false // Universal rule
  minimumOrderValue?: number
  maximumOrderValue?: number
  allowedPaymentMethods?: string[]
  requiredCustomerTier?: string[]
  geographicRestrictions?: string[]
}

// Order Terms
export interface OrderTerms {
  paymentTerms: string // "Net 30", "50% Deposit", "Immediate"
  returnPolicy: string
  cancellationPolicy: string
  shippingTerms: string
  specialConditions?: string[]
}

// Enhanced Product Interface with Order Types
export interface EnhancedProduct {
  id: string
  sku: string
  name: string
  category: string
  subcategory: string
  description: string
  msrp: number
  images: string[]
  features?: string[]
  tags?: string[]
  
  // Order Type Configuration
  orderTypes: OrderTypeValue[] // Which types this product supports
  orderTypeMetadata: {
    'at-once'?: AtOnceMetadata
    'prebook'?: PrebookMetadata
    'closeout'?: CloseoutMetadata
  }
  
  // Existing variant structure
  variants?: Array<{
    id: string
    color: string
    size: string
    sku: string
    inventory: number
    weight?: string
  }>
  
  // Pricing by tier
  pricing: {
    [tier: string]: {
      price: number
      minQuantity: number
    }
  }
}

// Season Management
export interface Season {
  id: string
  code: string // "SP25", "FA25"
  name: string // "Spring 2025", "Fall 2025"
  deliveryWindow: {
    start: Date
    end: Date
  }
  orderWindow: {
    start: Date
    end: Date
  }
  cancellationDeadline: Date
  depositPercent: number
  status: 'upcoming' | 'open' | 'closed' | 'in-production' | 'shipping'
  productCount: number
  collections: string[]
}

// Closeout List
export interface CloseoutList {
  id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  status: 'scheduled' | 'active' | 'expired'
  tierRestrictions: string[]
  products: string[] // Product IDs
  totalValue: number
  discountTier: number
}

// Cart Type Configuration
export interface CartTypeConfig {
  type: OrderTypeValue
  headerColor: string
  headerText: string
  icon: string
  badgeColor: string
  allowedActions: string[]
  checkoutFlow: 'standard' | 'deposit' | 'immediate'
}

// Order Validation Rules
export interface OrderValidationRules {
  canMixOrderTypes: false
  requiresDeposit: (order: any) => boolean
  calculateDeposit: (order: any) => number
  isEligibleForTerms: (customer: any, orderType: OrderTypeValue) => boolean
  validateQuantities: (items: any[], type: OrderTypeValue) => ValidationResult
  checkTierAccess: (customer: any, product: any) => boolean
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

// Visual Configuration
export const ORDER_TYPE_COLORS = {
  'at-once': {
    primary: '#10B981', // Green
    secondary: '#D1FAE5',
    badge: 'bg-green-500',
    text: 'text-green-600',
    border: 'border-green-500'
  },
  'prebook': {
    primary: '#3B82F6', // Blue
    secondary: '#DBEAFE',
    badge: 'bg-blue-500',
    text: 'text-blue-600',
    border: 'border-blue-500'
  },
  'closeout': {
    primary: '#EF4444', // Red
    secondary: '#FEE2E2',
    badge: 'bg-red-500',
    text: 'text-red-600',
    border: 'border-red-500'
  }
}

// Badge Labels
export const ORDER_TYPE_LABELS = {
  'at-once': 'In Stock',
  'prebook': 'Preorder',
  'closeout': 'CLOSEOUT'
}

// Icons
export const ORDER_TYPE_ICONS = {
  'at-once': '📦',
  'prebook': '📅',
  'closeout': '🏷️'
}