import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/api-auth'
import { QuoteService } from '@/lib/services/quote-service'
import { generateQuotePDF } from '@/components/features/quote-pdf'

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
    if (session.role === 'sales_rep' && quote.assignedTo !== session.id && quote.createdBy !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Generate HTML for the PDF
    const html = generateQuotePDF(quote)

    // Return HTML with appropriate headers for download
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${quote.number}.html"`,
      },
    })
  } catch (error) {
    console.error('Error generating quote PDF:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}