"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Package, 
  Clock, 
  Tag, 
  TrendingUp, 
  Calendar,
  DollarSign,
  AlertCircle,
  ChevronRight,
  ShoppingCart
} from "lucide-react"
import { ORDER_TYPE_COLORS } from "@/types/order-types"
import { formatCurrency } from "@/lib/mock-data"
import Link from "next/link"

interface OrderTypeMetrics {
  atOnce: {
    totalOrders: number
    totalValue: number
    avgOrderValue: number
    lastOrderDate: string
    frequentItems: string[]
    reorderRate: number
  }
  prebook: {
    totalOrders: number
    totalValue: number
    depositsCollected: number
    activeSeasons: string[]
    participation: string[]
    cancellationRate: number
  }
  closeout: {
    totalOrders: number
    totalValue: number
    savingsGenerated: number
    participationCount: number
    avgDiscount: number
    tierAccess: string
  }
}

/**
 * @description Order Types tab component for customer detail page
 * @fileoverview Shows customer's participation across all three order types
 */
export function CustomerOrderTypes({ customerId }: { customerId: string }) {
  const [metrics, setMetrics] = useState<OrderTypeMetrics | null>(null)
  const [activeType, setActiveType] = useState<'at-once' | 'prebook' | 'closeout'>('at-once')

  useEffect(() => {
    // Mock data for order type metrics
    setMetrics({
      atOnce: {
        totalOrders: 47,
        totalValue: 125340,
        avgOrderValue: 2667,
        lastOrderDate: "2025-01-05",
        frequentItems: ["Essential Cotton T-Shirt", "Premium Fleece Hoodie", "Canvas Tote Bag"],
        reorderRate: 78
      },
      prebook: {
        totalOrders: 12,
        totalValue: 89500,
        depositsCollected: 26850,
        activeSeasons: ["Spring 2025", "Fall 2025"],
        participation: ["SP24", "FA24", "SP25"],
        cancellationRate: 5
      },
      closeout: {
        totalOrders: 8,
        totalValue: 12450,
        savingsGenerated: 18200,
        participationCount: 6,
        avgDiscount: 52,
        tierAccess: "Gold"
      }
    })
  }, [customerId])

  if (!metrics) return null

  const getTotalOrderTypeValue = () => {
    return metrics.atOnce.totalValue + metrics.prebook.totalValue + metrics.closeout.totalValue
  }

  const getOrderTypeDistribution = () => {
    const total = getTotalOrderTypeValue()
    return {
      atOnce: (metrics.atOnce.totalValue / total * 100).toFixed(1),
      prebook: (metrics.prebook.totalValue / total * 100).toFixed(1),
      closeout: (metrics.closeout.totalValue / total * 100).toFixed(1)
    }
  }

  const distribution = getOrderTypeDistribution()

  return (
    <div className="space-y-6">
      {/* Order Type Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            activeType === 'at-once' ? 'ring-2 ring-green-500' : ''
          }`}
          onClick={() => setActiveType('at-once')}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" />
                <CardTitle className="text-base">At-Once Orders</CardTitle>
              </div>
              <Badge className="bg-green-500 text-white">{distribution.atOnce}%</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{formatCurrency(metrics.atOnce.totalValue)}</div>
              <div className="text-sm text-muted-foreground">
                {metrics.atOnce.totalOrders} orders • {metrics.atOnce.reorderRate}% reorder rate
              </div>
              <Progress value={Number(distribution.atOnce)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            activeType === 'prebook' ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => setActiveType('prebook')}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-base">Prebook Orders</CardTitle>
              </div>
              <Badge className="bg-blue-500 text-white">{distribution.prebook}%</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{formatCurrency(metrics.prebook.totalValue)}</div>
              <div className="text-sm text-muted-foreground">
                {metrics.prebook.totalOrders} orders • {metrics.prebook.activeSeasons.length} seasons
              </div>
              <Progress value={Number(distribution.prebook)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-lg ${
            activeType === 'closeout' ? 'ring-2 ring-red-500' : ''
          }`}
          onClick={() => setActiveType('closeout')}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-red-600" />
                <CardTitle className="text-base">Closeout Orders</CardTitle>
              </div>
              <Badge className="bg-red-500 text-white">{distribution.closeout}%</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{formatCurrency(metrics.closeout.totalValue)}</div>
              <div className="text-sm text-muted-foreground">
                {metrics.closeout.totalOrders} orders • Saved {formatCurrency(metrics.closeout.savingsGenerated)}
              </div>
              <Progress value={Number(distribution.closeout)} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed View for Selected Type */}
      {activeType === 'at-once' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              At-Once Order Details
            </CardTitle>
            <CardDescription>
              Immediate fulfillment orders from available stock
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-xl font-bold">{formatCurrency(metrics.atOnce.avgOrderValue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Order</p>
                <p className="text-xl font-bold">{metrics.atOnce.lastOrderDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reorder Rate</p>
                <p className="text-xl font-bold">{metrics.atOnce.reorderRate}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-xl font-bold">{metrics.atOnce.totalOrders}</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Frequently Ordered Items</h4>
              <div className="space-y-2">
                {metrics.atOnce.frequentItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{item}</span>
                    <Button size="sm" variant="outline">
                      Quick Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={`/rep/order-for/${customerId}?type=at-once`} className="flex-1">
                <Button className="w-full" variant="default">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Create At-Once Order
                </Button>
              </Link>
              <Button variant="outline" className="flex-1">
                View Order History
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeType === 'prebook' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Prebook Order Details
            </CardTitle>
            <CardDescription>
              Seasonal advance orders with deposits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-xl font-bold">{formatCurrency(metrics.prebook.totalValue)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Deposits Paid</p>
                <p className="text-xl font-bold">{formatCurrency(metrics.prebook.depositsCollected)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Seasons</p>
                <p className="text-xl font-bold">{metrics.prebook.activeSeasons.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cancel Rate</p>
                <p className="text-xl font-bold">{metrics.prebook.cancellationRate}%</p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Season Participation</h4>
              <div className="flex gap-2 flex-wrap">
                {metrics.prebook.activeSeasons.map(season => (
                  <Badge key={season} variant="outline" className="text-blue-600">
                    {season}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Historical Participation</h4>
              <div className="flex gap-2">
                {metrics.prebook.participation.map(season => (
                  <Badge key={season} variant="secondary">
                    {season}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={`/rep/order-for/${customerId}?type=prebook`} className="flex-1">
                <Button className="w-full" variant="default">
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Prebook Order
                </Button>
              </Link>
              <Button variant="outline" className="flex-1">
                View Season Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeType === 'closeout' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="h-5 w-5 text-red-600" />
              Closeout Order Details
            </CardTitle>
            <CardDescription>
              Time-limited clearance deals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Savings</p>
                <p className="text-xl font-bold text-green-600">
                  {formatCurrency(metrics.closeout.savingsGenerated)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Discount</p>
                <p className="text-xl font-bold">{metrics.closeout.avgDiscount}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tier Access</p>
                <p className="text-xl font-bold">{metrics.closeout.tierAccess}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Participation</p>
                <p className="text-xl font-bold">{metrics.closeout.participationCount}</p>
              </div>
            </div>
            
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div className="ml-2">
                <p className="text-sm font-medium">Active Closeout Available!</p>
                <p className="text-xs text-muted-foreground">
                  Winter clearance expires in 24 hours - Deep discounts available
                </p>
              </div>
            </Alert>

            <div className="flex gap-2">
              <Link href="/retailer/closeouts" className="flex-1">
                <Button className="w-full" variant="destructive">
                  <Tag className="h-4 w-4 mr-2" />
                  View Active Closeouts
                </Button>
              </Link>
              <Button variant="outline" className="flex-1">
                Invite to Closeout
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Order Type Recommendations</CardTitle>
          <CardDescription>
            Opportunities to optimize customer's ordering patterns
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {metrics.prebook.participation.length < 3 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-sm">Increase Prebook Participation</p>
                  <p className="text-xs text-muted-foreground">
                    Customer has low prebook participation. Encourage Fall 2025 ordering.
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          
          {metrics.atOnce.reorderRate > 70 && (
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-sm">Set Up Auto-Reorder</p>
                  <p className="text-xs text-muted-foreground">
                    High reorder rate detected. Consider setting up automatic reordering.
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
          
          {metrics.closeout.tierAccess !== "Platinum" && (
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Tag className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-sm">Upgrade for Better Closeout Access</p>
                  <p className="text-xs text-muted-foreground">
                    Customer could access exclusive closeouts with Platinum tier.
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}