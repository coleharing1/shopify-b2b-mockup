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
    const companyId = searchParams.get('companyId')
    const segment = searchParams.get('segment')

    // Apply role-based filtering
    let targetCompanyId = companyId
    if (session.role === 'retailer') {
      targetCompanyId = session.companyId
    }

    // Fetch customer metrics
    const metrics = await AnalyticsService.getCustomerMetrics(targetCompanyId || undefined)

    // Filter by segment if specified
    if (segment) {
      metrics.customerSegments = metrics.customerSegments.filter(
        s => s.segment.toLowerCase() === segment.toLowerCase()
      )
    }

    // Add insights
    const insights = generateCustomerInsights(metrics)

    return NextResponse.json({
      success: true,
      data: metrics,
      insights,
      summary: {
        healthScore: calculateCustomerHealthScore(metrics),
        growthRate: (metrics.newCustomers / metrics.totalCustomers) * 100,
        atRiskCount: Math.floor(metrics.totalCustomers * metrics.churnRate)
      }
    })
  } catch (error) {
    console.error('Customer analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer analytics' },
      { status: 500 }
    )
  }
}

function calculateCustomerHealthScore(metrics: any): number {
  let score = 50 // Base score
  
  // Positive factors
  if (metrics.retentionRate > 0.8) score += 20
  else if (metrics.retentionRate > 0.6) score += 10
  
  if (metrics.customerLifetimeValue > 40000) score += 15
  else if (metrics.customerLifetimeValue > 20000) score += 7
  
  const activeRate = metrics.activeCustomers / metrics.totalCustomers
  if (activeRate > 0.7) score += 15
  else if (activeRate > 0.5) score += 7
  
  // Negative factors
  if (metrics.churnRate > 0.2) score -= 10
  else if (metrics.churnRate > 0.1) score -= 5
  
  return Math.max(0, Math.min(100, score))
}

function generateCustomerInsights(metrics: any) {
  const insights = []
  
  // Retention insights
  if (metrics.retentionRate > 0.85) {
    insights.push({
      type: 'positive',
      message: 'Excellent customer retention rate at ' + (metrics.retentionRate * 100).toFixed(1) + '%',
      metric: 'retention'
    })
  } else if (metrics.retentionRate < 0.7) {
    insights.push({
      type: 'warning',
      message: 'Customer retention below target. Consider engagement campaigns.',
      metric: 'retention',
      action: 'Review customer engagement strategy'
    })
  }
  
  // CLV insights
  if (metrics.customerLifetimeValue > 50000) {
    insights.push({
      type: 'positive',
      message: 'High customer lifetime value indicates strong relationships',
      metric: 'clv'
    })
  }
  
  // Churn insights
  const atRiskCount = Math.floor(metrics.totalCustomers * metrics.churnRate)
  if (atRiskCount > 20) {
    insights.push({
      type: 'alert',
      message: `${atRiskCount} customers at risk of churning`,
      metric: 'churn',
      action: 'Launch retention campaign'
    })
  }
  
  // Segment insights
  const premiumSegment = metrics.customerSegments.find((s: any) => s.segment === 'Premium')
  if (premiumSegment && premiumSegment.revenue > 500000) {
    insights.push({
      type: 'positive',
      message: 'Premium segment driving significant revenue',
      metric: 'segmentation'
    })
  }
  
  return insights
}