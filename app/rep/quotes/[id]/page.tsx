'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Edit,
  Send,
  Download,
  Copy,
  MoreVertical,
  FileText,
  Calendar,
  Package,
  Truck,
  CreditCard,
  Building,
  User,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Quote } from '@/types/quote-types'

export default function RepQuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

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
      router.push('/rep/quotes')
    } finally {
      setLoading(false)
    }
  }

  const sendQuote = async () => {
    setActionLoading(true)
    try {
      const id = (await params).id
      const response = await fetch(`/api/quotes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send' })
      })
      if (!response.ok) throw new Error('Failed to send quote')
      
      toast.success('Quote sent to customer!')
      fetchQuote(id)
    } catch (error) {
      console.error('Error sending quote:', error)
      toast.error('Failed to send quote')
    } finally {
      setActionLoading(false)
    }
  }

  const duplicateQuote = async () => {
    try {
      // Create a new quote based on this one
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: quote?.companyId,
          contactId: quote?.contactId,
          type: 'proactive',
          orderType: quote?.orderType,
          items: quote?.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            variant: item.variant,
            notes: item.notes
          })),
          notes: quote?.terms.notes
        })
      })

      if (!response.ok) throw new Error('Failed to duplicate quote')
      const newQuote = await response.json()
      
      toast.success('Quote duplicated successfully!')
      router.push(`/rep/quotes/${newQuote.id}/edit`)
    } catch (error) {
      console.error('Error duplicating quote:', error)
      toast.error('Failed to duplicate quote')
    }
  }

  const saveAsTemplate = async () => {
    try {
      const response = await fetch('/api/quotes/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Template from ${quote?.number}`,
          description: `Based on quote for ${quote?.companyName}`,
          quoteId: quote?.id
        })
      })

      if (!response.ok) throw new Error('Failed to save template')
      
      toast.success('Quote saved as template!')
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save as template')
    }
  }

  const copyQuoteNumber = () => {
    if (quote) {
      navigator.clipboard.writeText(quote.number)
      toast.success('Quote number copied to clipboard')
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

  const getStatusIcon = (status: string) => {
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

  const canEdit = quote.status === 'draft' || quote.status === 'sent' || quote.status === 'viewed'
  const isExpired = new Date(quote.terms.validUntil) < new Date()

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{quote.number}</h1>
            <Badge variant={quote.status === 'accepted' ? 'default' : 'default'} className={quote.status === 'accepted' ? 'bg-green-100 text-green-800' : ''}>
              {getStatusIcon(quote.status)}
              <span className="ml-1">{quote.status.toUpperCase()}</span>
            </Badge>
            {quote.type === 'rfq' && (
              <Badge variant="outline">RFQ</Badge>
            )}
            {isExpired && quote.status !== 'accepted' && quote.status !== 'rejected' && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">EXPIRED</Badge>
            )}
          </div>
          <p className="text-gray-600">
            Created on {format(new Date(quote.createdAt), 'MMMM d, yyyy')}
            {quote.currentVersion > 1 && ` • Version ${quote.currentVersion}`}
          </p>
        </div>
        <div className="flex gap-2">
          {quote.status === 'draft' && (
            <Button onClick={sendQuote} disabled={actionLoading}>
              <Send className="mr-2 h-4 w-4" />
              Send to Customer
            </Button>
          )}
          {canEdit && (
            <Button
              variant="outline"
              onClick={async () => router.push(`/rep/quotes/${(await params).id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              {quote.status === 'draft' ? 'Edit' : 'Create Revision'}
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={copyQuoteNumber}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Quote Number
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={duplicateQuote}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate Quote
              </DropdownMenuItem>
              <DropdownMenuItem onClick={saveAsTemplate}>
                <Save className="mr-2 h-4 w-4" />
                Save as Template
              </DropdownMenuItem>
              {quote.status === 'sent' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Send className="mr-2 h-4 w-4" />
                    Send Reminder
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="timeline">Activity</TabsTrigger>
          {quote.versions.length > 0 && (
            <TabsTrigger value="versions">Versions</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{quote.companyName}</p>
                    <Badge variant="outline" className="mt-1">
                      {quote.orderType?.toUpperCase() || 'STANDARD'}
                    </Badge>
                  </div>
                </div>
                {quote.contactName && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <p className="text-sm">{quote.contactName}</p>
                  </div>
                )}
                {quote.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <p className="text-sm">{quote.contactEmail}</p>
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/rep/customers/${quote.companyId}`)}
                >
                  View Customer
                </Button>
              </CardContent>
            </Card>

            {/* Quote Information */}
            <Card>
              <CardHeader>
                <CardTitle>Quote Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Number:</span>
                  <span className="font-medium">{quote.number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Valid Until:</span>
                  <span className="font-medium">
                    {format(new Date(quote.terms.validUntil), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Products:</span>
                  <span className="font-medium">{quote.items.length} items</span>
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
                <CardTitle>Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Payment:</span>
                  <span className="font-medium uppercase">
                    {quote.terms.paymentTerms.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Shipping:</span>
                  <span className="font-medium uppercase">
                    {quote.terms.shippingTerms.replace('-', ' ')}
                  </span>
                </div>
                {quote.terms.deliveryDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Delivery:</span>
                    <span className="font-medium">
                      {format(new Date(quote.terms.deliveryDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {(quote.terms.notes || quote.terms.internalNotes) && (
            <div className="grid gap-6 md:grid-cols-2">
              {quote.terms.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{quote.terms.notes}</p>
                  </CardContent>
                </Card>
              )}
              {quote.terms.internalNotes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Internal Notes</CardTitle>
                    <CardDescription>Not visible to customer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{quote.terms.internalNotes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

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
                    <TableHead>List Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Unit Price</TableHead>
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
                          {item.discountReason && (
                            <p className="text-sm text-green-600 mt-1">
                              Discount reason: {item.discountReason}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.originalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                          {item.discount > 0 && (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                            {item.discount}%
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
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
              <CardTitle>Activity Timeline</CardTitle>
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
                  Track all revisions made to this quote
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
                        <div className="text-right">
                          <Badge variant="outline">
                            ${version.pricing.total.toLocaleString()}
                          </Badge>
                          {version.pricing.total !== quote.pricing.total && (
                            <p className="text-sm text-gray-500 mt-1">
                              {version.pricing.total < quote.pricing.total ? (
                                <span className="text-green-600">
                                  -${(quote.pricing.total - version.pricing.total).toFixed(2)}
                                </span>
                              ) : (
                                <span className="text-red-600">
                                  +${(version.pricing.total - quote.pricing.total).toFixed(2)}
                                </span>
                              )}
                            </p>
                          )}
                        </div>
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