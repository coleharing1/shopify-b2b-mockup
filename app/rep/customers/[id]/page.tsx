"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  DollarSign,
  CreditCard,
  ShoppingCart,
  FileText,
  MessageSquare,
  Plus,
  Package,
  Activity,
  Calendar,
  Book,
  TrendingUp,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { formatCurrency, getCompanyById } from "@/lib/mock-data"
import Link from "next/link"
import { CatalogBadge } from "@/components/features/catalog-badge"
import { PricingCalculator } from "@/components/features/pricing-calculator"
import { loadPriceListForCompany, formatTierLabel, getTierColorClasses } from "@/lib/pricing-helpers"

interface CustomerDetail {
  id: string
  companyName: string
  contactPerson: string
  email: string
  phone: string
  accountType: string
  pricingTier: string
  region: string
  address: {
    street: string
    city: string
    state: string
    zip: string
  }
  creditLimit: number
  creditUsed: number
  ytdPurchases: number
  lastOrderDate: string
  status: "active" | "inactive" | "pending"
  notes: string
  orders: Array<{
    id: string
    date: string
    poNumber: string
    total: number
    status: string
    itemCount: number
  }>
  frequentlyOrdered: Array<{
    productId: string
    name: string
    sku: string
    lastOrdered: string
    totalQuantity: number
  }>
  activity: Array<{
    id: string
    date: string
    type: string
    description: string
    user: string
  }>
}

/**
 * @description Customer detail view with comprehensive information
 * @fileoverview Shows all customer data in a tabbed interface
 */
export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showNoteDialog, setShowNoteDialog] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [notes, setNotes] = useState<Array<{id: string, text: string, author: string, date: string}>>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [catalogInfo, setCatalogInfo] = useState<any>(null)
  const [priceList, setPriceList] = useState<any>(null)
  const [quotes, setQuotes] = useState<any[]>([])
  const [quotesLoading, setQuotesLoading] = useState(false)

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        // Load actual company data
        const company = await getCompanyById(params.id as string)
        
        // Load catalog and pricing info
        if (company) {
          // Load price list
          const customerPriceList = await loadPriceListForCompany(company.id)
          setPriceList(customerPriceList)
          
          // Mock catalog info for the customer
          setCatalogInfo({
            id: 'catalog-1',
            name: company.pricingTier === 'tier-3' ? 'Premium Catalog' : 
                  company.pricingTier === 'tier-2' ? 'Preferred Catalog' : 'Standard Catalog',
            productCount: 150,
            features: company.pricingTier === 'tier-3' ? ['early-access', 'exclusive-products'] : []
          })
        }
        
        // Simulate loading customer details
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock customer data based on ID
        const mockCustomer: CustomerDetail = {
          id: params.id as string,
          companyName: "Mountain Gear Outfitters",
          contactPerson: "Sarah Johnson",
          email: "sarah@mountaingear.com",
          phone: "(555) 123-4567",
          accountType: "Premium Dealer",
          pricingTier: "tier-3", // 50% discount
          region: "West",
          address: {
            street: "123 Mountain View Dr",
            city: "Denver",
            state: "CO",
            zip: "80202"
          },
          creditLimit: 50000,
          creditUsed: 12500,
          ytdPurchases: 285420,
          lastOrderDate: "2024-01-28",
          status: "active",
          notes: "Excellent customer with consistent orders. Prefers bulk shipments at beginning of each season. Contact before major holidays for promotional opportunities.",
          orders: [
            {
              id: "ORD-2024-1289",
              date: "2024-01-28",
              poNumber: "PO-45678",
              total: 15340,
              status: "Delivered",
              itemCount: 127
            },
            {
              id: "ORD-2024-1156",
              date: "2024-01-15",
              poNumber: "PO-45523",
              total: 22180,
              status: "Delivered",
              itemCount: 189
            },
            {
              id: "ORD-2024-0987",
              date: "2024-01-02",
              poNumber: "PO-45234",
              total: 18920,
              status: "Delivered",
              itemCount: 156
            },
            {
              id: "ORD-2023-4521",
              date: "2023-12-20",
              poNumber: "PO-44987",
              total: 35670,
              status: "Delivered",
              itemCount: 298
            }
          ],
          frequentlyOrdered: [
            {
              productId: "product-1",
              name: "Alpine Pro Jacket",
              sku: "APJ-001",
              lastOrdered: "2024-01-28",
              totalQuantity: 450
            },
            {
              productId: "product-2",
              name: "Summit Hiking Boots",
              sku: "SHB-002",
              lastOrdered: "2024-01-15",
              totalQuantity: 380
            },
            {
              productId: "product-3",
              name: "Trail Master Backpack",
              sku: "TMB-003",
              lastOrdered: "2024-01-28",
              totalQuantity: 290
            }
          ],
          activity: [
            {
              id: "act-1",
              date: "2024-01-30",
              type: "note",
              description: "Discussed spring catalog and pre-season orders",
              user: "John Smith"
            },
            {
              id: "act-2",
              date: "2024-01-28",
              type: "order",
              description: "Order #ORD-2024-1289 placed",
              user: "Sarah Johnson"
            },
            {
              id: "act-3",
              date: "2024-01-25",
              type: "email",
              description: "Sent promotional offer for new product line",
              user: "John Smith"
            },
            {
              id: "act-4",
              date: "2024-01-20",
              type: "payment",
              description: "Payment received for invoice #INV-2024-0156",
              user: "System"
            }
          ]
        }
        
        setCustomer(mockCustomer)
        // Initialize notes
        setNotes([
          { id: '1', text: mockCustomer.notes, author: 'John Smith', date: '2024-01-20' }
        ])
        
        // Fetch quotes for this customer
        setQuotesLoading(true)
        try {
          const quotesResponse = await fetch(`/api/quotes?companyId=${params.id}`)
          if (quotesResponse.ok) {
            const { quotes: customerQuotes } = await quotesResponse.json()
            setQuotes(customerQuotes || [])
          }
        } catch (error) {
          console.error('Failed to fetch quotes:', error)
        } finally {
          setQuotesLoading(false)
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading customer:", error)
        setIsLoading(false)
      }
    }

    loadCustomer()
  }, [params.id])

  if (isLoading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading customer details...</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!customer) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Customer not found</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  const creditPercentage = (customer.creditUsed / customer.creditLimit) * 100
  
  const handleAddNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now().toString(),
        text: newNote,
        author: 'John Smith', // In real app, get from auth context
        date: new Date().toLocaleDateString()
      }
      setNotes([note, ...notes])
      setNewNote('')
      setShowNoteDialog(false)
      toast.success('Note added successfully')
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/rep/customers")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{customer.companyName}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  customer.status === 'active' ? 'bg-green-100 text-green-700' :
                  customer.status === 'inactive' ? 'bg-gray-100 text-gray-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {customer.status}
                </span>
                <span className="text-sm text-gray-600">{customer.accountType}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href={`/rep/order-for/${customer.id}`}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Place Order
              </Link>
            </Button>
            <Button variant="secondary">
              <FileText className="mr-2 h-4 w-4" />
              Create Quote
            </Button>
            <Button>
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">YTD Purchases</p>
                  <p className="text-2xl font-bold">{formatCurrency(customer.ytdPurchases)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Credit Used</p>
                  <p className="text-2xl font-bold">{formatCurrency(customer.creditUsed)}</p>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          creditPercentage > 80 ? 'bg-red-500' :
                          creditPercentage > 60 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${creditPercentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      of {formatCurrency(customer.creditLimit)} limit
                    </p>
                  </div>
                </div>
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Last Order</p>
                  <p className="text-lg font-medium">
                    {new Date(customer.lastOrderDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {Math.floor((Date.now() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pricing Tier</p>
                  <p className="text-lg font-medium">50% Discount</p>
                  <p className="text-sm text-gray-500">Tier 3 Pricing</p>
                </div>
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="pricing">Catalog & Pricing</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Primary Contact</p>
                      <p className="font-medium">{customer.contactPerson}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">
                        {customer.address.street}<br />
                        {customer.address.city}, {customer.address.state} {customer.address.zip}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Notes
                    <Button size="sm" variant="outline" onClick={() => setShowNoteDialog(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Note
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {notes.length > 0 ? (
                      notes.map((note) => (
                        <div key={note.id} className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700">{note.text}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-xs text-gray-500">{note.author}</p>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs text-gray-500">{note.date}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No notes yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Order ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          PO Number
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Items
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {customer.orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {order.id}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(order.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {order.poNumber}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {order.itemCount}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {formatCurrency(order.total)}
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost">View</Button>
                              <Button size="sm" variant="ghost">Reorder</Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quotes" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Quotes</CardTitle>
                  <Button onClick={() => router.push(`/rep/quotes/new?customerId=${customer.id}`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Quote
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {quotesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500">Loading quotes...</p>
                  </div>
                ) : quotes.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No quotes for this customer yet</p>
                    <Button 
                      variant="outline"
                      onClick={() => router.push(`/rep/quotes/new?customerId=${customer.id}`)}
                    >
                      Create First Quote
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Quote Number
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Items
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Total
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Valid Until
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {quotes.map((quote: any) => {
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
                          
                          const getStatusBadgeVariant = (status: string) => {
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
                          
                          return (
                            <tr key={quote.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {quote.number}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {new Date(quote.createdAt).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {quote.items.length}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {formatCurrency(quote.pricing.total)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {new Date(quote.terms.validUntil).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3">
                                <Badge variant={getStatusBadgeVariant(quote.status) as any}>
                                  {getStatusIcon(quote.status)}
                                  <span className="ml-1 capitalize">{quote.status}</span>
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/rep/quotes/${quote.id}`)}
                                >
                                  View
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Ordered Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customer.frequentlyOrdered.map((product) => (
                    <div
                      key={product.productId}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                        <p className="text-sm text-gray-500">
                          Last ordered: {new Date(product.lastOrdered).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{product.totalQuantity} units</p>
                        <p className="text-sm text-gray-500">Total ordered</p>
                      </div>
                      <Button size="sm">Quick Add</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pricing" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Catalog Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    Catalog Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {catalogInfo && (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Assigned Catalog</p>
                          <p className="font-medium text-lg">{catalogInfo.name}</p>
                        </div>
                        <CatalogBadge 
                          catalogName={catalogInfo.name}
                          features={catalogInfo.features}
                        />
                      </div>
                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Products Available</span>
                          <span className="font-medium">{catalogInfo.productCount || 150}</span>
                        </div>
                        {catalogInfo.features?.includes('early-access') && (
                          <Badge variant="outline" className="text-xs bg-blue-50">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Early Access to New Products
                          </Badge>
                        )}
                        {catalogInfo.features?.includes('exclusive-products') && (
                          <Badge variant="outline" className="text-xs bg-purple-50 mt-1">
                            <Package className="h-3 w-3 mr-1" />
                            Exclusive Product Lines
                          </Badge>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Pricing Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Pricing Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Pricing Tier</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getTierColorClasses(customer.pricingTier)}>
                        {formatTierLabel(customer.pricingTier)}
                      </Badge>
                      <span className="font-medium">
                        {customer.pricingTier === 'tier-3' ? '50%' : 
                         customer.pricingTier === 'tier-2' ? '40%' : '30%'} Discount
                      </span>
                    </div>
                  </div>
                  
                  {priceList && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600 mb-2">Custom Price List</p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium">{priceList.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {priceList.rules?.length || 0} custom pricing rules
                        </p>
                        {priceList.globalDiscount && (
                          <Badge variant="outline" className="text-xs mt-2">
                            Additional {(priceList.globalDiscount * 100).toFixed(0)}% volume discount
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600 mb-2">Price Benefits</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Volume pricing on bulk orders</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Seasonal promotions eligible</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span>Free shipping on orders over $2,500</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Pricing Calculator */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Price Check</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-lg mb-4">
                  <p className="text-sm">
                    Use this calculator to quickly check customer-specific pricing for any product.
                  </p>
                </div>
                {/* Placeholder: adjust props when calculator supports company context */}
                <PricingCalculator 
                  productId="sample"
                  productName="Sample"
                  msrp={100}
                  companyTier={customer.pricingTier}
                  priceListName={priceList?.name}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No documents available</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Plus className="h-4 w-4 mr-1" />
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activity" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customer.activity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex gap-3 pb-4 border-b last:border-0"
                    >
                      <div className={`p-2 rounded-full ${
                        activity.type === 'order' ? 'bg-green-100' :
                        activity.type === 'note' ? 'bg-blue-100' :
                        activity.type === 'email' ? 'bg-purple-100' :
                        'bg-gray-100'
                      }`}>
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()} • {activity.user}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Add Note Dialog */}
        <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Note for {customer.companyName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your note here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={4}
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNote}>
                Add Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthenticatedLayout>
  )
}