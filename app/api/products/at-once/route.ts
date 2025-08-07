import { NextResponse } from 'next/server'
import { ProductService } from '@/lib/services/product-service'

/**
 * @description API route for fetching at-once (immediate stock) products
 * @fileoverview Returns only products available for immediate shipment with real-time inventory
 */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Filter parameters
    const category = searchParams.get('category')
    const inStockOnly = searchParams.get('inStock') === 'true'
    const evergreenOnly = searchParams.get('evergreen') === 'true'
    
    // Get products from unified service
    const products = await ProductService.getProductsByOrderType('at-once', {
      category,
      inStockOnly,
      evergreenOnly
    })
    
    // Add real-time inventory status
    const productsWithStatus = products.map(product => {
      const metadata = product.orderTypeMetadata?.['at-once']
      const totalInventory = metadata?.atsInventory || 0
      
      let stockStatus = 'in-stock'
      if (totalInventory === 0) {
        stockStatus = 'out-of-stock'
      } else if (totalInventory < 50) {
        stockStatus = 'low-stock'
      }
      
      return {
        ...product,
        stockStatus,
        estimatedShipDate: calculateShipDate(metadata?.shipWithin || 3)
      }
    })
    
    return NextResponse.json({
      products: productsWithStatus,
      total: productsWithStatus.length,
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

function calculateShipDate(daysToShip: number): string {
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