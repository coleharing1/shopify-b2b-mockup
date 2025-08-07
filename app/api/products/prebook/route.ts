import { NextResponse } from 'next/server'
import { ProductService } from '@/lib/services/product-service'
import { PrebookMetadata } from '@/types/order-types'

/**
 * @description API route for fetching prebook (future season) products
 * @fileoverview Returns products available for advance ordering with delivery windows
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Filter parameters
    const season = searchParams.get('season') // e.g., "Spring 2025", "Fall 2025"
    const collection = searchParams.get('collection') // e.g., "Core", "Fashion", "Limited"
    const status = searchParams.get('status') // e.g., "planning", "confirmed", "in-production"
    
    // Get products from unified service
    const products = await ProductService.getProductsByOrderType('prebook', {
      season,
      collection,
      status
    })
    
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
      products: products,
      seasonGroups,
      total: products.length,
      filters: {
        seasons: availableSeasons.length > 0 ? availableSeasons : ["Spring 2025", "Summer 2025", "Fall 2025", "Holiday 2025"],
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