"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ShoppingCart, 
  Package, 
  Users, 
  FileText, 
  Settings, 
  Home,
  Search,
  BarChart,
  ClipboardList,
  DollarSign,
  Building,
  UserCheck,
  LogIn,
  PlusCircle,
  Eye,
  Edit,
  Truck,
  CreditCard,
  Download,
  MessageSquare,
  Star,
  TrendingUp,
  Shield,
  Database,
  Globe,
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Key
} from "lucide-react"

interface RouteLink {
  path: string
  label: string
  description?: string
  icon?: React.ReactNode
  status?: 'complete' | 'partial' | 'pending'
  requiresAuth?: boolean
  params?: string
}

interface RouteSection {
  title: string
  icon?: React.ReactNode
  routes: RouteLink[]
}

/**
 * @description Quick access page with all app routes organized by user type
 * @fileoverview Comprehensive URL directory for testing and navigation
 */
export default function QuickAccessPage() {
  const [copiedPath, setCopiedPath] = useState<string | null>(null)
  const [selectedUserType, setSelectedUserType] = useState<'all' | 'public' | 'retailer' | 'rep' | 'admin'>('all')

  const copyToClipboard = (path: string) => {
    navigator.clipboard.writeText(`http://localhost:3002${path}`)
    setCopiedPath(path)
    setTimeout(() => setCopiedPath(null), 2000)
  }

  const getStatusBadge = (status?: string) => {
    switch(status) {
      case 'complete':
        return <Badge variant="secondary" className="ml-2">✓ Complete</Badge>
      case 'partial':
        return <Badge variant="secondary" className="ml-2">⚡ Partial</Badge>
      case 'pending':
        return <Badge variant="outline" className="ml-2">🚧 Pending</Badge>
      case 'planned':
        return <Badge variant="outline" className="ml-2">📅 Planned</Badge>
      default:
        return null
    }
  }

  const publicRoutes: RouteSection[] = [
    {
      title: "Authentication & Onboarding",
      icon: <LogIn className="h-5 w-5" />,
      routes: [
        { path: "/", label: "Home Page", icon: <Home className="h-4 w-4" />, status: 'complete' },
        { path: "/login", label: "Login", icon: <LogIn className="h-4 w-4" />, status: 'complete' },
        { path: "/apply", label: "Dealer Application", icon: <ClipboardList className="h-4 w-4" />, status: 'complete' },
        { path: "/apply/submitted", label: "Application Submitted", icon: <CheckCircle className="h-4 w-4" />, status: 'complete' },
        { path: "/apply/status/APP-2025-001", label: "Application Status (Pending)", params: "applicationId", icon: <Clock className="h-4 w-4" />, status: 'complete' },
        { path: "/apply/status/APP-2025-002", label: "Application Status (Approved)", params: "applicationId", icon: <CheckCircle className="h-4 w-4" />, status: 'complete' },
        { path: "/apply/status/APP-2025-003", label: "Application Status (Rejected)", params: "applicationId", icon: <XCircle className="h-4 w-4" />, status: 'complete' },
        { path: "/welcome/company-1", label: "Welcome Kit", params: "companyId", icon: <Star className="h-4 w-4" />, status: 'complete' },
        { path: "/select-account", label: "Account Selection", icon: <Users className="h-4 w-4" />, status: 'complete' },
      ]
    },
    {
      title: "Public Features",
      icon: <Globe className="h-5 w-5" />,
      routes: [
        { path: "/search", label: "Global Search", icon: <Search className="h-4 w-4" />, status: 'complete' },
        { path: "/quick", label: "Quick Access (This Page)", icon: <ArrowRight className="h-4 w-4" />, status: 'complete' },
      ]
    }
  ]

  const retailerRoutes: RouteSection[] = [
    {
      title: "Dashboard & Overview",
      icon: <BarChart className="h-5 w-5" />,
      routes: [
        { path: "/retailer/dashboard", label: "Retailer Dashboard", icon: <Home className="h-4 w-4" />, status: 'complete', requiresAuth: true },
      ]
    },
    {
      title: "Product Catalog",
      icon: <Package className="h-5 w-5" />,
      routes: [
        { path: "/retailer/products", label: "Product Catalog", icon: <Package className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/retailer/products/PROD-001", label: "Product Detail", params: "productId", icon: <Eye className="h-4 w-4" />, status: 'complete', requiresAuth: true },
      ]
    },
    {
      title: "Shopping & Checkout",
      icon: <ShoppingCart className="h-5 w-5" />,
      routes: [
        { path: "/retailer/cart", label: "Shopping Cart", icon: <ShoppingCart className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/retailer/checkout", label: "Checkout", icon: <CreditCard className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/retailer/at-once", label: "At-Once Orders 🆕", icon: <Package className="h-4 w-4" />, status: 'complete', requiresAuth: true, description: "Immediate stock orders (40-60% of volume)" },
        { path: "/retailer/prebook", label: "Prebook Orders 🆕", icon: <Clock className="h-4 w-4" />, status: 'complete', requiresAuth: true, description: "Future seasons 3-6 months out (30-50% of volume)" },
        { path: "/retailer/prebook/spring-2025", label: "Spring '25 Prebook", params: "season", icon: <Clock className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/retailer/prebook/fall-2025", label: "Fall '25 Prebook", params: "season", icon: <Clock className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/retailer/closeouts", label: "Closeout Deals 🆕", icon: <TrendingUp className="h-4 w-4" />, status: 'complete', requiresAuth: true, description: "Time-limited clearance (10-20% of volume)" },
        { path: "/retailer/closeouts/active", label: "Active Closeout", params: "list-id", icon: <TrendingUp className="h-4 w-4" />, status: 'complete', requiresAuth: true },
      ]
    },
    {
      title: "Orders & History",
      icon: <ClipboardList className="h-5 w-5" />,
      routes: [
        { path: "/retailer/orders", label: "Order History", icon: <FileText className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/retailer/orders/ORD-2024-001", label: "Order Detail", params: "orderId", icon: <Eye className="h-4 w-4" />, status: 'complete', requiresAuth: true },
      ]
    },
    {
      title: "Resources & Support",
      icon: <Download className="h-5 w-5" />,
      routes: [
        { path: "/retailer/resources", label: "Resources & Downloads", icon: <Download className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/retailer/settings", label: "Account Settings", icon: <Settings className="h-4 w-4" />, status: 'complete', requiresAuth: true },
      ]
    },
    {
      title: "Future Features",
      icon: <Star className="h-5 w-5" />,
      routes: [
        { path: "/retailer/quotes", label: "Quote Requests", icon: <FileText className="h-4 w-4" />, status: 'pending', requiresAuth: true },
        { path: "/retailer/invoices", label: "Invoices", icon: <DollarSign className="h-4 w-4" />, status: 'pending', requiresAuth: true },
        { path: "/retailer/statements", label: "Statements", icon: <FileText className="h-4 w-4" />, status: 'pending', requiresAuth: true },
        { path: "/retailer/line-sheets", label: "Line Sheets", icon: <FileText className="h-4 w-4" />, status: 'pending', requiresAuth: true, description: "Downloadable product catalogs" },
      ]
    }
  ]

  const repRoutes: RouteSection[] = [
    {
      title: "Dashboard & Overview",
      icon: <BarChart className="h-5 w-5" />,
      routes: [
        { path: "/rep/dashboard", label: "Sales Rep Dashboard", icon: <Home className="h-4 w-4" />, status: 'complete', requiresAuth: true },
      ]
    },
    {
      title: "Customer Management",
      icon: <Users className="h-5 w-5" />,
      routes: [
        { path: "/rep/customers", label: "Customer List", icon: <Users className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/rep/customers/company-1", label: "Customer Detail", params: "customerId", icon: <Building className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/rep/order-for/company-1", label: "Order on Behalf", params: "customerId", icon: <ShoppingCart className="h-4 w-4" />, status: 'complete', requiresAuth: true },
      ]
    },
    {
      title: "Order Management",
      icon: <ClipboardList className="h-5 w-5" />,
      routes: [
        { path: "/rep/orders", label: "All Customer Orders", icon: <FileText className="h-4 w-4" />, status: 'complete', requiresAuth: true },
      ]
    },
    {
      title: "Sales Tools",
      icon: <Briefcase className="h-5 w-5" />,
      routes: [
        { path: "/rep/resources", label: "Sales Resources", icon: <Download className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/rep/settings", label: "Rep Settings", icon: <Settings className="h-4 w-4" />, status: 'complete', requiresAuth: true },
      ]
    },
    {
      title: "Order Type Management 🆕",
      icon: <Package className="h-5 w-5" />,
      routes: [
        { path: "/rep/prebooks", label: "Prebook Management", icon: <Clock className="h-4 w-4" />, status: 'complete', requiresAuth: true, description: "Season planning & tracking" },
        { path: "/rep/prebooks/spring-2025", label: "Spring '25 Orders", params: "season", icon: <Clock className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/rep/closeouts/manage", label: "Closeout Manager", icon: <TrendingUp className="h-4 w-4" />, status: 'complete', requiresAuth: true, description: "Create & assign lists" },
      ]
    },
    {
      title: "Future Features",
      icon: <Star className="h-5 w-5" />,
      routes: [
        { path: "/rep/quotes", label: "Quote Builder", icon: <FileText className="h-4 w-4" />, status: 'pending', requiresAuth: true },
        { path: "/rep/commission", label: "Commission Tracker", icon: <DollarSign className="h-4 w-4" />, status: 'pending', requiresAuth: true },
        { path: "/rep/leads", label: "Lead Management", icon: <UserCheck className="h-4 w-4" />, status: 'pending', requiresAuth: true },
        { path: "/rep/analytics", label: "Sales Analytics", icon: <TrendingUp className="h-4 w-4" />, status: 'pending', requiresAuth: true },
      ]
    }
  ]

  const adminRoutes: RouteSection[] = [
    {
      title: "Admin Dashboard",
      icon: <Shield className="h-5 w-5" />,
      routes: [
        { path: "/admin/dashboard", label: "Admin Dashboard", icon: <Home className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/admin/applications", label: "Application Review", icon: <ClipboardList className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/admin/applications/APP-001", label: "Application Detail", params: "applicationId", icon: <Eye className="h-4 w-4" />, status: 'complete', requiresAuth: true },
      ]
    },
    {
      title: "Order Type Administration 🆕",
      icon: <Package className="h-5 w-5" />,
      routes: [
        { path: "/admin/order-settings", label: "Order Type Settings", icon: <Settings className="h-4 w-4" />, status: 'complete', requiresAuth: true, description: "Configure order types" },
        { path: "/admin/seasons", label: "Season Management", icon: <Clock className="h-4 w-4" />, status: 'complete', requiresAuth: true, description: "Prebook seasons" },
        { path: "/admin/closeouts", label: "Closeout Builder", icon: <TrendingUp className="h-4 w-4" />, status: 'complete', requiresAuth: true, description: "Create closeout lists" },
      ]
    },
    {
      title: "Admin Management Tools",
      icon: <Database className="h-5 w-5" />,
      routes: [
        { path: "/admin/users", label: "User Management", icon: <Users className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/admin/products", label: "Product Management", icon: <Package className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/admin/pricing", label: "Pricing Rules", icon: <DollarSign className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/admin/catalogs", label: "Catalog Management", icon: <FileText className="h-4 w-4" />, status: 'complete', requiresAuth: true },
        { path: "/admin/analytics", label: "Platform Analytics", icon: <BarChart className="h-4 w-4" />, status: 'complete', requiresAuth: true },
      ]
    }
  ]

  const testCredentials = [
    { email: "john@outdoorretailers.com", role: "Retailer", company: "Outdoor Retailers Co.", tier: "Gold" },
    { email: "sarah@sportinggoods.com", role: "Retailer", company: "Sporting Goods Plus", tier: "Silver" },
    { email: "mike@adventuregear.com", role: "Retailer", company: "Adventure Gear Shop", tier: "Bronze" },
    { email: "tom@company.com", role: "Sales Rep", company: "B2B Company", tier: "N/A" },
    { email: "admin@company.com", role: "Admin", company: "B2B Company", tier: "N/A" },
  ]

  const getAllRoutes = () => {
    const all: RouteSection[] = [...publicRoutes]
    
    if (selectedUserType === 'all' || selectedUserType === 'retailer') {
      all.push(...retailerRoutes)
    }
    if (selectedUserType === 'all' || selectedUserType === 'rep') {
      all.push(...repRoutes)
    }
    if (selectedUserType === 'all' || selectedUserType === 'admin') {
      all.push(...adminRoutes)
    }
    
    return all
  }

  const getFilteredRoutes = () => {
    switch(selectedUserType) {
      case 'public':
        return publicRoutes
      case 'retailer':
        return retailerRoutes
      case 'rep':
        return repRoutes
      case 'admin':
        return adminRoutes
      case 'all':
      default:
        return getAllRoutes()
    }
  }

  const routes = getFilteredRoutes()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🚀 B2B Portal Quick Access</h1>
          <p className="text-gray-600 text-lg">
            Complete URL directory for testing and navigation
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">✅ Placeholder Routes Added</Badge>
            <Badge variant="secondary">Phase 4: 90% Complete</Badge>
            <Badge variant="outline">Next: Phase 5 - Custom Pricing</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Visual mockup demonstration • No backend • All data is static
          </p>
        </div>

        {/* Test Credentials */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Test Credentials - Now with Quick Demo Access!
            </CardTitle>
            <CardDescription>Click any role card on login page or use the header dropdown for instant switching</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testCredentials.map((cred, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{cred.role}</span>
                    {cred.tier !== "N/A" && <Badge variant="outline" className="text-xs">{cred.tier}</Badge>}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded flex-1">{cred.email}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(cred.email)}
                      >
                        {copiedPath === cred.email ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">{cred.company}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 mb-1">🚀 New Demo Features:</p>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Quick role switcher in header - no logout needed!</li>
                <li>• Visual role cards on login page - one-click access</li>
                <li>• Deep-link auto-login: /retailer/dashboard?role=retailer&scenario=at-once</li>
                <li>• Demo Scenario Launcher button (bottom-right) with pre-loaded carts</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* User Type Filter */}
        <div className="mb-6">
          <Tabs value={selectedUserType} onValueChange={(v) => setSelectedUserType(v as any)}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All Routes</TabsTrigger>
              <TabsTrigger value="public">Public</TabsTrigger>
              <TabsTrigger value="retailer">Retailer</TabsTrigger>
              <TabsTrigger value="rep">Sales Rep</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {routes.map((section, sectionIdx) => (
            <Card key={sectionIdx} className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {section.icon}
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {section.routes.map((route, routeIdx) => (
                    <div 
                      key={routeIdx}
                      className="group flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {route.icon}
                          <Link 
                            href={route.path}
                            className="font-medium text-sm hover:text-primary transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {route.label}
                          </Link>
                          {getStatusBadge(route.status)}
                          {route.requiresAuth && (
                            <Badge variant="outline" className="text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Auth
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-xs text-gray-500">{route.path}</code>
                          {route.params && (
                            <Badge variant="secondary" className="text-xs">
                              {route.params}
                            </Badge>
                          )}
                        </div>
                        {route.description && (
                          <p className="text-xs text-gray-500 mt-1">{route.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => copyToClipboard(route.path)}
                        >
                          {copiedPath === route.path ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          asChild
                        >
                          <Link href={route.path} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Routes Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              API Routes
            </CardTitle>
            <CardDescription>Server-side endpoints (require authentication)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm mb-2">Authentication</h3>
                <code className="block text-xs bg-gray-100 p-2 rounded">/api/auth</code>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-sm mb-2">Data Endpoints</h3>
                <code className="block text-xs bg-gray-100 p-2 rounded">/api/products</code>
                <code className="block text-xs bg-gray-100 p-2 rounded">/api/orders</code>
                <code className="block text-xs bg-gray-100 p-2 rounded">/api/placeholder/[width]/[height]</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Features Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Key Features by Business Value
            </CardTitle>
            <CardDescription>Core capabilities that differentiate this B2B portal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Revenue Drivers
                </h3>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• Tiered pricing (30/40/50% discounts)</li>
                  <li>• Quick reorder from history</li>
                  <li>• Smart reorder reminders (45 days)</li>
                  <li>• AI product recommendations</li>
                  <li>• Volume-based pricing breaks</li>
                  <li>• <strong className="text-green-600">✅ Prebook seasons (30-50% deposit)</strong></li>
                  <li>• <strong className="text-green-600">✅ Closeout deals (40-70% off)</strong></li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Efficiency Features
                </h3>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• Order on behalf of customer</li>
                  <li>• Multi-account management</li>
                  <li>• Bulk order operations</li>
                  <li>• QuickBooks integration ready</li>
                  <li>• Real-time inventory status</li>
                  <li>• <strong className="text-green-600">✅ Three order types system</strong></li>
                  <li>• <strong className="text-green-600">✅ Seasonal prebook management</strong></li>
                  <li>• <strong className="text-green-600">✅ Time-limited closeouts</strong></li>
                  <li>• <strong className="text-green-600">✅ Demo scenario launcher</strong></li>
                  <li>• <strong className="text-green-600">✅ Quick role switching</strong></li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  User Experience
                </h3>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• Mobile-responsive design</li>
                  <li>• Global search (Cmd+K)</li>
                  <li>• Advanced filtering system</li>
                  <li>• Saved searches & filters</li>
                  <li>• Customer 360° view</li>
                  <li>• <strong className="text-green-600">✅ One-click role selection</strong></li>
                  <li>• <strong className="text-green-600">✅ Deep-link auto-login</strong></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Metrics */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Expected Business Impact
            </CardTitle>
            <CardDescription>Projected improvements from portal implementation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">75%</p>
                <p className="text-xs text-gray-600">Faster Order Processing</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">30%</p>
                <p className="text-xs text-gray-600">↑ Reorder Frequency</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">20%</p>
                <p className="text-xs text-gray-600">↑ Average Order Value</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">90%</p>
                <p className="text-xs text-gray-600">Less Manual Entry</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pain Points Addressed */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Pain Points This Portal Solves
            </CardTitle>
            <CardDescription>Common wholesale challenges addressed by the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm mb-2">For Retailers</h3>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 text-green-600 mt-0.5" />
                    <span>Manual order entry and phone/email ordering</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 text-green-600 mt-0.5" />
                    <span>Lack of real-time inventory visibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 text-green-600 mt-0.5" />
                    <span>Pricing confusion across tiers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 text-green-600 mt-0.5" />
                    <span>Missing reorder opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 text-green-600 mt-0.5" />
                    <span>Difficulty accessing marketing materials</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-sm mb-2">For Sales Reps</h3>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 text-green-600 mt-0.5" />
                    <span>Juggling multiple accounts manually</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 text-green-600 mt-0.5" />
                    <span>Missing follow-up reminders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 text-green-600 mt-0.5" />
                    <span>Scattered customer information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 text-green-600 mt-0.5" />
                    <span>Manual commission tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-3 w-3 text-green-600 mt-0.5" />
                    <span>No visibility into customer behavior</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Development Status */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Development Phases
            </CardTitle>
            <CardDescription>Current progress and upcoming features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Phase 1-3: Core Features</p>
                    <p className="text-xs text-gray-600">Login, dashboards, products, cart, checkout</p>
                  </div>
                </div>
                <Badge variant="secondary">Complete</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-sm">Phase 4: Service Layer & Admin Portal</p>
                    <p className="text-xs text-gray-600">Config system, services, admin features (90% done)</p>
                  </div>
                </div>
                <Badge variant="secondary">Near Complete</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">✨ Route Scaffolding Complete</p>
                    <p className="text-xs text-gray-600">All admin and missing routes now have placeholder pages</p>
                  </div>
                </div>
                <Badge variant="secondary">Just Added!</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-sm">Phase 5: Custom Pricing & Catalogs</p>
                    <p className="text-xs text-gray-600">Customer-specific pricing, hidden products, SMUs</p>
                  </div>
                </div>
                <Badge variant="outline">After Order Types</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-sm">Phase 6: B2B Quote System</p>
                    <p className="text-xs text-gray-600">RFQ, quote builder, approval workflow</p>
                  </div>
                </div>
                <Badge variant="outline">Planned</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-sm">Missing: Onboarding Workflow</p>
                    <p className="text-xs text-gray-600">Dealer application, approval, welcome kit</p>
                  </div>
                </div>
                <Badge variant="destructive">Critical Gap</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Architecture */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Technical Architecture
            </CardTitle>
            <CardDescription>Stack and implementation approach</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-sm mb-2">Tech Stack</h3>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• Next.js 15 with App Router</li>
                  <li>• TypeScript for type safety</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Shadcn/ui components</li>
                  <li>• Mock JSON data (no backend)</li>
                  <li>• Vercel deployment ready</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-sm mb-2">AI-First Principles</h3>
                <ul className="text-xs space-y-1 text-gray-600">
                  <li>• Components under 500 lines</li>
                  <li>• Functional patterns only</li>
                  <li>• JSDoc comments on all functions</li>
                  <li>• Descriptive variable names</li>
                  <li>• Error-first approach</li>
                  <li>• Maps over enums</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Port: 3002 | Environment: Development | Auth: Mock</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/" className="hover:text-primary" target="_blank" rel="noopener noreferrer">Go to Home</Link>
            <Link href="/login" className="hover:text-primary" target="_blank" rel="noopener noreferrer">Go to Login</Link>
            <a href="http://localhost:3002" className="hover:text-primary" target="_blank" rel="noopener noreferrer">Open in Browser</a>
          </div>
          <p className="mt-4 text-xs">
            This is a visual demonstration prototype. No actual data is processed or stored.
          </p>
        </div>
      </div>
    </div>
  )
}