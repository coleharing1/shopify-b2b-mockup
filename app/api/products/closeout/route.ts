import { NextResponse } from 'next/server'
import { ProductService } from '@/lib/services/product-service'
import { CloseoutMetadata } from '@/types/order-types'

/**
 * @description API route for fetching closeout (clearance) products
 * @fileoverview Returns time-limited closeout deals with deep discounts
 */

// Simulated closeout lists
const closeoutLists = [
  {
    id: "closeout-list-001",
    name: "Winter Clearance",
    description: "End of season winter items",
    status: "active",
    productsCount: 0, // Will be calculated dynamically
    totalValue: 0,
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000)
  },
  {
    id: "closeout-list-002",
    name: "Discontinued Items",
    description: "Final sale on discontinued products",
    status: "active",
    productsCount: 0,
    totalValue: 0,
    expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000)
  },
  {
    id: "closeout-flash-001",
    name: "Flash Sale",
    description: "Limited time flash deals",
    status: "active",
    productsCount: 0,
    totalValue: 0,
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000)
  }
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Filter parameters
    const listId = searchParams.get('listId')
    const tierFilter = searchParams.get('tier') // Customer tier
    const urgentOnly = searchParams.get('urgent') === 'true' // Expiring in < 24 hours
    const finalSaleOnly = searchParams.get('finalSale') === 'true'
    
    // Get products from unified service
    let products = await ProductService.getProductsByOrderType('closeout', {
      urgentOnly,
      finalSaleOnly
    })
    
    // Apply additional filters
    if (listId) {
      products = products.filter(p => {
        const metadata = p.orderTypeMetadata?.['closeout'] as CloseoutMetadata
        return metadata?.listId === listId
      })
    }
    
    if (tierFilter) {
      products = products.filter(p => {
        const metadata = p.orderTypeMetadata?.['closeout'] as CloseoutMetadata
        return !metadata?.tierRestrictions?.length || 
               metadata.tierRestrictions.includes(tierFilter)
      })
    }
    
    // Calculate current discount based on progressive discounting
    const productsWithCurrentDiscount = products.map(product => {
      const metadata = product.orderTypeMetadata?.['closeout'] as CloseoutMetadata
      let currentDiscount = metadata?.discountPercent || 0
      
      if (metadata?.progressiveDiscounts) {
        const hoursElapsed = (Date.now() - metadata.startedAt.getTime()) / (1000 * 60 * 60)
        const applicable = metadata.progressiveDiscounts
          .filter(pd => pd.timeElapsed <= hoursElapsed)
          .sort((a, b) => b.timeElapsed - a.timeElapsed)[0]
        
        if (applicable) {
          currentDiscount = applicable.discountPercent
        }
      }
      
      // Calculate time remaining
      const timeRemaining = metadata?.expiresAt ? 
        Math.max(0, metadata.expiresAt.getTime() - Date.now()) : 0
      
      return {
        ...product,
        currentDiscount,
        timeRemaining,
        urgency: timeRemaining < 6 * 60 * 60 * 1000 ? 'critical' :
                 timeRemaining < 24 * 60 * 60 * 1000 ? 'high' : 'normal',
        tags: product.tags || []
      }
    })
    
    // Update list counts dynamically
    const updatedLists = closeoutLists.map(list => ({
      ...list,
      productsCount: productsWithCurrentDiscount.filter(p => {
        const metadata = p.orderTypeMetadata?.['closeout'] as CloseoutMetadata
        // Assign products to lists based on their tags or random distribution
        if (list.id === 'closeout-flash-001' && p.urgency === 'critical') return true
        if (list.id === 'closeout-list-001' && p.tags?.includes('winter')) return true
        if (list.id === 'closeout-list-002' && p.tags?.includes('clearance')) return true
        return Math.random() > 0.5 // Random assignment for demo
      }).length
    }))
    
    return NextResponse.json({
      products: productsWithCurrentDiscount,
      lists: updatedLists,
      total: productsWithCurrentDiscount.length,
      filters: {
        lists: updatedLists.map(l => ({ id: l.id, name: l.name })),
        urgencyLevels: ['critical', 'high', 'normal']
      }
    })
  } catch (error) {
    console.error('Error fetching closeout products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch closeout products' },
      { status: 500 }
    )
  }
}