'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Settings, TrendingUp } from "lucide-react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"

export default function AdminSeasonsPage() {
  return (
    <AuthenticatedLayout>
      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Season Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure prebook seasons and delivery windows
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Season
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Spring 2025</CardTitle>
              <CardDescription>Active Season</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Products:</span>
                  <span>24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Orders:</span>
                  <span>12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery:</span>
                  <span>Mar-Apr 2025</span>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="w-full justify-center">
                  Ordering Open
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summer 2025</CardTitle>
              <CardDescription>Planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Products:</span>
                  <span>18</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Orders:</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery:</span>
                  <span>Jun-Jul 2025</span>
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="outline" className="w-full justify-center">
                  Opens Feb 15
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-full py-8">
              <Settings className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground text-center">
                Season configuration coming in Phase 5
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Season Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Advanced season analytics and management tools will be available soon.
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}