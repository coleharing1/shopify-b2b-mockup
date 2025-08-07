"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from "lucide-react"
import Link from "next/link"

// Extended mock data
const mockApplications = [
  {
    id: "APP-2025-047",
    companyName: "Outdoor Adventures LLC",
    dba: "Adventure Gear Store",
    ein: "12-3456789",
    submittedAt: "2025-08-07T10:00:00Z",
    status: "pending",
    creditScore: 720,
    requestedCredit: 25000,
    state: "CA",
    salesRep: null
  },
  {
    id: "APP-2025-046",
    companyName: "Mountain Gear Supply",
    ein: "98-7654321",
    submittedAt: "2025-08-07T08:30:00Z",
    status: "reviewing",
    creditScore: 680,
    requestedCredit: 15000,
    state: "CO",
    salesRep: "John Smith",
    reviewer: "Admin User"
  },
  {
    id: "APP-2025-045",
    companyName: "Pacific Coast Sports",
    ein: "45-1234567",
    submittedAt: "2025-08-06T16:45:00Z",
    status: "approved",
    creditScore: 750,
    requestedCredit: 50000,
    approvedCredit: 35000,
    state: "WA",
    salesRep: "Jane Doe",
    reviewer: "Admin User",
    approvedAt: "2025-08-07T09:00:00Z"
  },
  {
    id: "APP-2025-044",
    companyName: "Adventure Outfitters",
    ein: "67-8901234",
    submittedAt: "2025-08-06T14:20:00Z",
    status: "rejected",
    creditScore: 580,
    requestedCredit: 20000,
    state: "AZ",
    salesRep: "Bob Johnson",
    reviewer: "Admin User",
    rejectedAt: "2025-08-06T16:00:00Z",
    rejectionReason: "Credit score below minimum requirement"
  },
  {
    id: "APP-2025-043",
    companyName: "Summit Sports Retail",
    ein: "23-4567890",
    submittedAt: "2025-08-05T11:15:00Z",
    status: "pending",
    creditScore: 695,
    requestedCredit: 30000,
    state: "UT",
    salesRep: null
  },
  {
    id: "APP-2025-042",
    companyName: "Coastal Outdoor Co",
    ein: "89-0123456",
    submittedAt: "2025-08-05T09:30:00Z",
    status: "approved",
    creditScore: 710,
    requestedCredit: 40000,
    approvedCredit: 40000,
    state: "OR",
    salesRep: "Sarah Wilson",
    reviewer: "Admin User",
    approvedAt: "2025-08-05T15:00:00Z"
  }
]

/**
 * @description Admin applications management page
 * @fileoverview List and filter dealer applications with bulk actions
 */
export default function AdminApplicationsPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedApplications, setSelectedApplications] = useState<string[]>([])
  const [filterState, setFilterState] = useState("")
  const [sortBy, setSortBy] = useState("submittedAt")

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

  const filteredApplications = mockApplications.filter(app => {
    // Tab filter
    if (selectedTab !== "all" && app.status !== selectedTab) return false
    
    // Search filter
    if (searchTerm && !app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !app.id.toLowerCase().includes(searchTerm.toLowerCase())) return false
    
    // State filter
    if (filterState && app.state !== filterState) return false
    
    return true
  })

  const toggleApplicationSelection = (appId: string) => {
    setSelectedApplications(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    )
  }

  const toggleAllApplications = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([])
    } else {
      setSelectedApplications(filteredApplications.map(app => app.id))
    }
  }

  const tabCounts = {
    all: mockApplications.length,
    pending: mockApplications.filter(a => a.status === 'pending').length,
    reviewing: mockApplications.filter(a => a.status === 'reviewing').length,
    approved: mockApplications.filter(a => a.status === 'approved').length,
    rejected: mockApplications.filter(a => a.status === 'rejected').length
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dealer Applications</h1>
        <p className="mt-1 text-sm text-gray-600">
          Review and manage dealer account applications
        </p>
      </div>

      {/* Filters and Actions */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by company name or application ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterState} onValueChange={setFilterState}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All States</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="CO">Colorado</SelectItem>
                  <SelectItem value="WA">Washington</SelectItem>
                  <SelectItem value="OR">Oregon</SelectItem>
                  <SelectItem value="AZ">Arizona</SelectItem>
                  <SelectItem value="UT">Utah</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submittedAt">Newest First</SelectItem>
                  <SelectItem value="submittedAtAsc">Oldest First</SelectItem>
                  <SelectItem value="creditScore">Credit Score</SelectItem>
                  <SelectItem value="companyName">Company Name</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {selectedApplications.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedApplications.length} application{selectedApplications.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Approve Selected
                </Button>
                <Button size="sm" variant="outline">
                  Reject Selected
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applications Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            All ({tabCounts.all})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({tabCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="reviewing">
            Reviewing ({tabCounts.reviewing})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({tabCounts.approved})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({tabCounts.rejected})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab}>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-12 px-4 py-3">
                        <Checkbox
                          checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                          onChange={toggleAllApplications}
                        />
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
                        Application
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
                        Company Details
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
                        Credit Info
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
                        Status
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-900">
                        Assigned To
                      </th>
                      <th className="text-right px-4 py-3 text-sm font-medium text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <Checkbox
                            checked={selectedApplications.includes(app.id)}
                            onChange={() => toggleApplicationSelection(app.id)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(app.status)}
                            <div>
                              <Link
                                href={`/admin/applications/${app.id}`}
                                className="text-sm font-medium text-gray-900 hover:text-primary"
                              >
                                {app.id}
                              </Link>
                              <p className="text-xs text-gray-500">
                                {new Date(app.submittedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{app.companyName}</p>
                            {app.dba && (
                              <p className="text-xs text-gray-500">DBA: {app.dba}</p>
                            )}
                            <p className="text-xs text-gray-500">EIN: {app.ein}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {app.state}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm">
                              Score: <span className="font-medium">{app.creditScore}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Requested: ${app.requestedCredit.toLocaleString()}
                            </p>
                            {app.approvedCredit && (
                              <p className="text-xs text-green-600">
                                Approved: ${app.approvedCredit.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            {getStatusBadge(app.status)}
                            {app.rejectionReason && (
                              <p className="text-xs text-red-600 mt-1">
                                {app.rejectionReason}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            {app.salesRep ? (
                              <div>
                                <p className="text-gray-900">{app.salesRep}</p>
                                <p className="text-xs text-gray-500">Sales Rep</p>
                              </div>
                            ) : (
                              <p className="text-gray-500">Unassigned</p>
                            )}
                            {app.reviewer && (
                              <p className="text-xs text-gray-500 mt-1">
                                Reviewed by {app.reviewer}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
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

              {/* Pagination */}
              <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredApplications.length}</span> of{" "}
                  <span className="font-medium">{mockApplications.length}</span> results
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}