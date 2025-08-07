"use client"

import { useState } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { 
  User, 
  Users,
  Bell, 
  Settings, 
  Calendar, 
  Target,
  Smartphone,
  Shield,
  Save,
  Camera,
  Mail,
  FileText,
  BarChart,
  Clock,
  Star,
  Package,
  Grid3X3,
  AlertCircle,
  Info,
  Check,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock rep data - in production this would come from API
const mockRepData = {
  id: "rep-1",
  name: "Sarah Johnson",
  email: "sarah@brand.com",
  phone: "(555) 987-6543",
  territory: "Mountain West",
  title: "Regional Sales Manager",
  profilePhoto: "/api/placeholder/150/150",
  joinDate: "2020-03-15",
  commissionRate: "5%",
  commissionStructure: "Tiered commission based on monthly sales volume",
  performanceMetrics: {
    mtdSales: 125000,
    ytdSales: 1500000,
    activeAccounts: 24,
    newAccountsThisMonth: 2,
    currentGoal: 150000,
    goalProgress: 83
  }
}

const mockFavoriteProducts = [
  { id: "prod-1", name: "Trail Runner Pro", sku: "TR-PRO-001" },
  { id: "prod-5", name: "Summit Backpack 65L", sku: "BP-SUM-65L" },
  { id: "prod-8", name: "Alpine Jacket", sku: "JK-ALP-001" }
]

/**
 * @description Sales rep account settings page
 * @fileoverview Comprehensive settings management for sales representatives
 */
export default function RepSettingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // Form states
  const [profile, setProfile] = useState({
    name: mockRepData.name,
    email: mockRepData.email,
    phone: mockRepData.phone,
    title: mockRepData.title,
    bio: "Experienced sales professional specializing in outdoor gear and sporting goods. Passionate about helping retailers grow their business."
  })

  const [notifications, setNotifications] = useState({
    newOrders: true,
    orderStatusUpdates: true,
    customerActivity: true,
    lowStockAlerts: true,
    goalReminders: true,
    commissionUpdates: true,
    digest: "daily",
    quietHours: false,
    quietStart: "18:00",
    quietEnd: "08:00"
  })

  const [preferences, setPreferences] = useState({
    defaultDashboard: "overview",
    orderListView: "table",
    showCommission: true,
    autoFollowUp: true,
    followUpDays: "3",
    defaultSort: "date-desc",
    showGoals: true,
    enableShortcuts: true
  })

  const [signature, setSignature] = useState({
    emailSignature: `Best regards,\n\nSarah Johnson\nRegional Sales Manager\nOutdoor Gear Brand\n(555) 987-6543\nsarah@brand.com`,
    includeInQuotes: true,
    includeInOrders: false
  })

  const handleSave = (section: string) => {
    toast({
      title: "Settings saved",
      description: `Your ${section.toLowerCase()} settings have been updated successfully.`,
    })
    setHasUnsavedChanges(false)
  }

  const handleCancel = () => {
    setHasUnsavedChanges(false)
    toast({
      title: "Changes discarded",
      description: "Your changes have been discarded.",
      variant: "secondary"
    })
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        <Breadcrumb items={[
          { label: "Dashboard", href: "/rep/dashboard" },
          { label: "Account Settings" }
        ]} />
        
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-gray-600 mt-1">Manage your profile and preferences</p>
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
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="signature">Signature</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <CardTitle>Personal Profile</CardTitle>
                </div>
                <Badge variant="secondary">Sales Representative</Badge>
              </div>
              <CardDescription>
                Your personal information and professional details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-400" />
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="absolute bottom-0 right-0 rounded-full"
                    onClick={() => {
                      toast({
                        title: "Upload photo",
                        description: "Photo upload functionality would open here.",
                        variant: "secondary"
                      })
                    }}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profile.name.toString()}
                      onChange={(e) => {
                        setProfile({...profile, name: e.target.value})
                        setHasUnsavedChanges(true)
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={profile.email.toString()}
                      onChange={(e) => {
                        setProfile({...profile, email: e.target.value})
                        setHasUnsavedChanges(true)
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={profile.phone.toString()}
                      onChange={(e) => {
                        setProfile({...profile, phone: e.target.value})
                        setHasUnsavedChanges(true)
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input 
                      id="title" 
                      value={profile.title.toString()}
                      onChange={(e) => {
                        setProfile({...profile, title: e.target.value})
                        setHasUnsavedChanges(true)
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea 
                  id="bio" 
                  value={profile.bio.toString()}
                  onChange={(e) => {
                    setProfile({...profile, bio: e.target.value})
                    setHasUnsavedChanges(true)
                  }}
                  className="min-h-[100px] mt-2"
                  placeholder="Tell your customers about yourself..."
                />
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Territory & Commission</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Assigned Territory</Label>
                    <p className="font-medium">{mockRepData.territory}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Commission Rate</Label>
                    <p className="font-medium">{mockRepData.commissionRate}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-sm text-gray-600">Commission Structure</Label>
                    <p className="text-sm mt-1">{mockRepData.commissionStructure}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSave('Profile')}
                  disabled={!hasUnsavedChanges}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
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

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Activity Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="new-orders">New Orders</Label>
                      <p className="text-sm text-gray-600">Get notified when customers place new orders</p>
                    </div>
                    <Checkbox
                      id="new-orders"
                      checked={notifications.newOrders}
                      onChange={(e) => {
                        setNotifications({...notifications, newOrders: e.target.checked})
                        setHasUnsavedChanges(true)
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="order-status">Order Status Updates</Label>
                      <p className="text-sm text-gray-600">Updates when orders ship or status changes</p>
                    </div>
                    <Checkbox
                      id="order-status"
                      checked={notifications.orderStatusUpdates}
                      onChange={(e) => {
                        setNotifications({...notifications, orderStatusUpdates: e.target.checked})
                        setHasUnsavedChanges(true)
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="customer-activity">Customer Activity</Label>
                      <p className="text-sm text-gray-600">When customers view catalogs or add to cart</p>
                    </div>
                    <Checkbox
                      id="customer-activity"
                      checked={notifications.customerActivity}
                      onChange={(e) => {
                        setNotifications({...notifications, customerActivity: e.target.checked})
                        setHasUnsavedChanges(true)
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="low-stock">Low Stock Alerts</Label>
                      <p className="text-sm text-gray-600">Notifications for low inventory on popular items</p>
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
                      <Label htmlFor="goal-reminders">Goal Reminders</Label>
                      <p className="text-sm text-gray-600">Progress updates on sales goals</p>
                    </div>
                    <Checkbox
                      id="goal-reminders"
                      checked={notifications.goalReminders}
                      onChange={(e) => {
                        setNotifications({...notifications, goalReminders: e.target.checked})
                        setHasUnsavedChanges(true)
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="commission">Commission Updates</Label>
                      <p className="text-sm text-gray-600">Monthly commission statements and updates</p>
                    </div>
                    <Checkbox
                      id="commission"
                      checked={notifications.commissionUpdates}
                      onChange={(e) => {
                        setNotifications({...notifications, commissionUpdates: e.target.checked})
                        setHasUnsavedChanges(true)
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label htmlFor="digest">Email Digest Frequency</Label>
                <Select 
                  value={notifications.digest.toString()} 
                  onValueChange={(value) => {
                    setNotifications({...notifications, digest: value})
                    setHasUnsavedChanges(true)
                  }}
                >
                  <SelectTrigger id="digest" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly Summary</SelectItem>
                    <SelectItem value="daily">Daily Summary</SelectItem>
                    <SelectItem value="weekly">Weekly Summary</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Label htmlFor="quiet-hours">Quiet Hours</Label>
                    <p className="text-sm text-gray-600">Pause notifications during specific hours</p>
                  </div>
                  <Checkbox
                    id="quiet-hours"
                    checked={notifications.quietHours}
                    onChange={(e) => {
                      setNotifications({...notifications, quietHours: e.target.checked})
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
                {notifications.quietHours && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quiet-start">Start Time</Label>
                      <Input 
                        id="quiet-start" 
                        type="time" 
                        value={notifications.quietStart.toString()}
                        onChange={(e) => {
                          setNotifications({...notifications, quietStart: e.target.value})
                          setHasUnsavedChanges(true)
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quiet-end">End Time</Label>
                      <Input 
                        id="quiet-end" 
                        type="time" 
                        value={notifications.quietEnd.toString()}
                        onChange={(e) => {
                          setNotifications({...notifications, quietEnd: e.target.value})
                          setHasUnsavedChanges(true)
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
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
        </TabsContent>

        {/* Sales Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Sales Preferences
              </CardTitle>
              <CardDescription>
                Customize your sales workflow and dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="default-dashboard">Default Dashboard View</Label>
                <Select 
                  value={preferences.defaultDashboard.toString()} 
                  onValueChange={(value) => {
                    setPreferences({...preferences, defaultDashboard: value})
                    setHasUnsavedChanges(true)
                  }}
                >
                  <SelectTrigger id="default-dashboard" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overview">Overview</SelectItem>
                    <SelectItem value="orders">Orders</SelectItem>
                    <SelectItem value="customers">Customers</SelectItem>
                    <SelectItem value="analytics">Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="order-view">Order List View</Label>
                <RadioGroup 
                  value={preferences.orderListView.toString()} 
                  onValueChange={(value) => {
                    setPreferences({...preferences, orderListView: value})
                    setHasUnsavedChanges(true)
                  }}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="table" id="table-view" />
                    <Label htmlFor="table-view">Table View</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cards" id="cards-view" />
                    <Label htmlFor="cards-view">Card View</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="list" id="list-view" />
                    <Label htmlFor="list-view">Compact List</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="default-sort">Default Sort Order</Label>
                <Select 
                  value={preferences.defaultSort.toString()} 
                  onValueChange={(value) => {
                    setPreferences({...preferences, defaultSort: value})
                    setHasUnsavedChanges(true)
                  }}
                >
                  <SelectTrigger id="default-sort" className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Newest First</SelectItem>
                    <SelectItem value="date-asc">Oldest First</SelectItem>
                    <SelectItem value="amount-desc">Highest Value</SelectItem>
                    <SelectItem value="amount-asc">Lowest Value</SelectItem>
                    <SelectItem value="customer">Customer Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-commission">Show Commission on Orders</Label>
                    <p className="text-sm text-gray-600">Display commission amounts in order views</p>
                  </div>
                  <Checkbox
                    id="show-commission"
                    checked={preferences.showCommission}
                    onChange={(e) => {
                      setPreferences({...preferences, showCommission: e.target.checked})
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-goals">Show Sales Goals</Label>
                    <p className="text-sm text-gray-600">Display progress bars for monthly goals</p>
                  </div>
                  <Checkbox
                    id="show-goals"
                    checked={preferences.showGoals}
                    onChange={(e) => {
                      setPreferences({...preferences, showGoals: e.target.checked})
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="shortcuts">Enable Keyboard Shortcuts</Label>
                    <p className="text-sm text-gray-600">Use keyboard shortcuts for quick navigation</p>
                  </div>
                  <Checkbox
                    id="shortcuts"
                    checked={preferences.enableShortcuts}
                    onChange={(e) => {
                      setPreferences({...preferences, enableShortcuts: e.target.checked})
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <Label htmlFor="auto-followup">Automatic Follow-ups</Label>
                    <p className="text-sm text-gray-600">Send follow-up reminders for quotes and carts</p>
                  </div>
                  <Checkbox
                    id="auto-followup"
                    checked={preferences.autoFollowUp}
                    onChange={(e) => {
                      setPreferences({...preferences, autoFollowUp: e.target.checked})
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
                {preferences.autoFollowUp && (
                  <div>
                    <Label htmlFor="followup-days">Follow-up After (Days)</Label>
                    <Select 
                      value={preferences.followUpDays.toString()} 
                      onValueChange={(value) => {
                        setPreferences({...preferences, followUpDays: value})
                        setHasUnsavedChanges(true)
                      }}
                    >
                      <SelectTrigger id="followup-days" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="5">5 Days</SelectItem>
                        <SelectItem value="7">7 Days</SelectItem>
                        <SelectItem value="14">14 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
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

          {/* Favorite Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Favorite Products
              </CardTitle>
              <CardDescription>
                Quick access to frequently ordered products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockFavoriteProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Product removed",
                          description: `${product.name} removed from favorites.`,
                        })
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Package className="h-4 w-4 mr-2" />
                Add Products
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Signature Tab */}
        <TabsContent value="signature" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Email Signature
              </CardTitle>
              <CardDescription>
                Customize your email signature for professional communication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email-sig">Signature Content</Label>
                <Textarea 
                  id="email-sig"
                  value={signature.emailSignature.toString()}
                  onChange={(e) => {
                    setSignature({...signature, emailSignature: e.target.value})
                    setHasUnsavedChanges(true)
                  }}
                  className="min-h-[150px] mt-2 font-mono text-sm"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sig-quotes">Include in Quotes</Label>
                    <p className="text-sm text-gray-600">Add signature to quote documents</p>
                  </div>
                  <Checkbox
                    id="sig-quotes"
                    checked={signature.includeInQuotes}
                    onChange={(e) => {
                      setSignature({...signature, includeInQuotes: e.target.checked})
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sig-orders">Include in Order Confirmations</Label>
                    <p className="text-sm text-gray-600">Add signature to order emails</p>
                  </div>
                  <Checkbox
                    id="sig-orders"
                    checked={signature.includeInOrders}
                    onChange={(e) => {
                      setSignature({...signature, includeInOrders: e.target.checked})
                      setHasUnsavedChanges(true)
                    }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Preview</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <pre className="text-sm whitespace-pre-wrap">{signature.emailSignature}</pre>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleSave('Signature')}
                  disabled={!hasUnsavedChanges}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Signature
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

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Performance Settings
              </CardTitle>
              <CardDescription>
                Configure goals and performance tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Current Performance</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">MTD Sales</p>
                    <p className="text-2xl font-bold">${mockRepData.performanceMetrics.mtdSales.toLocaleString()}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Goal Progress</span>
                        <span>{mockRepData.performanceMetrics.goalProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${mockRepData.performanceMetrics.goalProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">YTD Sales</p>
                    <p className="text-2xl font-bold">${mockRepData.performanceMetrics.ytdSales.toLocaleString()}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span>{mockRepData.performanceMetrics.activeAccounts} Active Accounts</span>
                      <span>+{mockRepData.performanceMetrics.newAccountsThisMonth} New</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Goal Preferences</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="goal-tracking">Goal Tracking Display</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger id="goal-tracking" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Goals</SelectItem>
                        <SelectItem value="weekly">Weekly Goals</SelectItem>
                        <SelectItem value="monthly">Monthly Goals</SelectItem>
                        <SelectItem value="quarterly">Quarterly Goals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="report-schedule">Performance Report Schedule</Label>
                    <Select defaultValue="weekly">
                      <SelectTrigger id="report-schedule" className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Dashboard Widgets</h4>
                <p className="text-sm text-gray-600 mb-3">Choose which widgets to show on your dashboard</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "sales-chart", label: "Sales Chart", icon: BarChart },
                    { id: "recent-orders", label: "Recent Orders", icon: Clock },
                    { id: "top-customers", label: "Top Customers", icon: Users },
                    { id: "commission", label: "Commission Tracker", icon: Target },
                    { id: "activities", label: "Activity Feed", icon: Bell },
                    { id: "goals", label: "Goal Progress", icon: Target }
                  ].map(widget => (
                    <div key={widget.id} className="flex items-center gap-2">
                      <Checkbox id={widget.id} defaultChecked />
                      <Label 
                        htmlFor={widget.id} 
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <widget.icon className="h-4 w-4" />
                        {widget.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Calendar Integration</h4>
                    <p className="text-sm text-gray-600">Sync with Google or Outlook calendar</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Calendar sync",
                      description: "Calendar integration settings would open here.",
                      variant: "secondary"
                    })
                  }}
                >
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 rounded">
                    <Smartphone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Mobile App</h4>
                    <p className="text-sm text-gray-600">Configure mobile app settings</p>
                  </div>
                </div>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-100 rounded">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Security settings",
                      description: "Two-factor authentication setup would open here.",
                      variant: "secondary"
                    })
                  }}
                >
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}