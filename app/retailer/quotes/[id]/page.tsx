'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  CheckCircle,
  XCircle,
  Download,
  ShoppingCart,
  Clock,
  Calendar,
  Package,
  Truck,
  CreditCard,
  FileText,
  AlertCircle,
  MessageSquare
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Quote } from '@/types/quote-types'
import { QuoteToOrder } from '@/components/features/quote-to-order'
import { downloadQuotePDF } from '@/components/features/quote-pdf'

export default function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [revisionNotes, setRevisionNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRevisionForm, setShowRevisionForm] = useState(false)
  const [showRejectionForm, setShowRejectionForm] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const id = (await params).id
      if (!mounted) return
      fetchQuote(id)
    })()
    return () => {
      mounted = false
    }
  }, [params])

  const fetchQuote = async (id: string) => {
    try {
      const response = await fetch(`/api/quotes/${id}`)
      if (!response.ok) throw new Error('Failed to fetch quote')
      const data = await response.json()
      setQuote(data)
    } catch (error) {
      console.error('Error fetching quote:', error)
      toast.error('Failed to load quote')
      router.push('/retailer/quotes')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    setActionLoading(true)
    try {
      const id = (await params).id
      const response = await fetch(`/api/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' })
      })
      if (!response.ok) throw new Error('Failed to accept quote')
      
      toast.success('Quote accepted successfully!')
      fetchQuote(id)
      
      // Optionally convert to order immediately
      const convertResponse = await fetch(`/api/quotes/${id}/convert`, {
        method: 'POST'
      })
      if (convertResponse.ok) {
        const result = await convertResponse.json()
        toast.success(`Order ${result.orderNumber} created!`)
        setTimeout(() => {
          router.push('/retailer/orders')
        }, 2000)
      }
    } catch (error) {
      console.error('Error accepting quote:', error)
      toast.error('Failed to accept quote')
    } finally {
      setActionLoading(false)
    }
  }

  const handleRequestRevision = async () => {
    if (!revisionNotes.trim()) {
      toast.error('Please provide revision details')
      return
    }

    setActionLoading(true)
    try {
      const id = (await params).id
      const response = await fetch(`/api/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request-revision',
          revisionNotes
        })
      })
      if (!response.ok) throw new Error('Failed to request revision')
      
      toast.success('Revision request sent')
      setShowRevisionForm(false)
      setRevisionNotes('')
      fetchQuote(id)
    } catch (error) {
      console.error('Error requesting revision:', error)
      toast.error('Failed to request revision')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection')
      return
    }

    setActionLoading(true)
    try {
      const id = (await params).id
      const response = await fetch(`/api/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          reason: rejectionReason
        })
      })
      if (!response.ok) throw new Error('Failed to reject quote')
      
      toast.success('Quote rejected')
      setShowRejectionForm(false)
      setRejectionReason('')
      fetchQuote((await params).id)
    } catch (error) {
      console.error('Error rejecting quote:', error)
      toast.error('Failed to reject quote')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-gray-500">Loading quote...</p>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-gray-500">Quote not found</p>
      </div>
    )
  }

  const canTakeAction = quote.status === 'sent' || quote.status === 'viewed' || quote.status === 'revised'
  const isExpired = new Date(quote.terms.validUntil) < new Date()

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{quote.number}</h1>
            <Badge variant={quote.status === 'accepted' ? 'default' : 'default'} className={quote.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}>
              {quote.status.toUpperCase()}
            </Badge>
            {quote.type === 'rfq' && (
              <Badge variant="outline">RFQ</Badge>
            )}
          </div>
          <p className="text-gray-600">
            Created on {format(new Date(quote.createdAt), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => downloadQuotePDF(quote)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          {canTakeAction && !isExpired && (
            <>
              <Button
                variant="default"
                onClick={handleAccept}
                disabled={actionLoading}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Accept Quote
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRevisionForm(true)}
                disabled={actionLoading}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Request Changes
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowRejectionForm(true)}
                disabled={actionLoading}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Expiration Warning */}
      {isExpired && quote.status !== 'accepted' && quote.status !== 'rejected' && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              <p>
                This quote expired on {format(new Date(quote.terms.validUntil), 'MMMM d, yyyy')}.
                Please request a new quote if you're still interested.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revision Form */}
      {showRevisionForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Request Revision</CardTitle>
            <CardDescription>
              Describe the changes you'd like to see in this quote
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Please specify what changes you need..."
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              rows={4}
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button onClick={handleRequestRevision} disabled={actionLoading}>
                Send Revision Request
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRevisionForm(false)
                  setRevisionNotes('')
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rejection Form */}
      {showRejectionForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Reject Quote</CardTitle>
            <CardDescription>
              Please provide a reason for rejecting this quote
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              className="mb-4"
            />
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={actionLoading}
              >
                Confirm Rejection
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectionForm(false)
                  setRejectionReason('')
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quote to Order Conversion */}
      {(quote.status === 'sent' || quote.status === 'viewed' || quote.status === 'accepted') && !isExpired && (
        <div className="mb-6">
          <QuoteToOrder 
            quote={quote}
            onSuccess={(orderId, orderNumber) => {
              toast.success(`Order ${orderNumber} created successfully!`)
              router.push('/retailer/orders')
            }}
          />
        </div>
      )}

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          {quote.versions.length > 0 && (
            <TabsTrigger value="versions">Versions</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Quote Information */}
            <Card>
              <CardHeader>
                <CardTitle>Quote Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Quote Number:</span>
                  <span className="font-medium">{quote.number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Valid Until:</span>
                  <span className="font-medium">
                    {format(new Date(quote.terms.validUntil), 'MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Order Type:</span>
                  <span className="font-medium capitalize">{quote.orderType || 'Standard'}</span>
                </div>
                {quote.referenceNumber && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Reference:</span>
                    <span className="font-medium">{quote.referenceNumber}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Terms */}
            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Payment Terms:</span>
                  <span className="font-medium uppercase">
                    {quote.terms.paymentTerms.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Shipping Terms:</span>
                  <span className="font-medium uppercase">
                    {quote.terms.shippingTerms.replace('-', ' ')}
                  </span>
                </div>
                {quote.terms.deliveryDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Delivery Date:</span>
                    <span className="font-medium">
                      {format(new Date(quote.terms.deliveryDate), 'MMMM d, yyyy')}
                    </span>
                  </div>
                )}
                {quote.terms.notes && (
                  <div className="pt-2">
                    <p className="text-sm text-gray-600 mb-1">Notes:</p>
                    <p className="text-sm">{quote.terms.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pricing Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${quote.pricing.subtotal.toLocaleString()}</span>
                </div>
                {quote.pricing.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({quote.pricing.discountPercentage.toFixed(0)}%)</span>
                    <span>-${quote.pricing.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Tax ({quote.pricing.taxRate}%)</span>
                  <span>${quote.pricing.tax.toLocaleString()}</span>
                </div>
                {quote.pricing.shipping > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${quote.pricing.shipping.toLocaleString()}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${quote.pricing.total.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>Quote Items</CardTitle>
              <CardDescription>
                {quote.items.length} product{quote.items.length !== 1 ? 's' : ''} in this quote
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quote.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          {item.variant && (
                            <p className="text-sm text-gray-500">
                              {item.variant.size && `Size: ${item.variant.size}`}
                              {item.variant.color && `, Color: ${item.variant.color}`}
                            </p>
                          )}
                          {item.notes && (
                            <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        {item.discount > 0 && (
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            {item.discount}%
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${item.total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Quote Timeline</CardTitle>
              <CardDescription>
                Complete history of this quote
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quote.timeline.map((event, index) => (
                  <div key={event.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      {index < quote.timeline.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-200" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium capitalize">{event.type}</p>
                        <span className="text-sm text-gray-500">
                          {format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {event.details || `Quote ${event.type} by ${event.userName}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {quote.versions.length > 0 && (
          <TabsContent value="versions">
            <Card>
              <CardHeader>
                <CardTitle>Version History</CardTitle>
                <CardDescription>
                  Track changes made to this quote
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quote.versions.map((version) => (
                    <div key={version.versionNumber} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">Version {version.versionNumber}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(version.createdAt), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                        <Badge variant="outline">
                          ${version.pricing.total.toLocaleString()}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p className="font-medium mb-1">Changes:</p>
                        <ul className="list-disc list-inside">
                          {version.changes.map((change, idx) => (
                            <li key={idx}>{change}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}