"use client"

import { useEffect, useState } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/features/stat-card"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  DollarSign, 
  FileText, 
  ShoppingCart,
  TrendingUp,
  Calendar,
  ArrowRight,
  Activity,
  Tag,
  Calculator,
  Book,
  BarChart3,
  Target,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react"
import { getCompanies, getOrdersByCompanyId, formatCurrency } from "@/lib/mock-data"
import Link from "next/link"
import { useAuth } from "@/lib/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { formatTierLabel } from "@/lib/pricing-helpers"

interface RepMetrics {
  totalAccounts: number
  mtdSales: number
  activeQuotes: number
  pendingOrders: number
  quotesData?: {
    draft: number
    sent: number
    expiringSoon: number
    totalValue: number
    conversionRate: number
  }
  topAccounts: Array<{
    id: string
    name: string
    ytdPurchases: number
    lastOrderDate: string
  }>
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
    customerId?: string
  }>
  upcomingFollowUps: Array<{
    id: string
    customerName: string
    date: string
    note: string
  }>
}

export function RepDashboardPageContent() {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<RepMetrics | null>(null)
  const [performanceData, setPerformanceData] = useState<{
    salesTrend: Array<{ month: string; amount: number; target: number }>
    conversionRate: number
    pipelineValue: number
    commissionEarned: number
    commissionPending: number
    forecastAccuracy: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const companies = await getCompanies()
        const orders = await getOrdersByCompanyId('*')
        
        const repCompanies = companies.filter((c: any) => c.assignedRepId === 'rep-1')
        const repOrders = orders.filter((o: any) => 
          repCompanies.some((c: any) => c.id === o.companyId)
        )
        
        const currentMonth = new Date().getMonth()
        const mtdOrders = repOrders.filter((o: any) => {
          const orderDate = new Date(o.orderDate)
          return orderDate.getMonth() === currentMonth
        })
        const mtdSales = mtdOrders.reduce((sum: number, o: any) => sum + o.total, 0)
        
        // Fetch quotes data
        let quotesData = {
          draft: 0,
          sent: 0,
          expiringSoon: 0,
          totalValue: 0,
          conversionRate: 0
        }
        
        try {
          const quotesResponse = await fetch('/api/quotes')
          if (quotesResponse.ok) {
            const { quotes, summary } = await quotesResponse.json()
            quotesData = {
              draft: summary.draftQuotes || 0,
              sent: summary.sentQuotes || 0,
              expiringSoon: quotes.filter((q: any) => {
                const validUntil = new Date(q.terms.validUntil)
                const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
                return q.status === 'sent' && validUntil <= threeDaysFromNow && validUntil > new Date()
              }).length,
              totalValue: summary.totalValue || 0,
              conversionRate: summary.conversionRate || 0
            }
          }
        } catch (error) {
          console.error('Failed to fetch quotes data:', error)
        }
        
        const mockMetrics: RepMetrics = {
          totalAccounts: repCompanies.length,
          mtdSales: mtdSales || 125840,
          activeQuotes: quotesData.draft + quotesData.sent,
          pendingOrders: repOrders.filter((o: any) => o.status === 'pending').length,
          quotesData,
          topAccounts: repCompanies.slice(0, 5).map((company: any) => ({
            id: company.id,
            name: company.name,
            ytdPurchases: company.yearToDatePurchases || 0,
            lastOrderDate: company.lastOrderDate || "2024-01-28"
          })),
          recentActivity: [
            {
              id: "activity-1",
              type: "order",
              description: `New order placed by ${repCompanies[0]?.name || "Outdoor Retailers Co."}`,
              timestamp: "2 hours ago",
              customerId: repCompanies[0]?.id || "company-1"
            }
          ],
          upcomingFollowUps: [
            {
              id: "followup-1",
              customerName: repCompanies[0]?.name || "Outdoor Retailers Co.",
              date: "Tomorrow",
              note: "Discuss spring catalog and pre-season orders"
            }
          ]
        }
        
        // Fetch performance analytics
        try {
          const analyticsResponse = await fetch('/api/analytics/sales?' + new URLSearchParams({
            salesRepId: user?.id || 'user-4',
            startDate: new Date(Date.now() - 180 * 86400000).toISOString(),
            endDate: new Date().toISOString(),
            groupBy: 'month'
          }))
          
          if (analyticsResponse.ok) {
            const analyticsData = await analyticsResponse.json()
            setPerformanceData({
              salesTrend: [
                { month: 'Aug', amount: 95000, target: 100000 },
                { month: 'Sep', amount: 110000, target: 100000 },
                { month: 'Oct', amount: 125000, target: 120000 },
                { month: 'Nov', amount: 140000, target: 130000 },
                { month: 'Dec', amount: 155000, target: 150000 },
                { month: 'Jan', amount: 125840, target: 140000 }
              ],
              conversionRate: 0.23,
              pipelineValue: 450000,
              commissionEarned: 12500,
              commissionPending: 6250,
              forecastAccuracy: 0.87
            })
          }
        } catch (error) {
          console.error('Failed to fetch performance data:', error)
        }
        
        setMetrics(mockMetrics)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading metrics:", error)
        setIsLoading(false)
      }
    }

    loadMetrics()
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

  if (!metrics) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Unable to load dashboard data</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Accounts"
            value={metrics.totalAccounts.toString()}
            icon={Users}
            description="Active customers"
          />
          <StatCard
            title="MTD Sales"
            value={formatCurrency(metrics.mtdSales)}
            icon={DollarSign}
            description="Month to date"
          />
          <StatCard
            title="Active Quotes"
            value={metrics.activeQuotes.toString()}
            icon={FileText}
            description="Awaiting response"
          />
          <StatCard
            title="Pending Orders"
            value={metrics.pendingOrders.toString()}
            icon={ShoppingCart}
            description="Ready to process"
          />
        </div>
        
        {/* Quotes Summary */}
        {metrics.quotesData && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Quote Pipeline</CardTitle>
                <Link href="/rep/quotes">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{metrics.quotesData.draft}</p>
                  <p className="text-sm text-gray-500">Draft</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{metrics.quotesData.sent}</p>
                  <p className="text-sm text-gray-500">Sent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">
                    {metrics.quotesData.expiringSoon}
                  </p>
                  <p className="text-sm text-gray-500">Expiring Soon</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    ${(metrics.quotesData.totalValue / 1000).toFixed(0)}k
                  </p>
                  <p className="text-sm text-gray-500">Total Value</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {metrics.quotesData.conversionRate.toFixed(0)}%
                  </p>
                  <p className="text-sm text-gray-500">Conversion</p>
                </div>
              </div>
              {metrics.quotesData.expiringSoon > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      You have {metrics.quotesData.expiringSoon} quote{metrics.quotesData.expiringSoon !== 1 ? 's' : ''} expiring soon.
                      <Link href="/rep/quotes?tab=expiring" className="ml-1 font-medium underline">
                        Take action
                      </Link>
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Performance Dashboard */}
        {performanceData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Performance Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sales Performance</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {performanceData.forecastAccuracy * 100}% accuracy
                  </Badge>
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceData.salesTrend.map((month, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{month.month}</span>
                        <div className="flex items-center gap-2">
                          {month.amount >= month.target ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                          <span className="font-medium">
                            {formatCurrency(month.amount)}
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${Math.min(100, (month.amount / month.target) * 100)}%` }}
                          />
                        </div>
                        <div 
                          className="absolute top-0 h-2 w-0.5 bg-gray-600"
                          style={{ left: '100%' }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Target: {formatCurrency(month.target)}</span>
                        <span className={month.amount >= month.target ? 'text-green-600' : 'text-red-600'}>
                          {month.amount >= month.target ? '+' : ''}{((month.amount / month.target - 1) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Commission & Pipeline */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Commission Tracking</CardTitle>
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Earned</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(performanceData.commissionEarned)}
                        </span>
                      </div>
                      <div className="w-full bg-green-100 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Pending</span>
                        <span className="font-semibold text-yellow-600">
                          {formatCurrency(performanceData.commissionPending)}
                        </span>
                      </div>
                      <div className="w-full bg-yellow-100 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Total Expected</span>
                        <span className="font-bold">
                          {formatCurrency(performanceData.commissionEarned + performanceData.commissionPending)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Pipeline & Conversion</CardTitle>
                  <Target className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pipeline Value</p>
                      <p className="text-2xl font-bold">{formatCurrency(performanceData.pipelineValue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-blue-600 h-3 rounded-full"
                            style={{ width: `${performanceData.conversionRate * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{(performanceData.conversionRate * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href="/rep/analytics">
                        View Detailed Analytics
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Top Accounts by Revenue
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/rep/customers">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.topAccounts.map((account, index) => (
                  <div
                    key={account.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-sm font-medium text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <Link 
                          href={`/rep/customers/${account.id}`}
                          className="font-medium text-gray-900 hover:text-primary"
                        >
                          {account.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-gray-500">
                            Last order: {new Date(account.lastOrderDate).toLocaleDateString()}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {account.id.includes('1') ? 'Gold' : account.id.includes('2') ? 'Silver' : 'Bronze'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(account.ytdPurchases)}</p>
                      <p className="text-sm text-gray-500">YTD</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Follow-ups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.upcomingFollowUps.map((followUp) => (
                  <div
                    key={followUp.id}
                    className="p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-medium text-sm">{followUp.customerName}</p>
                      <span className="text-xs text-primary font-medium">
                        {followUp.date}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{followUp.note}</p>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  View Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Customer Pricing Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Customer Pricing & Catalogs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Quick Price Check */}
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <Badge variant="outline" className="text-xs">Quick Tool</Badge>
                </div>
                <h4 className="font-medium mb-1">Price Calculator</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Check customer-specific pricing instantly
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link href="/rep/pricing-calculator">
                    Open Calculator
                  </Link>
                </Button>
              </div>
              
              {/* Catalog Summary */}
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <Book className="h-5 w-5 text-green-600" />
                  <Badge variant="outline" className="text-xs">3 Active</Badge>
                </div>
                <h4 className="font-medium mb-1">Customer Catalogs</h4>
                <p className="text-sm text-gray-600 mb-3">
                  View assigned product catalogs
                </p>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link href="/rep/catalogs">
                    View Catalogs
                  </Link>
                </Button>
              </div>
              
              {/* Pricing Tiers */}
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Customer Tiers</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      {formatTierLabel('tier-3')}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {metrics.topAccounts.filter((a: any) => a.id.includes('1')).length} customers
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                      {formatTierLabel('tier-2')}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {metrics.topAccounts.filter((a: any) => a.id.includes('2')).length || 2} customers
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                      {formatTierLabel('tier-1')}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {metrics.topAccounts.filter((a: any) => a.id.includes('3')).length || 1} customers
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pricing Exception Alerts */}
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Activity className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">
                    Pricing Update Alert
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    2 customers have pending volume pricing adjustments. Review and apply changes.
                  </p>
                </div>
                <Button size="sm" variant="outline" className="text-xs" asChild>
                  <Link href="/rep/pricing-exceptions">
                    Review
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metrics.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                >
                  <div className={`p-2 rounded-full ${
                    activity.type === 'order' ? 'bg-green-100' :
                    activity.type === 'quote' ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    {activity.type === 'order' && <ShoppingCart className="h-4 w-4 text-green-600" />}
                    {activity.type === 'quote' && <FileText className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'message' && <Activity className="h-4 w-4 text-gray-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                  {activity.customerId && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/rep/customers/${activity.customerId}`}>
                        View
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button size="lg" className="h-auto py-4" asChild>
            <Link href="/rep/customers">
              <Users className="mr-2 h-5 w-5" />
              Manage Customers
            </Link>
          </Button>
          <Button size="lg" variant="secondary" className="h-auto py-4" asChild>
            <Link href="/rep/orders">
              <ShoppingCart className="mr-2 h-5 w-5" />
              View All Orders
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-auto py-4" asChild>
            <Link href="/rep/closeouts/manage">
              <FileText className="mr-2 h-5 w-5" />
              Manage Closeouts
            </Link>
          </Button>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

