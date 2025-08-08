import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/api-auth'
import { QuoteService } from '@/lib/services/quote-service'
import { QuoteStatus } from '@/types/quote-types'

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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

    // Check permissions
    if (session.role === 'retailer' && quote.companyId !== session.companyId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (session.role === 'sales_rep' && quote.assignedTo !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Track view event for retailers
    if (session.role === 'retailer' && quote.status === 'sent') {
      await QuoteService.updateQuoteStatus(
        quote.id,
        'viewed',
        session.id,
        'Customer viewed the quote'
      )
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Error fetching quote:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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

    // Check permissions
    if (session.role === 'retailer') {
      if (quote.companyId !== session.companyId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      // Retailers can only accept or reject quotes
      const { action } = await request.json()
      if (action !== 'accept' && action !== 'reject' && action !== 'request-revision') {
        return NextResponse.json(
          { error: 'Invalid action for retailer' },
          { status: 400 }
        )
      }
    } else if (session.role === 'sales_rep') {
      if (quote.assignedTo !== session.id && quote.createdBy !== session.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
    }

    const body = await request.json()

    // Handle status updates
    if (body.status) {
      const updatedQuote = await QuoteService.updateQuoteStatus(
        id,
        body.status as QuoteStatus,
         session.id,
        body.details
      )
      return NextResponse.json(updatedQuote)
    }

    // Handle revisions
    if (body.revision) {
      const updatedQuote = await QuoteService.addQuoteRevision(
        id,
        body.revision,
        session.id
      )
      return NextResponse.json(updatedQuote)
    }

    // Handle specific actions
    if (body.action) {
      let status: QuoteStatus
      let details: string

      switch (body.action) {
        case 'accept':
          status = 'accepted'
          details = 'Customer accepted the quote'
          break
        case 'reject':
          status = 'rejected'
          details = body.reason || 'Customer rejected the quote'
          break
        case 'send':
          status = 'sent'
          details = 'Quote sent to customer'
          break
        case 'request-revision':
          status = 'revised'
          details = body.revisionNotes || 'Customer requested revisions'
          break
        default:
          return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
          )
      }

      const updatedQuote = await QuoteService.updateQuoteStatus(
        id,
        status,
         session.id,
        details
      )
      return NextResponse.json(updatedQuote)
    }

    return NextResponse.json(
      { error: 'No valid update provided' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating quote:', error)
    return NextResponse.json(
      { error: 'Failed to update quote' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
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

    // Only allow deletion of draft quotes by the creator or admin
    if (quote.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft quotes can be deleted' },
        { status: 400 }
      )
    }

    if (session.role !== 'admin' && quote.createdBy !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    await QuoteService.updateQuoteStatus(
      id,
      'cancelled',
      session.id,
      'Quote cancelled'
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting quote:', error)
    return NextResponse.json(
      { error: 'Failed to delete quote' },
      { status: 500 }
    )
  }
}