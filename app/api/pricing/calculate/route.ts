import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/api-auth'
import { calculateCustomerPrice, getPriceBreakdown } from '@/services/business/pricing.service'
import { PriceList, PriceListAssignment } from '@/types/pricing-types'

/**
 * @description API route for calculating customer-specific pricing
 * @fileoverview Calculates prices with volume breaks and custom rules
 */

// Load price lists (in production, this would come from a database)
async function getPriceListForCompany(companyId: string): Promise<PriceList | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/mockdata/price-lists.json`)
    const data = await response.json()
    
    // Find assignment for company
    const assignment = data.assignments.find((a: PriceListAssignment) => a.companyId === companyId)
    if (!assignment) return null
    
    // Find price list
    return data.priceLists.find((pl: PriceList) => pl.id === assignment.priceListId) || null
  } catch (error) {
    console.error('Error loading price lists:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify user session
    const user = await verifySession(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, msrp, quantity, orderType, orderTotal } = body

    // Validate input
    if (!productId || !msrp || !quantity) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, msrp, quantity' },
        { status: 400 }
      )
    }

    // Get company's price list
    const priceList = await getPriceListForCompany(user.companyId)

    // Calculate price with all discounts
    const calculation = calculateCustomerPrice(
      {
        productId,
        msrp,
        quantity,
        companyId: user.companyId,
        orderType,
        orderTotal
      },
      priceList || undefined
    )

    return NextResponse.json({
      calculation,
      priceList: priceList ? {
        id: priceList.id,
        name: priceList.name,
        baseTier: priceList.baseTier
      } : null,
      userContext: {
        companyId: user.companyId,
        pricingTier: user.pricingTier || 'tier-1',
        role: user.role
      }
    })
  } catch (error) {
    console.error('Error calculating price:', error)
    return NextResponse.json(
      { error: 'Failed to calculate price' },
      { status: 500 }
    )
  }
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

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const msrp = parseFloat(searchParams.get('msrp') || '0')
    const quantity = parseInt(searchParams.get('quantity') || '1')

    if (!productId || !msrp) {
      return NextResponse.json(
        { error: 'Missing required parameters: productId, msrp' },
        { status: 400 }
      )
    }

    // Get company's price list
    const priceList = await getPriceListForCompany(user.companyId)

    // Get price breakdown for transparency
    const breakdown = getPriceBreakdown(
      { id: productId, msrp },
      quantity,
      user.companyId,
      priceList || undefined
    )

    return NextResponse.json({
      breakdown,
      volumeBreaks: priceList?.rules.find(r => r.productId === productId)?.volumeBreaks || [],
      priceList: priceList ? {
        id: priceList.id,
        name: priceList.name,
        baseTier: priceList.baseTier
      } : null
    })
  } catch (error) {
    console.error('Error getting price breakdown:', error)
    return NextResponse.json(
      { error: 'Failed to get price breakdown' },
      { status: 500 }
    )
  }
}