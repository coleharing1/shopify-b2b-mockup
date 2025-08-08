'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ShoppingCart, AlertCircle, CheckCircle, Package, CreditCard, Truck, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { Quote } from '@/types/quote-types'
import { useRouter } from 'next/navigation'

interface QuoteToOrderProps {
  quote: Quote
  onSuccess?: (orderId: string, orderNumber: string) => void
  onCancel?: () => void
}

export function QuoteToOrder({ quote, onSuccess, onCancel }: QuoteToOrderProps) {
  const router = useRouter()
  const [converting, setConverting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [conversionResult, setConversionResult] = useState<{
    orderId: string
    orderNumber: string
  } | null>(null)

  const handleConvert = async () => {
    setConverting(true)
    try {
      // First, ensure the quote is accepted
      if (quote.status !== 'accepted') {
        const acceptResponse = await fetch(`/api/quotes/${quote.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'accept' })
        })
        
        if (!acceptResponse.ok) {
          throw new Error('Failed to accept quote')
        }
      }

      // Convert to order
      const response = await fetch(`/api/quotes/${quote.id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      if (!response.ok) {
        throw new Error('Failed to convert quote to order')
      }

      const result = await response.json()
      setConversionResult(result)
      
      toast.success(`Order ${result.orderNumber} created successfully!`)
      
      if (onSuccess) {
        onSuccess(result.orderId, result.orderNumber)
      }
      
      // Redirect to order after a short delay
      setTimeout(() => {
        router.push('/retailer/orders')
      }, 2000)
    } catch (error) {
      console.error('Error converting quote to order:', error)
      toast.error('Failed to convert quote to order')
    } finally {
      setConverting(false)
      setShowConfirmDialog(false)
    }
  }

  const canConvert = quote.status === 'accepted' || quote.status === 'sent' || quote.status === 'viewed'
  const isExpired = new Date(quote.terms.validUntil) < new Date()

  if (!canConvert || isExpired) {
    return null
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Convert to Order
          </CardTitle>
          <CardDescription>
            Accept this quote and create an order with locked pricing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Quote Details</AlertTitle>
            <AlertDescription>
              This quote contains {quote.items.length} items totaling ${quote.pricing.total.toLocaleString()}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Products</span>
              </div>
              <span className="font-medium">{quote.items.length} items</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Payment Terms</span>
              </div>
              <Badge variant="outline">
                {quote.terms.paymentTerms.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Shipping Terms</span>
              </div>
              <Badge variant="outline">
                {quote.terms.shippingTerms.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>

            {quote.terms.deliveryDate && (
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Requested Delivery</span>
                </div>
                <span className="font-medium">
                  {new Date(quote.terms.deliveryDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <Separator />

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold">Total Amount</span>
              <span className="text-2xl font-bold text-green-600">
                ${quote.pricing.total.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              This price will be locked in when you convert to an order
            </p>
          </div>

          <Button 
            className="w-full" 
            size="lg"
            onClick={() => setShowConfirmDialog(true)}
            disabled={converting}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {quote.status === 'accepted' ? 'Convert to Order' : 'Accept & Convert to Order'}
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Order Creation</DialogTitle>
            <DialogDescription>
              You are about to convert quote {quote.number} into an order.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>What happens next?</AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>An order will be created with the quoted prices</li>
                  <li>The pricing will be locked and won't change</li>
                  <li>You'll receive an order confirmation</li>
                  <li>The quote will be marked as converted</li>
                </ul>
              </AlertDescription>
            </Alert>

            {quote.referenceNumber && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Reference Number:</strong> {quote.referenceNumber}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  This will be attached to your order
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmDialog(false)}
              disabled={converting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConvert}
              disabled={converting}
            >
              {converting ? 'Creating Order...' : 'Confirm & Create Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Result */}
      {conversionResult && (
        <Dialog open={!!conversionResult} onOpenChange={() => setConversionResult(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Order Created Successfully!
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="font-semibold text-green-800">
                  Order Number: {conversionResult.orderNumber}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Your order has been created and is being processed.
                </p>
              </div>
              <p className="text-sm text-gray-600">
                You will be redirected to your orders page shortly...
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => router.push('/retailer/orders')}>
                View Orders
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}