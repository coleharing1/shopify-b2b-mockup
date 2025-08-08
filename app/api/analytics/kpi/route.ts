import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/lib/services/analytics-service'
import { verifySession } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'month'
    const compare = searchParams.get('compare') === 'true'

    // Get KPI snapshot
    const kpis = await AnalyticsService.getKPISnapshot()

    // Filter KPIs based on role
    const roleKPIs = filterKPIsByRole(kpis, session.role)

    // Add comparison data if requested
    let comparisonData = null
    if (compare) {
      comparisonData = generateComparisonData(roleKPIs)
    }

    // Calculate performance indicators
    const performance = calculatePerformance(roleKPIs)

    return NextResponse.json({
      success: true,
      data: {
        current: roleKPIs,
        comparison: comparisonData,
        performance,
        period,
        lastUpdated: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('KPI analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch KPI data' },
      { status: 500 }
    )
  }
}

function filterKPIsByRole(kpis: Record<string, any>, role: string): Record<string, any> {
  const roleKPIMap: Record<string, string[]> = {
    retailer: [
      'monthlyRevenue',
      'orderFulfillmentRate',
      'customerSatisfaction'
    ],
    rep: [
      'dailyRevenue',
      'weeklyRevenue',
      'monthlyRevenue',
      'orderFulfillmentRate',
      'customerSatisfaction',
      'grossMargin'
    ],
    admin: Object.keys(kpis) // Admin sees all KPIs
  }

  const allowedKPIs = roleKPIMap[role] || []
  const filtered: Record<string, any> = {}

  allowedKPIs.forEach(key => {
    if (key in kpis) {
      filtered[key] = kpis[key]
    }
  })

  return filtered
}

function generateComparisonData(currentKPIs: Record<string, any>): Record<string, any> {
  const comparison: Record<string, any> = {}

  Object.entries(currentKPIs).forEach(([key, value]) => {
    if (typeof value === 'number') {
      // Generate previous period value (mock data)
      const previousValue = value * (0.85 + Math.random() * 0.3)
      const change = ((value - previousValue) / previousValue) * 100

      comparison[key] = {
        current: value,
        previous: previousValue,
        change: change.toFixed(2),
        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
      }
    }
  })

  return comparison
}

function calculatePerformance(kpis: Record<string, any>): Record<string, any> {
  const performance: Record<string, any> = {
    overall: 'good',
    score: 75,
    areas: []
  }

  // Revenue performance
  if ('monthlyRevenue' in kpis) {
    const revenueTarget = 1000000
    const revenuePerformance = (kpis.monthlyRevenue / revenueTarget) * 100
    performance.areas.push({
      name: 'Revenue',
      score: Math.min(100, revenuePerformance),
      status: revenuePerformance >= 100 ? 'excellent' : revenuePerformance >= 80 ? 'good' : 'needs-improvement'
    })
  }

  // Fulfillment performance
  if ('orderFulfillmentRate' in kpis) {
    const fulfillmentScore = kpis.orderFulfillmentRate * 100
    performance.areas.push({
      name: 'Fulfillment',
      score: fulfillmentScore,
      status: fulfillmentScore >= 95 ? 'excellent' : fulfillmentScore >= 90 ? 'good' : 'needs-improvement'
    })
  }

  // Customer satisfaction
  if ('customerSatisfaction' in kpis) {
    const satisfactionScore = (kpis.customerSatisfaction / 5) * 100
    performance.areas.push({
      name: 'Customer Satisfaction',
      score: satisfactionScore,
      status: satisfactionScore >= 90 ? 'excellent' : satisfactionScore >= 80 ? 'good' : 'needs-improvement'
    })
  }

  // Margin performance
  if ('grossMargin' in kpis) {
    const marginScore = kpis.grossMargin * 100
    performance.areas.push({
      name: 'Gross Margin',
      score: marginScore,
      status: marginScore >= 40 ? 'excellent' : marginScore >= 35 ? 'good' : 'needs-improvement'
    })
  }

  // Calculate overall score
  if (performance.areas.length > 0) {
    performance.score = Math.round(
      performance.areas.reduce((sum: number, area: any) => sum + area.score, 0) / performance.areas.length
    )
    performance.overall = performance.score >= 85 ? 'excellent' : performance.score >= 70 ? 'good' : 'needs-improvement'
  }

  return performance
}