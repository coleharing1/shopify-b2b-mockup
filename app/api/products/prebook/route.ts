import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/lib/services/product-service'
import { PrebookMetadata, ORDER_TYPES, PrebookFilters } from '@/types/order-types'
import { verifySession } from '@/lib/api-auth'

/**
 * @description API route for fetching prebook (future season) products
 * @fileoverview Returns products available for advance ordering with delivery windows
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
    const filters: PrebookFilters = {
      season: searchParams.get('season') || undefined,
      collection: searchParams.get('collection') || undefined,
      status: searchParams.get('status') as PrebookFilters['status'] || undefined,
      requiresFullSizeRun: searchParams.has('requiresFullSizeRun')
        ? searchParams.get('requiresFullSizeRun') === 'true'
        : undefined
    }
    
    // Get products from unified service
    const products = await ProductService.getProductsByOrderType(ORDER_TYPES.PREBOOK, filters)
    
    // Group by season for easy navigation
    const seasonGroups = products.reduce((acc, product) => {
      const metadata = product.orderTypeMetadata?.['prebook'] as PrebookMetadata
      const seasonKey = metadata?.season || 'Unknown'
      
      if (!acc[seasonKey]) {
        acc[seasonKey] = {
          season: seasonKey,
          products: [],
          deliveryWindow: metadata?.deliveryWindow,
          cancellationDeadline: metadata?.cancellationDeadline,
          depositPercent: metadata?.depositPercent || 30
        }
      }
      
      acc[seasonKey].products.push(product)
      return acc
    }, {} as Record<string, any>)
    
    // Get available seasons from the service
    const availableSeasons = await ProductService.getAvailableSeasons()
    
    return NextResponse.json({
      products,
      seasonGroups,
      total: products.length,
      filters: {
        seasons: availableSeasons.length > 0 ? availableSeasons : ["Spring 2025", "Summer 2025", "Fall 2025"],
        collections: ["Core", "Fashion", "Limited"],
        statuses: ["planning", "confirmed", "in-production", "complete"]
      }
    })
  } catch (error) {
    console.error('Error fetching prebook products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prebook products' },
      { status: 500 }
    )
  }
}