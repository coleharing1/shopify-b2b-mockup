'use client'

import { useState } from 'react'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Download,
  Send,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail
} from 'lucide-react'
import { useAuth } from '@/lib/contexts/auth-context'
import { formatDate } from '@/lib/mock-data'

export default function RetailerReportsPage() {
  const { user } = useAuth()
  const [reportType, setReportType] = useState('order-history')
  const [format, setFormat] = useState('pdf')
  const [dateRange, setDateRange] = useState('30')
  const [emailDelivery, setEmailDelivery] = useState(false)
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
            },
            companyId: user?.companyId
          },
          email: emailDelivery ? user?.email : undefined
        })
      })

      if (response.ok) {
        if (emailDelivery) {
          alert('Report sent to your email!')
        } else {
          // Download the file
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
      }
    } catch (error) {
      console.error('Failed to generate report:', error)
      alert('Failed to generate report')
    } finally {
      setIsGenerating(false)
    }
  }

  const recentReports = [
    {
      id: '1',
      name: 'Order History - December 2024',
      type: 'order-history',
      generatedAt: new Date(Date.now() - 86400000),
      status: 'completed',
      size: '245 KB'
    },
    {
      id: '2',
      name: 'Invoice Statement - Q4 2024',
      type: 'invoice',
      generatedAt: new Date(Date.now() - 172800000),
      status: 'completed',
      size: '128 KB'
    },
    {
      id: '3',
      name: 'Product Performance - November',
      type: 'product-performance',
      generatedAt: new Date(Date.now() - 259200000),
      status: 'completed',
      size: '312 KB'
    }
  ]

  const scheduledReports = [
    {
      id: '1',
      name: 'Monthly Statement',
      frequency: 'Monthly',
      nextRun: new Date(Date.now() + 5 * 86400000),
      format: 'PDF',
      delivery: 'Email'
    },
    {
      id: '2',
      name: 'Quarterly Summary',
      frequency: 'Quarterly',
      nextRun: new Date(Date.now() + 30 * 86400000),
      format: 'Excel',
      delivery: 'Email'
    }
  ]

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-2">Generate and download business reports</p>
        </div>

        <Tabs defaultValue="generate" className="space-y-4">
          <TabsList>
            <TabsTrigger value="generate">Generate Report</TabsTrigger>
            <TabsTrigger value="history">Report History</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>Generate New Report</CardTitle>
                <CardDescription>Create custom reports for your business needs</CardDescription>
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
                        <SelectItem value="order-history">Order History</SelectItem>
                        <SelectItem value="product-performance">Product Performance</SelectItem>
                        <SelectItem value="invoice">Invoice Statement</SelectItem>
                        <SelectItem value="tax">Tax Documentation</SelectItem>
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
                    <Label>Delivery Options</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="email-delivery" 
                        checked={emailDelivery}
                        onChange={(e) => setEmailDelivery(e.currentTarget.checked)}
                      />
                      <Label htmlFor="email-delivery" className="font-normal">
                        Send to email ({user?.email})
                      </Label>
                    </div>
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
                        {emailDelivery ? (
                          <><Send className="h-4 w-4 mr-2" /> Send Report</>
                        ) : (
                          <><Download className="h-4 w-4 mr-2" /> Download Report</>
                        )}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Previously generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-gray-600">
                            Generated {formatDate(report.generatedAt.toISOString())} • {report.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {report.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-600" />
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

          <TabsContent value="scheduled">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>Automatically generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scheduledReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <p className="text-sm text-gray-600">
                          {report.frequency} • Next: {formatDate(report.nextRun.toISOString())}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{report.format}</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {report.delivery}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
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
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}