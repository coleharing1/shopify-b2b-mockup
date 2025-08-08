'use client'

import { useEffect, useState } from 'react'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DollarSign,
  Users,
  Package,
  TrendingUp,
  Activity,
  AlertCircle,
  BarChart3,
  ShoppingCart,
  Clock,
  Target,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/mock-data'
import { useAuth } from '@/lib/contexts/auth-context'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [kpiData, setKpiData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch KPI data
        const kpiResponse = await fetch('/api/analytics/kpi')
        if (kpiResponse.ok) {
          const data = await kpiResponse.json()
          setKpiData(data.data)
        }

        // Simulate additional analytics data
        setKpiData((prev: any) => ({
          ...prev,
          current: {
            totalRevenue: 1250000,
            totalOrders: 3500,
            totalCustomers: 300,
            inventoryValue: 2500000,
            fulfillmentRate: 0.97,
            customerSatisfaction: 4.6,
            grossMargin: 0.42,
            cashFlow: 195000
          },
          comparison: {
            revenue: { current: 1250000, previous: 1100000, change: 13.6 },
            orders: { current: 3500, previous: 3200, change: 9.4 },
            customers: { current: 300, previous: 275, change: 9.1 },
            aov: { current: 357, previous: 344, change: 3.8 }
          },
          alerts: [
            { type: 'warning', message: '15 products low on stock', link: '/admin/inventory' },
            { type: 'info', message: '5 pending catalog approvals', link: '/admin/catalogs' },
            { type: 'success', message: 'Revenue up 13.6% this month', link: '/admin/analytics' }
          ],
          recentOrders: [
            { id: 'ORD-10234', customer: 'Outdoor Retailers Co.', amount: 12500, status: 'processing' },
            { id: 'ORD-10235', customer: 'Mountain Gear Shop', amount: 8750, status: 'pending' },
            { id: 'ORD-10236', customer: 'Adventure Sports Inc.', amount: 15200, status: 'shipped' }
          ]
        }))
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/admin/reports">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/analytics">
                <Activity className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
          </div>
        </div>

        {/* Real-time Alerts */}
        {kpiData?.alerts && (
          <div className="space-y-2">
            {kpiData.alerts.map((alert: any, index: number) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  alert.type === 'success' ? 'bg-green-50 border border-green-200' :
                  'bg-blue-50 border border-blue-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className={`h-4 w-4 ${
                    alert.type === 'warning' ? 'text-yellow-600' :
                    alert.type === 'success' ? 'text-green-600' :
                    'text-blue-600'
                  }`} />
                  <span className="text-sm font-medium">{alert.message}</span>
                </div>
                <Button size="sm" variant="ghost" asChild>
                  <Link href={alert.link}>View</Link>
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(kpiData?.current?.totalRevenue || 0)}
              </div>
              {kpiData?.comparison?.revenue && (
                <p className={`text-xs flex items-center mt-1 ${
                  kpiData.comparison.revenue.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpiData.comparison.revenue.change > 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(kpiData.comparison.revenue.change)}% from last period
                </p>
              )}
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
              <div className="text-2xl font-bold">
                {kpiData?.current?.totalOrders?.toLocaleString() || 0}
              </div>
              {kpiData?.comparison?.orders && (
                <p className={`text-xs flex items-center mt-1 ${
                  kpiData.comparison.orders.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpiData.comparison.orders.change > 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(kpiData.comparison.orders.change)}% from last period
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Active Customers</CardTitle>
                <Users className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {kpiData?.current?.totalCustomers || 0}
              </div>
              {kpiData?.comparison?.customers && (
                <p className={`text-xs flex items-center mt-1 ${
                  kpiData.comparison.customers.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {kpiData.comparison.customers.change > 0 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  {Math.abs(kpiData.comparison.customers.change)}% from last period
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">Inventory Value</CardTitle>
                <Package className="h-4 w-4 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(kpiData?.current?.inventoryValue || 0)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Turnover: 4.2x annually
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly revenue performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { month: 'Aug', revenue: 980000, target: 1000000 },
                  { month: 'Sep', revenue: 1050000, target: 1000000 },
                  { month: 'Oct', revenue: 1125000, target: 1100000 },
                  { month: 'Nov', revenue: 1200000, target: 1150000 },
                  { month: 'Dec', revenue: 1350000, target: 1300000 },
                  { month: 'Jan', revenue: 1250000, target: 1200000 }
                ].map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{item.month}</span>
                      <span className="font-medium">{formatCurrency(item.revenue)}</span>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${Math.min(100, (item.revenue / item.target) * 100)}%` }}
                        />
                      </div>
                      <div 
                        className="absolute top-0 h-2 w-0.5 bg-gray-600"
                        style={{ left: '100%' }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Target: {formatCurrency(item.target)}</span>
                      <span className={item.revenue >= item.target ? 'text-green-600' : 'text-red-600'}>
                        {item.revenue >= item.target ? '+' : ''}{((item.revenue / item.target - 1) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
              <CardDescription>Operational performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Fulfillment Rate</span>
                    <span className="text-sm font-medium">
                      {((kpiData?.current?.fulfillmentRate || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(kpiData?.current?.fulfillmentRate || 0) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Customer Satisfaction</span>
                    <span className="text-sm font-medium">
                      {kpiData?.current?.customerSatisfaction || 0}/5.0
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${((kpiData?.current?.customerSatisfaction || 0) / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Gross Margin</span>
                    <span className="text-sm font-medium">
                      {((kpiData?.current?.grossMargin || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(kpiData?.current?.grossMargin || 0) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Cash Flow</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(kpiData?.current?.cashFlow || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {kpiData?.recentOrders?.map((order: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(order.amount)}</p>
                      <Badge variant={
                        order.status === 'shipped' ? 'default' :
                        order.status === 'processing' ? 'secondary' :
                        'outline'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/admin/orders">View All Orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" asChild>
                  <Link href="/admin/users">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/products">
                    <Package className="h-4 w-4 mr-2" />
                    Products
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/catalogs">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Catalogs
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/pricing">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Pricing
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/seasons">
                    <Clock className="h-4 w-4 mr-2" />
                    Seasons
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/forecasting">
                    <Target className="h-4 w-4 mr-2" />
                    Forecasting
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}