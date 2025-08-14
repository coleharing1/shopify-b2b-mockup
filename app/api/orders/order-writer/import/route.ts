import { NextRequest, NextResponse } from 'next/server'
import { excelOrderWriter } from '@/lib/services/excel-order-writer'
import { getServerBaseUrl } from '@/lib/mock-data'

/**
 * POST /api/orders/order-writer/import
 * Uploads and processes completed Excel order
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

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const poNumber = formData.get('poNumber') as string
    const specialInstructions = formData.get('specialInstructions') as string
    const requestedShipDate = formData.get('requestedShipDate') as string

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Check file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/octet-stream' // Some browsers send this for Excel files
    ]
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx')) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an Excel (.xlsx) file' },
        { status: 400 }
      )
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // For sales reps, get companyId from form data
    let companyId = user.companyId
    if (user.role === 'sales_rep' || user.role === 'admin') {
      const requestedCompanyId = formData.get('companyId') as string
      if (!requestedCompanyId) {
        return NextResponse.json(
          { error: 'Company ID required for sales rep/admin users' },
          { status: 400 }
        )
      }
      companyId = requestedCompanyId
    }

    // Parse and validate the Excel file
    const parseResult = await excelOrderWriter.parseOrderWorkbook(buffer, companyId)

    // Check for parsing errors
    if (!parseResult.validation.valid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          validation: parseResult.validation,
          items: parseResult.items
        },
        { status: 422 }
      )
    }

    // Check if there are any items
    if (parseResult.items.length === 0) {
      return NextResponse.json(
        { error: 'No valid items found in the order' },
        { status: 400 }
      )
    }

    // Prepare order data for creation
    const orderData = {
      companyId,
      poNumber: poNumber || `AUTO-${Date.now()}`,
      requestedShipDate: requestedShipDate || null,
      specialInstructions: specialInstructions || '',
      orderType: parseResult.metadata.orderType,
      items: parseResult.items.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        sku: item.sku,
        name: item.name || item.description || 'Unknown Product',
        quantity: item.quantity,
        unitPrice: item.unitPrice || 0,
        notes: item.notes || ''
      })),
      source: 'excel_import',
      importMetadata: {
        exportId: parseResult.metadata.exportId,
        fileName: file.name,
        importedAt: new Date().toISOString(),
        importedBy: user.id
      }
    }

    // Call the orders API to create the order
    const baseUrl = getServerBaseUrl()
    const createOrderResponse = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '' // Forward cookies for auth
      },
      body: JSON.stringify(orderData)
    })

    if (!createOrderResponse.ok) {
      const errorData = await createOrderResponse.json()
      return NextResponse.json(
        { error: errorData.error || 'Failed to create order' },
        { status: createOrderResponse.status }
      )
    }

    const createdOrder = await createOrderResponse.json()

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Order imported successfully',
      order: createdOrder.order,
      validation: parseResult.validation,
      stats: {
        itemCount: parseResult.items.length,
        totalQuantity: parseResult.items.reduce((sum, item) => sum + item.quantity, 0),
        totalValue: parseResult.items.reduce((sum, item) => 
          sum + (item.unitPrice || 0) * item.quantity, 0
        )
      }
    })

  } catch (error) {
    console.error('Import error:', error)
    
    // Return appropriate error response
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('Company not found')) {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        )
      }
      
      if (error.message.includes('parse')) {
        return NextResponse.json(
          { error: 'Failed to parse Excel file. Please ensure it is a valid order template.' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to import order' },
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    }
  })
}