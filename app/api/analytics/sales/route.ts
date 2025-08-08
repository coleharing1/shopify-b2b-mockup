import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService, DateRange, AnalyticsFilters } from '@/lib/services/analytics-service'
import { verifySession } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    
    // Parse date range
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const dateRange: DateRange = {
      start: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 86400000),
      end: endDate ? new Date(endDate) : new Date()
    }

    // Parse filters
    const filters: AnalyticsFilters = {
      companyId: searchParams.get('companyId') || undefined,
      region: searchParams.get('region') || undefined,
      orderType: searchParams.get('orderType') as any || undefined,
      productCategory: searchParams.get('category') || undefined,
      salesRepId: searchParams.get('salesRepId') || undefined,
      pricingTier: searchParams.get('tier') || undefined
    }

    // Apply role-based filtering
    if (session.role === 'retailer') {
      filters.companyId = session.companyId
    } else if (session.role === 'sales_rep') {
      filters.salesRepId = session.id
    }

    // Get grouping period
    const groupBy = searchParams.get('groupBy') || 'day'

    // Fetch sales metrics
    const metrics = await AnalyticsService.getSalesMetrics(dateRange, filters)

    // Add grouping if requested
    if (groupBy && ['day', 'week', 'month', 'quarter'].includes(groupBy)) {
      const grouped = groupDataByPeriod(metrics.revenueByPeriod, groupBy as any)
      metrics.revenueByPeriod = grouped
    }

    return NextResponse.json({
      success: true,
      data: metrics,
      filters: {
        dateRange,
        ...filters,
        groupBy
      }
    })
  } catch (error) {
    console.error('Sales analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales analytics' },
      { status: 500 }
    )
  }
}

function groupDataByPeriod(
  data: Array<{ date: string; revenue: number }>,
  period: 'day' | 'week' | 'month' | 'quarter'
): Array<{ date: string; revenue: number }> {
  if (period === 'day') return data

  const grouped = new Map<string, number>()

  data.forEach(item => {
    const date = new Date(item.date)
    let key: string

    switch (period) {
      case 'week':
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split('T')[0]
        break
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        break
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1
        key = `${date.getFullYear()}-Q${quarter}`
        break
      default:
        key = item.date
    }

    grouped.set(key, (grouped.get(key) || 0) + item.revenue)
  })

  return Array.from(grouped.entries()).map(([date, revenue]) => ({ date, revenue }))
}