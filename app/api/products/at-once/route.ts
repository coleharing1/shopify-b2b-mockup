import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/services/product-service'
import { ORDER_TYPES, AtOnceFilters } from '@/types/order-types'
import { verifySession } from '@/lib/api-auth'

/**
 * @description API route for fetching at-once (immediate stock) products
 * @fileoverview Returns only products available for immediate shipment with real-time inventory
 */

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
    
    const { searchParams } = new URL(request.url)
    
    // Build filters from query parameters
    const filters: AtOnceFilters = {
      category: searchParams.get('category') || undefined,
      inStockOnly: searchParams.get('inStock') === 'true',
      evergreenOnly: searchParams.get('evergreen') === 'true',
      minInventory: searchParams.has('minInventory') 
        ? parseInt(searchParams.get('minInventory')!) 
        : undefined,
      stockLocation: searchParams.get('stockLocation') || undefined
    }
    
    // Get products from unified service (all logic is in the service)
    const products = await ProductService.getProductsByOrderType(ORDER_TYPES.AT_ONCE, filters)
    
    // Apply company-specific pricing if user is a retailer
    const productsWithPricing = products.map(product => ({
      ...product,
      userPricingTier: user.pricingTier || 'tier-1',
      effectivePrice: product.pricing[user.pricingTier || 'tier-1']?.price || product.msrp
    }))
    
    return NextResponse.json({
      products: productsWithPricing,
      total: productsWithPricing.length,
      userContext: {
        companyId: user.companyId,
        pricingTier: user.pricingTier || 'tier-1',
        role: user.role
      },
      filters: {
        categories: ['Apparel', 'Accessories', 'SMW'],
        stockStatuses: ['in-stock', 'low-stock', 'out-of-stock', 'backorder']
      }
    })
  } catch (error) {
    console.error('Error fetching at-once products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch at-once products' },
      { status: 500 }
    )
  }
}