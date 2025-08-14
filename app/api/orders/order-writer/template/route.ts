import { NextRequest, NextResponse } from 'next/server'
import { excelOrderWriter } from '@/lib/services/excel-order-writer'

/**
 * GET /api/orders/order-writer/template
 * Downloads personalized Excel order template
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
    'user-1': { id: 'user-1', companyId: 'company-1', role: 'retailer', name: 'John Doe' },
    'user-2': { id: 'user-2', companyId: 'company-2', role: 'retailer', name: 'Sarah Johnson' },
    'user-3': { id: 'user-3', companyId: 'company-3', role: 'retailer', name: 'Mike Chen' },
    'user-4': { id: 'user-4', companyId: 'b2b-internal', role: 'sales_rep', name: 'Alex Thompson' },
    'user-5': { id: 'user-5', companyId: 'b2b-internal', role: 'admin', name: 'Admin User' }
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
    const orderType = searchParams.get('orderType') as 'at-once' | 'prebook' | 'closeout' || 'at-once'
    const productIds = searchParams.get('productIds')?.split(',').filter(Boolean)
    const season = searchParams.get('season') || undefined
    
    // For sales reps, require companyId parameter
    let companyId = user.companyId
    if (user.role === 'sales_rep' || user.role === 'admin') {
      const requestedCompanyId = searchParams.get('companyId')
      if (!requestedCompanyId) {
        return NextResponse.json(
          { error: 'Company ID required for sales rep/admin users' },
          { status: 400 }
        )
      }
      companyId = requestedCompanyId
    }

    // Validate order type
    const validOrderTypes = ['at-once', 'prebook', 'closeout']
    if (!validOrderTypes.includes(orderType)) {
      return NextResponse.json(
        { error: `Invalid order type. Must be one of: ${validOrderTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Generate the Excel workbook
    const buffer = await excelOrderWriter.generateOrderWorkbook({
      companyId,
      orderType,
      productIds,
      season
    })

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const filename = `order-${orderType}-${timestamp}.xlsx`

    // Return Excel file
    return new Response(buffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Template generation error:', error)
    
    // Return appropriate error response
    if (error instanceof Error) {
      if (error.message === 'Company not found') {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate order template' },
      { status: 500 }
    )
  }
}

// OPTIONS endpoint for CORS preflight
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
  })
}