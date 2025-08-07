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
  Activity
} from "lucide-react"
import { getCompanies, getOrdersByCompanyId, formatCurrency } from "@/lib/mock-data"
import Link from "next/link"
import { useAuth } from "@/lib/contexts/auth-context"

interface RepMetrics {
  totalAccounts: number
  mtdSales: number
  activeQuotes: number
  pendingOrders: number
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
        
        const mockMetrics: RepMetrics = {
          totalAccounts: repCompanies.length,
          mtdSales: mtdSales || 125840,
          activeQuotes: 8,
          pendingOrders: repOrders.filter((o: any) => o.status === 'pending').length,
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
                        <p className="text-sm text-gray-500">
                          Last order: {new Date(account.lastOrderDate).toLocaleDateString()}
                        </p>
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
            <Link href="/rep/resources">
              <FileText className="mr-2 h-5 w-5" />
              Sales Resources
            </Link>
          </Button>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

