'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Plus, Minus, Search, ShoppingCart, Send } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/contexts/auth-context'
import { type Product } from '@/lib/mock-data'

interface QuoteLineItem {
  productId: string
  productName: string
  sku: string
  quantity: number
  variant?: {
    size?: string
    color?: string
  }
  notes?: string
}

export default function RequestQuotePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [selectedItems, setSelectedItems] = useState<QuoteLineItem[]>([])
  const [notes, setNotes] = useState('')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const searchProducts = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) throw new Error('Search failed')
      const data = await response.json()
      setSearchResults(data.products || [])
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Failed to search products')
    } finally {
      setIsSearching(false)
    }
  }

  const addProduct = (product: Product) => {
    const existing = selectedItems.find(item => item.productId === product.id)
    if (existing) {
      toast.info('Product already added to quote')
      return
    }

    setSelectedItems([...selectedItems, {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: 1,
      variant: product.variants?.[0]
    }])
    toast.success('Product added to quote')
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setSelectedItems(items =>
      items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const removeItem = (productId: string) => {
    setSelectedItems(items => items.filter(item => item.productId !== productId))
    toast.info('Product removed from quote')
  }

  const updateItemNotes = (productId: string, notes: string) => {
    setSelectedItems(items =>
      items.map(item =>
        item.productId === productId ? { ...item, notes } : item
      )
    )
  }

  const submitQuoteRequest = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please add at least one product to the quote')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: user?.companyId,
          type: 'rfq',
          orderType: 'at-once',
          items: selectedItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            variant: item.variant,
            notes: item.notes
          })),
          notes,
          referenceNumber,
          requestedDeliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
          sendImmediately: true
        })
      })

      if (!response.ok) throw new Error('Failed to submit quote request')
      
      const quote = await response.json()
      toast.success('Quote request submitted successfully!')
      router.push(`/retailer/quotes/${quote.id}`)
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Failed to submit quote request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Request a Quote</h1>
        <p className="text-gray-600 mt-2">
          Build your quote request by searching and adding products below
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Product Search */}
          <Card>
            <CardHeader>
              <CardTitle>Search Products</CardTitle>
              <CardDescription>
                Find and add products to your quote request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Search by name, SKU, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchProducts()}
                />
                <Button onClick={searchProducts} disabled={isSearching}>
                  <Search className="h-4 w-4" />
                  {isSearching ? 'Searching...' : 'Search'}
                </Button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {searchResults.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addProduct(product)}
                        disabled={selectedItems.some(item => item.productId === product.id)}
                      >
                        <Plus className="h-4 w-4" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Selected Products */}
          <Card>
            <CardHeader>
              <CardTitle>Selected Products</CardTitle>
              <CardDescription>
                {selectedItems.length} product{selectedItems.length !== 1 ? 's' : ''} in your quote request
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedItems.length === 0 ? (
                <p className="text-center py-8 text-gray-500">
                  No products added yet. Search and add products above.
                </p>
              ) : (
                <div className="space-y-4">
                  {selectedItems.map(item => (
                    <div key={item.productId} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium">{item.productName}</p>
                          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.productId)}
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <Label htmlFor={`qty-${item.productId}`}>Quantity</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              id={`qty-${item.productId}`}
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                              className="w-20 text-center"
                              min="1"
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor={`notes-${item.productId}`}>Notes (optional)</Label>
                          <Input
                            id={`notes-${item.productId}`}
                            placeholder="Special requirements..."
                            value={item.notes || ''}
                            onChange={(e) => updateItemNotes(item.productId, e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quote Details */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Quote Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="reference">Reference Number (optional)</Label>
                <Input
                  id="reference"
                  placeholder="Your PO or reference number"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="delivery">Requested Delivery Date</Label>
                <Input
                  id="delivery"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special requirements or questions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Products:</span>
                  <span className="font-medium">{selectedItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Units:</span>
                  <span className="font-medium">
                    {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={submitQuoteRequest}
                disabled={isSubmitting || selectedItems.length === 0}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}