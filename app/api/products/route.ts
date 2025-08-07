import { NextRequest, NextResponse } from 'next/server'
import { getProducts, getCompanyById } from '@/lib/mock-data'

/**
 * @description Products API endpoint with company-specific filtering
 * @fileoverview Returns products filtered by authenticated user's company and pricing tier
 */

// Helper function to verify session (simplified for demo)
async function verifySession(request: NextRequest) {
  const session = request.cookies.get('session')
  
  if (!session) {
    return null
  }

  // Parse session to get user ID (simplified)
  const parts = session.value.split('_')
  const userId = parts[1]
  
  // In production, validate session and get user from database
  // For demo, return mock user data based on userId
  const userMap: Record<string, any> = {
    'user-1': { id: 'user-1', companyId: 'company-1', role: 'retailer' },
    'user-2': { id: 'user-2', companyId: 'company-2', role: 'retailer' },
    'user-3': { id: 'user-3', companyId: 'company-3', role: 'retailer' },
    'user-4': { id: 'user-4', companyId: 'b2b-internal', role: 'rep' },
    'user-5': { id: 'user-5', companyId: 'b2b-internal', role: 'admin' }
  }
  
  return userMap[userId] || null
}

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

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const companyId = searchParams.get('companyId') || user.companyId
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    // For sales reps, they can query any company's products
    // For retailers, they can only see their own company's products
    if (user.role === 'retailer' && companyId !== user.companyId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get all products
    const allProducts = await getProducts()
    
    // Get company data to determine pricing tier
    const company = await getCompanyById(companyId)
    const pricingTier = (company as any)?.pricingTier || 'tier-1'

    // Filter products based on search and category
    let filteredProducts = allProducts

    if (search) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category === category
      )
    }

    // Apply pagination
    const paginatedProducts = filteredProducts.slice(offset, offset + limit)

    // Add company-specific pricing to products
    const productsWithPricing = paginatedProducts.map(product => {
      // Calculate tier price based on company's discount tier
      const tierDiscounts = {
        1: 0.30, // 30% off MSRP
        2: 0.40, // 40% off MSRP
        3: 0.50  // 50% off MSRP
      }
      
      const discount = tierDiscounts[pricingTier as keyof typeof tierDiscounts] || 0.30
      const tierPrice = product.msrp * (1 - discount)

      return {
        ...product,
        tierPrice,
        pricingTier,
        discount: `${discount * 100}%`
      }
    })

    return NextResponse.json({
      products: productsWithPricing,
      total: filteredProducts.length,
      limit,
      offset,
      companyId,
      pricingTier
    })
  } catch (error) {
    console.error('Products API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST endpoint for creating products (admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await verifySession(request)
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.sku || !body.msrp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, save to database
    // For demo, return success
    const newProduct = {
      id: `product-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      message: 'Product created successfully',
      product: newProduct
    })
  } catch (error) {
    console.error('Create product error:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}