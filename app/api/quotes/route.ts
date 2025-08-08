import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/api-auth'
import { QuoteService } from '@/lib/services/quote-service'
import { QuoteRequest, QuoteFilter } from '@/types/quote-types'

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    
    const filter: QuoteFilter = {}

    // Parse filter parameters
    const status = searchParams.get('status')
    if (status) {
      filter.status = status.split(',') as any
    }

    const type = searchParams.get('type')
    if (type) {
      filter.type = type.split(',') as any
    }

    const search = searchParams.get('search')
    if (search) {
      filter.search = search
    }

    const minValue = searchParams.get('minValue')
    if (minValue) {
      filter.minValue = parseFloat(minValue)
    }

    const maxValue = searchParams.get('maxValue')
    if (maxValue) {
      filter.maxValue = parseFloat(maxValue)
    }

    const dateFrom = searchParams.get('dateFrom')
    if (dateFrom) {
      filter.dateFrom = new Date(dateFrom)
    }

    const dateTo = searchParams.get('dateTo')
    if (dateTo) {
      filter.dateTo = new Date(dateTo)
    }

    // Apply role-based filtering
    if (session.role === 'retailer') {
      filter.companyId = session.companyId
    } else if (session.role === 'sales_rep') {
      filter.assignedTo = session.id
    }
    // Admin sees all quotes

    const quotes = await QuoteService.getQuotes(filter)
    const summary = await QuoteService.getQuoteSummary(filter)

    return NextResponse.json({
      quotes,
      summary,
      total: quotes.length
    })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const quoteRequest: QuoteRequest = body

    // Validate request
    if (!quoteRequest.companyId || !quoteRequest.items || quoteRequest.items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid quote request' },
        { status: 400 }
      )
    }

    // Check permissions
    if (session.role === 'retailer') {
      // Retailers can only create RFQs for their own company
      if (quoteRequest.companyId !== session.companyId) {
        return NextResponse.json(
          { error: 'Cannot create quote for another company' },
          { status: 403 }
        )
      }
      quoteRequest.type = 'rfq'
      quoteRequest.contactId = session.id
    } else if (session.role === 'sales_rep') {
      // Reps can create quotes for any company
      if (!quoteRequest.type) {
        quoteRequest.type = 'proactive'
      }
    } else if (session.role === 'admin') {
      // Admins can create any type of quote
      if (!quoteRequest.type) {
        quoteRequest.type = 'proactive'
      }
    }

    const quote = await QuoteService.createQuote(quoteRequest, session.id)

    // If the request includes sending the quote immediately
    if (body.sendImmediately) {
      await QuoteService.updateQuoteStatus(
        quote.id,
        'sent',
        session.id,
        'Quote sent to customer'
      )
    }

    return NextResponse.json(quote, { status: 201 })
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json(
      { error: 'Failed to create quote' },
      { status: 500 }
    )
  }
}