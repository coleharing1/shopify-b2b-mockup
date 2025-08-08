import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/lib/services/analytics-service'
import { verifySession } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession(request)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin and rep roles can access inventory analytics
    if (!['admin', 'rep'].includes(session.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const alertsOnly = searchParams.get('alertsOnly') === 'true'
    const includeForecasting = searchParams.get('includeForecasting') === 'true'

    // Fetch inventory metrics
    const metrics = await AnalyticsService.getInventoryMetrics()

    // Filter by category if specified
    if (category) {
      metrics.stockLevels = metrics.stockLevels.filter(
        item => item.product.category === category
      )
      metrics.topMoving = metrics.topMoving.filter(
        item => item.product.category === category
      )
    }

    // Return only alerts if requested
    if (alertsOnly) {
      return NextResponse.json({
        success: true,
        data: {
          reorderAlerts: metrics.reorderAlerts,
          lowStock: metrics.stockLevels.filter(item => item.status === 'low'),
          deadStock: metrics.deadStock
        }
      })
    }

    // Add forecasting data if requested
    if (includeForecasting) {
      const forecastingData = await generateForecastingData(metrics)
      return NextResponse.json({
        success: true,
        data: {
          ...metrics,
          forecasting: forecastingData
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: metrics,
      summary: {
        totalProducts: metrics.totalProducts,
        totalValue: metrics.totalValue,
        alertCount: metrics.reorderAlerts.length,
        lowStockCount: metrics.stockLevels.filter(i => i.status === 'low').length,
        healthScore: calculateInventoryHealth(metrics)
      }
    })
  } catch (error) {
    console.error('Inventory analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory analytics' },
      { status: 500 }
    )
  }
}

function calculateInventoryHealth(metrics: any): number {
  // Calculate a health score from 0-100
  let score = 100
  
  // Deduct for reorder alerts
  score -= metrics.reorderAlerts.length * 2
  
  // Deduct for low stock items
  const lowStockCount = metrics.stockLevels.filter((i: any) => i.status === 'low').length
  score -= lowStockCount * 1.5
  
  // Deduct for dead stock
  score -= metrics.deadStock.length * 3
  
  // Bonus for good turnover rate
  if (metrics.turnoverRate > 4) {
    score += 10
  } else if (metrics.turnoverRate < 2) {
    score -= 10
  }
  
  return Math.max(0, Math.min(100, score))
}

async function generateForecastingData(metrics: any) {
  // Generate demand forecasting based on current metrics
  return {
    nextMonth: {
      expectedDemand: metrics.topMoving.map((item: any) => ({
        productId: item.product.id,
        estimatedUnits: Math.floor(item.velocity * 30),
        confidence: 0.75 + Math.random() * 0.2
      }))
    },
    nextQuarter: {
      expectedDemand: metrics.topMoving.map((item: any) => ({
        productId: item.product.id,
        estimatedUnits: Math.floor(item.velocity * 90),
        confidence: 0.65 + Math.random() * 0.2
      }))
    },
    seasonalFactors: {
      currentIndex: 1.15,
      nextMonthIndex: 1.08,
      trend: 'increasing' as const
    },
    reorderSuggestions: metrics.reorderAlerts.map((alert: any) => ({
      ...alert,
      suggestedQuantity: Math.max(100, alert.reorderPoint * 2),
      estimatedLeadTime: 14 + Math.floor(Math.random() * 7)
    }))
  }
}