import { Product } from '@/lib/mock-data'
import { type Order, type Company } from '@/lib/mock-data'

export interface DateRange {
  start: Date
  end: Date
}

export interface SalesMetrics {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  ordersByType: Record<string, number>
  revenueByPeriod: Array<{ date: string; revenue: number }>
  topProducts: Array<{ product: Product; quantity: number; revenue: number }>
  conversionRate: number
  growthRate: number
}

export interface InventoryMetrics {
  totalProducts: number
  totalValue: number
  stockLevels: Array<{ product: Product; quantity: number; status: 'low' | 'normal' | 'high' }>
  turnoverRate: number
  reorderAlerts: Array<{ product: Product; currentStock: number; reorderPoint: number }>
  topMoving: Array<{ product: Product; velocity: number }>
  deadStock: Array<{ product: Product; daysSinceLastSale: number }>
}

export interface CustomerMetrics {
  totalCustomers: number
  activeCustomers: number
  newCustomers: number
  customerLifetimeValue: number
  retentionRate: number
  churnRate: number
  topCustomers: Array<{ company: Company; totalSpent: number; orderCount: number }>
  customerSegments: Array<{ segment: string; count: number; revenue: number }>
}

export interface ProductPerformance {
  productId: string
  name: string
  totalRevenue: number
  unitsSold: number
  averagePrice: number
  marginPercentage: number
  returnRate: number
  categoryRank: number
  trend: 'up' | 'down' | 'stable'
  forecast: {
    nextMonth: number
    nextQuarter: number
  }
}

export interface OrderTrends {
  period: 'day' | 'week' | 'month' | 'quarter' | 'year'
  data: Array<{
    date: string
    orders: number
    revenue: number
    avgOrderValue: number
    uniqueCustomers: number
  }>
  summary: {
    totalOrders: number
    totalRevenue: number
    growthRate: number
    seasonalIndex: number
  }
}

export interface AnalyticsFilters {
  companyId?: string
  region?: string
  orderType?: 'at-once' | 'prebook' | 'closeout'
  productCategory?: string
  salesRepId?: string
  pricingTier?: string
}

export class AnalyticsService {
  static async getSalesMetrics(
    dateRange: DateRange,
    filters?: AnalyticsFilters
  ): Promise<SalesMetrics> {
    // Simulate fetching sales data
    const mockData: SalesMetrics = {
      totalRevenue: 1250000,
      totalOrders: 3500,
      averageOrderValue: 357.14,
      ordersByType: {
        'at-once': 2100,
        'prebook': 900,
        'closeout': 500
      },
      revenueByPeriod: generateRevenueByPeriod(dateRange),
      topProducts: await getTopProducts(),
      conversionRate: 0.23,
      growthRate: 0.15
    }

    // Apply filters if provided
    if (filters?.orderType) {
      mockData.totalOrders = mockData.ordersByType[filters.orderType] || 0
      mockData.totalRevenue = mockData.totalOrders * mockData.averageOrderValue
    }

    return mockData
  }

  static async getInventoryMetrics(): Promise<InventoryMetrics> {
    const products = await fetchMockProducts()
    
    return {
      totalProducts: products.length,
      totalValue: products.reduce((sum, p) => sum + (p.msrp * 100), 0), // Mock inventory qty
      stockLevels: products.slice(0, 10).map(p => ({
        product: p,
        quantity: Math.floor(Math.random() * 500),
        status: Math.random() > 0.7 ? 'low' : Math.random() > 0.3 ? 'normal' : 'high' as any
      })),
      turnoverRate: 4.2,
      reorderAlerts: products.slice(0, 3).map(p => ({
        product: p,
        currentStock: Math.floor(Math.random() * 20),
        reorderPoint: 50
      })),
      topMoving: products.slice(0, 5).map(p => ({
        product: p,
        velocity: Math.random() * 100
      })),
      deadStock: products.slice(-2).map(p => ({
        product: p,
        daysSinceLastSale: Math.floor(Math.random() * 180) + 90
      }))
    }
  }

  static async getCustomerMetrics(companyId?: string): Promise<CustomerMetrics> {
    const companies = await fetchMockCompanies()
    const targetCompanies = companyId 
      ? companies.filter(c => c.id === companyId)
      : companies

    return {
      totalCustomers: targetCompanies.length,
      activeCustomers: Math.floor(targetCompanies.length * 0.7),
      newCustomers: Math.floor(targetCompanies.length * 0.1),
      customerLifetimeValue: 45000,
      retentionRate: 0.85,
      churnRate: 0.15,
      topCustomers: targetCompanies.slice(0, 5).map(c => ({
        company: c,
        totalSpent: Math.floor(Math.random() * 100000) + 20000,
        orderCount: Math.floor(Math.random() * 50) + 10
      })),
      customerSegments: [
        { segment: 'Premium', count: 50, revenue: 750000 },
        { segment: 'Standard', count: 150, revenue: 400000 },
        { segment: 'Basic', count: 100, revenue: 100000 }
      ]
    }
  }

  static async getProductPerformance(productId?: string): Promise<ProductPerformance[]> {
    const products = await fetchMockProducts()
    const targetProducts = productId 
      ? products.filter(p => p.id === productId)
      : products.slice(0, 10)

    return targetProducts.map((product, index) => ({
      productId: product.id,
      name: product.name,
      totalRevenue: Math.floor(Math.random() * 50000) + 10000,
      unitsSold: Math.floor(Math.random() * 500) + 100,
      averagePrice: product.msrp * 0.7,
      marginPercentage: 0.35 + (Math.random() * 0.15),
      returnRate: Math.random() * 0.05,
      categoryRank: index + 1,
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable' as any,
      forecast: {
        nextMonth: Math.floor(Math.random() * 200) + 50,
        nextQuarter: Math.floor(Math.random() * 600) + 150
      }
    }))
  }

  static async getOrderTrends(period: OrderTrends['period']): Promise<OrderTrends> {
    const dataPoints = generateTrendData(period)
    const totalOrders = dataPoints.reduce((sum, d) => sum + d.orders, 0)
    const totalRevenue = dataPoints.reduce((sum, d) => sum + d.revenue, 0)

    return {
      period,
      data: dataPoints,
      summary: {
        totalOrders,
        totalRevenue,
        growthRate: 0.12,
        seasonalIndex: 1.15
      }
    }
  }

  static async getKPISnapshot(): Promise<Record<string, any>> {
    return {
      dailyRevenue: 42000,
      weeklyRevenue: 285000,
      monthlyRevenue: 1250000,
      orderFulfillmentRate: 0.97,
      customerSatisfaction: 4.6,
      inventoryTurnover: 4.2,
      cashConversionCycle: 45,
      grossMargin: 0.42
    }
  }
}

// Helper functions
function generateRevenueByPeriod(dateRange: DateRange) {
  const days = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))
  const data = []
  
  for (let i = 0; i < Math.min(days, 30); i++) {
    const date = new Date(dateRange.start)
    date.setDate(date.getDate() + i)
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 50000) + 30000
    })
  }
  
  return data
}

function generateTrendData(period: string) {
  const points = period === 'day' ? 24 : period === 'week' ? 7 : period === 'month' ? 30 : 12
  const data = []
  
  for (let i = 0; i < points; i++) {
    const date = new Date()
    if (period === 'day') date.setHours(date.getHours() - (points - i))
    else if (period === 'week') date.setDate(date.getDate() - (points - i))
    else if (period === 'month') date.setDate(date.getDate() - (points - i))
    else date.setMonth(date.getMonth() - (points - i))
    
    data.push({
      date: date.toISOString().split('T')[0],
      orders: Math.floor(Math.random() * 100) + 50,
      revenue: Math.floor(Math.random() * 50000) + 30000,
      avgOrderValue: Math.floor(Math.random() * 500) + 200,
      uniqueCustomers: Math.floor(Math.random() * 50) + 20
    })
  }
  
  return data
}

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  const devPort = process.env.PORT || process.env.NEXT_PUBLIC_DEV_PORT || '3100'
  return `http://localhost:${devPort}`
}

async function fetchMockProducts(): Promise<Product[]> {
  const response = await fetch(`${getBaseUrl()}/mockdata/products.json`)
  const data = await response.json()
  return data.products || []
}

async function fetchMockCompanies(): Promise<Company[]> {
  const response = await fetch(`${getBaseUrl()}/mockdata/companies.json`)
  const data = await response.json()
  return data.companies || []
}

async function getTopProducts(): Promise<Array<{ product: Product; quantity: number; revenue: number }>> {
  const products = await fetchMockProducts()
  return products.slice(0, 5).map(p => ({
    product: p,
    quantity: Math.floor(Math.random() * 500) + 100,
    revenue: Math.floor(Math.random() * 50000) + 10000
  }))
}