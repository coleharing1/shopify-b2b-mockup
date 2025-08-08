'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, Clock, DollarSign, Plus } from "lucide-react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"

export default function AdminCloseoutsPage() {
  return (
    <AuthenticatedLayout>
      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6" />
              Closeout Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage clearance inventory and closeout lists
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Closeout List
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Lists</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-2xl font-bold">47</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Clock className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">$124K</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Active Closeout Lists</CardTitle>
            <CardDescription>
              Manage current clearance campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Winter Clearance</h3>
                  <p className="text-sm text-muted-foreground">18 products • Expires in 2 days</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Urgent</Badge>
                  <Button size="sm" variant="outline">Manage</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Discontinued Items</h3>
                  <p className="text-sm text-muted-foreground">15 products • Expires in 5 days</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Active</Badge>
                  <Button size="sm" variant="outline">Manage</Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">Flash Sale</h3>
                  <p className="text-sm text-muted-foreground">14 products • Expires in 6 hours</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Critical</Badge>
                  <Button size="sm" variant="outline">Manage</Button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                Full closeout management features coming in Phase 5, including:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Automated markdown schedules</li>
                <li>• Customer tier eligibility</li>
                <li>• Inventory allocation rules</li>
                <li>• Performance analytics</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}