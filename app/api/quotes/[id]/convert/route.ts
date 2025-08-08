import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/api-auth'
import { QuoteService } from '@/lib/services/quote-service'

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const session = await verifySession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const quote = await QuoteService.getQuote(id)
    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 })
    }

    // Check permissions - only the customer or admin can convert
    if (session.role === 'retailer' && quote.companyId !== session.companyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (session.role === 'sales_rep') {
      return NextResponse.json(
        { error: 'Sales reps cannot convert quotes directly' },
        { status: 403 }
      )
    }

    // Check quote status
    if (quote.status !== 'accepted') {
      return NextResponse.json(
        { error: 'Only accepted quotes can be converted to orders' },
        { status: 400 }
      )
    }

    const result = await QuoteService.convertQuoteToOrder(id)

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
      orderNumber: result.orderNumber,
      message: `Quote successfully converted to order ${result.orderNumber}`
    })
  } catch (error) {
    console.error('Error converting quote to order:', error)
    return NextResponse.json(
      { error: 'Failed to convert quote to order' },
      { status: 500 }
    )
  }
}