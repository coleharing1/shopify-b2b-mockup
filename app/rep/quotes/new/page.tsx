'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Plus,
  Minus,
  Search,
  Save,
  Send,
  Building,
  Package,
  DollarSign,
  Calendar,
  FileText,
  Percent,
  X
} from 'lucide-react'
import { toast } from 'sonner'
import { MOCK_USERS } from '@/config/auth.config'
import { type Product } from '@/lib/mock-data'

interface QuoteLineItem {
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  originalPrice: number
  discount: number
  discountType: 'percentage' | 'fixed'
  discountReason?: string
  total: number
  variant?: {
    size?: string
    color?: string
  }
  notes?: string
}

interface QuoteTemplate {
  id: string
  name: string
  description?: string
  items: any[]
  terms: any
}

export default function NewQuotePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState('customer')
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedContact, setSelectedContact] = useState('')
  const [orderType, setOrderType] = useState<'at-once' | 'prebook' | 'closeout'>('at-once')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [selectedItems, setSelectedItems] = useState<QuoteLineItem[]>([])
  const [paymentTerms, setPaymentTerms] = useState('net-30')
  const [shippingTerms, setShippingTerms] = useState('fob-destination')
  const [validDays, setValidDays] = useState('30')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [notes, setNotes] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [templates, setTemplates] = useState<QuoteTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [sendNow, setSendNow] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/quotes/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const searchProducts = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&orderType=${orderType}`)
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
      toast.info('Product already added')
      return
    }

    const company = companies.find(c => c.id === selectedCompany)
    const tier = (company as any)?.pricingTier || 'bronze'
    const tierDiscounts = { gold: 50, silver: 40, bronze: 30 }
    const baseDiscount = tierDiscounts[tier as keyof typeof tierDiscounts]

    const item: QuoteLineItem = {
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity: 1,
      originalPrice: product.msrp,
      unitPrice: product.msrp * (1 - baseDiscount / 100),
      discount: baseDiscount,
      discountType: 'percentage',
      total: product.msrp * (1 - baseDiscount / 100),
      variant: product.variants?.[0]
    }

    setSelectedItems([...selectedItems, item])
    toast.success('Product added')
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return
    setSelectedItems(items =>
      items.map(item =>
        item.productId === productId
          ? { ...item, quantity, total: item.unitPrice * quantity }
          : item
      )
    )
  }

  const updateDiscount = (productId: string, discount: number, reason?: string) => {
    setSelectedItems(items =>
      items.map(item => {
        if (item.productId !== productId) return item
        
        const newUnitPrice = item.originalPrice * (1 - discount / 100)
        return {
          ...item,
          discount,
          discountReason: reason,
          unitPrice: newUnitPrice,
          total: newUnitPrice * item.quantity
        }
      })
    )
  }

  const removeItem = (productId: string) => {
    setSelectedItems(items => items.filter(item => item.productId !== productId))
  }

  const loadTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (!template) return

    // This would normally load the template items
    toast.success(`Template "${template.name}" loaded`)
    setPaymentTerms(template.terms.paymentTerms || 'net-30')
    setShippingTerms(template.terms.shippingTerms || 'fob-destination')
    setNotes(template.terms.notes || '')
  }

  const calculateTotals = () => {
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0)
    const discountedTotal = selectedItems.reduce((sum, item) => sum + item.total, 0)
    const discount = subtotal - discountedTotal
    const taxRate = 9
    const tax = discountedTotal * (taxRate / 100)
    const shipping = discountedTotal > 500 ? 0 : 50
    const total = discountedTotal + tax + shipping

    return { subtotal, discount, discountedTotal, tax, taxRate, shipping, total }
  }

  const saveQuote = async (send: boolean = false) => {
    if (!selectedCompany) {
      toast.error('Please select a customer')
      setCurrentStep('customer')
      return
    }

    if (selectedItems.length === 0) {
      toast.error('Please add at least one product')
      setCurrentStep('products')
      return
    }

    setIsSaving(true)
    try {
      const validUntil = new Date()
      validUntil.setDate(validUntil.getDate() + parseInt(validDays))

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: selectedCompany,
          contactId: selectedContact,
          type: 'proactive',
          orderType,
          items: selectedItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            variant: item.variant,
            notes: item.notes
          })),
          notes,
          requestedDeliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
          sendImmediately: send
        })
      })

      if (!response.ok) throw new Error('Failed to create quote')
      
      const quote = await response.json()
      toast.success(send ? 'Quote created and sent!' : 'Quote saved as draft')
      router.push(`/rep/quotes/${quote.id}`)
    } catch (error) {
      console.error('Save error:', error)
      toast.error('Failed to save quote')
    } finally {
      setIsSaving(false)
    }
  }

  const totals = calculateTotals()
  const companies = Array.from(new Set(Object.values(MOCK_USERS)
    .filter(u => u.role === 'retailer')
    .map(u => ({ id: u.companyId, name: u.companyName, pricingTier: 'tier-1' }))
  )).sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create New Quote</h1>
        <p className="text-gray-600 mt-2">
          Build a custom quote for your customer
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={currentStep} onValueChange={setCurrentStep}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="terms">Terms</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>

            <TabsContent value="customer" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Select Customer</CardTitle>
                  <CardDescription>
                    Choose the customer and order type for this quote
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                      <SelectTrigger id="company">
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map(company => (
                          <SelectItem key={company.id} value={company.id}>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              {company.name}
                              <Badge variant="outline" className="ml-2">
                                {company.pricingTier}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCompany && (
                    <div>
                      <Label htmlFor="contact">Contact Person (Optional)</Label>
                      <Select value={selectedContact} onValueChange={setSelectedContact}>
                        <SelectTrigger id="contact">
                          <SelectValue placeholder="Select a contact" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(MOCK_USERS)
                            .filter(u => u.companyId === selectedCompany && u.role === 'retailer')
                            .map(user => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name} - {user.email}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="orderType">Order Type</Label>
                    <Select value={orderType} onValueChange={(v: any) => setOrderType(v)}>
                      <SelectTrigger id="orderType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="at-once">At-Once (Immediate Delivery)</SelectItem>
                        <SelectItem value="prebook">Prebook (Future Season)</SelectItem>
                        <SelectItem value="closeout">Closeout (Clearance)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="template">Start from Template (Optional)</Label>
                    <Select value={selectedTemplate} onValueChange={(v) => {
                      setSelectedTemplate(v)
                      loadTemplate(v)
                    }}>
                      <SelectTrigger id="template">
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => setCurrentStep('products')}
                    disabled={!selectedCompany}
                  >
                    Continue to Products
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Add Products</CardTitle>
                  <CardDescription>
                    Search and add products to the quote
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && searchProducts()}
                    />
                    <Button onClick={searchProducts} disabled={isSearching}>
                      <Search className="h-4 w-4" />
                      Search
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {searchResults.map(product => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">
                              SKU: {product.sku} | ${product.msrp}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addProduct(product)}
                            disabled={selectedItems.some(i => i.productId === product.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Selected Products</CardTitle>
                  <CardDescription>
                    {selectedItems.length} products added
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedItems.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">
                      No products added yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {selectedItems.map(item => (
                        <div key={item.productId} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.productId)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4">
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
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                                className="w-16 text-center"
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
                            <div className="flex-1 text-right">
                              <p className="font-medium">${item.total.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">
                                ${item.unitPrice.toFixed(2)} each
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    className="w-full mt-4"
                    onClick={() => setCurrentStep('pricing')}
                    disabled={selectedItems.length === 0}
                  >
                    Continue to Pricing
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Adjust Pricing</CardTitle>
                  <CardDescription>
                    Fine-tune discounts and pricing for each item
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
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedItems.map(item => (
                        <TableRow key={item.productId}>
                          <TableCell className="font-medium">{item.productName}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.originalPrice.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                value={item.discount}
                                onChange={(e) => updateDiscount(item.productId, parseFloat(e.target.value) || 0)}
                                className="w-16"
                                min="0"
                                max="100"
                              />
                              <Percent className="h-4 w-4 text-gray-500" />
                            </div>
                          </TableCell>
                          <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                          <TableCell className="font-medium">${item.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <Button
                    className="w-full mt-4"
                    onClick={() => setCurrentStep('terms')}
                  >
                    Continue to Terms
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Terms & Conditions</CardTitle>
                  <CardDescription>
                    Set payment terms, shipping, and validity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="payment">Payment Terms</Label>
                      <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                        <SelectTrigger id="payment">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="due-on-receipt">Due on Receipt</SelectItem>
                          <SelectItem value="net-30">Net 30</SelectItem>
                          <SelectItem value="net-60">Net 60</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="shipping">Shipping Terms</Label>
                      <Select value={shippingTerms} onValueChange={setShippingTerms}>
                        <SelectTrigger id="shipping">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fob-origin">FOB Origin</SelectItem>
                          <SelectItem value="fob-destination">FOB Destination</SelectItem>
                          <SelectItem value="cif">CIF</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="validity">Valid For (Days)</Label>
                      <Input
                        id="validity"
                        type="number"
                        value={validDays}
                        onChange={(e) => setValidDays(e.target.value)}
                        min="1"
                        max="90"
                      />
                    </div>

                    <div>
                      <Label htmlFor="delivery">Delivery Date</Label>
                      <Input
                        id="delivery"
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

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

                  <Button
                    className="w-full"
                    onClick={() => setCurrentStep('review')}
                  >
                    Review Quote
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="review" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Review Quote</CardTitle>
                  <CardDescription>
                    Review the quote details before saving or sending
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Customer</h3>
                    <p className="text-sm text-gray-600">
                      {companies.find(c => c.id === selectedCompany)?.name}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Products ({selectedItems.length})</h3>
                    <div className="space-y-2">
                      {selectedItems.map(item => (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span>{item.productName} x {item.quantity}</span>
                          <span>${item.total.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Terms</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Payment: {paymentTerms.replace('-', ' ').toUpperCase()}</p>
                      <p>Shipping: {shippingTerms.replace('-', ' ').toUpperCase()}</p>
                      <p>Valid for: {validDays} days</p>
                      {deliveryDate && <p>Delivery: {deliveryDate}</p>}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => saveQuote(false)}
                      disabled={isSaving}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save as Draft
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => saveQuote(true)}
                      disabled={isSaving}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send to Customer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Summary Sidebar */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Quote Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedCompany && (
                <div>
                  <p className="text-sm text-gray-600">Customer</p>
                  <p className="font-medium">
                    {companies.find(c => c.id === selectedCompany)?.name}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-600">Products</p>
                <p className="font-medium">{selectedItems.length} items</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Total Units</p>
                <p className="font-medium">
                  {selectedItems.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}