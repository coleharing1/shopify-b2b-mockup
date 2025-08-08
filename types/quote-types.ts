export interface QuoteItem {
  id: string
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  originalPrice: number
  discount: number
  discountType: 'percentage' | 'fixed'
  discountReason?: string
  total: number
  notes?: string
  variant?: {
    size?: string
    color?: string
  }
}

export interface QuotePricing {
  subtotal: number
  discount: number
  discountPercentage: number
  tax: number
  taxRate: number
  shipping: number
  total: number
  currency: string
}

export interface QuoteTerms {
  validUntil: Date
  paymentTerms: 'net-30' | 'net-60' | 'due-on-receipt' | 'custom'
  paymentTermsCustom?: string
  shippingTerms: 'fob-origin' | 'fob-destination' | 'cif' | 'custom'
  shippingTermsCustom?: string
  deliveryDate?: Date
  notes?: string
  internalNotes?: string
}

export interface QuoteVersion {
  versionNumber: number
  createdAt: Date
  createdBy: string
  changes: string[]
  pricing: QuotePricing
  items: QuoteItem[]
}

export interface QuoteEvent {
  id: string
  timestamp: Date
  type: 'created' | 'sent' | 'viewed' | 'revised' | 'accepted' | 'rejected' | 'expired' | 'converted'
  userId: string
  userName: string
  details?: string
  metadata?: Record<string, any>
}

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'revised' | 'accepted' | 'rejected' | 'expired' | 'cancelled'
export type QuoteType = 'rfq' | 'proactive' | 'renewal'

export interface Quote {
  id: string
  number: string // QUOTE-2024-001
  companyId: string
  companyName: string
  contactId?: string
  contactName?: string
  contactEmail?: string
  createdBy: string
  createdByName: string
  assignedTo?: string
  assignedToName?: string
  status: QuoteStatus
  type: QuoteType
  orderType?: 'at-once' | 'prebook' | 'closeout'
  items: QuoteItem[]
  pricing: QuotePricing
  terms: QuoteTerms
  versions: QuoteVersion[]
  currentVersion: number
  timeline: QuoteEvent[]
  tags?: string[]
  source?: 'website' | 'email' | 'phone' | 'trade-show' | 'sales-call'
  referenceNumber?: string // Customer PO or reference
  convertedOrderId?: string
  createdAt: Date
  updatedAt: Date
}

export interface QuoteRequest {
  companyId: string
  contactId?: string
  type: QuoteType
  orderType?: 'at-once' | 'prebook' | 'closeout'
  items: Array<{
    productId: string
    quantity: number
    variant?: {
      size?: string
      color?: string
    }
    notes?: string
  }>
  notes?: string
  requestedDeliveryDate?: Date
  referenceNumber?: string
}

export interface QuoteFilter {
  status?: QuoteStatus[]
  type?: QuoteType[]
  companyId?: string
  assignedTo?: string
  createdBy?: string
  dateFrom?: Date
  dateTo?: Date
  minValue?: number
  maxValue?: number
  search?: string
}

export interface QuoteSummary {
  totalQuotes: number
  draftQuotes: number
  sentQuotes: number
  acceptedQuotes: number
  rejectedQuotes: number
  expiredQuotes: number
  totalValue: number
  acceptedValue: number
  conversionRate: number
  averageQuoteValue: number
  averageTimeToClose: number // in days
}

export interface QuoteTemplate {
  id: string
  name: string
  description?: string
  items: Array<{
    productId: string
    quantity: number
    discount?: number
    discountType?: 'percentage' | 'fixed'
  }>
  terms: Partial<QuoteTerms>
  tags?: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
  usageCount: number
}