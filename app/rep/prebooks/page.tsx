"use client"

import { useState, useEffect } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Calendar,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle,
  Package,
  ChevronRight,
  Download,
  Filter
} from "lucide-react"
import { formatCurrency } from "@/lib/mock-data"
import Link from "next/link"

interface SeasonSummary {
  id: string
  name: string
  status: 'open' | 'closing-soon' | 'closed'
  orderWindow: {
    start: Date
    end: Date
  }
  deliveryWindow: {
    start: Date
    end: Date
  }
  cancellationDeadline: Date
  depositPercent: number
  stats: {
    totalCustomers: number
    participatingCustomers: number
    totalOrders: number
    totalValue: number
    depositsCollected: number
    avgOrderValue: number
    topProducts: string[]
  }
}

interface CustomerPrebookSummary {
  customerId: string
  companyName: string
  seasons: {
    [seasonId: string]: {
      ordered: boolean
      orderValue: number
      depositPaid: number
      items: number
      status: 'pending' | 'confirmed' | 'cancelled'
    }
  }
  totalValue: number
  trend: 'up' | 'down' | 'stable'
}

/**
 * @description Sales Rep Prebook Management Dashboard
 * @fileoverview Manage all customer prebook orders across seasons
 */
export default function RepPrebooksPage() {
  const [seasons, setSeasons] = useState<SeasonSummary[]>([])
  const [customers, setCustomers] = useState<CustomerPrebookSummary[]>([])
  const [selectedSeason, setSelectedSeason] = useState<string>("sp25")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPrebookData()
  }, [])

  const loadPrebookData = async () => {
    setLoading(true)
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock season data
    setSeasons([
      {
        id: "sp25",
        name: "Spring 2025",
        status: 'open',
        orderWindow: {
          start: new Date("2024-12-01"),
          end: new Date("2025-02-28")
        },
        deliveryWindow: {
          start: new Date("2025-03-15"),
          end: new Date("2025-04-15")
        },
        cancellationDeadline: new Date("2025-02-01"),
        depositPercent: 30,
        stats: {
          totalCustomers: 25,
          participatingCustomers: 18,
          totalOrders: 18,
          totalValue: 285000,
          depositsCollected: 85500,
          avgOrderValue: 15833,
          topProducts: ["Spring Floral Midi Dress", "Lightweight Linen Shorts", "Cotton Blend Tee"]
        }
      },
      {
        id: "fa25",
        name: "Fall 2025",
        status: 'open',
        orderWindow: {
          start: new Date("2025-05-01"),
          end: new Date("2025-07-31")
        },
        deliveryWindow: {
          start: new Date("2025-08-15"),
          end: new Date("2025-09-15")
        },
        cancellationDeadline: new Date("2025-07-01"),
        depositPercent: 40,
        stats: {
          totalCustomers: 25,
          participatingCustomers: 8,
          totalOrders: 8,
          totalValue: 125000,
          depositsCollected: 50000,
          avgOrderValue: 15625,
          topProducts: ["Quilted Fall Jacket", "Cable Knit Sweater"]
        }
      }
    ])

    // Mock customer data
    setCustomers([
      {
        customerId: "1",
        companyName: "Mountain Gear Outfitters",
        seasons: {
          sp25: { ordered: true, orderValue: 25000, depositPaid: 7500, items: 145, status: 'confirmed' },
          fa25: { ordered: true, orderValue: 18000, depositPaid: 7200, items: 98, status: 'confirmed' }
        },
        totalValue: 43000,
        trend: 'up'
      },
      {
        customerId: "2",
        companyName: "Urban Style Boutique",
        seasons: {
          sp25: { ordered: true, orderValue: 15000, depositPaid: 4500, items: 87, status: 'confirmed' },
          fa25: { ordered: false, orderValue: 0, depositPaid: 0, items: 0, status: 'pending' }
        },
        totalValue: 15000,
        trend: 'down'
      },
      {
        customerId: "3",
        companyName: "Coastal Trading Co",
        seasons: {
          sp25: { ordered: true, orderValue: 32000, depositPaid: 9600, items: 186, status: 'confirmed' },
          fa25: { ordered: true, orderValue: 28000, depositPaid: 11200, items: 162, status: 'confirmed' }
        },
        totalValue: 60000,
        trend: 'stable'
      }
    ])

    setLoading(false)
  }

  const currentSeason = seasons.find(s => s.id === selectedSeason)
  const getDaysUntilDeadline = (deadline: Date) => {
    const now = new Date()
    const days = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  const getParticipationRate = (season: SeasonSummary) => {
    return Math.round((season.stats.participatingCustomers / season.stats.totalCustomers) * 100)
  }

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Prebook Management</h1>
            <p className="text-muted-foreground">
              Manage seasonal orders and track customer participation
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointments
            </Button>
          </div>
        </div>

        {/* Season Tabs */}
        <Tabs value={selectedSeason} onValueChange={setSelectedSeason}>
          <TabsList>
            {seasons.map(season => (
              <TabsTrigger key={season.id} value={season.id}>
                <div className="flex items-center gap-2">
                  {season.name}
                  {season.status === 'open' && (
                    <Badge className="bg-green-500 text-white text-xs">Open</Badge>
                  )}
                  {season.status === 'closing-soon' && (
                    <Badge className="bg-orange-500 text-white text-xs">Closing</Badge>
                  )}
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {seasons.map(season => (
            <TabsContent key={season.id} value={season.id} className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(season.stats.totalValue)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {season.stats.totalOrders} orders
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Deposits Collected</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(season.stats.depositsCollected)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {season.depositPercent}% of order value
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Participation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {getParticipationRate(season)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {season.stats.participatingCustomers}/{season.stats.totalCustomers} customers
                    </p>
                    <Progress value={getParticipationRate(season)} className="h-2 mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Days Until Cancel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {getDaysUntilDeadline(season.cancellationDeadline)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Deadline: {season.cancellationDeadline.toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Deadline Alert */}
              {getDaysUntilDeadline(season.cancellationDeadline) < 30 && getDaysUntilDeadline(season.cancellationDeadline) > 0 && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription>
                    <strong>Cancellation deadline approaching!</strong> Only {getDaysUntilDeadline(season.cancellationDeadline)} days 
                    remaining for customers to modify or cancel {season.name} orders.
                  </AlertDescription>
                </Alert>
              )}

              {/* Customer Participation Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Participation</CardTitle>
                  <CardDescription>
                    Track which customers have placed orders for {season.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {customers.map(customer => {
                      const seasonOrder = customer.seasons[season.id]
                      return (
                        <div 
                          key={customer.customerId}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="font-medium">{customer.companyName}</p>
                              <div className="flex gap-2 mt-1">
                                {seasonOrder?.ordered ? (
                                  <>
                                    <Badge variant="outline" className="text-xs">
                                      {seasonOrder.items} items
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {formatCurrency(seasonOrder.orderValue)}
                                    </Badge>
                                    {seasonOrder.status === 'confirmed' && (
                                      <Badge className="bg-green-500 text-white text-xs">
                                        Confirmed
                                      </Badge>
                                    )}
                                  </>
                                ) : (
                                  <Badge variant="secondary" className="text-xs">
                                    Not Ordered
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {customer.trend === 'up' && (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            )}
                            {!seasonOrder?.ordered && (
                              <Link href={`/rep/order-for/${customer.customerId}?type=prebook&season=${season.id}`}>
                                <Button size="sm">
                                  Create Order
                                </Button>
                              </Link>
                            )}
                            {seasonOrder?.ordered && (
                              <Button size="sm" variant="outline">
                                View Order
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>
                    Best-selling items for {season.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {season.stats.topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{product}</span>
                        </div>
                        <Badge variant="outline">#{index + 1}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start">
                <Users className="h-4 w-4 mr-2" />
                Send Season Reminders
              </Button>
              <Button variant="outline" className="justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Check Cancellation Status
              </Button>
              <Button variant="outline" className="justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Calculate Commissions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}