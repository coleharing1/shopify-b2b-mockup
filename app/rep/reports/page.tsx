'use client'

import { useState } from 'react'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Download,
  Send,
  Calendar,
  FileText,
  DollarSign,
  Users,
  TrendingUp,
  Award
} from 'lucide-react'
import { useAuth } from '@/lib/contexts/auth-context'
import { formatCurrency, formatDate } from '@/lib/mock-data'

export default function RepReportsPage() {
  const { user } = useAuth()
  const [reportType, setReportType] = useState('sales-summary')
  const [format, setFormat] = useState('pdf')
  const [dateRange, setDateRange] = useState('30')

  const handleGenerateReport = async () => {
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
            salesRepId: user?.id
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
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Reports</h1>
          <p className="text-gray-600 mt-2">Generate and download performance reports</p>
        </div>

        <Tabs defaultValue="generate" className="space-y-4">
          <TabsList>
            <TabsTrigger value="generate">Generate Report</TabsTrigger>
            <TabsTrigger value="commission">Commission Statements</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <Card>
              <CardHeader>
                <CardTitle>Create Custom Report</CardTitle>
                <CardDescription>Generate reports for your accounts and territories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Report Type</label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales-summary">Sales Summary</SelectItem>
                        <SelectItem value="customer-activity">Customer Activity</SelectItem>
                        <SelectItem value="product-performance">Product Performance</SelectItem>
                        <SelectItem value="commission-statement">Commission Statement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Format</label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Range</label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <Calendar className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 3 months</SelectItem>
                        <SelectItem value="180">Last 6 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleGenerateReport} className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commission">
            <Card>
              <CardHeader>
                <CardTitle>Commission Statements</CardTitle>
                <CardDescription>Track your earnings and commission history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Commission Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <DollarSign className="h-8 w-8 text-green-600" />
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Paid</span>
                        </div>
                        <p className="text-2xl font-bold">{formatCurrency(15000)}</p>
                        <p className="text-sm text-gray-600">YTD Earned</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <TrendingUp className="h-8 w-8 text-yellow-600" />
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Pending</span>
                        </div>
                        <p className="text-2xl font-bold">{formatCurrency(6250)}</p>
                        <p className="text-sm text-gray-600">This Month</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <Award className="h-8 w-8 text-blue-600" />
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">5%</span>
                        </div>
                        <p className="text-2xl font-bold">{formatCurrency(21250)}</p>
                        <p className="text-sm text-gray-600">Total Expected</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Commission */}
                  <div>
                    <h3 className="font-medium mb-3">Recent Commissions</h3>
                    <div className="space-y-3">
                      {[
                        { customer: 'Outdoor Retailers Co.', amount: 2500, status: 'paid', date: '2024-01-15' },
                        { customer: 'Mountain Gear Shop', amount: 1875, status: 'paid', date: '2024-01-10' },
                        { customer: 'Adventure Sports Inc.', amount: 3125, status: 'pending', date: '2024-01-28' },
                        { customer: 'Trail Blazers Outfitters', amount: 1500, status: 'pending', date: '2024-01-25' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{item.customer}</p>
                            <p className="text-sm text-gray-600">{formatDate(item.date)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(item.amount)}</p>
                            <span className={`text-xs px-2 py-1 rounded ${
                              item.status === 'paid' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Full Statement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pipeline">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Reports</CardTitle>
                <CardDescription>Track opportunities and forecast revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Pipeline Summary */}
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Current Pipeline</h3>
                      <span className="text-2xl font-bold text-blue-900">{formatCurrency(450000)}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {[
                        { stage: 'Prospecting', value: 125000, count: 12 },
                        { stage: 'Qualification', value: 95000, count: 8 },
                        { stage: 'Proposal', value: 150000, count: 5 },
                        { stage: 'Negotiation', value: 80000, count: 3 }
                      ].map((stage, index) => (
                        <div key={index} className="text-center">
                          <p className="text-xs text-gray-600 mb-1">{stage.stage}</p>
                          <p className="font-semibold">{formatCurrency(stage.value)}</p>
                          <p className="text-xs text-gray-500">{stage.count} deals</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Opportunities */}
                  <div>
                    <h3 className="font-medium mb-3">Top Opportunities</h3>
                    <div className="space-y-3">
                      {[
                        { customer: 'Outdoor Retailers Co.', value: 75000, probability: 0.8, closeDate: '2024-02-15' },
                        { customer: 'Mountain Gear Shop', value: 45000, probability: 0.6, closeDate: '2024-02-28' },
                        { customer: 'Adventure Sports Inc.', value: 95000, probability: 0.4, closeDate: '2024-03-15' }
                      ].map((opp, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{opp.customer}</p>
                            <span className="text-sm text-gray-600">Close: {formatDate(opp.closeDate)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Value</p>
                              <p className="font-semibold">{formatCurrency(opp.value)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Probability</p>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${opp.probability * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium">{(opp.probability * 100)}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Export Pipeline Data
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