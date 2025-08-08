'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Search,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Send,
  TrendingUp,
  DollarSign,
  Target,
  AlertTriangle
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Quote, QuoteStatus, QuoteSummary } from '@/types/quote-types'

export default function RepQuotesPage() {
  const router = useRouter()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [expiringQuotes, setExpiringQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all')
  const [summary, setSummary] = useState<QuoteSummary | null>(null)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    fetchQuotes()
    fetchExpiringQuotes()
  }, [statusFilter])

  const fetchQuotes = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }
      if (searchQuery) {
        params.append('search', searchQuery)
      }

      const response = await fetch(`/api/quotes?${params}`)
      if (!response.ok) throw new Error('Failed to fetch quotes')
      
      const data = await response.json()
      setQuotes(data.quotes)
      setSummary(data.summary)
    } catch (error) {
      console.error('Error fetching quotes:', error)
      toast.error('Failed to load quotes')
    } finally {
      setLoading(false)
    }
  }

  const fetchExpiringQuotes = async () => {
    try {
      const response = await fetch('/api/quotes/expiring')
      if (response.ok) {
        const data = await response.json()
        setExpiringQuotes(data.quotes)
      }
    } catch (error) {
      console.error('Error fetching expiring quotes:', error)
    }
  }

  const getStatusIcon = (status: QuoteStatus) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4" />
      case 'sent':
      case 'viewed':
        return <Clock className="h-4 w-4" />
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      case 'expired':
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusBadgeVariant = (status: QuoteStatus) => {
    switch (status) {
      case 'draft':
        return 'secondary'
      case 'sent':
        return 'default'
      case 'viewed':
        return 'outline'
      case 'accepted':
        return 'success'
      case 'rejected':
        return 'destructive'
      case 'expired':
        return 'warning'
      default:
        return 'default'
    }
  }

  const handleSearch = () => {
    fetchQuotes()
  }

  const sendReminder = async (quoteId: string) => {
    try {
      // In a real app, this would send an email reminder
      toast.success('Reminder sent to customer')
    } catch (error) {
      toast.error('Failed to send reminder')
    }
  }

  const filteredQuotes = activeTab === 'all' 
    ? quotes 
    : activeTab === 'drafts'
    ? quotes.filter(q => q.status === 'draft')
    : activeTab === 'pending'
    ? quotes.filter(q => q.status === 'sent' || q.status === 'viewed')
    : activeTab === 'expiring'
    ? expiringQuotes
    : quotes

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Quotes</h1>
          <p className="text-gray-600 mt-2">
            Manage and track your customer quotes
          </p>
        </div>
        <Button onClick={() => router.push('/rep/quotes/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Create Quote
        </Button>
      </div>

      {/* Metrics Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-5 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Open Quotes</CardDescription>
              <CardTitle className="text-2xl">
                {summary.sentQuotes + summary.draftQuotes}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Quote Value</CardDescription>
              <CardTitle className="text-2xl">
                ${(summary.totalValue / 1000).toFixed(0)}k
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Conversion Rate</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                {summary.conversionRate.toFixed(0)}%
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Avg. Quote Value</CardDescription>
              <CardTitle className="text-2xl">
                ${(summary.averageQuoteValue / 1000).toFixed(1)}k
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Expiring Soon</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                {expiringQuotes.length}
                {expiringQuotes.length > 0 && (
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                )}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Search by quote number, company, or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="viewed">Viewed</SelectItem>
                <SelectItem value="revised">Revised</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Table with Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-6 pt-6">
              <TabsList>
                <TabsTrigger value="all">
                  All Quotes ({quotes.length})
                </TabsTrigger>
                <TabsTrigger value="drafts">
                  Drafts ({quotes.filter(q => q.status === 'draft').length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({quotes.filter(q => q.status === 'sent' || q.status === 'viewed').length})
                </TabsTrigger>
                <TabsTrigger value="expiring">
                  Expiring Soon ({expiringQuotes.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="m-0">
              {loading ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">Loading quotes...</p>
                </div>
              ) : filteredQuotes.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500 mb-4">
                    {activeTab === 'expiring' 
                      ? 'No quotes expiring soon'
                      : 'No quotes found'}
                  </p>
                  {activeTab === 'all' && (
                    <Button onClick={() => router.push('/rep/quotes/new')}>
                      Create Your First Quote
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quote Number</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuotes.map((quote) => {
                      const isExpiringSoon = expiringQuotes.some(eq => eq.id === quote.id)
                      return (
                        <TableRow key={quote.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {quote.number}
                              {quote.type === 'rfq' && (
                                <Badge variant="outline" className="text-xs">
                                  RFQ
                                </Badge>
                              )}
                              {isExpiringSoon && (
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{quote.companyName}</TableCell>
                          <TableCell>
                            {format(new Date(quote.createdAt), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>{quote.items.length} items</TableCell>
                          <TableCell className="font-medium">
                            ${quote.pricing.total.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {format(new Date(quote.terms.validUntil), 'MMM d')}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(quote.status) as any}>
                              {getStatusIcon(quote.status)}
                              <span className="ml-1 capitalize">{quote.status}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/rep/quotes/${quote.id}`)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {(quote.status === 'draft' || quote.status === 'sent' || quote.status === 'viewed') && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/rep/quotes/${quote.id}/edit`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              {(quote.status === 'sent' || quote.status === 'viewed') && isExpiringSoon && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => sendReminder(quote.id)}
                                  title="Send reminder"
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      {expiringQuotes.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Action Required
            </CardTitle>
            <CardDescription>
              These quotes need your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiringQuotes.slice(0, 3).map(quote => (
                <div
                  key={quote.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{quote.companyName}</p>
                    <p className="text-sm text-gray-500">
                      {quote.number} - Expires {format(new Date(quote.terms.validUntil), 'MMM d')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => sendReminder(quote.id)}
                    >
                      Send Reminder
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => router.push(`/rep/quotes/${quote.id}/edit`)}
                    >
                      Extend Validity
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}