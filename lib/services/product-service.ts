/**
 * @description Unified Product Service for all order types
 * @fileoverview Handles filtering and metadata application for at-once, prebook, and closeout products
 */

import { Product, getProducts } from '@/lib/mock-data'
import { 
  EnhancedProduct, 
  AtOnceMetadata, 
  PrebookMetadata, 
  CloseoutMetadata,
  OrderTypeValue,
  ORDER_TYPES,
  AtOnceFilters,
  PrebookFilters,
  CloseoutFilters
} from '@/types/order-types'

export class ProductService {
  /**
   * Get products filtered by order type with appropriate metadata
   */
  static async getProductsByOrderType(
    orderType: typeof ORDER_TYPES.AT_ONCE,
    filters?: AtOnceFilters
  ): Promise<EnhancedProduct[]>
  static async getProductsByOrderType(
    orderType: typeof ORDER_TYPES.PREBOOK,
    filters?: PrebookFilters
  ): Promise<EnhancedProduct[]>
  static async getProductsByOrderType(
    orderType: typeof ORDER_TYPES.CLOSEOUT,
    filters?: CloseoutFilters
  ): Promise<EnhancedProduct[]>
  static async getProductsByOrderType(
    orderType: OrderTypeValue,
    filters?: AtOnceFilters | PrebookFilters | CloseoutFilters
  ): Promise<EnhancedProduct[]> {
    const allProducts = await getProducts()
    
    // Filter products that support this order type
    let filteredProducts = allProducts.filter(product => 
      product.orderTypes?.includes(orderType)
    )
    
    // Apply order-type specific filtering and enhancement
    switch (orderType) {
      case ORDER_TYPES.AT_ONCE:
        return this.enhanceAtOnceProducts(filteredProducts, filters as AtOnceFilters)
      case ORDER_TYPES.PREBOOK:
        return this.enhancePrebookProducts(filteredProducts, filters as PrebookFilters)
      case ORDER_TYPES.CLOSEOUT:
        return this.enhanceCloseoutProducts(filteredProducts, filters as CloseoutFilters)
      default:
        return []
    }
  }

  /**
   * Enhance products with at-once specific metadata and display properties
   */
  private static enhanceAtOnceProducts(
    products: Product[],
    filters?: AtOnceFilters
  ): EnhancedProduct[] {
    let enhanced = products.map(product => {
      const atOnceMetadata = product.orderTypeMetadata?.['at-once'] || {}
      
      // Calculate total available inventory from variants
      const totalInventory = product.variants?.reduce((sum, v) => sum + v.inventory, 0) || 0
      
      // Determine stock status
      let stockStatus = 'in-stock'
      if (totalInventory === 0) {
        stockStatus = 'out-of-stock'
      } else if (totalInventory < 50) {
        stockStatus = 'low-stock'
      }
      
      const enhancedMetadata: AtOnceMetadata = {
        shipWithin: atOnceMetadata.shipWithin || 3,
        stockLocation: atOnceMetadata.stockLocation || ['Main Warehouse'],
        backorderAvailable: atOnceMetadata.backorderAvailable ?? true,
        atsInventory: atOnceMetadata.atsInventory || totalInventory,
        realTimeSync: true,
        evergreenItem: atOnceMetadata.evergreenItem || product.tags?.includes('evergreen'),
        quickReorderEligible: true,
        ...(atOnceMetadata.expectedRestockDate && {
          expectedRestockDate: new Date(atOnceMetadata.expectedRestockDate)
        })
      }
      
      const enhanced: EnhancedProduct & { stockStatus: string; estimatedShipDate: string } = {
        ...product,
        orderTypes: [ORDER_TYPES.AT_ONCE],
        orderTypeMetadata: {
          'at-once': enhancedMetadata
        },
        // Add display properties here (moved from API route)
        stockStatus,
        estimatedShipDate: this.calculateShipDate(enhancedMetadata.shipWithin)
      }
      
      return enhanced
    })
    
    // Apply filters
    if (filters?.inStockOnly) {
      enhanced = enhanced.filter(p => {
        const metadata = p.orderTypeMetadata?.['at-once'] as AtOnceMetadata
        return metadata?.atsInventory > 0
      })
    }
    
    if (filters?.evergreenOnly) {
      enhanced = enhanced.filter(p => {
        const metadata = p.orderTypeMetadata?.['at-once'] as AtOnceMetadata
        return metadata?.evergreenItem === true
      })
    }
    
    if (filters?.category) {
      enhanced = enhanced.filter(p => 
        p.category.toLowerCase() === filters.category!.toLowerCase()
      )
    }
    
    if (filters?.minInventory) {
      enhanced = enhanced.filter(p => {
        const metadata = p.orderTypeMetadata?.['at-once'] as AtOnceMetadata
        return (metadata?.atsInventory || 0) >= filters.minInventory!
      })
    }
    
    if (filters?.stockLocation) {
      enhanced = enhanced.filter(p => {
        const metadata = p.orderTypeMetadata?.['at-once'] as AtOnceMetadata
        return metadata?.stockLocation?.includes(filters.stockLocation!)
      })
    }
    
    return enhanced
  }

  /**
   * Enhance products with prebook specific metadata
   */
  private static enhancePrebookProducts(
    products: Product[],
    filters?: PrebookFilters
  ): EnhancedProduct[] {
    let enhanced = products.map(product => {
      const prebookMetadata = product.orderTypeMetadata?.['prebook'] || {}
      
      const enhancedMetadata: PrebookMetadata = {
        season: prebookMetadata.season || 'Spring 2025',
        collection: prebookMetadata.collection || 'Core',
        deliveryWindow: prebookMetadata.deliveryWindow ? {
          start: new Date(prebookMetadata.deliveryWindow.start),
          end: new Date(prebookMetadata.deliveryWindow.end),
          isFlexible: true
        } : {
          start: new Date('2025-03-01'),
          end: new Date('2025-03-31'),
          isFlexible: true
        },
        cancellationDeadline: new Date(prebookMetadata.cancellationDeadline || '2025-02-01'),
        modificationDeadline: new Date('2025-02-15'),
        depositPercent: prebookMetadata.depositPercent || 30,
        requiresFullSizeRun: prebookMetadata.requiresFullSizeRun ?? false,
        minimumUnits: prebookMetadata.minimumUnits || 6,
        productionStatus: 'planning'
      }
      
      const enhanced: EnhancedProduct = {
        ...product,
        orderTypes: [ORDER_TYPES.PREBOOK],
        orderTypeMetadata: {
          'prebook': enhancedMetadata
        }
      }
      
      return enhanced
    })
    
    // Apply filters
    if (filters?.season) {
      enhanced = enhanced.filter(p => {
        const metadata = p.orderTypeMetadata?.['prebook'] as PrebookMetadata
        return metadata?.season === filters.season
      })
    }
    
    if (filters?.collection) {
      enhanced = enhanced.filter(p => {
        const metadata = p.orderTypeMetadata?.['prebook'] as PrebookMetadata
        return metadata?.collection === filters.collection
      })
    }
    
    if (filters?.status) {
      enhanced = enhanced.filter(p => {
        const metadata = p.orderTypeMetadata?.['prebook'] as PrebookMetadata
        return metadata?.productionStatus === filters.status
      })
    }
    
    if (filters?.requiresFullSizeRun !== undefined) {
      enhanced = enhanced.filter(p => {
        const metadata = p.orderTypeMetadata?.['prebook'] as PrebookMetadata
        return metadata?.requiresFullSizeRun === filters.requiresFullSizeRun
      })
    }
    
    return enhanced
  }

  /**
   * Enhance products with closeout specific metadata and display properties
   */
  private static enhanceCloseoutProducts(
    products: Product[],
    filters?: CloseoutFilters
  ): EnhancedProduct[] {
    let enhanced = products.map(product => {
      const closeoutMetadata = product.orderTypeMetadata?.['closeout'] || {}
      
      // Calculate closeout pricing
      const discountPercent = closeoutMetadata.discountPercent || 50
      const closeoutPrice = product.msrp * (1 - discountPercent / 100)
      
      // Calculate available quantity from variants
      const totalInventory = product.variants?.reduce((sum, v) => sum + v.inventory, 0) || 0
      
      const expiresAt = new Date(closeoutMetadata.expiresAt || Date.now() + 48 * 60 * 60 * 1000)
      const startedAt = new Date()
      
      const enhancedMetadata: CloseoutMetadata = {
        listId: 'closeout-default',
        expiresAt,
        startedAt,
        availableQuantity: closeoutMetadata.availableQuantity || totalInventory,
        originalQuantity: totalInventory * 2, // Assume original was double
        discountPercent: discountPercent,
        finalSale: closeoutMetadata.finalSale ?? true,
        minimumOrderQuantity: closeoutMetadata.minimumOrderQuantity || 1,
        tierRestrictions: []
      }
      
      // Calculate current discount based on progressive discounting
      let currentDiscount = enhancedMetadata.discountPercent
      if (enhancedMetadata.progressiveDiscounts) {
        const hoursElapsed = (Date.now() - enhancedMetadata.startedAt.getTime()) / (1000 * 60 * 60)
        const applicable = enhancedMetadata.progressiveDiscounts
          .filter(pd => pd.timeElapsed <= hoursElapsed)
          .sort((a, b) => b.timeElapsed - a.timeElapsed)[0]
        
        if (applicable) {
          currentDiscount = applicable.discountPercent
        }
      }
      
      // Calculate time remaining
      const timeRemaining = Math.max(0, expiresAt.getTime() - Date.now())
      
      const enhanced: EnhancedProduct & { 
        currentDiscount: number; 
        timeRemaining: number; 
        urgency: string 
      } = {
        ...product,
        orderTypes: [ORDER_TYPES.CLOSEOUT],
        orderTypeMetadata: {
          'closeout': enhancedMetadata
        },
        // Override pricing for closeout
        pricing: {
          'tier-1': { price: closeoutPrice, minQuantity: enhancedMetadata.minimumOrderQuantity },
          'tier-2': { price: closeoutPrice, minQuantity: enhancedMetadata.minimumOrderQuantity },
          'tier-3': { price: closeoutPrice, minQuantity: enhancedMetadata.minimumOrderQuantity }
        },
        // Add display properties
        currentDiscount,
        timeRemaining,
        urgency: timeRemaining < 6 * 60 * 60 * 1000 ? 'critical' :
                 timeRemaining < 24 * 60 * 60 * 1000 ? 'high' : 'normal'
      }
      
      return enhanced
    })
    
    // Apply filters
    if (filters?.urgentOnly) {
      enhanced = enhanced.filter(p => p.urgency === 'critical' || p.urgency === 'high')
    }
    
    if (filters?.finalSaleOnly) {
      enhanced = enhanced.filter(p => {
        const metadata = p.orderTypeMetadata?.['closeout'] as CloseoutMetadata
        return metadata?.finalSale === true
      })
    }
    
    if (filters?.minDiscount) {
      enhanced = enhanced.filter(p => p.currentDiscount >= filters.minDiscount!)
    }
    
    if (filters?.listId) {
      enhanced = enhanced.filter(p => {
        const metadata = p.orderTypeMetadata?.['closeout'] as CloseoutMetadata
        return metadata?.listId === filters.listId
      })
    }
    
    if (filters?.tierFilter) {
      enhanced = enhanced.filter(p => {
        const metadata = p.orderTypeMetadata?.['closeout'] as CloseoutMetadata
        return !metadata?.tierRestrictions?.length || 
               metadata.tierRestrictions.includes(filters.tierFilter!)
      })
    }
    
    return enhanced
  }

  /**
   * Calculate estimated ship date based on business days
   */
  private static calculateShipDate(daysToShip: number): string {
    const date = new Date()
    let businessDays = 0
    
    while (businessDays < daysToShip) {
      date.setDate(date.getDate() + 1)
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        businessDays++
      }
    }
    
    return date.toISOString().split('T')[0]
  }

  /**
   * Get a single product with order type metadata
   */
  static async getProductById(
    productId: string,
    orderType?: OrderTypeValue
  ): Promise<EnhancedProduct | null> {
    const products = await getProducts()
    const product = products.find(p => p.id === productId)
    
    if (!product) return null
    
    // If no order type specified, return with all available order types
    if (!orderType) {
      return product as EnhancedProduct
    }
    
    // Return with specific order type metadata
    const filtered = await this.getProductsByOrderType(
      orderType as any,
      {} as any
    )
    return filtered.find(p => p.id === productId) || null
  }

  /**
   * Check if a product is available for a specific order type
   */
  static isProductAvailableForOrderType(
    product: Product,
    orderType: OrderTypeValue
  ): boolean {
    return product.orderTypes?.includes(orderType) || false
  }

  /**
   * Get all available seasons for prebook products
   */
  static async getAvailableSeasons(): Promise<string[]> {
    const products = await getProducts()
    const seasons = new Set<string>()
    
    products.forEach(product => {
      if (product.orderTypes?.includes(ORDER_TYPES.PREBOOK)) {
        const season = product.orderTypeMetadata?.['prebook']?.season
        if (season) seasons.add(season)
      }
    })
    
    return Array.from(seasons).sort()
  }

  /**
   * Get products by tags
   */
  static async getProductsByTags(tags: string[]): Promise<Product[]> {
    const products = await getProducts()
    
    return products.filter(product => 
      tags.some(tag => product.tags?.includes(tag))
    )
  }
}