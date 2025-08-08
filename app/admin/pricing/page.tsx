'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, TrendingUp, Users, Settings, Calculator } from "lucide-react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { getTierLabel } from "@/config/order-types.config"

export default function AdminPricingPage() {
  return (
    <AuthenticatedLayout>
      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              Pricing Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure pricing tiers, discounts, and customer-specific pricing
            </p>
          </div>
          <Button>
            <Calculator className="h-4 w-4 mr-2" />
            Pricing Calculator
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Price Lists</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Custom Overrides</p>
                  <p className="text-2xl font-bold">47</p>
                </div>
                <Settings className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Discount</p>
                  <p className="text-2xl font-bold">38%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tiers" className="space-y-4">
          <TabsList>
            <TabsTrigger value="tiers">Pricing Tiers</TabsTrigger>
            <TabsTrigger value="lists">Price Lists</TabsTrigger>
            <TabsTrigger value="overrides">Overrides</TabsTrigger>
            <TabsTrigger value="volume">Volume Breaks</TabsTrigger>
          </TabsList>

          <TabsContent value="tiers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Standard Pricing Tiers</CardTitle>
                <CardDescription>
                  Base discount levels for customer segments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-orange-100 text-orange-800">
                        {getTierLabel('tier-1')}
                      </Badge>
                      <div>
                        <p className="font-medium">Standard Tier</p>
                        <p className="text-sm text-muted-foreground">30% off MSRP • $500 minimum</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">8 companies</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-gray-100 text-gray-800">
                        {getTierLabel('tier-2')}
                      </Badge>
                      <div>
                        <p className="font-medium">Preferred Tier</p>
                        <p className="text-sm text-muted-foreground">40% off MSRP • $2,500 minimum</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">5 companies</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {getTierLabel('tier-3')}
                      </Badge>
                      <div>
                        <p className="font-medium">Premium Tier</p>
                        <p className="text-sm text-muted-foreground">50% off MSRP • $5,000 minimum</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">3 companies</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lists" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Customer Price Lists</CardTitle>
                <CardDescription>
                  Custom pricing agreements by customer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Customer-specific price lists will be available in Phase 5.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li>• Create custom price lists per customer</li>
                  <li>• Set product-specific pricing</li>
                  <li>• Configure volume-based discounts</li>
                  <li>• Manage contract pricing</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overrides" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Price Overrides</CardTitle>
                <CardDescription>
                  Special pricing exceptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Price override management coming in Phase 5.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="volume" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Volume Break Pricing</CardTitle>
                <CardDescription>
                  Quantity-based discount tiers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Volume pricing configuration coming in Phase 5.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}