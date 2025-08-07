import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/services/product-service'
import { CloseoutMetadata, ORDER_TYPES, CloseoutFilters } from '@/types/order-types'
import { verifySession } from '@/lib/api-auth'

/**
 * @description API route for fetching closeout (clearance) products
 * @fileoverview Returns time-limited closeout deals with deep discounts
 */

// Simulated closeout lists (in production, these would come from a database)
const closeoutLists = [
  {
    id: "closeout-list-001",
    name: "Winter Clearance",
    description: "End of season winter items",
    status: "active",
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000)
  },
  {
    id: "closeout-list-002",
    name: "Discontinued Items",
    description: "Final sale on discontinued products",
    status: "active",
    expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000)
  },
  {
    id: "closeout-flash-001",
    name: "Flash Sale",
    description: "Limited time flash deals",
    status: "active",
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000)
  }
]

export async function GET(request: NextRequest) {
  try {
    // Verify user session
    const user = await verifySession(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Check if user has access to closeout deals (could be tier-restricted)
    if (user.role === 'retailer' && user.pricingTier === 'tier-1') {
      return NextResponse.json(
        { error: 'Closeout deals require Silver tier or higher' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    
    // Build filters from query parameters
    const filters: CloseoutFilters = {
      urgentOnly: searchParams.get('urgent') === 'true',
      finalSaleOnly: searchParams.get('finalSale') === 'true',
      listId: searchParams.get('listId') || undefined,
      tierFilter: searchParams.get('tier') || undefined,
      minDiscount: searchParams.has('minDiscount')
        ? parseInt(searchParams.get('minDiscount')!)
        : undefined
    }
    
    // Get products from unified service (all business logic is in the service)
    const products = await ProductService.getProductsByOrderType(ORDER_TYPES.CLOSEOUT, filters)
    
    // Update list counts dynamically based on products
    const updatedLists = closeoutLists.map(list => ({
      ...list,
      productsCount: products.filter(p => {
        // Simple assignment logic for demo
        const urgency = (p as any).urgency
        if (list.id === 'closeout-flash-001' && urgency === 'critical') return true
        if (list.id === 'closeout-list-001' && p.tags?.includes('winter')) return true
        if (list.id === 'closeout-list-002' && p.tags?.includes('clearance')) return true
        return false
      }).length,
      totalValue: 0 // Would calculate in production
    }))
    
    return NextResponse.json({
      products,
      lists: updatedLists,
      total: products.length,
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