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
  ArrowRight 
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