"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

const mockMetrics = {
  totalApplications: 47,
  pendingReview: 8,
  approvedThisMonth: 12,
  rejectedThisMonth: 3,
  avgApprovalTime: "1.5 days",
  approvalRate: "92%",
  totalDealers: 286,
  newThisMonth: 15
}

const recentApplications = [
  {
    id: "APP-2025-047",
    companyName: "Outdoor Adventures LLC",
    submittedAt: "2025-08-07T10:00:00Z",
    status: "pending",
    creditScore: 720
  },
  {
    id: "APP-2025-046",
    companyName: "Mountain Gear Supply",
    submittedAt: "2025-08-07T08:30:00Z",
    status: "reviewing",
    creditScore: 680
  },
  {
    id: "APP-2025-045",
    companyName: "Pacific Coast Sports",
    submittedAt: "2025-08-06T16:45:00Z",
    status: "approved",
    creditScore: 750
  },
  {
    id: "APP-2025-044",
    companyName: "Adventure Outfitters",
    submittedAt: "2025-08-06T14:20:00Z",
    status: "rejected",
    creditScore: 580
  }
]

/**
 * @description Admin metrics dashboard
 * @fileoverview Overview of dealer applications and account metrics
 */
export default function AdminDashboardPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'reviewing':
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      case 'reviewing':
        return <Badge variant="default">Reviewing</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage dealer applications and monitor account metrics
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Pending Applications
              </CardTitle>
              <FileText className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.pendingReview}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Approval Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.approvalRate}</div>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Avg. Processing Time
              </CardTitle>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.avgApprovalTime}</div>
            <p className="text-xs text-gray-500 mt-1">Target: 2 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Dealers
              </CardTitle>
              <Users className="h-4 w-4 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockMetrics.totalDealers}</div>
            <p className="text-xs text-gray-500 mt-1">+{mockMetrics.newThisMonth} this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Applications</CardTitle>
              <CardDescription>Latest dealer applications requiring attention</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/applications">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">
                    Application ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">
                    Company
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">
                    Submitted
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">
                    Credit Score
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-900">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(app.status)}
                        <span className="text-sm font-medium">{app.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{app.companyName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="font-mono">
                        {app.creditScore}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-3 px-4">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/applications/${app.id}`}>
                          Review
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-green-900">
              Approved This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {mockMetrics.approvedThisMonth}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span className="text-xs text-green-700">
                {mockMetrics.approvalRate} approval rate
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-900">
              Rejected This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {mockMetrics.rejectedThisMonth}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <XCircle className="h-3 w-3 text-red-600" />
              <span className="text-xs text-red-700">
                Most common: Credit issues
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-900">
              Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {mockMetrics.totalApplications}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <FileText className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-blue-700">
                {mockMetrics.pendingReview} pending review
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}