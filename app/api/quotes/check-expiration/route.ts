import { NextRequest, NextResponse } from 'next/server'
import { QuoteService } from '@/lib/services/quote-service'

// This endpoint can be called by a cron job to check and expire quotes
export async function POST(request: NextRequest) {
  try {
    // In production, you'd want to verify this is called by your cron service
    // For example, check for a secret header
    const authHeader = request.headers.get('x-cron-secret')
    if (process.env.CRON_SECRET && authHeader !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check and expire quotes
    const expiredCount = await QuoteService.expireQuotes()

    // Get quotes expiring soon for notifications
    const expiringQuotes = await QuoteService.checkExpiringQuotes()

    // In a real app, you would:
    // 1. Send email notifications for expiring quotes
    // 2. Send reminders to sales reps
    // 3. Update any dashboards or metrics

    return NextResponse.json({
      success: true,
      expired: expiredCount,
      expiringSoon: expiringQuotes.length,
      message: `Expired ${expiredCount} quotes, ${expiringQuotes.length} expiring soon`
    })
  } catch (error) {
    console.error('Error checking quote expiration:', error)
    return NextResponse.json(
      { error: 'Failed to check quote expiration' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    service: 'quote-expiration-checker',
    timestamp: new Date().toISOString()
  })
}