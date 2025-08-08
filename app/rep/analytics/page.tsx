'use client'

import { useEffect, useState } from 'react'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Award,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '@/lib/contexts/auth-context'
import { formatCurrency } from '@/lib/mock-data'

export default function RepAnalyticsPage() {
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState('30')
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch sales analytics
        const salesResponse = await fetch('/api/analytics/sales?' + new URLSearchParams({
          salesRepId: user?.id || 'user-4',
          startDate: new Date(Date.now() - parseInt(dateRange) * 86400000).toISOString(),
          endDate: new Date().toISOString(),
          groupBy: dateRange === '7' ? 'day' : dateRange === '30' ? 'week' : 'month'
        }))

        // Fetch customer analytics
        const customerResponse = await fetch('/api/analytics/customers?' + new URLSearchParams({
          salesRepId: user?.id || 'user-4'
        }))

        if (salesResponse.ok && customerResponse.ok) {
          const salesData = await salesResponse.json()
          const customerData = await customerResponse.json()
          
          setAnalyticsData({
            sales: salesData.data,
            customers: customerData.data,
            performance: generatePerformanceMetrics()
          })
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [user, dateRange])

  const generatePerformanceMetrics = () => ({
    quotaAttainment: 0.89,
    winRate: 0.23,
    avgDealSize: 35714,
    salesCycle: 21,
    customerRetention: 0.85,
    crossSellRate: 0.42,
    territories: [
      { name: 'West Coast', revenue: 450000, growth: 0.15 },
      { name: 'Mountain', revenue: 320000, growth: 0.08 },
      { name: 'Southwest', revenue: 280000, growth: -0.05 }
    ]
  })

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Performance Analytics</h1>
            <p className="text-gray-600 mt-2">Track your sales performance and customer metrics</p>
          </div>
          <div className="flex gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 3 months</SelectItem>
                <SelectItem value="180">Last 6 months</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        {analyticsData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Quota Attainment</CardTitle>
                  <Target className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(analyticsData.performance.quotaAttainment * 100).toFixed(1)}%
                </div>
                <div className="flex items-center mt-1">
                  {analyticsData.performance.quotaAttainment >= 1 ? (
                    <>
                      <Award className="h-3 w-3 text-green-600 mr-1" />
                      <span className="text-xs text-green-600">On track</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3 w-3 text-yellow-600 mr-1" />
                      <span className="text-xs text-yellow-600">Below target</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Win Rate</CardTitle>
                  <Activity className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(analyticsData.performance.winRate * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Industry avg: 20%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Deal Size</CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(analyticsData.performance.avgDealSize)}
                </div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Sales Cycle</CardTitle>
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analyticsData.performance.salesCycle} days
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Target: 18 days
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Analytics Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-4">
          <TabsList>
            <TabsTrigger value="portfolio">Customer Portfolio</TabsTrigger>
            <TabsTrigger value="territory">Territory Performance</TabsTrigger>
            <TabsTrigger value="products">Product Mix</TabsTrigger>
            <TabsTrigger value="forecast">Forecast vs Actual</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Portfolio Analysis</CardTitle>
                <CardDescription>Performance by customer segment</CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData?.customers && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Users className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                        <p className="text-2xl font-bold">{analyticsData.customers.totalCustomers}</p>
                        <p className="text-sm text-gray-600">Total Accounts</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Activity className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <p className="text-2xl font-bold">{analyticsData.customers.activeCustomers}</p>
                        <p className="text-sm text-gray-600">Active This Month</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <p className="text-2xl font-bold">{analyticsData.customers.newCustomers}</p>
                        <p className="text-sm text-gray-600">New This Month</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Segment Performance</h4>
                      <div className="space-y-3">
                        {analyticsData.customers.customerSegments.map((segment: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{segment.segment}</p>
                              <p className="text-sm text-gray-600">{segment.count} customers</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(segment.revenue)}</p>
                              <p className="text-xs text-gray-500">Revenue</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">Customer Health</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-blue-700">Retention Rate</p>
                          <p className="text-lg font-bold text-blue-900">
                            {(analyticsData.performance.customerRetention * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-700">CLV</p>
                          <p className="text-lg font-bold text-blue-900">
                            {formatCurrency(analyticsData.customers.customerLifetimeValue)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-blue-700">Cross-sell Rate</p>
                          <p className="text-lg font-bold text-blue-900">
                            {(analyticsData.performance.crossSellRate * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="territory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Territory Performance</CardTitle>
                <CardDescription>Sales by region</CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData?.performance && (
                  <div className="space-y-4">
                    {analyticsData.performance.territories.map((territory: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{territory.name}</span>
                          <div className="flex items-center gap-2">
                            {territory.growth > 0 ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className={`text-sm font-medium ${
                              territory.growth > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {territory.growth > 0 ? '+' : ''}{(territory.growth * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ 
                              width: `${(territory.revenue / Math.max(...analyticsData.performance.territories.map((t: any) => t.revenue))) * 100}%` 
                            }}
                          />
                        </div>
                        <p className="text-sm text-gray-600">{formatCurrency(territory.revenue)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Product Mix Optimization</CardTitle>
                <CardDescription>Sales distribution by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: 'Apparel', sales: 450000, units: 2500, margin: 0.42 },
                    { category: 'Footwear', sales: 380000, units: 1800, margin: 0.38 },
                    { category: 'Accessories', sales: 220000, units: 3200, margin: 0.45 }
                  ].map((product, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{product.category}</h4>
                        <span className="text-sm text-gray-600">
                          {((product.sales / 1050000) * 100).toFixed(1)}% of total
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Revenue</p>
                          <p className="font-semibold">{formatCurrency(product.sales)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Units Sold</p>
                          <p className="font-semibold">{product.units.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Margin</p>
                          <p className="font-semibold">{(product.margin * 100).toFixed(0)}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecast" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Forecast vs Actual</CardTitle>
                <CardDescription>Tracking forecast accuracy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-900">Forecast Accuracy</span>
                      <span className="text-2xl font-bold text-green-900">87%</span>
                    </div>
                    <div className="text-xs text-green-700">
                      Your forecasts are highly accurate. Keep up the good work!
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { month: 'October', forecast: 120000, actual: 125000 },
                      { month: 'November', forecast: 135000, actual: 140000 },
                      { month: 'December', forecast: 150000, actual: 155000 },
                      { month: 'January', forecast: 140000, actual: 125840 }
                    ].map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{item.month}</span>
                          <span className={item.actual >= item.forecast ? 'text-green-600' : 'text-red-600'}>
                            {((item.actual / item.forecast - 1) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div className="bg-gray-500 h-2 rounded-full" style={{ width: '100%' }} />
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                item.actual >= item.forecast ? 'bg-green-600' : 'bg-red-600'
                              }`}
                              style={{ width: `${Math.min(100, (item.actual / item.forecast) * 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Forecast: {formatCurrency(item.forecast)}</span>
                          <span>Actual: {formatCurrency(item.actual)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}