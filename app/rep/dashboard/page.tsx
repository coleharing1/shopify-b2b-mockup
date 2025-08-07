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
import { formatCurrency } from "@/lib/mock-data"
import Link from "next/link"

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

/**
 * @description Sales Rep Dashboard with performance metrics
 * @fileoverview Main dashboard for sales representatives
 */
export default function RepDashboardPage() {
  const [metrics, setMetrics] = useState<RepMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        // Simulate loading rep metrics
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const mockMetrics: RepMetrics = {
          totalAccounts: 47,
          mtdSales: 125840,
          activeQuotes: 8,
          pendingOrders: 12,
          topAccounts: [
            {
              id: "company-1",
              name: "Mountain Gear Outfitters",
              ytdPurchases: 285420,
              lastOrderDate: "2024-01-28"
            },
            {
              id: "company-2",
              name: "Summit Sports Retail",
              ytdPurchases: 198760,
              lastOrderDate: "2024-01-25"
            },
            {
              id: "company-3",
              name: "Alpine Adventure Co",
              ytdPurchases: 176230,
              lastOrderDate: "2024-01-30"
            },
            {
              id: "company-4",
              name: "Peak Performance Shop",
              ytdPurchases: 152890,
              lastOrderDate: "2024-01-22"
            },
            {
              id: "company-5",
              name: "Trail Blazers Outdoor",
              ytdPurchases: 134560,
              lastOrderDate: "2024-01-29"
            }
          ],
          recentActivity: [
            {
              id: "activity-1",
              type: "order",
              description: "New order placed by Mountain Gear Outfitters",
              timestamp: "2 hours ago",
              customerId: "company-1"
            },
            {
              id: "activity-2",
              type: "quote",
              description: "Quote approved by Summit Sports Retail",
              timestamp: "4 hours ago",
              customerId: "company-2"
            },
            {
              id: "activity-3",
              type: "message",
              description: "Message from Alpine Adventure Co about bulk pricing",
              timestamp: "Yesterday",
              customerId: "company-3"
            },
            {
              id: "activity-4",
              type: "order",
              description: "Order shipped to Peak Performance Shop",
              timestamp: "Yesterday",
              customerId: "company-4"
            }
          ],
          upcomingFollowUps: [
            {
              id: "followup-1",
              customerName: "Trail Blazers Outdoor",
              date: "Tomorrow",
              note: "Discuss spring catalog and pre-season orders"
            },
            {
              id: "followup-2",
              customerName: "Mountain Gear Outfitters",
              date: "Feb 3",
              note: "Review Q1 performance and promotional opportunities"
            },
            {
              id: "followup-3",
              customerName: "Summit Sports Retail",
              date: "Feb 5",
              note: "Present new product line and exclusive deals"
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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, John Smith</p>
        </div>

        {/* Metrics Grid */}
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Accounts */}
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

          {/* Upcoming Follow-ups */}
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

        {/* Recent Activity */}
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

        {/* Quick Actions */}
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