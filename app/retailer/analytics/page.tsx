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
  Package,
  ShoppingCart,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { useAuth } from '@/lib/contexts/auth-context'
import { formatCurrency } from '@/lib/mock-data'

export default function RetailerAnalyticsPage() {
  const { user } = useAuth()
  const [dateRange, setDateRange] = useState('30')
  const [salesData, setSalesData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user?.companyId) return

      try {
        const response = await fetch('/api/analytics/sales?' + new URLSearchParams({
          companyId: user.companyId,
          startDate: new Date(Date.now() - parseInt(dateRange) * 86400000).toISOString(),
          endDate: new Date().toISOString(),
          groupBy: dateRange === '7' ? 'day' : dateRange === '30' ? 'week' : 'month'
        }))

        if (response.ok) {
          const data = await response.json()
          setSalesData(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalytics()
  }, [user, dateRange])

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Exporting report...')
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Purchase Analytics</h1>
            <p className="text-gray-600 mt-2">Track your spending patterns and optimize your purchasing</p>
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
            <Button onClick={handleExport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        {salesData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
                  <DollarSign className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(salesData.totalRevenue)}</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{salesData.growthRate * 100}% from last period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{salesData.totalOrders}</div>
                <p className="text-xs text-gray-600 mt-1">
                  Avg: {formatCurrency(salesData.averageOrderValue)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Top Category</CardTitle>
                  <Package className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Apparel</div>
                <p className="text-xs text-gray-600 mt-1">45% of total spend</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Savings Rate</CardTitle>
                  <Activity className="h-4 w-4 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5%</div>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  {formatCurrency(12500)} saved
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Detailed Analytics */}
        <Tabs defaultValue="spending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="spending">Spending Analysis</TabsTrigger>
            <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal Patterns</TabsTrigger>
            <TabsTrigger value="budget">Budget Tracking</TabsTrigger>
          </TabsList>

          <TabsContent value="spending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Purchase History</CardTitle>
                <CardDescription>Your spending over time</CardDescription>
              </CardHeader>
              <CardContent>
                {salesData && (
                  <div className="space-y-4">
                    {salesData.revenueByPeriod.slice(0, 10).map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="text-sm text-gray-600">
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-4">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${(item.revenue / Math.max(...salesData.revenueByPeriod.map((r: any) => r.revenue))) * 100}%`
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium min-w-[80px] text-right">
                            {formatCurrency(item.revenue)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Category Spending</CardTitle>
                <CardDescription>Breakdown by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Apparel', value: 45000, percentage: 45, trend: 'up' },
                    { name: 'Footwear', value: 35000, percentage: 35, trend: 'stable' },
                    { name: 'Accessories', value: 20000, percentage: 20, trend: 'down' }
                  ].map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex items-center gap-2">
                          {category.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                          {category.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600" />}
                          <span className="text-sm text-gray-600">{category.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500">{formatCurrency(category.value)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seasonal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Buying Patterns</CardTitle>
                <CardDescription>Optimize your ordering schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { quarter: 'Q1', amount: 225000, percentage: 20 },
                    { quarter: 'Q2', amount: 280000, percentage: 25 },
                    { quarter: 'Q3', amount: 250000, percentage: 22 },
                    { quarter: 'Q4', amount: 370000, percentage: 33 }
                  ].map((quarter, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl font-bold text-primary">{quarter.quarter}</div>
                      <div className="text-sm text-gray-600 mt-1">{formatCurrency(quarter.amount)}</div>
                      <div className="text-xs text-gray-500">{quarter.percentage}% of annual</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Insight:</strong> Your peak purchasing period is Q4. Consider placing larger orders in Q3 to benefit from better pricing and availability.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Tracking</CardTitle>
                <CardDescription>Monitor your spending against targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Monthly Budget</span>
                      <span className="text-sm text-gray-600">$85,000 / $100,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-yellow-500 h-3 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Quarterly Budget</span>
                      <span className="text-sm text-gray-600">$250,000 / $300,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: '83%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Annual Budget</span>
                      <span className="text-sm text-gray-600">$950,000 / $1,200,000</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: '79%' }} />
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600">Remaining this month</p>
                    <p className="text-lg font-semibold">{formatCurrency(15000)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-600">Days left in period</p>
                    <p className="text-lg font-semibold">12 days</p>
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