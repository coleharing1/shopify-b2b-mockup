'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Plus, Minus, Save, Send, X, Percent, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Quote } from '@/types/quote-types'

export default function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [items, setItems] = useState<any[]>([])
  const [notes, setNotes] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [showRevisionDialog, setShowRevisionDialog] = useState(false)
  const [revisionNotes, setRevisionNotes] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { id } = await params
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
      setItems(data.items.map((item: any) => ({ ...item })))
      setNotes(data.terms.notes || '')
      setInternalNotes(data.terms.internalNotes || '')
    } catch (error) {
      console.error('Error fetching quote:', error)
      toast.error('Failed to load quote')
      router.push('/rep/quotes')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return
    setItems(items.map(item => {
      if (item.id !== itemId) return item
      return {
        ...item,
        quantity,
        total: item.unitPrice * quantity
      }
    }))
  }

  const updateDiscount = (itemId: string, discount: number) => {
    setItems(items.map(item => {
      if (item.id !== itemId) return item
      const newUnitPrice = item.originalPrice * (1 - discount / 100)
      return {
        ...item,
        discount,
        unitPrice: newUnitPrice,
        total: newUnitPrice * item.quantity
      }
    }))
  }

  const updateDiscountReason = (itemId: string, reason: string) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, discountReason: reason } : item
    ))
  }

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId))
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0)
    const discountedTotal = items.reduce((sum, item) => sum + item.total, 0)
    const discount = subtotal - discountedTotal
    const taxRate = 9
    const tax = discountedTotal * (taxRate / 100)
    const shipping = discountedTotal > 500 ? 0 : 50
    const total = discountedTotal + tax + shipping

    return {
      subtotal,
      discount,
      discountPercentage: subtotal > 0 ? (discount / subtotal) * 100 : 0,
      tax,
      taxRate,
      shipping,
      total,
      currency: 'USD'
    }
  }

  const saveChanges = async (sendToCustomer: boolean = false) => {
    if (!quote) return

    if (items.length === 0) {
      toast.error('Quote must have at least one item')
      return
    }

    setSaving(true)
    try {
      const pricing = calculateTotals()
      const isRevision = quote.status !== 'draft'

      if (isRevision && !revisionNotes) {
        setShowRevisionDialog(true)
        setSaving(false)
        return
      }

      const idVal = (await params).id
      const response = await fetch(`/api/quotes/${idVal}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          revision: isRevision ? {
            items,
            pricing,
            terms: {
              ...quote.terms,
              notes,
              internalNotes
            }
          } : undefined,
          status: sendToCustomer ? 'sent' : undefined,
          details: revisionNotes || undefined
        })
      })

      if (!response.ok) throw new Error('Failed to save quote')
      
      toast.success(
        sendToCustomer ? 'Quote sent to customer!' : 
        isRevision ? 'Revision created successfully' : 
        'Quote saved successfully'
      )
      
      router.push(`/rep/quotes/${idVal}`)
    } catch (error) {
      console.error('Error saving quote:', error)
      toast.error('Failed to save quote')
    } finally {
      setSaving(false)
    }
  }

  const confirmRevision = () => {
    setShowRevisionDialog(false)
    saveChanges()
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

  const totals = calculateTotals()
  const isDraft = quote.status === 'draft'
  const canEdit = isDraft || quote.status === 'sent' || quote.status === 'viewed'

  if (!canEdit) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              <p>
                This quote cannot be edited. Status: <Badge>{quote.status}</Badge>
              </p>
            </div>
            <Button
              className="mt-4"
              onClick={async () => router.push(`/rep/quotes/${(await params).id}`)}
            >
              View Quote
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            {isDraft ? 'Edit Draft Quote' : 'Create Quote Revision'}
          </h1>
          <p className="text-gray-600 mt-2">
            {quote.number} - {quote.companyName}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
              onClick={async () => router.push(`/rep/quotes/${(await params).id}`)}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => saveChanges(false)}
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
          <Button
            onClick={() => saveChanges(true)}
            disabled={saving}
          >
            <Send className="mr-2 h-4 w-4" />
            Send to Customer
          </Button>
        </div>
      </div>

      {!isDraft && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-5 w-5" />
              <p>
                You are creating a revision of this quote. The customer will be notified of the changes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Line Items */}
          <Card>
            <CardHeader>
              <CardTitle>Quote Items</CardTitle>
              <CardDescription>
                Adjust quantities and pricing for each item
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>List Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                          {item.discountReason && (
                            <Input
                              placeholder="Discount reason"
                              value={item.discountReason}
                              onChange={(e) => updateDiscountReason(item.id, e.target.value)}
                              className="mt-1 text-xs"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>${item.originalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            value={item.discount}
                            onChange={(e) => updateDiscount(item.id, parseFloat(e.target.value) || 0)}
                            className="w-16"
                            min="0"
                            max="100"
                          />
                          <Percent className="h-4 w-4 text-gray-500" />
                        </div>
                      </TableCell>
                      <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="font-medium">
                        ${item.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notes">Customer Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Notes visible to customer..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="internal">Internal Notes</Label>
                <Textarea
                  id="internal"
                  placeholder="Internal notes (not visible to customer)..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge variant={quote.status === 'draft' ? 'secondary' : 'default'}>
                  {quote.status.toUpperCase()}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-medium">{quote.companyName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Items</p>
                <p className="font-medium">{items.length} products</p>
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${totals.subtotal.toFixed(2)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${totals.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Tax ({totals.taxRate}%)</span>
                  <span>${totals.tax.toFixed(2)}</span>
                </div>
                {totals.shipping > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${totals.shipping.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>${totals.total.toFixed(2)}</span>
                </div>
              </div>

              {!isDraft && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Version</p>
                  <Badge variant="outline">
                    Version {quote.currentVersion + 1} (Revision)
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Revision Dialog */}
      <AlertDialog open={showRevisionDialog} onOpenChange={setShowRevisionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Quote Revision</AlertDialogTitle>
            <AlertDialogDescription>
              Please describe the changes you're making to this quote.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Describe the changes (e.g., Updated pricing, Added new products, etc.)"
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRevision}>
              Create Revision
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}