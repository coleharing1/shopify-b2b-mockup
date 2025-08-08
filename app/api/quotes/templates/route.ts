import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/api-auth'
import { QuoteService } from '@/lib/services/quote-service'

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only reps and admins can access templates
    if (session.role === 'retailer') {
      return NextResponse.json(
        { error: 'Templates not available for retailers' },
        { status: 403 }
      )
    }

    const templates = await QuoteService.getTemplates()
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
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

    // Only reps and admins can create templates
    if (session.role === 'retailer') {
      return NextResponse.json(
        { error: 'Cannot create templates' },
        { status: 403 }
      )
    }

    const { name, description, quoteId } = await request.json()

    if (!name || !quoteId) {
      return NextResponse.json(
        { error: 'Name and quoteId are required' },
        { status: 400 }
      )
    }

    const quote = await QuoteService.getQuote(quoteId)
    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    const template = await QuoteService.saveTemplate(
      name,
      description || '',
      quote,
      session.id
    )

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}