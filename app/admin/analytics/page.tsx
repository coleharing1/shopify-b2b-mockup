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
  Package,
  ShoppingCart,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  Filter,
  Target,
  Zap
} from 'lucide-react'
import { formatCurrency } from '@/lib/mock-data'
import { useAuth } from '@/lib/contexts/auth-context'

export default function AdminAnalyticsPage() {
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState('30')
  const [dimension, setDimension] = useState('all')
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch comprehensive analytics
        const [salesRes, inventoryRes, customerRes] = await Promise.all([
          fetch('/api/analytics/sales?' + new URLSearchParams({
            startDate: new Date(Date.now() - parseInt(dateRange) * 86400000).toISOString(),
            endDate: new Date().toISOString(),
            groupBy: dateRange === '7' ? 'day' : dateRange === '30' ? 'week' : 'month'
          })),
          fetch('/api/analytics/inventory'),
          fetch('/api/analytics/customers')
        ])

        if (salesRes.ok && inventoryRes.ok && customerRes.ok) {
          const [salesData, inventoryData, customerData] = await Promise.all([
            salesRes.json(),
            inventoryRes.json(),
            customerRes.json()
          ])

          setAnalyticsData({
            sales: salesData.data,
            inventory: inventoryData.data,
            customers: customerData.data,
            insights: generateInsights(salesData.data, inventoryData.data, customerData.data)
          })
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [dateRange, dimension])

  const generateInsights = (sales: any, inventory: any, customers: any) => ({
    opportunities: [
      {
        title: 'Revenue Growth Opportunity',
        value: 250000,
        description: 'Increase average order value by 10% through bundling',
        priority: 'high'
      },
      {
        title: 'Inventory Optimization',
        value: 150000,
        description: 'Reduce carrying costs by optimizing stock levels',
        priority: 'medium'
      },
      {
        title: 'Customer Expansion',
        value: 180000,
        description: 'Target dormant accounts for reactivation',
        priority: 'high'
      }
    ],
    trends: [
      { metric: 'Revenue', trend: 'up', change: 13.6 },
      { metric: 'Orders', trend: 'up', change: 9.4 },
      { metric: 'AOV', trend: 'up', change: 3.8 },
      { metric: 'Customers', trend: 'up', change: 9.1 }
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
            <h1 className="text-3xl font-bold text-gray-900">Business Analytics</h1>
            <p className="text-gray-600 mt-2">Multi-dimensional analysis and insights</p>
          </div>
          <div className="flex gap-3">
            <Select value={dimension} onValueChange={setDimension}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dimensions</SelectItem>
                <SelectItem value="sales">Sales Only</SelectItem>
                <SelectItem value="inventory">Inventory Only</SelectItem>
                <SelectItem value="customers">Customers Only</SelectItem>
              </SelectContent>
            </Select>
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
              Export
            </Button>
          </div>
        </div>

        {/* Key Insights */}
        {analyticsData?.insights && (
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Key Insights & Opportunities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analyticsData.insights.opportunities.map((opp: any, index: number) => (
                <Card key={index} className={`border-l-4 ${
                  opp.priority === 'high' ? 'border-l-red-500' : 'border-l-yellow-500'
                }`}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{opp.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-green-600 mb-2">
                      +{formatCurrency(opp.value)}
                    </p>
                    <p className="text-sm text-gray-600">{opp.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Performance Trends */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {analyticsData?.insights?.trends.map((trend: any, index: number) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">{trend.metric}</span>
                  {trend.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <p className={`text-2xl font-bold ${
                  trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {trend.trend === 'up' ? '+' : '-'}{Math.abs(trend.change)}%
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Analysis</TabsTrigger>
            <TabsTrigger value="customers">Customer Analysis</TabsTrigger>
            <TabsTrigger value="cohort">Cohort Analysis</TabsTrigger>
            <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Order Type</CardTitle>
                  <CardDescription>Distribution across order types</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData?.sales && (
                    <div className="space-y-4">
                      {Object.entries(analyticsData.sales.ordersByType).map(([type, count]: [string, any]) => (
                        <div key={type}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium capitalize">{type}</span>
                            <span className="text-sm text-gray-600">{count} orders</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full"
                              style={{ 
                                width: `${(count / analyticsData.sales.totalOrders) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>Best performing products</CardDescription>
                </CardHeader>
                <CardContent>
                  {analyticsData?.sales?.topProducts && (
                    <div className="space-y-3">
                      {analyticsData.sales.topProducts.slice(0, 5).map((product: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{product.product.name}</p>
                            <p className="text-xs text-gray-600">{product.quantity} units</p>
                          </div>
                          <span className="font-semibold">{formatCurrency(product.revenue)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Health</CardTitle>
                <CardDescription>Stock levels and turnover analysis</CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData?.inventory && (
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Package className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                      <p className="text-2xl font-bold">{analyticsData.inventory.totalProducts}</p>
                      <p className="text-sm text-gray-600">Total SKUs</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Activity className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold">{analyticsData.inventory.turnoverRate}x</p>
                      <p className="text-sm text-gray-600">Turnover Rate</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <TrendingDown className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                      <p className="text-2xl font-bold">{analyticsData.inventory.reorderAlerts.length}</p>
                      <p className="text-sm text-gray-600">Reorder Alerts</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <Package className="h-8 w-8 mx-auto mb-2 text-red-600" />
                      <p className="text-2xl font-bold">{analyticsData.inventory.deadStock.length}</p>
                      <p className="text-sm text-gray-600">Dead Stock</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Segmentation</CardTitle>
                <CardDescription>Performance by customer segment</CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData?.customers && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center">
                        <p className="text-3xl font-bold">{analyticsData.customers.totalCustomers}</p>
                        <p className="text-sm text-gray-600">Total Customers</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold">
                          {((analyticsData.customers.retentionRate || 0.85) * 100).toFixed(0)}%
                        </p>
                        <p className="text-sm text-gray-600">Retention Rate</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold">
                          {formatCurrency(analyticsData.customers.customerLifetimeValue)}
                        </p>
                        <p className="text-sm text-gray-600">Avg CLV</p>
                      </div>
                    </div>
                    {analyticsData.customers.customerSegments.map((segment: any, index: number) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{segment.segment}</h4>
                          <span className="text-sm text-gray-600">{segment.count} customers</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Revenue</span>
                          <span className="font-semibold">{formatCurrency(segment.revenue)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cohort" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cohort Analysis</CardTitle>
                <CardDescription>Customer retention by acquisition month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Cohort</th>
                        <th className="text-center py-2">Month 0</th>
                        <th className="text-center py-2">Month 1</th>
                        <th className="text-center py-2">Month 2</th>
                        <th className="text-center py-2">Month 3</th>
                        <th className="text-center py-2">Month 4</th>
                        <th className="text-center py-2">Month 5</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { cohort: 'Aug 2024', retention: [100, 85, 78, 72, 68, 65] },
                        { cohort: 'Sep 2024', retention: [100, 88, 82, 76, 71] },
                        { cohort: 'Oct 2024', retention: [100, 90, 84, 79] },
                        { cohort: 'Nov 2024', retention: [100, 87, 81] },
                        { cohort: 'Dec 2024', retention: [100, 92] },
                        { cohort: 'Jan 2025', retention: [100] }
                      ].map((cohort, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 font-medium">{cohort.cohort}</td>
                          {[0, 1, 2, 3, 4, 5].map((month) => (
                            <td key={month} className="text-center py-2">
                              {cohort.retention[month] ? (
                                <span className={`px-2 py-1 rounded text-xs ${
                                  cohort.retention[month] >= 80 ? 'bg-green-100 text-green-700' :
                                  cohort.retention[month] >= 70 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {cohort.retention[month]}%
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictive" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Predictive Analytics</CardTitle>
                <CardDescription>AI-powered forecasts and recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Revenue Forecast</h4>
                    <div className="space-y-2">
                      {[
                        { period: 'Next Month', forecast: 1350000, confidence: 0.89 },
                        { period: 'Next Quarter', forecast: 4100000, confidence: 0.76 },
                        { period: 'Next Year', forecast: 16500000, confidence: 0.62 }
                      ].map((item, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{item.period}</span>
                            <span className="text-xs text-gray-600">
                              {(item.confidence * 100).toFixed(0)}% confidence
                            </span>
                          </div>
                          <p className="text-lg font-bold">{formatCurrency(item.forecast)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Risk Alerts</h4>
                    <div className="space-y-2">
                      {[
                        { risk: 'Inventory shortage predicted for Spring collection', severity: 'high' },
                        { risk: '15% of customers showing churn signals', severity: 'medium' },
                        { risk: 'Seasonal demand spike expected in 3 weeks', severity: 'low' }
                      ].map((alert, index) => (
                        <div key={index} className={`p-3 rounded-lg border ${
                          alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                          alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                          'bg-blue-50 border-blue-200'
                        }`}>
                          <p className="text-sm">{alert.risk}</p>
                        </div>
                      ))}
                    </div>
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