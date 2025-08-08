'use client'

import { useState, useEffect } from 'react'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Target,
  Users,
  ShoppingCart,
  DollarSign,
  Activity,
  Zap,
  Award,
  ChevronRight
} from 'lucide-react'
import { useAuth } from '@/lib/contexts/auth-context'
import { formatCurrency } from '@/lib/mock-data'
import Link from 'next/link'

export default function RepInsightsPage() {
  const { user } = useAuth()
  const [insights, setInsights] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching AI-powered insights
    setTimeout(() => {
      setInsights({
        recommendations: [
          {
            id: '1',
            type: 'opportunity',
            priority: 'high',
            title: 'Cross-sell opportunity with Outdoor Retailers Co.',
            description: 'Based on purchase history, they are likely to be interested in the new hiking boot collection.',
            action: 'Send catalog',
            value: 45000,
            confidence: 0.85
          },
          {
            id: '2',
            type: 'retention',
            priority: 'high',
            title: 'Mountain Gear Shop at risk of churn',
            description: 'No orders in 45 days. Previously ordered monthly.',
            action: 'Schedule call',
            value: 25000,
            confidence: 0.72
          },
          {
            id: '3',
            type: 'upsell',
            priority: 'medium',
            title: 'Adventure Sports Inc. eligible for tier upgrade',
            description: '$5,000 away from Gold tier. Consider offering incentive.',
            action: 'Propose deal',
            value: 15000,
            confidence: 0.68
          }
        ],
        bestPractices: [
          {
            id: '1',
            category: 'Timing',
            insight: 'Your conversion rate is 40% higher when contacting customers on Tuesday mornings',
            benchmark: 'Top performers: Tuesday-Thursday, 9-11 AM'
          },
          {
            id: '2',
            category: 'Product Mix',
            insight: 'Customers who buy apparel + footwear have 60% higher LTV',
            benchmark: 'Your mix: 30% bundled. Top performers: 45%'
          },
          {
            id: '3',
            category: 'Follow-up',
            insight: 'Following up within 24 hours increases close rate by 35%',
            benchmark: 'Your avg: 48 hours. Top performers: 18 hours'
          }
        ],
        atRiskCustomers: [
          { name: 'Trail Blazers Outfitters', lastOrder: '60 days ago', riskLevel: 'high', avgOrderValue: 35000 },
          { name: 'Summit Supplies', lastOrder: '45 days ago', riskLevel: 'medium', avgOrderValue: 28000 },
          { name: 'Canyon Adventures', lastOrder: '35 days ago', riskLevel: 'low', avgOrderValue: 18000 }
        ],
        performanceInsights: {
          strengths: [
            'Excellent customer retention (85% vs 75% avg)',
            'High average deal size ($35K vs $25K avg)',
            'Strong product knowledge scores'
          ],
          improvements: [
            'Increase prospecting activities by 20%',
            'Reduce quote turnaround time to <24 hours',
            'Focus on multi-product deals'
          ]
        }
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Generating insights...</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Insights</h1>
          <p className="text-gray-600 mt-2">AI-powered recommendations to boost your performance</p>
        </div>

        {/* Key Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-yellow-600" />
            <h2 className="text-lg font-semibold">Recommended Actions</h2>
            <Badge variant="outline" className="ml-2">AI-Powered</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights?.recommendations.map((rec: any) => (
              <Card key={rec.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {rec.type === 'opportunity' && <ShoppingCart className="h-5 w-5 text-green-600" />}
                      {rec.type === 'retention' && <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                      {rec.type === 'upsell' && <TrendingUp className="h-5 w-5 text-blue-600" />}
                      <Badge 
                        variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">{(rec.confidence * 100).toFixed(0)}% confidence</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-medium mb-1">{rec.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-600">
                      +{formatCurrency(rec.value)} potential
                    </span>
                    <Button size="sm" variant="outline">
                      {rec.action}
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* At-Risk Customers Alert */}
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-yellow-900">Customer Retention Alert</p>
                <p className="text-sm text-yellow-800 mt-1">
                  {insights?.atRiskCustomers.length} customers showing signs of churn
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/rep/customers?filter=at-risk">
                  View All
                </Link>
              </Button>
            </div>
            <div className="mt-3 space-y-2">
              {insights?.atRiskCustomers.slice(0, 2).map((customer: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-yellow-200">
                  <div>
                    <p className="text-sm font-medium">{customer.name}</p>
                    <p className="text-xs text-gray-600">Last order: {customer.lastOrder}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        customer.riskLevel === 'high' ? 'border-red-500 text-red-700' : 
                        customer.riskLevel === 'medium' ? 'border-yellow-500 text-yellow-700' : 
                        'border-gray-500 text-gray-700'
                      }`}
                    >
                      {customer.riskLevel} risk
                    </Badge>
                    <p className="text-xs text-gray-600 mt-1">AOV: {formatCurrency(customer.avgOrderValue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>

        {/* Best Practices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Best Practices & Benchmarks
            </CardTitle>
            <CardDescription>Learn from top performers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights?.bestPractices.map((practice: any) => (
                <div key={practice.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="outline">{practice.category}</Badge>
                    <Activity className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium mb-1">{practice.insight}</p>
                  <p className="text-xs text-gray-600">{practice.benchmark}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Your Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {insights?.performanceInsights.strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5" />
                    <span className="text-sm">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {insights?.performanceInsights.improvements.map((improvement: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
                    <span className="text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/rep/customers">
              <Users className="h-4 w-4 mr-2" />
              Manage Customers
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/rep/analytics">
              View Full Analytics
            </Link>
          </Button>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}