"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Package, 
  Clock, 
  Tag, 
  TrendingUp,
  Calendar,
  ShoppingCart,
  AlertCircle,
  ChevronRight,
  Truck,
  Timer,
  DollarSign
} from "lucide-react"
import { ORDER_TYPE_COLORS } from "@/types/order-types"
import { formatCurrency } from "@/lib/mock-data"
import Link from "next/link"
import { useAtOnceCart } from "@/lib/contexts/at-once-cart-context"
import { usePrebookCart } from "@/lib/contexts/prebook-cart-context"
import { useCloseoutCart } from "@/lib/contexts/closeout-cart-context"

interface OrderTypeStats {
  atOnce: {
    cartItems: number
    cartValue: number
    recentOrders: number
    quickReorderAvailable: boolean
  }
  prebook: {
    cartItems: number
    cartValue: number
    depositRequired: number
    activeSeasons: string[]
    nextDeadline?: Date
  }
  closeout: {
    cartItems: number
    cartValue: number
    savings: number
    activeDeals: number
    urgentDeals: number
  }
}

/**
 * @description Order Type Dashboard Widget
 * @fileoverview Shows order type activity and quick actions on main dashboard
 */
export function OrderTypeDashboard() {
  const atOnceCart = useAtOnceCart()
  const prebookCart = usePrebookCart()
  const closeoutCart = useCloseoutCart()
  
  const [stats, setStats] = useState<OrderTypeStats>({
    atOnce: {
      cartItems: 0,
      cartValue: 0,
      recentOrders: 12,
      quickReorderAvailable: true
    },
    prebook: {
      cartItems: 0,
      cartValue: 0,
      depositRequired: 0,
      activeSeasons: ["Spring 2025", "Fall 2025"],
      nextDeadline: new Date("2025-02-01")
    },
    closeout: {
      cartItems: 0,
      cartValue: 0,
      savings: 0,
      activeDeals: 3,
      urgentDeals: 1
    }
  })

  useEffect(() => {
    // Update stats from cart contexts
    setStats(prev => ({
      ...prev,
      atOnce: {
        ...prev.atOnce,
        cartItems: atOnceCart.getItemCount(),
        cartValue: atOnceCart.getCartTotal()
      },
      prebook: {
        ...prev.prebook,
        cartItems: prebookCart.getItemCount(),
        cartValue: prebookCart.getCartTotal(),
        depositRequired: prebookCart.getDepositAmount()
      },
      closeout: {
        ...prev.closeout,
        cartItems: closeoutCart.getItemCount(),
        cartValue: closeoutCart.getCartTotal(),
        savings: closeoutCart.getSavingsTotal()
      }
    }))
  }, [atOnceCart, prebookCart, closeoutCart])

  const getTotalCartValue = () => {
    return stats.atOnce.cartValue + stats.prebook.cartValue + stats.closeout.cartValue
  }

  const getTotalCartItems = () => {
    return stats.atOnce.cartItems + stats.prebook.cartItems + stats.closeout.cartItems
  }

  const getDaysUntilDeadline = (deadline?: Date) => {
    if (!deadline) return null
    const now = new Date()
    const days = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  return (
    <div className="space-y-6">
      {/* Order Type Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            Quick access to all order types and current cart status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* At-Once Card */}
            <div className="relative">
              <Link href="/retailer/at-once">
                <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-green-600" />
                        <CardTitle className="text-base">At-Once Orders</CardTitle>
                      </div>
                      <Badge className="bg-green-500 text-white text-xs">
                        Stock
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">
                          {stats.atOnce.cartItems > 0 ? formatCurrency(stats.atOnce.cartValue) : "Shop Now"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stats.atOnce.cartItems > 0 
                            ? `${stats.atOnce.cartItems} items in cart`
                            : "Ready to ship items"
                          }
                        </p>
                      </div>
                      <Truck className="h-8 w-8 text-green-600/20" />
                    </div>
                    
                    {stats.atOnce.quickReorderAvailable && (
                      <div className="flex items-center gap-2 text-xs text-green-600">
                        <TrendingUp className="h-3 w-3" />
                        Quick reorder available
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        {stats.atOnce.recentOrders} recent orders
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Prebook Card */}
            <div className="relative">
              <Link href="/retailer/prebook">
                <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-base">Prebook Orders</CardTitle>
                      </div>
                      <Badge className="bg-blue-500 text-white text-xs">
                        Future
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">
                          {stats.prebook.cartItems > 0 ? formatCurrency(stats.prebook.cartValue) : "View Seasons"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stats.prebook.cartItems > 0 
                            ? `Deposit: ${formatCurrency(stats.prebook.depositRequired)}`
                            : `${stats.prebook.activeSeasons.length} active seasons`
                          }
                        </p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-600/20" />
                    </div>
                    
                    {stats.prebook.nextDeadline && (
                      <div className="flex items-center gap-2 text-xs text-blue-600">
                        <AlertCircle className="h-3 w-3" />
                        Cancel by {stats.prebook.nextDeadline.toLocaleDateString()} 
                        ({getDaysUntilDeadline(stats.prebook.nextDeadline)} days)
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        {stats.prebook.activeSeasons.join(", ")}
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Closeout Card */}
            <div className="relative">
              <Link href="/retailer/closeouts">
                <Card className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-red-500">
                  {stats.closeout.urgentDeals > 0 && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge className="bg-red-600 text-white animate-pulse">
                        {stats.closeout.urgentDeals} Urgent
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Tag className="h-5 w-5 text-red-600" />
                        <CardTitle className="text-base">Closeout Deals</CardTitle>
                      </div>
                      <Badge className="bg-red-500 text-white text-xs">
                        Sale
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-2xl font-bold">
                          {stats.closeout.cartItems > 0 
                            ? formatCurrency(stats.closeout.cartValue) 
                            : `${stats.closeout.activeDeals} Active`
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stats.closeout.cartItems > 0 
                            ? `Saved: ${formatCurrency(stats.closeout.savings)}`
                            : "Limited time offers"
                          }
                        </p>
                      </div>
                      <Timer className="h-8 w-8 text-red-600/20" />
                    </div>
                    
                    {stats.closeout.urgentDeals > 0 && (
                      <div className="flex items-center gap-2 text-xs text-red-600 animate-pulse">
                        <AlertCircle className="h-3 w-3" />
                        {stats.closeout.urgentDeals} deals ending soon!
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-xs text-muted-foreground">
                        Up to 70% off
                      </span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>

          {/* Combined Cart Summary */}
          {getTotalCartItems() > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Combined Cart Summary</p>
                    <p className="text-sm text-muted-foreground">
                      {getTotalCartItems()} items across {
                        [stats.atOnce.cartItems > 0, stats.prebook.cartItems > 0, stats.closeout.cartItems > 0]
                          .filter(Boolean).length
                      } order types
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{formatCurrency(getTotalCartValue())}</p>
                  <Link href="/retailer/cart">
                    <Button size="sm" className="mt-1">
                      Review Carts
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <Link href="/retailer/at-once" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Browse Stock</p>
                  <p className="text-xs text-muted-foreground">Ships in 1-5 days</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <Link href="/retailer/prebook" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Plan Seasons</p>
                  <p className="text-xs text-muted-foreground">30-50% deposit</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <Link href="/retailer/closeouts" className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Tag className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">View Deals</p>
                  <p className="text-xs text-muted-foreground">40-70% off</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}