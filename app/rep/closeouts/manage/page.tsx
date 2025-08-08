'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, AlertCircle, Clock, TrendingDown } from "lucide-react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"

export default function RepCloseoutsManagePage() {
  return (
    <AuthenticatedLayout>
      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6" />
              Manage Closeouts
            </h1>
            <p className="text-sm text-muted-foreground">
              Coordinate closeout deals for your customers
            </p>
          </div>
          <Badge variant="outline" className="bg-red-50">
            <Clock className="h-3 w-3 mr-1" />
            3 Expiring Soon
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                Active Closeout Lists
              </CardTitle>
              <CardDescription>
                Current clearance opportunities for customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This page will display closeout management tools for sales reps.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>• View customer-specific closeout eligibility</li>
                <li>• Reserve quantities for key accounts</li>
                <li>• Track closeout performance</li>
                <li>• Manage urgency notifications</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                Customer Opportunities
              </CardTitle>
              <CardDescription>
                Match closeouts to customer needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mt-2">
                Coming in Phase 5: Advanced closeout management with customer matching.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}