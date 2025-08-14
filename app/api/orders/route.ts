import { NextRequest, NextResponse } from 'next/server'
import { getOrdersByCompanyId } from '@/lib/mock-data'

/**
 * @description Orders API endpoint with company-specific filtering
 * @fileoverview Serves orders filtered by companyId with proper authorization
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
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Authorization check
    // Retailers can only see their own orders
    // Sales reps and admins can see any company's orders
    if (user.role === 'retailer' && companyId !== user.companyId) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Get orders for the company
    const allOrders = await getOrdersByCompanyId(companyId)

    // Apply filters
    let filteredOrders = allOrders

    if (status && status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === status)
    }

    if (search) {
      filteredOrders = filteredOrders.filter(order =>
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.poNumber.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Sort by date (newest first)
    filteredOrders.sort((a, b) => 
      new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    )

    // Apply pagination
    const paginatedOrders = filteredOrders.slice(offset, offset + limit)

    return NextResponse.json({
      orders: paginatedOrders,
      total: filteredOrders.length,
      limit,
      offset,
      companyId
    })
  } catch (error) {
    console.error('Orders API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
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

    // Validate required fields
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

    if (!body.poNumber) {
      return NextResponse.json(
        { error: 'PO number is required' },
        { status: 400 }
      )
    }

    // Calculate order total
    const subtotal = body.items.reduce((sum: number, item: any) => {
      // Support both unitPrice (preferred) and price (legacy) fields
      const price = item.unitPrice || item.price || 0
      return sum + (price * item.quantity)
    }, 0)

    const tax = subtotal * 0.08 // 8% tax rate
    const shipping = subtotal > 500 ? 0 : 25 // Free shipping over $500
    const total = subtotal + tax + shipping

    // Create new order
    const newOrder = {
      id: `ORD-${Date.now()}`,
      companyId: user.companyId,
      poNumber: body.poNumber,
      orderDate: new Date().toISOString(),
      requestedShipDate: body.requestedShipDate || null,
      status: 'pending',
      items: body.items,
      subtotal,
      tax,
      shipping,
      total,
      specialInstructions: body.specialInstructions || '',
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In production, save to database
    // For demo, return success
    return NextResponse.json({
      message: 'Order created successfully',
      order: newOrder
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

// PUT endpoint for updating order status
export async function PUT(request: NextRequest) {
  try {
    const user = await verifySession(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Only reps and admins can update order status
    if (user.role === 'retailer') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { orderId, status } = body

    if (!orderId || !status) {
      return NextResponse.json(
        { error: 'Order ID and status are required' },
        { status: 400 }
      )
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // In production, update in database
    // For demo, return success
    return NextResponse.json({
      message: 'Order status updated successfully',
      orderId,
      status,
      updatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}