"use client"

import { useEffect, useState } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { StatCard } from "@/components/features/stat-card"
import { RecentOrdersTable } from "@/components/features/recent-orders-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ShoppingBag, 
  DollarSign, 
  CreditCard, 
  Package, 
  AlertCircle,
  TrendingUp,
  ArrowRight,
  BarChart3,
  PieChart,
  TrendingDown
} from "lucide-react"
import Link from "next/link"
import { 
  getCompanyById, 
  getOrdersByCompanyId, 
  getRetailerMetrics,
  formatCurrency,
  formatDate,
  type Company,
  type Order
} from "@/lib/mock-data"
import { useAuth } from "@/lib/contexts/auth-context"

/**
 * @description Retailer dashboard with metrics and quick actions
 * @fileoverview Main dashboard page showing company stats and recent activity
 */
export default function RetailerDashboardPage() {
  const { user } = useAuth()
  const [company, setCompany] = useState<Company | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [metrics, setMetrics] = useState<{
    recentActivity: Array<{
      date: string
      type: string
      description: string
      trackingNumber?: string
      amount?: number
    }>
    recommendations: string[]
  } | null>(null)
  const [analytics, setAnalytics] = useState<{
    spendingTrend: Array<{ month: string; amount: number }>
    categoryBreakdown: Array<{ category: string; value: number; percentage: number }>
    savings: { total: number; percentage: number }
    seasonalPattern: { peak: string; low: string }
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      // Use company ID from authenticated user context
      if (!user?.companyId) {
        setIsLoading(false)
        return
      }
      
      const companyId = user.companyId
      
      const [companyData, ordersData, metricsData] = await Promise.all([
        getCompanyById(companyId),
        getOrdersByCompanyId(companyId),
        getRetailerMetrics(companyId)
      ])

      // Fetch analytics data
      try {
        const response = await fetch('/api/analytics/sales?' + new URLSearchParams({
          companyId,
          startDate: new Date(Date.now() - 180 * 86400000).toISOString(),
          endDate: new Date().toISOString(),
          groupBy: 'month'
        }))
        
        if (response.ok) {
          const analyticsData = await response.json()
          const spendingTrend = analyticsData.data.revenueByPeriod.map((item: any) => ({
            month: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
            amount: item.revenue
          }))
          
          setAnalytics({
            spendingTrend: spendingTrend.slice(-6), // Last 6 months
            categoryBreakdown: [
              { category: 'Apparel', value: 45000, percentage: 45 },
              { category: 'Footwear', value: 35000, percentage: 35 },
              { category: 'Accessories', value: 20000, percentage: 20 }
            ],
            savings: { total: 12500, percentage: 12.5 },
            seasonalPattern: { peak: 'Q4', low: 'Q1' }
          })
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      }

      setCompany(companyData)
      setOrders(ordersData)
      setMetrics(metricsData)
      setIsLoading(false)
    }

    loadDashboardData()
  }, [user])

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!company) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-red-600">Error loading company data</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  const availableCredit = company.creditLimit - company.creditUsed
  const creditUsagePercent = (company.creditUsed / company.creditLimit) * 100
  const pendingShipments = orders.filter(o => o.status === "pending").length

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {company.primaryContact?.name || 'Valued Customer'}
          </h1>
          <p className="text-gray-600 mt-2">
            {company.name} • Account #{company.accountNumber}
          </p>
        </div>

        {/* Promotional Banner */}
        <Card className="bg-gradient-to-r from-primary to-primary-hover text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">
                  New Spring Collection Now Available!
                </h2>
                <p className="opacity-90 mb-4">
                  Get 10% extra off on all Spring 2025 items when you order before January 31st
                </p>
                <Button variant="secondary" asChild>
                  <Link href="/retailer/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <TrendingUp className="h-16 w-16 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Last Order Date"
            value={formatDate(company.lastOrderDate)}
            description="Track #1234567890"
            icon={ShoppingBag}
          />
          <StatCard
            title="YTD Purchases"
            value={formatCurrency(company.yearToDatePurchases)}
            description="Tier 2 Pricing"
            icon={DollarSign}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            title="Available Credit"
            value={formatCurrency(availableCredit)}
            description={`${creditUsagePercent.toFixed(0)}% of limit used`}
            icon={CreditCard}
          />
          <StatCard
            title="Pending Shipments"
            value={pendingShipments.toString()}
            description="View all orders"
            icon={Package}
          />
        </div>

        {/* Analytics Section */}
        {analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spending Trends Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Spending Trends</CardTitle>
                <BarChart3 className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.spendingTrend.map((month, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{month.month}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${(month.amount / Math.max(...analytics.spendingTrend.map(m => m.amount))) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium min-w-[80px] text-right">
                          {formatCurrency(month.amount)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Total Savings</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(analytics.savings.total)} ({analytics.savings.percentage}%)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Category Spending</CardTitle>
                <PieChart className="h-5 w-5 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.categoryBreakdown.map((category, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{category.category}</span>
                        <span className="text-sm text-gray-600">{category.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatCurrency(category.value)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Peak Season</span>
                    <span className="font-medium">{analytics.seasonalPattern.peak}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Low Season</span>
                    <span className="font-medium">{analytics.seasonalPattern.low}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentOrdersTable orders={orders} />
          </div>

          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/retailer/orders">
                    <Package className="mr-2 h-4 w-4" />
                    Track Shipments
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/retailer/products">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Place New Order
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/retailer/resources">
                    <AlertCircle className="mr-2 h-4 w-4" />
                    Download Catalogs
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/retailer/analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Activity Feed */}
            {metrics?.recentActivity && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {metrics.recentActivity.map((activity, index) => (
                      <div key={index} className="text-sm border-l-2 border-gray-200 pl-3">
                        <p className="font-medium text-gray-900">{activity.description}</p>
                        <p className="text-gray-500">{formatDate(activity.date)}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {metrics?.recommendations && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {metrics.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}