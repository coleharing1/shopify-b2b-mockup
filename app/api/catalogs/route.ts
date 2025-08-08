import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/api-auth'
import { CatalogService } from '@/lib/services/catalog-service'
import { ProductService } from '@/lib/services/product-service'

/**
 * @description API route for fetching company-specific product catalogs
 * @fileoverview Returns filtered products based on catalog assignments
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

    // Get company catalog context
    const catalogContext = await CatalogService.getCompanyCatalog(user.companyId)
    
    // Get all products
    const allProducts = await ProductService.getAllProducts()
    
    // Filter products based on catalog
    const visibleProducts = await CatalogService.filterProductsByCatalog(
      allProducts,
      catalogContext.catalog
    )

    // Get catalog filter summary
    const filterResult = await CatalogService.getCatalogFilterResult(
      allProducts,
      user.companyId
    )

    return NextResponse.json({
      catalog: {
        id: catalogContext.catalog.id,
        name: catalogContext.catalog.name,
        description: catalogContext.catalog.description,
        features: catalogContext.catalog.features || [],
        restrictions: catalogContext.catalog.restrictions || []
      },
      products: visibleProducts,
      stats: filterResult,
      userContext: {
        companyId: user.companyId,
        companyName: user.name,
        pricingTier: user.pricingTier || 'tier-1',
        role: user.role
      }
    })
  } catch (error) {
    console.error('Error fetching catalog:', error)
    return NextResponse.json(
      { error: 'Failed to fetch catalog' },
      { status: 500 }
    )
  }
}