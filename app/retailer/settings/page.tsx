"use client"

import { useState, useEffect } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { useAuth } from "@/lib/contexts/auth-context"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { 
  Building, 
  MapPin, 
  Users, 
  Bell, 
  FileText, 
  Link2,
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Download,
  Upload,
  Shield,
  CreditCard,
  Calendar,
  AlertCircle,
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"

// Company data mapping - in production this would come from API
const getCompanyData = (companyId: string) => {
  const companyMap: Record<string, any> = {
    "company-1": {
      id: "company-1",
      name: "Outdoor Retailers Co.",
      dba: "Outdoor Co",
      type: "premium_dealer",
      accountNumber: "ORC-10234",
      taxId: "12-3456789",
      yearEstablished: "2010",
      website: "www.outdoorco.com",
      creditLimit: 75000,
      creditUsed: 22500,
      paymentTerms: "Net 30",
      pricingTier: "tier-3",
      tierName: "Premium Dealer (50% off MSRP)",
      status: "active"
    },
    "company-2": {
      id: "company-2",
      name: "Urban Style Boutique",
      dba: "Urban Style",
      type: "preferred_dealer",
      accountNumber: "USB-20456",
      taxId: "34-5678901",
      yearEstablished: "2015",
      website: "www.urbanstyle.com",
      creditLimit: 50000,
      creditUsed: 12500,
      paymentTerms: "Net 30",
      pricingTier: "tier-2",
      tierName: "Preferred Dealer (40% off MSRP)",
      status: "active"
    },
    "company-3": {
      id: "company-3",
      name: "West Coast Sports",
      dba: "WCS",
      type: "standard_dealer",
      accountNumber: "WCS-30789",
      taxId: "56-7890123",
      yearEstablished: "2018",
      website: "www.westcoastsports.com",
      creditLimit: 25000,
      creditUsed: 5000,
      paymentTerms: "Net 15",
      pricingTier: "tier-1",
      tierName: "Standard Dealer (30% off MSRP)",
      status: "active"
    }
  }
  return companyMap[companyId] || companyMap["company-1"]
}

const mockAddresses = [
  {
    id: "addr-1",
    label: "Main Store",
    address1: "123 Mountain View Dr",
    address2: "Suite 100",
    city: "Denver",
    state: "CO",
    zip: "80202",
    isDefault: true
  },
  {
    id: "addr-2",
    label: "Warehouse",
    address1: "456 Industrial Pkwy",
    address2: "",
    city: "Aurora",
    state: "CO",
    zip: "80010",
    isDefault: false
  }
]

const mockUsers = [
  {
    id: "user-1",
    name: "John Smith",
    email: "john@mountaingear.com",
    role: "Owner",
    permissions: "Full Access",
    lastLogin: "2025-08-07 10:30 AM"
  },
  {
    id: "user-2",
    name: "Jane Doe",
    email: "jane@mountaingear.com",
    role: "Buyer",
    permissions: "Order Management",
    lastLogin: "2025-08-06 3:45 PM"
  },
  {
    id: "user-3",
    name: "Bob Wilson",
    email: "bob@mountaingear.com",
    role: "Viewer",
    permissions: "View Only",
    lastLogin: "2025-08-05 9:15 AM"
  }
]

const mockDocuments = [
  {
    id: "doc-1",
    name: "Resale Certificate - Colorado",
    type: "resale_certificate",
    uploadedDate: "2025-01-15",
    expiryDate: "2026-01-15",
    status: "active"
  },
  {
    id: "doc-2",
    name: "Tax Exemption Certificate",
    type: "tax_exempt",
    uploadedDate: "2025-02-01",
    expiryDate: "2025-12-31",
    status: "expiring_soon"
  }
]

/**
 * @description Retailer account settings page
 * @fileoverview Comprehensive settings management for retailer accounts
 */
export default function RetailerSettingsPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("company")
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [companyData, setCompanyData] = useState<any>(null)
  
  useEffect(() => {
    if (user?.companyId) {
      setCompanyData(getCompanyData(user.companyId))
    }
  }, [user])
  
  // Form states
  const [notifications, setNotifications] = useState({
    orderConfirmations: true,
    shippingUpdates: true,
    lowStockAlerts: true,
    newProducts: false,
    promotions: true,
    newsletter: true,
    emailDigest: "daily"
  })

  const [preferences, setPreferences] = useState({
    requirePO: true,
    defaultShipTo: "addr-1",
    orderApproval: "none",
    autoReorder: false
  })

  const handleSave = (section: string) => {
    // Simulate save
    toast({
      title: "Settings saved",
      description: `Your ${section.toLowerCase()} settings have been updated successfully.`,
    })
    setIsEditing(null)
    setHasUnsavedChanges(false)
  }

  const handleCancel = () => {
    setIsEditing(null)
    setHasUnsavedChanges(false)
    // Reset form states to original values
    toast({
      title: "Changes discarded",
      description: "Your changes have been discarded.",
      variant: "secondary"
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary">Active</Badge>
      case 'expiring_soon':
        return <Badge variant="secondary">Expiring Soon</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (!companyData) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <Breadcrumb items={[
          { label: "Dashboard", href: "/retailer/dashboard" },
          { label: "Account Settings" }
        ]} />
        
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>


      <Tabs value={activeTab} onValueChange={(value) => {
        if (hasUnsavedChanges) {
          toast({
            title: "Unsaved changes",
            description: "You have unsaved changes. Please save or cancel before switching tabs.",
            variant: "secondary"
          })
          return
        }
        setActiveTab(value)
      }}>
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        {/* Company Information Tab */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  <CardTitle>Company Information</CardTitle>
                </div>
                <Badge variant="secondary">Active Account</Badge>
              </div>
              <CardDescription>
                Your company details and account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Legal Business Name</Label>
                  <p className="font-medium">{companyData.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">DBA</Label>
                  <p className="font-medium">{companyData.dba || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Account Number</Label>
                  <p className="font-medium font-mono">{companyData.accountNumber}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Tax ID</Label>
                  <p className="font-medium font-mono">{companyData.taxId}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Business Type</Label>
                  <p className="font-medium capitalize">{companyData.type.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Year Established</Label>
                  <p className="font-medium">{companyData.yearEstablished}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Website</Label>
                  <p className="font-medium">{companyData.website}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Account Status</Label>
                  <Badge variant="secondary" className="mt-1">Active</Badge>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Account Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Pricing Tier</Label>
                    <p className="font-medium">{companyData.tierName}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Payment Terms</Label>
                    <p className="font-medium">{companyData.paymentTerms}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Credit Limit</Label>
                    <p className="font-medium">${companyData.creditLimit.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Available Credit</Label>
                    <p className="font-medium text-green-600">
                      ${(companyData.creditLimit - companyData.creditUsed).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shipping Addresses Tab */}
        <TabsContent value="addresses" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Addresses
                  </CardTitle>
                  <CardDescription>
                    Manage your shipping locations
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddAddress(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Address
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAddresses.map((address) => (
                  <div
                    key={address.id}
                    className={cn(
                      "p-4 border rounded-lg",
                      address.isDefault && "border-primary bg-primary-light/20"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{address.label}</h4>
                          {address.isDefault && (
                            <Badge variant="default" className="text-xs">Default</Badge>
                          )}
                        </div>
                        <address className="text-sm text-gray-600 not-italic">
                          {address.address1}<br />
                          {address.address2 && <>{address.address2}<br /></>}
                          {address.city}, {address.state} {address.zip}
                        </address>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setIsEditing(`address-${address.id}`)
                            toast({
                              title: "Edit mode",
                              description: "You can now edit this address.",
                              variant: "secondary"
                            })
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            toast({
                              title: "Address removed",
                              description: "The shipping address has been removed.",
                            })
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {!address.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => {
                          toast({
                            title: "Default address updated",
                            description: `${address.label} is now your default shipping address.`,
                          })
                        }}
                      >
                        Set as Default
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {showAddAddress && (
                <div className="mt-4 p-4 border-2 border-dashed rounded-lg">
                  <h4 className="font-medium mb-4">Add New Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="label">Label</Label>
                      <Input id="label" placeholder="e.g., Store #2" />
                    </div>
                    <div>
                      <Label htmlFor="address1">Address Line 1</Label>
                      <Input id="address1" placeholder="Street address" />
                    </div>
                    <div>
                      <Label htmlFor="address2">Address Line 2</Label>
                      <Input id="address2" placeholder="Apt, suite, etc. (optional)" />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="City" />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select>
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CO">Colorado</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="12345" />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={() => {
                      handleSave('Address')
                      setShowAddAddress(false)
                    }}>Save Address</Button>
                    <Button variant="outline" onClick={() => {
                      setShowAddAddress(false)
                      setHasUnsavedChanges(false)
                    }}>Cancel</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    View and manage user access (read-only in demo)
                  </CardDescription>
                </div>
                <Button disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  Invite User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Role: {user.role}</span>
                        <span>•</span>
                        <span>{user.permissions}</span>
                        <span>•</span>
                        <span>Last login: {user.lastLogin}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" disabled>
                      Manage
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex gap-2">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Need to add or remove users?</p>
                    <p className="text-blue-700 mt-1">
                      Contact your sales representative to modify user access permissions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Tax Documents
                  </CardTitle>
                  <CardDescription>
                    Manage your tax exemption certificates
                  </CardDescription>
                </div>
                <Button onClick={() => {
                  toast({
                    title: "Upload started",
                    description: "Select a tax document to upload.",
                    variant: "secondary"
                  })
                }}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-gray-100 rounded">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className={cn(
                            doc.status === 'expiring_soon' && "text-yellow-600 font-medium"
                          )}>
                            Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(doc.status)}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "Download started",
                            description: `Downloading ${doc.name}...`,
                          })
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {mockDocuments.some(doc => doc.status === 'expiring_soon') && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-900">Document Expiring Soon</p>
                      <p className="text-yellow-700 mt-1">
                        One or more of your tax documents will expire soon. Please upload updated versions to maintain your tax-exempt status.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Integration Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Integration Settings
              </CardTitle>
              <CardDescription>
                Connect your account with external services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">QuickBooks Integration</h4>
                    <p className="text-sm text-gray-600">Sync orders and invoices automatically</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Connected</Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Opening configuration",
                        description: "QuickBooks integration settings will open in a new window.",
                        variant: "secondary"
                      })
                    }}
                  >Configure</Button>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">API Access</h4>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-gray-600">API Key</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value="sk_live_****************************" readOnly />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toast({
                            title: "API Key regenerated",
                            description: "Your new API key has been generated and saved.",
                          })
                        }}
                      >Regenerate</Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Webhook URL</Label>
                    <Input placeholder="https://your-domain.com/webhook" className="mt-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about account activity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="order-confirmations">Order Confirmations</Label>
                    <p className="text-sm text-gray-600">Receive emails when orders are placed</p>
                  </div>
                  <Checkbox
                    id="order-confirmations"
                    checked={notifications.orderConfirmations}
                    onChange={(e) => {
                      setNotifications({...notifications, orderConfirmations: e.target.checked})
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="shipping-updates">Shipping Updates</Label>
                    <p className="text-sm text-gray-600">Get notified when orders ship</p>
                  </div>
                  <Checkbox
                    id="shipping-updates"
                    checked={notifications.shippingUpdates}
                    onChange={(e) => {
                      setNotifications({...notifications, shippingUpdates: e.target.checked})
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="low-stock">Low Stock Alerts</Label>
                    <p className="text-sm text-gray-600">Alert when frequently ordered items are low</p>
                  </div>
                  <Checkbox
                    id="low-stock"
                    checked={notifications.lowStockAlerts}
                    onChange={(e) => {
                      setNotifications({...notifications, lowStockAlerts: e.target.checked})
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="new-products">New Product Announcements</Label>
                    <p className="text-sm text-gray-600">Be first to know about new arrivals</p>
                  </div>
                  <Checkbox
                    id="new-products"
                    checked={notifications.newProducts}
                    onChange={(e) => {
                      setNotifications({...notifications, newProducts: e.target.checked})
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="promotions">Promotions & Deals</Label>
                    <p className="text-sm text-gray-600">Special offers for your account tier</p>
                  </div>
                  <Checkbox
                    id="promotions"
                    checked={notifications.promotions}
                    onChange={(e) => {
                      setNotifications({...notifications, promotions: e.target.checked})
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label htmlFor="email-digest">Email Digest Frequency</Label>
                <Select value={notifications.emailDigest} onValueChange={(value) => {
                  setNotifications({...notifications, emailDigest: value})
                  setHasUnsavedChanges(true)
                }}>
                  <SelectTrigger id="email-digest" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="daily">Daily Summary</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  onClick={() => handleSave('Notification')}
                  disabled={!hasUnsavedChanges}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Notifications
                </Button>
                {hasUnsavedChanges && (
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Order Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Order Preferences</CardTitle>
              <CardDescription>
                Set your default ordering preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="require-po">Require PO Number</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox
                    id="require-po"
                    checked={preferences.requirePO}
                    onChange={(e) => {
                      setPreferences({...preferences, requirePO: e.target.checked})
                      setHasUnsavedChanges(true)
                    }}
                  />
                  <Label htmlFor="require-po" className="text-sm text-gray-600 font-normal">
                    Make PO number mandatory for all orders
                  </Label>
                </div>
              </div>

              <div>
                <Label htmlFor="default-ship">Default Shipping Address</Label>
                <Select value={preferences.defaultShipTo} onValueChange={(value) => {
                  setPreferences({...preferences, defaultShipTo: value})
                  setHasUnsavedChanges(true)
                }}>
                  <SelectTrigger id="default-ship" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAddresses.map(addr => (
                      <SelectItem key={addr.id} value={addr.id}>
                        {addr.label} - {addr.city}, {addr.state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="order-approval">Order Approval</Label>
                <Select value={preferences.orderApproval} onValueChange={(value) => {
                  setPreferences({...preferences, orderApproval: value})
                  setHasUnsavedChanges(true)
                }}>
                  <SelectTrigger id="order-approval" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No approval required</SelectItem>
                    <SelectItem value="over-1000">Orders over $1,000</SelectItem>
                    <SelectItem value="over-5000">Orders over $5,000</SelectItem>
                    <SelectItem value="all">All orders require approval</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSave('Preferences')}
                  disabled={!hasUnsavedChanges}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
                {hasUnsavedChanges && (
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}