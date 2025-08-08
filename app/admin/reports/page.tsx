'use client'

import { useState } from 'react'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Download,
  FileText,
  Calendar,
  Filter,
  BarChart3,
  DollarSign,
  Package,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/mock-data'

export default function AdminReportsPage() {
  const [reportType, setReportType] = useState('financial-overview')
  const [format, setFormat] = useState('pdf')
  const [dateRange, setDateRange] = useState('30')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: reportType,
          format,
          filters: {
            dateRange: {
              start: new Date(Date.now() - parseInt(dateRange) * 86400000),
              end: new Date()
            }
          }
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${reportType}-${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Failed to generate report:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const scheduledReports = [
    {
      id: '1',
      name: 'Monthly Financial Report',
      type: 'financial-overview',
      frequency: 'Monthly',
      nextRun: new Date(Date.now() + 5 * 86400000),
      recipients: ['cfo@company.com', 'accounting@company.com'],
      status: 'active'
    },
    {
      id: '2',
      name: 'Weekly Sales Summary',
      type: 'sales-summary',
      frequency: 'Weekly',
      nextRun: new Date(Date.now() + 2 * 86400000),
      recipients: ['sales-team@company.com'],
      status: 'active'
    },
    {
      id: '3',
      name: 'Inventory Status Report',
      type: 'inventory-status',
      frequency: 'Daily',
      nextRun: new Date(Date.now() + 86400000),
      recipients: ['warehouse@company.com'],
      status: 'active'
    }
  ]

  const reportHistory = [
    {
      id: '1',
      name: 'Financial Overview - January 2025',
      type: 'financial-overview',
      generatedAt: new Date(Date.now() - 86400000),
      generatedBy: 'System',
      size: '2.4 MB',
      status: 'completed'
    },
    {
      id: '2',
      name: 'Sales Performance - Q4 2024',
      type: 'sales-summary',
      generatedAt: new Date(Date.now() - 172800000),
      generatedBy: 'Admin User',
      size: '1.8 MB',
      status: 'completed'
    },
    {
      id: '3',
      name: 'Customer Analytics - December',
      type: 'customer-activity',
      generatedAt: new Date(Date.now() - 259200000),
      generatedBy: 'Marketing Team',
      size: '3.1 MB',
      status: 'completed'
    }
  ]

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports Center</h1>
          <p className="text-gray-600 mt-2">Generate and manage business reports</p>
        </div>

        <Tabs defaultValue="generate" className="space-y-4">
          <TabsList>
            <TabsTrigger value="generate">Generate Report</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
            <TabsTrigger value="history">Report History</TabsTrigger>
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>Generate New Report</CardTitle>
                <CardDescription>Create comprehensive business reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="report-type">Report Type</Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger id="report-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="financial-overview">Financial Overview</SelectItem>
                        <SelectItem value="sales-summary">Sales Summary</SelectItem>
                        <SelectItem value="inventory-status">Inventory Status</SelectItem>
                        <SelectItem value="customer-activity">Customer Activity</SelectItem>
                        <SelectItem value="product-performance">Product Performance</SelectItem>
                        <SelectItem value="tax-summary">Tax Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger id="format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date-range">Date Range</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger id="date-range">
                        <Calendar className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 3 months</SelectItem>
                        <SelectItem value="180">Last 6 months</SelectItem>
                        <SelectItem value="365">Last year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="filters">Additional Filters</Label>
                    <Select>
                      <SelectTrigger id="filters">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Select filters" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Data</SelectItem>
                        <SelectItem value="region">By Region</SelectItem>
                        <SelectItem value="category">By Category</SelectItem>
                        <SelectItem value="rep">By Sales Rep</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <Button 
                    onClick={handleGenerateReport} 
                    disabled={isGenerating}
                    className="w-full sm:w-auto"
                  >
                    {isGenerating ? (
                      <>Generating...</>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>Automated report generation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduledReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gray-100 rounded">
                          <Clock className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <div className="flex items-center gap-4 mt-1">
                             <span className="text-sm text-gray-600">
                               {report.frequency} • Next: {formatDate(report.nextRun.toISOString())}
                             </span>
                            <span className="text-sm text-gray-600">
                              {report.recipients.length} recipients
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          report.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {report.status}
                        </span>
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Pause</Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule New Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Report History</CardTitle>
                <CardDescription>Previously generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportHistory.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-gray-600">
                            Generated {formatDate(report.generatedAt.toISOString())} by {report.generatedBy} • {report.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {report.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        )}
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
                <CardDescription>Pre-configured report formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: 'Executive Summary',
                      description: 'High-level overview for leadership',
                      icon: BarChart3,
                      color: 'text-blue-600 bg-blue-50'
                    },
                    {
                      name: 'Financial Report',
                      description: 'Detailed financial metrics and analysis',
                      icon: DollarSign,
                      color: 'text-green-600 bg-green-50'
                    },
                    {
                      name: 'Inventory Analysis',
                      description: 'Stock levels and turnover metrics',
                      icon: Package,
                      color: 'text-purple-600 bg-purple-50'
                    },
                    {
                      name: 'Customer Insights',
                      description: 'Customer behavior and segmentation',
                      icon: Users,
                      color: 'text-orange-600 bg-orange-50'
                    }
                  ].map((template, index) => (
                    <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded ${template.color}`}>
                          <template.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                          <Button variant="outline" size="sm" className="mt-3">
                            Use Template
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}