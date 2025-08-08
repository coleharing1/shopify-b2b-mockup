'use client'

import { useState, useEffect } from 'react'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Target,
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  Calendar,
  DollarSign,
  Package,
  Users,
  Zap,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { formatCurrency } from '@/lib/mock-data'

export default function AdminForecastingPage() {
  const [forecastPeriod, setForecastPeriod] = useState('quarter')
  const [forecastData, setForecastData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching forecast data
    setTimeout(() => {
      setForecastData({
        revenue: {
          current: 1250000,
          forecast: {
            month: { value: 1350000, confidence: 0.92, change: 8 },
            quarter: { value: 4100000, confidence: 0.85, change: 12 },
            year: { value: 16500000, confidence: 0.72, change: 15 }
          },
          drivers: [
            { factor: 'Seasonal demand', impact: '+15%', timing: 'Next 2 months' },
            { factor: 'New product launch', impact: '+8%', timing: 'Q2 2025' },
            { factor: 'Market expansion', impact: '+12%', timing: 'H2 2025' }
          ]
        },
        demand: {
          categories: [
            { name: 'Apparel', current: 2500, forecast: 3200, change: 28 },
            { name: 'Footwear', current: 1800, forecast: 2100, change: 17 },
            { name: 'Accessories', current: 3200, forecast: 3500, change: 9 }
          ],
          peakPeriods: [
            { period: 'February', reason: 'Spring pre-orders', increase: 35 },
            { period: 'April', reason: 'Summer collection', increase: 42 },
            { period: 'September', reason: 'Fall/Winter launch', increase: 48 }
          ]
        },
        inventory: {
          recommendations: [
            { product: 'Hiking Boots', action: 'Increase stock', quantity: 500, by: '2025-02-15' },
            { product: 'Rain Jackets', action: 'Reorder now', quantity: 300, by: '2025-02-01' },
            { product: 'Camping Gear', action: 'Reduce stock', quantity: -200, by: '2025-03-01' }
          ],
          turnoverForecast: 4.8,
          stockoutRisk: [
            { product: 'Trail Running Shoes', risk: 'high', probability: 0.75 },
            { product: 'Waterproof Pants', risk: 'medium', probability: 0.45 },
            { product: 'Fleece Jackets', risk: 'low', probability: 0.15 }
          ]
        },
        scenarios: [
          {
            name: 'Best Case',
            probability: 0.25,
            revenue: 1450000,
            growth: 16,
            assumptions: ['Market growth exceeds expectations', 'All new products successful']
          },
          {
            name: 'Most Likely',
            probability: 0.60,
            revenue: 1350000,
            growth: 8,
            assumptions: ['Steady market conditions', 'Normal seasonal patterns']
          },
          {
            name: 'Worst Case',
            probability: 0.15,
            revenue: 1180000,
            growth: -6,
            assumptions: ['Economic downturn', 'Supply chain disruptions']
          }
        ],
        alerts: [
          { type: 'warning', message: 'Spring inventory needs to be ordered by Feb 1st', severity: 'high' },
          { type: 'info', message: '3 customers likely to increase orders next quarter', severity: 'medium' },
          { type: 'success', message: 'Current trajectory exceeds annual target by 12%', severity: 'low' }
        ]
      })
      setIsLoading(false)
    }, 1000)
  }, [forecastPeriod])

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Generating forecasts...</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Forecasting & Planning</h1>
            <p className="text-gray-600 mt-2">Predictive analytics and demand planning</p>
          </div>
          <div className="flex gap-3">
            <Select value={forecastPeriod} onValueChange={setForecastPeriod}>
              <SelectTrigger className="w-40">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Next Month</SelectItem>
                <SelectItem value="quarter">Next Quarter</SelectItem>
                <SelectItem value="year">Next Year</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Zap className="h-4 w-4 mr-2" />
              Run Forecast
            </Button>
          </div>
        </div>

        {/* Forecast Alerts */}
        {forecastData?.alerts && (
          <div className="space-y-2">
            {forecastData.alerts.map((alert: any, index: number) => (
              <Alert key={index} className={`${
                alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                alert.type === 'success' ? 'border-green-200 bg-green-50' :
                'border-blue-200 bg-blue-50'
              }`}>
                <AlertTriangle className={`h-4 w-4 ${
                  alert.type === 'warning' ? 'text-yellow-600' :
                  alert.type === 'success' ? 'text-green-600' :
                  'text-blue-600'
                }`} />
                <AlertDescription>
                  <span className="font-medium">{alert.message}</span>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Revenue Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Forecast</CardTitle>
            <CardDescription>Projected revenue based on current trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              {Object.entries(forecastData?.revenue?.forecast || {}).map(([period, data]: [string, any]) => (
                <div key={period} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 capitalize mb-2">Next {period}</p>
                  <p className="text-2xl font-bold mb-1">{formatCurrency(data.value)}</p>
                  <div className="flex items-center justify-center gap-2">
                    {data.change > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-sm font-medium ${
                      data.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {Math.abs(data.change)}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-gray-500">Confidence</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${data.confidence * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {(data.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <h4 className="font-medium mb-3">Key Growth Drivers</h4>
              <div className="space-y-2">
                {forecastData?.revenue?.drivers?.map((driver: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{driver.factor}</p>
                      <p className="text-xs text-gray-600">{driver.timing}</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {driver.impact}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Forecasts */}
        <Tabs defaultValue="demand" className="space-y-4">
          <TabsList>
            <TabsTrigger value="demand">Demand Forecast</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Planning</TabsTrigger>
            <TabsTrigger value="scenarios">Scenario Analysis</TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal Adjustments</TabsTrigger>
          </TabsList>

          <TabsContent value="demand">
            <Card>
              <CardHeader>
                <CardTitle>Demand Forecast by Category</CardTitle>
                <CardDescription>Expected demand for the next period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forecastData?.demand?.categories?.map((category: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{category.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {category.current} → {category.forecast} units
                          </span>
                          <Badge variant={category.change > 20 ? 'default' : 'secondary'}>
                            +{category.change}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(category.forecast / (category.forecast + 500)) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">Peak Demand Periods</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {forecastData?.demand?.peakPeriods?.map((peak: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <p className="font-medium text-sm">{peak.period}</p>
                        <p className="text-xs text-gray-600 mt-1">{peak.reason}</p>
                        <p className="text-lg font-bold text-green-600 mt-2">+{peak.increase}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Planning</CardTitle>
                <CardDescription>Stock recommendations and reorder points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Action Required</h4>
                    <div className="space-y-3">
                      {forecastData?.inventory?.recommendations?.map((rec: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{rec.product}</p>
                            <p className="text-sm text-gray-600">{rec.action}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {rec.quantity > 0 ? '+' : ''}{rec.quantity} units
                            </p>
                            <p className="text-xs text-gray-600">By {rec.by}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Stockout Risk Analysis</h4>
                    <div className="space-y-2">
                      {forecastData?.inventory?.stockoutRisk?.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium">{item.product}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  item.risk === 'high' ? 'bg-red-600' :
                                  item.risk === 'medium' ? 'bg-yellow-600' :
                                  'bg-green-600'
                                }`}
                                style={{ width: `${item.probability * 100}%` }}
                              />
                            </div>
                            <Badge variant={
                              item.risk === 'high' ? 'destructive' :
                              item.risk === 'medium' ? 'default' :
                              'secondary'
                            }>
                              {item.risk}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Forecasted Turnover Rate</p>
                        <p className="text-sm text-gray-600 mt-1">Next quarter projection</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{forecastData?.inventory?.turnoverForecast}x</p>
                        <p className="text-sm text-green-600">+0.6 from current</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scenarios">
            <Card>
              <CardHeader>
                <CardTitle>Scenario Analysis</CardTitle>
                <CardDescription>Multiple forecast scenarios based on different assumptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {forecastData?.scenarios?.map((scenario: any, index: number) => (
                    <div key={index} className={`p-4 border rounded-lg ${
                      scenario.name === 'Most Likely' ? 'border-blue-300 bg-blue-50' : ''
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{scenario.name}</h4>
                          <p className="text-sm text-gray-600">Probability: {(scenario.probability * 100).toFixed(0)}%</p>
                        </div>
                        <Badge variant={
                          scenario.name === 'Best Case' ? 'default' :
                          scenario.name === 'Worst Case' ? 'destructive' :
                          'secondary'
                        }>
                          {scenario.growth > 0 ? '+' : ''}{scenario.growth}% growth
                        </Badge>
                      </div>
                      <div className="mb-3">
                        <p className="text-2xl font-bold">{formatCurrency(scenario.revenue)}</p>
                        <p className="text-sm text-gray-600">Projected monthly revenue</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Key Assumptions:</p>
                        <ul className="space-y-1">
                          {scenario.assumptions.map((assumption: string, i: number) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5" />
                              {assumption}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seasonal">
            <Card>
              <CardHeader>
                <CardTitle>Seasonal Adjustments</CardTitle>
                <CardDescription>Historical patterns and seasonal factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { quarter: 'Q1', index: 0.85, trend: 'Low season' },
                      { quarter: 'Q2', index: 1.05, trend: 'Growing' },
                      { quarter: 'Q3', index: 0.95, trend: 'Stable' },
                      { quarter: 'Q4', index: 1.15, trend: 'Peak season' }
                    ].map((season, index) => (
                      <div key={index} className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold">{season.quarter}</p>
                        <p className="text-lg font-semibold mt-2">{season.index}x</p>
                        <p className="text-sm text-gray-600">{season.trend}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium mb-2">Seasonal Insights</h4>
                    <ul className="space-y-2">
                      <li className="text-sm flex items-start gap-2">
                        <Activity className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <span>Q4 typically generates 33% of annual revenue</span>
                      </li>
                      <li className="text-sm flex items-start gap-2">
                        <Activity className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <span>Spring pre-orders drive 25% increase in Q1</span>
                      </li>
                      <li className="text-sm flex items-start gap-2">
                        <Activity className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <span>Summer clearance impacts Q3 margins by -5%</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}