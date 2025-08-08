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
import { Plus, Search, FileText, Clock, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Quote, QuoteStatus } from '@/types/quote-types'

export default function RetailerQuotesPage() {
  const router = useRouter()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'all'>('all')
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    fetchQuotes()
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Quotes</h1>
          <p className="text-gray-600 mt-2">
            View and manage your quote requests
          </p>
        </div>
        <Button onClick={() => router.push('/retailer/quotes/request')}>
          <Plus className="mr-2 h-4 w-4" />
          Request Quote
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Quotes</CardDescription>
              <CardTitle className="text-2xl">{summary.totalQuotes}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending Response</CardDescription>
              <CardTitle className="text-2xl">
                {summary.sentQuotes + (summary.viewedQuotes || 0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Accepted</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {summary.acceptedQuotes}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Value</CardDescription>
              <CardTitle className="text-2xl">
                ${summary.totalValue?.toLocaleString() || 0}
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
                  placeholder="Search quotes..."
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
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading quotes...</p>
            </div>
          ) : quotes.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No quotes found</p>
              <Button onClick={() => router.push('/retailer/quotes/request')}>
                Request Your First Quote
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote Number</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">
                      {quote.number}
                      {quote.type === 'rfq' && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          RFQ
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {format(new Date(quote.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{quote.items.length} items</TableCell>
                    <TableCell className="font-medium">
                      ${quote.pricing.total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {format(new Date(quote.terms.validUntil), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(quote.status) as any}>
                        {getStatusIcon(quote.status)}
                        <span className="ml-1 capitalize">{quote.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/retailer/quotes/${quote.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}