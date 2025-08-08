import {
  Quote,
  QuoteRequest,
  QuoteItem,
  QuotePricing,
  QuoteEvent,
  QuoteStatus,
  QuoteFilter,
  QuoteSummary,
  QuoteTemplate
} from '@/types/quote-types'
import { ProductService } from './product-service'
import { MOCK_USERS, MOCK_USERS_BY_ID } from '@/config/auth.config'

export class QuoteService {
  private static quotes: Quote[] = []
  private static templates: QuoteTemplate[] = []
  private static initialized = false

  private static async initialize() {
    if (this.initialized) return

    try {
      const response = await fetch('/mockdata/quotes.json')
      const data = await response.json()
      this.quotes = data.quotes.map((q: any) => ({
        ...q,
        createdAt: new Date(q.createdAt),
        updatedAt: new Date(q.updatedAt),
        terms: {
          ...q.terms,
          validUntil: new Date(q.terms.validUntil),
          deliveryDate: q.terms.deliveryDate ? new Date(q.terms.deliveryDate) : undefined
        },
        timeline: q.timeline.map((e: any) => ({
          ...e,
          timestamp: new Date(e.timestamp)
        })),
        versions: q.versions.map((v: any) => ({
          ...v,
          createdAt: new Date(v.createdAt)
        }))
      }))
      this.templates = data.templates.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt)
      }))
      this.initialized = true
    } catch (error) {
      console.error('Failed to load quotes:', error)
      this.quotes = []
      this.templates = []
    }
  }

  static async createQuote(
    request: QuoteRequest,
    userId: string
  ): Promise<Quote> {
    await this.initialize()

    const user = MOCK_USERS_BY_ID[userId]
    const company = Object.values(MOCK_USERS).find(u => u.companyId === request.companyId)
    const contact = request.contactId 
      ? MOCK_USERS_BY_ID[request.contactId]
      : undefined

    const quoteNumber = `QUOTE-${new Date().getFullYear()}-${String(this.quotes.length + 1).padStart(3, '0')}`
    
    const items: QuoteItem[] = await Promise.all(
      request.items.map(async (item, index) => {
        const product = await ProductService.getProductById(item.productId)
        if (!product) throw new Error(`Product ${item.productId} not found`)

        // Simple pricing: use msrp and apply mock tier discount
        const tierDiscount = 0.3
        const finalPrice = product.msrp * (1 - tierDiscount)
        const pricing = { finalPrice, discountPercentage: tierDiscount * 100 }

        return {
          id: `item-${index + 1}`,
          productId: item.productId,
          productName: product.name,
          sku: product.sku,
          quantity: item.quantity,
          unitPrice: pricing.finalPrice,
           originalPrice: product.msrp,
          discount: pricing.discountPercentage,
          discountType: 'percentage' as const,
          total: pricing.finalPrice * item.quantity,
          notes: item.notes,
          variant: item.variant
        }
      })
    )

    const pricing = this.calculateQuotePricing(items)

    const quote: Quote = {
      id: `quote-${Date.now()}`,
      number: quoteNumber,
      companyId: request.companyId,
      companyName: company?.name || 'Unknown Company',
      contactId: request.contactId,
      contactName: contact?.name,
      contactEmail: contact?.email,
      createdBy: userId,
      createdByName: user?.name || 'Unknown User',
      assignedTo: user?.role === 'sales_rep' ? userId : undefined,
      assignedToName: user?.role === 'sales_rep' ? user.name : undefined,
      status: 'draft',
      type: request.type,
      orderType: request.orderType,
      items,
      pricing,
      terms: {
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        paymentTerms: 'net-30',
        shippingTerms: 'fob-destination',
        deliveryDate: request.requestedDeliveryDate,
        notes: request.notes
      },
      versions: [],
      currentVersion: 1,
      timeline: [
        {
          id: `event-${Date.now()}`,
          timestamp: new Date(),
          type: 'created',
          userId,
          userName: user?.name || 'Unknown User',
          details: `Quote created${request.type === 'rfq' ? ' from RFQ' : ''}`
        }
      ],
      referenceNumber: request.referenceNumber,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.quotes.push(quote)
    return quote
  }

  static async updateQuoteStatus(
    quoteId: string,
    status: QuoteStatus,
    userId: string,
    details?: string
  ): Promise<Quote> {
    await this.initialize()

    const quote = this.quotes.find(q => q.id === quoteId)
    if (!quote) throw new Error('Quote not found')

    const user = MOCK_USERS_BY_ID[userId]

    quote.status = status
    quote.updatedAt = new Date()

    const event: QuoteEvent = {
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: status as any,
      userId,
      userName: user?.name || 'Unknown User',
      details
    }

    quote.timeline.push(event)

    if (status === 'expired') {
      quote.terms.validUntil = new Date()
    }

    return quote
  }

  static async addQuoteRevision(
    quoteId: string,
    changes: Partial<Quote>,
    userId: string
  ): Promise<Quote> {
    await this.initialize()

    const quote = this.quotes.find(q => q.id === quoteId)
    if (!quote) throw new Error('Quote not found')

    const user = MOCK_USERS_BY_ID[userId]

    const changeList: string[] = []
    if (changes.items) changeList.push('Updated line items')
    if (changes.pricing) changeList.push('Adjusted pricing')
    if (changes.terms) changeList.push('Modified terms')

    quote.versions.push({
      versionNumber: quote.currentVersion,
      createdAt: new Date(),
      createdBy: userId,
      changes: changeList,
      pricing: { ...quote.pricing },
      items: [...quote.items]
    })

    if (changes.items) quote.items = changes.items
    if (changes.pricing) quote.pricing = changes.pricing
    if (changes.terms) quote.terms = { ...quote.terms, ...changes.terms }

    quote.currentVersion++
    quote.status = 'revised'
    quote.updatedAt = new Date()

    quote.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'revised',
      userId,
      userName: user?.name || 'Unknown User',
      details: `Revision ${quote.currentVersion}: ${changeList.join(', ')}`
    })

    return quote
  }

  static async convertQuoteToOrder(quoteId: string): Promise<{
    orderId: string
    orderNumber: string
  }> {
    await this.initialize()

    const quote = this.quotes.find(q => q.id === quoteId)
    if (!quote) throw new Error('Quote not found')
    if (quote.status !== 'accepted') {
      throw new Error('Only accepted quotes can be converted to orders')
    }

    const orderId = `order-${Date.now()}`
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`

    quote.convertedOrderId = orderId
    quote.status = 'accepted'
    quote.updatedAt = new Date()

    quote.timeline.push({
      id: `event-${Date.now()}`,
      timestamp: new Date(),
      type: 'converted',
      userId: 'system',
      userName: 'System',
      details: `Converted to order ${orderNumber}`,
      metadata: { orderId, orderNumber }
    })

    return { orderId, orderNumber }
  }

  static calculateQuotePricing(items: QuoteItem[]): QuotePricing {
    const subtotal = items.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0)
    const discountedTotal = items.reduce((sum, item) => sum + item.total, 0)
    const discount = subtotal - discountedTotal
    const discountPercentage = subtotal > 0 ? (discount / subtotal) * 100 : 0
    const taxRate = 9 // 9% tax rate
    const tax = discountedTotal * (taxRate / 100)
    const shipping = discountedTotal > 500 ? 0 : 50 // Free shipping over $500
    const total = discountedTotal + tax + shipping

    return {
      subtotal,
      discount,
      discountPercentage,
      tax,
      taxRate,
      shipping,
      total,
      currency: 'USD'
    }
  }

  static async getQuotes(filter?: QuoteFilter): Promise<Quote[]> {
    await this.initialize()

    let filtered = [...this.quotes]

    if (filter) {
      if (filter.status?.length) {
        filtered = filtered.filter(q => filter.status!.includes(q.status))
      }
      if (filter.type?.length) {
        filtered = filtered.filter(q => filter.type!.includes(q.type))
      }
      if (filter.companyId) {
        filtered = filtered.filter(q => q.companyId === filter.companyId)
      }
      if (filter.assignedTo) {
        filtered = filtered.filter(q => q.assignedTo === filter.assignedTo)
      }
      if (filter.createdBy) {
        filtered = filtered.filter(q => q.createdBy === filter.createdBy)
      }
      if (filter.dateFrom) {
        filtered = filtered.filter(q => q.createdAt >= filter.dateFrom!)
      }
      if (filter.dateTo) {
        filtered = filtered.filter(q => q.createdAt <= filter.dateTo!)
      }
      if (filter.minValue) {
        filtered = filtered.filter(q => q.pricing.total >= filter.minValue!)
      }
      if (filter.maxValue) {
        filtered = filtered.filter(q => q.pricing.total <= filter.maxValue!)
      }
      if (filter.search) {
        const search = filter.search.toLowerCase()
        filtered = filtered.filter(q => 
          q.number.toLowerCase().includes(search) ||
          q.companyName.toLowerCase().includes(search) ||
          q.items.some(i => i.productName.toLowerCase().includes(search))
        )
      }
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  static async getQuote(id: string): Promise<Quote | null> {
    await this.initialize()
    return this.quotes.find(q => q.id === id) || null
  }

  static async getQuoteSummary(filter?: QuoteFilter): Promise<QuoteSummary> {
    const quotes = await this.getQuotes(filter)

    const summary: QuoteSummary = {
      totalQuotes: quotes.length,
      draftQuotes: quotes.filter(q => q.status === 'draft').length,
      sentQuotes: quotes.filter(q => q.status === 'sent').length,
      acceptedQuotes: quotes.filter(q => q.status === 'accepted').length,
      rejectedQuotes: quotes.filter(q => q.status === 'rejected').length,
      expiredQuotes: quotes.filter(q => q.status === 'expired').length,
      totalValue: quotes.reduce((sum, q) => sum + q.pricing.total, 0),
      acceptedValue: quotes
        .filter(q => q.status === 'accepted')
        .reduce((sum, q) => sum + q.pricing.total, 0),
      conversionRate: quotes.length > 0
        ? (quotes.filter(q => q.status === 'accepted').length / quotes.length) * 100
        : 0,
      averageQuoteValue: quotes.length > 0
        ? quotes.reduce((sum, q) => sum + q.pricing.total, 0) / quotes.length
        : 0,
      averageTimeToClose: this.calculateAverageTimeToClose(quotes)
    }

    return summary
  }

  private static calculateAverageTimeToClose(quotes: Quote[]): number {
    const acceptedQuotes = quotes.filter(q => q.status === 'accepted')
    if (acceptedQuotes.length === 0) return 0

    const totalDays = acceptedQuotes.reduce((sum, quote) => {
      const acceptedEvent = quote.timeline.find(e => e.type === 'accepted')
      if (!acceptedEvent) return sum

      const daysDiff = Math.floor(
        (acceptedEvent.timestamp.getTime() - quote.createdAt.getTime()) / 
        (1000 * 60 * 60 * 24)
      )
      return sum + daysDiff
    }, 0)

    return totalDays / acceptedQuotes.length
  }

  static async getTemplates(): Promise<QuoteTemplate[]> {
    await this.initialize()
    return this.templates
  }

  static async getTemplate(id: string): Promise<QuoteTemplate | null> {
    await this.initialize()
    return this.templates.find(t => t.id === id) || null
  }

  static async saveTemplate(
    name: string,
    description: string,
    quote: Quote,
    userId: string
  ): Promise<QuoteTemplate> {
    await this.initialize()

    const template: QuoteTemplate = {
      id: `template-${Date.now()}`,
      name,
      description,
      items: quote.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        discount: item.discount,
        discountType: item.discountType
      })),
      terms: {
        paymentTerms: quote.terms.paymentTerms,
        shippingTerms: quote.terms.shippingTerms,
        notes: quote.terms.notes
      },
      tags: quote.tags,
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0
    }

    this.templates.push(template)
    return template
  }

  static async checkExpiringQuotes(): Promise<Quote[]> {
    await this.initialize()

    const now = new Date()
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)

    return this.quotes.filter(q => 
      q.status === 'sent' &&
      q.terms.validUntil <= threeDaysFromNow &&
      q.terms.validUntil > now
    )
  }

  static async expireQuotes(): Promise<number> {
    await this.initialize()

    const now = new Date()
    const expiredQuotes = this.quotes.filter(q => 
      (q.status === 'sent' || q.status === 'viewed') &&
      q.terms.validUntil < now
    )

    for (const quote of expiredQuotes) {
      await this.updateQuoteStatus(quote.id, 'expired', 'system', 'Quote expired')
    }

    return expiredQuotes.length
  }
}