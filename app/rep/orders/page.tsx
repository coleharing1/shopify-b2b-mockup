"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveTable } from "@/components/ui/responsive-table"
import { StatCard } from "@/components/features/stat-card"
import { 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  Package, 
  DollarSign,
  Users,
  Calendar,
  ChevronRight,
  FileText,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

// Extended mock data for sales rep orders
const mockOrders = [
  {
    id: "SO-2025-001",
    orderId: "order-1001",
    companyId: "company-1",
    companyName: "Mountain Gear Outfitters",
    orderDate: "2025-08-05",
    poNumber: "MGO-PO-2025-0805",
    status: "processing",
    total: 4567.89,
    items: 15,
    commission: 456.79
  },
  {
    id: "SO-2025-002",
    orderId: "order-1002",
    companyId: "company-2",
    companyName: "Summit Sports Retail",
    orderDate: "2025-08-04",
    poNumber: "SSR-PO-2025-0804",
    status: "shipped",
    total: 3234.56,
    items: 12,
    commission: 323.46
  },
  {
    id: "SO-2025-003",
    orderId: "order-1003",
    companyId: "company-1",
    companyName: "Mountain Gear Outfitters",
    orderDate: "2025-08-03",
    poNumber: "MGO-PO-2025-0803",
    status: "delivered",
    total: 5678.90,
    items: 20,
    commission: 567.89
  },
  {
    id: "SO-2025-004",
    orderId: "order-1004",
    companyId: "company-3",
    companyName: "Adventure Outfitters",
    orderDate: "2025-08-02",
    poNumber: "AO-PO-2025-0802",
    status: "pending",
    total: 2345.67,
    items: 8,
    commission: 234.57
  },
  {
    id: "SO-2025-005",
    orderId: "order-1005",
    companyId: "company-2",
    companyName: "Summit Sports Retail",
    orderDate: "2025-08-01",
    poNumber: "SSR-PO-2025-0801",
    status: "delivered",
    total: 6789.01,
    items: 25,
    commission: 678.90
  }
]

const mockCustomers = [
  { id: "company-1", name: "Mountain Gear Outfitters", orderCount: 2 },
  { id: "company-2", name: "Summit Sports Retail", orderCount: 2 },
  { id: "company-3", name: "Adventure Outfitters", orderCount: 1 }
]

/**
 * @description Sales rep order management dashboard
 * @fileoverview Centralized view of all customer orders with analytics
 */
export default function RepOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [dateRange, setDateRange] = useState("30days")

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalOrders = mockOrders.length
    const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0)
    const totalCommission = mockOrders.reduce((sum, order) => sum + order.commission, 0)
    const averageOrderValue = totalRevenue / totalOrders
    
    return {
      totalOrders,
      totalRevenue,
      totalCommission,
      averageOrderValue
    }
  }, [])

  // Filter orders
  const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      const matchesSearch = searchTerm === "" || 
        order.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCustomer = selectedCustomer === "all" || order.companyId === selectedCustomer
      const matchesStatus = selectedStatus === "all" || order.status === selectedStatus
      
      return matchesSearch && matchesCustomer && matchesStatus
    })
  }, [searchTerm, selectedCustomer, selectedStatus])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-600" />
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>
      case 'shipped':
        return <Badge variant="default">Shipped</Badge>
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>
      default:
        return <Badge variant="outline">Pending</Badge>
    }
  }

  // Calculate status distribution
  const statusCounts = useMemo(() => {
    const counts = {
      all: mockOrders.length,
      pending: mockOrders.filter(o => o.status === 'pending').length,
      processing: mockOrders.filter(o => o.status === 'processing').length,
      shipped: mockOrders.filter(o => o.status === 'shipped').length,
      delivered: mockOrders.filter(o => o.status === 'delivered').length
    }
    return counts
  }, [])

  const columns = [
    { 
      key: "order", 
      label: "Order", 
      sortable: true,
      render: (order: typeof mockOrders[0]) => (
        <div className="flex items-center gap-2">
          {getStatusIcon(order.status)}
          <div>
            <Link href={`/retailer/orders/${order.orderId}`} className="font-medium text-primary hover:underline">
              {order.id}
            </Link>
            <p className="text-xs text-gray-500">{order.poNumber}</p>
          </div>
        </div>
      )
    },
    { 
      key: "customer", 
      label: "Customer",
      sortable: true,
      render: (order: typeof mockOrders[0]) => (
        <div>
          <Link href={`/rep/customers/${order.companyId}`} className="text-sm font-medium hover:text-primary">
            {order.companyName}
          </Link>
          <p className="text-xs text-gray-500">{order.items} items</p>
        </div>
      )
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (order: typeof mockOrders[0]) => (
        <span className="text-sm">{new Date(order.orderDate).toLocaleDateString()}</span>
      )
    },
    {
      key: "total",
      label: "Total",
      sortable: true,
      render: (order: typeof mockOrders[0]) => (
        <div>
          <p className="font-medium">${order.total.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Comm: ${order.commission.toFixed(2)}</p>
        </div>
      )
    },
    {
      key: "status",
      label: "Status",
      render: (order: typeof mockOrders[0]) => getStatusBadge(order.status)
    },
    {
      key: "actions",
      label: "Actions",
      render: (order: typeof mockOrders[0]) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/retailer/orders/${order.orderId}`}>
              View
              <ChevronRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order Management</h1>
        <p className="text-gray-600 mt-1">Track and manage all customer orders</p>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Orders"
          value={metrics.totalOrders}
          icon={Package}
          trend="+12%"
          description="This month"
        />
        <StatCard
          title="Total Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="+18%"
          description="From all customers"
        />
        <StatCard
          title="Commission Earned"
          value={`$${metrics.totalCommission.toLocaleString()}`}
          icon={TrendingUp}
          trend="+15%"
          description="This month"
        />
        <StatCard
          title="Average Order"
          value={`$${metrics.averageOrderValue.toFixed(2)}`}
          icon={Users}
          description="Per transaction"
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Orders</CardTitle>
          <CardDescription>Search and filter across all customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Order ID, PO, customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="customer">Customer</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger id="customer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  {mockCustomers.map(customer => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.orderCount})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger id="dateRange">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="year">This year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Orders
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table with Tabs */}
      <Tabs defaultValue="all" value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList>
          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
          <TabsTrigger value="processing">Processing ({statusCounts.processing})</TabsTrigger>
          <TabsTrigger value="shipped">Shipped ({statusCounts.shipped})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered ({statusCounts.delivered})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Customer Orders</CardTitle>
                  <CardDescription>
                    {filteredOrders.length} orders found
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Commission Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ResponsiveTable
                columns={columns}
                data={filteredOrders}
                mobileColumns={["order", "customer", "total"]}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Customer Order Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Order Distribution by Customer</CardTitle>
          <CardDescription>See which customers are ordering the most</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCustomers.map(customer => {
              const customerOrders = mockOrders.filter(o => o.companyId === customer.id)
              const customerTotal = customerOrders.reduce((sum, o) => sum + o.total, 0)
              const percentage = (customerTotal / metrics.totalRevenue) * 100
              
              return (
                <div key={customer.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Link href={`/rep/customers/${customer.id}`} className="font-medium hover:text-primary">
                        {customer.name}
                      </Link>
                      <span className="text-sm text-gray-600">
                        ${customerTotal.toLocaleString()} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}