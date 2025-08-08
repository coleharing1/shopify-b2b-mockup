import { NextRequest, NextResponse } from 'next/server'
import { verifySession } from '@/lib/api-auth'
import { QuoteService } from '@/lib/services/quote-service'

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const expiringQuotes = await QuoteService.checkExpiringQuotes()

    // Filter based on role
    let filtered = expiringQuotes
    if (session.role === 'retailer') {
      filtered = expiringQuotes.filter(q => q.companyId === session.companyId)
    } else if (session.role === 'sales_rep') {
      filtered = expiringQuotes.filter(q => q.assignedTo === session.id)
    }
    // Admin sees all expiring quotes

    return NextResponse.json({
      quotes: filtered,
      count: filtered.length
    })
  } catch (error) {
    console.error('Error fetching expiring quotes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expiring quotes' },
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

    // Only admins can trigger expire check
    if (session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can expire quotes' },
        { status: 403 }
      )
    }

    const expiredCount = await QuoteService.expireQuotes()

    return NextResponse.json({
      success: true,
      expiredCount,
      message: `${expiredCount} quotes expired`
    })
  } catch (error) {
    console.error('Error expiring quotes:', error)
    return NextResponse.json(
      { error: 'Failed to expire quotes' },
      { status: 500 }
    )
  }
}