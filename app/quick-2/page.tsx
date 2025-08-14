"use client"

import React, { useState, useMemo, useCallback, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { 
  Search,
  Copy,
  Check,
  ExternalLink,
  Home,
  Package,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  BarChart,
  Shield,
  Globe,
  Zap,
  Sparkles,
  Code,
  Database,
  Rocket,
  Filter,
  Grid3X3,
  List,
  ChevronRight,
  BookOpen,
  Play,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  Plus,
  User,
  Edit,
  DollarSign,
  UserPlus,
  Book,
  Tag,
  CreditCard,
  ArrowUpRight,
  Terminal,
  Palette,
  Layers,
  ClipboardList,
  GitBranch,
  Activity,
  Command,
  Hash,
  Link2,
  Eye,
  EyeOff,
  Folder,
  FolderOpen,
  ChevronDown,
  Key
} from "lucide-react"

// Route data structure
interface Route {
  path: string
  label: string
  description?: string
  icon?: React.ReactNode
  status: 'complete' | 'partial' | 'pending' | 'planned'
  requiresAuth?: boolean
  params?: string[]
  tags?: string[]
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
}

interface RouteGroup {
  id: string
  title: string
  icon: React.ReactNode
  description?: string
  color: string
  routes: Route[]
}

// Status configuration
const statusConfig = {
  complete: { label: "Complete", icon: CheckCircle, color: "text-green-600 bg-green-50 border-green-200" },
  partial: { label: "Partial", icon: AlertCircle, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
  pending: { label: "Pending", icon: Clock, color: "text-blue-600 bg-blue-50 border-blue-200" },
  planned: { label: "Planned", icon: XCircle, color: "text-gray-500 bg-gray-50 border-gray-200" }
}

// View modes
type ViewMode = 'grid' | 'list' | 'compact'
type GroupBy = 'category' | 'status' | 'auth' | 'none'

export default function QuickAccessV2() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [searchQuery, setSearchQuery] = useState("")
  const [copiedPath, setCopiedPath] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<'all' | 'public' | 'retailer' | 'rep' | 'admin' | 'api'>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [groupBy, setGroupBy] = useState<GroupBy>('category')
  const [showDescription, setShowDescription] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['auth', 'retailer-core', 'rep-core', 'admin-core']))

  // Complete route data
  const routeGroups: RouteGroup[] = [
    // Public Routes
    {
      id: 'auth',
      title: "Authentication & Onboarding",
      icon: <Shield className="h-5 w-5" />,
      description: "Public access and authentication flows",
      color: "from-purple-500 to-pink-500",
      routes: [
        { path: "/", label: "Landing Page", icon: <Home />, status: 'complete', tags: ['public', 'marketing'] },
        { path: "/login", label: "Login", icon: <Shield />, status: 'complete', tags: ['auth'] },
        { path: "/apply", label: "Dealer Application", icon: <FileText />, status: 'complete', tags: ['onboarding'] },
        { path: "/apply/submitted", label: "Application Submitted", icon: <Check />, status: 'complete' },
        { path: "/apply/status/:id", label: "Application Status", params: ['id'], icon: <Clock />, status: 'complete' },
        { path: "/welcome/:companyId", label: "Welcome Kit", params: ['companyId'], icon: <Sparkles />, status: 'complete' },
        { path: "/select-account", label: "Account Selection", icon: <Users />, status: 'complete' },
      ]
    },
    // Retailer Routes
    {
      id: 'retailer-core',
      title: "Retailer Core",
      icon: <ShoppingCart className="h-5 w-5" />,
      description: "Essential retailer features",
      color: "from-blue-500 to-cyan-500",
      routes: [
        { path: "/retailer/dashboard", label: "Dashboard", icon: <BarChart />, status: 'complete', requiresAuth: true, tags: ['analytics'] },
        { path: "/retailer/products", label: "Product Catalog", icon: <Package />, status: 'complete', requiresAuth: true, tags: ['catalog'] },
        { path: "/retailer/products/:id", label: "Product Detail", params: ['id'], icon: <Eye />, status: 'complete', requiresAuth: true },
        { path: "/retailer/cart", label: "Shopping Cart", icon: <ShoppingCart />, status: 'complete', requiresAuth: true },
        { path: "/retailer/checkout", label: "Checkout", icon: <CreditCard />, status: 'complete', requiresAuth: true },
        { path: "/retailer/orders", label: "Order History", icon: <FileText />, status: 'complete', requiresAuth: true },
        { path: "/retailer/orders/:id", label: "Order Detail", params: ['id'], icon: <Eye />, status: 'complete', requiresAuth: true },
      ]
    },
    {
      id: 'retailer-order-types',
      title: "Order Types",
      icon: <Layers className="h-5 w-5" />,
      description: "Specialized ordering workflows",
      color: "from-green-500 to-emerald-500",
      routes: [
        { path: "/retailer/at-once", label: "At-Once Orders", icon: <Zap />, status: 'complete', requiresAuth: true, description: "Immediate delivery" },
        { path: "/retailer/prebook", label: "Prebook Orders", icon: <Clock />, status: 'complete', requiresAuth: true, description: "Future seasons" },
        { path: "/retailer/prebook/:season", label: "Season Prebook", params: ['season'], icon: <Calendar />, status: 'complete', requiresAuth: true },
        { path: "/retailer/closeouts", label: "Closeout Deals", icon: <TrendingUp />, status: 'complete', requiresAuth: true, description: "Clearance items" },
        { path: "/retailer/closeouts/:listId", label: "Closeout List", params: ['listId'], icon: <List />, status: 'complete', requiresAuth: true },
        { path: "/retailer/size-matrix", label: "Size Matrix Grid", icon: <Grid3X3 />, status: 'complete', requiresAuth: true, description: "Bulk ordering by size/color", tags: ['new'] },
        { path: "/retailer/quick-order", label: "Quick Order", icon: <Zap />, status: 'complete', requiresAuth: true, description: "Fast product ordering", tags: ['new'] },
      ]
    },
    {
      id: 'retailer-advanced',
      title: "Advanced Features",
      icon: <Star className="h-5 w-5" />,
      description: "Quotes, analytics, and resources",
      color: "from-yellow-500 to-orange-500",
      routes: [
        { path: "/retailer/quotes", label: "Quotes", icon: <FileText />, status: 'complete', requiresAuth: true },
        { path: "/retailer/quotes/request", label: "Request Quote", icon: <Plus />, status: 'complete', requiresAuth: true },
        { path: "/retailer/quotes/:id", label: "Quote Detail", params: ['id'], icon: <Eye />, status: 'complete', requiresAuth: true },
        { path: "/retailer/analytics", label: "Analytics", icon: <BarChart />, status: 'complete', requiresAuth: true },
        { path: "/retailer/reports", label: "Reports", icon: <FileText />, status: 'complete', requiresAuth: true },
        { path: "/retailer/resources", label: "Resources", icon: <BookOpen />, status: 'complete', requiresAuth: true },
        { path: "/retailer/settings", label: "Settings", icon: <Settings />, status: 'complete', requiresAuth: true },
        { path: "/retailer/invoices", label: "Invoices", icon: <FileText />, status: 'pending', requiresAuth: true },
        { path: "/retailer/statements", label: "Statements", icon: <FileText />, status: 'pending', requiresAuth: true },
      ]
    },
    // Sales Rep Routes
    {
      id: 'rep-core',
      title: "Sales Rep Core",
      icon: <Users className="h-5 w-5" />,
      description: "Customer management and orders",
      color: "from-indigo-500 to-purple-500",
      routes: [
        { path: "/rep/dashboard", label: "Dashboard", icon: <BarChart />, status: 'complete', requiresAuth: true },
        { path: "/rep/customers", label: "Customers", icon: <Users />, status: 'complete', requiresAuth: true },
        { path: "/rep/customers/:id", label: "Customer Detail", params: ['id'], icon: <User />, status: 'complete', requiresAuth: true },
        { path: "/rep/order-for/:customerId", label: "Order on Behalf", params: ['customerId'], icon: <ShoppingCart />, status: 'complete', requiresAuth: true },
        { path: "/rep/orders", label: "All Orders", icon: <FileText />, status: 'complete', requiresAuth: true },
        { path: "/rep/products", label: "Products", icon: <Package />, status: 'complete', requiresAuth: true },
      ]
    },
    {
      id: 'rep-advanced',
      title: "Rep Advanced",
      icon: <Rocket className="h-5 w-5" />,
      description: "Quotes, analytics, and management",
      color: "from-pink-500 to-rose-500",
      routes: [
        { path: "/rep/quotes", label: "Quotes", icon: <FileText />, status: 'complete', requiresAuth: true },
        { path: "/rep/quotes/new", label: "Create Quote", icon: <Plus />, status: 'complete', requiresAuth: true },
        { path: "/rep/quotes/:id", label: "Quote Detail", params: ['id'], icon: <Eye />, status: 'complete', requiresAuth: true },
        { path: "/rep/quotes/:id/edit", label: "Edit Quote", params: ['id'], icon: <Edit />, status: 'complete', requiresAuth: true },
        { path: "/rep/quotes/templates", label: "Templates", icon: <Layers />, status: 'complete', requiresAuth: true },
        { path: "/rep/prebooks", label: "Prebook Management", icon: <Clock />, status: 'complete', requiresAuth: true },
        { path: "/rep/closeouts/manage", label: "Closeout Manager", icon: <TrendingUp />, status: 'complete', requiresAuth: true },
        { path: "/rep/analytics", label: "Analytics", icon: <BarChart />, status: 'complete', requiresAuth: true },
        { path: "/rep/insights", label: "Insights", icon: <TrendingUp />, status: 'complete', requiresAuth: true },
        { path: "/rep/reports", label: "Reports", icon: <FileText />, status: 'complete', requiresAuth: true },
        { path: "/rep/resources", label: "Resources", icon: <BookOpen />, status: 'complete', requiresAuth: true },
        { path: "/rep/settings", label: "Settings", icon: <Settings />, status: 'complete', requiresAuth: true },
        { path: "/rep/commission", label: "Commission", icon: <DollarSign />, status: 'pending', requiresAuth: true },
        { path: "/rep/leads", label: "Leads", icon: <UserPlus />, status: 'pending', requiresAuth: true },
      ]
    },
    // Admin Routes
    {
      id: 'admin-core',
      title: "Admin Core",
      icon: <Shield className="h-5 w-5" />,
      description: "System administration",
      color: "from-red-500 to-pink-500",
      routes: [
        { path: "/admin/dashboard", label: "Dashboard", icon: <BarChart />, status: 'complete', requiresAuth: true },
        { path: "/admin/applications", label: "Applications", icon: <FileText />, status: 'complete', requiresAuth: true },
        { path: "/admin/applications/:id", label: "Application Detail", params: ['id'], icon: <Eye />, status: 'complete', requiresAuth: true },
        { path: "/admin/users", label: "User Management", icon: <Users />, status: 'complete', requiresAuth: true },
        { path: "/admin/order-settings", label: "Order Settings", icon: <Settings />, status: 'complete', requiresAuth: true },
      ]
    },
    {
      id: 'admin-catalog',
      title: "Catalog Management",
      icon: <Package className="h-5 w-5" />,
      description: "Products, pricing, and catalogs",
      color: "from-teal-500 to-cyan-500",
      routes: [
        { path: "/admin/products", label: "Products", icon: <Package />, status: 'complete', requiresAuth: true },
        { path: "/admin/products/:id", label: "Product Detail", params: ['id'], icon: <Eye />, status: 'complete', requiresAuth: true },
        { path: "/admin/pricing", label: "Pricing Rules", icon: <DollarSign />, status: 'complete', requiresAuth: true },
        { path: "/admin/catalogs", label: "Catalogs", icon: <Book />, status: 'complete', requiresAuth: true },
        { path: "/admin/catalogs/:id", label: "Catalog Detail", params: ['id'], icon: <Eye />, status: 'complete', requiresAuth: true },
        { path: "/admin/price-lists", label: "Price Lists", icon: <List />, status: 'complete', requiresAuth: true },
        { path: "/admin/price-lists/:id", label: "Price List Detail", params: ['id'], icon: <Eye />, status: 'complete', requiresAuth: true },
        { path: "/admin/assignments", label: "Assignments", icon: <Link2 />, status: 'complete', requiresAuth: true },
        { path: "/admin/seasons", label: "Seasons", icon: <Calendar />, status: 'complete', requiresAuth: true },
        { path: "/admin/closeouts", label: "Closeouts", icon: <Tag />, status: 'complete', requiresAuth: true },
      ]
    },
    {
      id: 'admin-analytics',
      title: "Analytics & Reports",
      icon: <Activity className="h-5 w-5" />,
      description: "Business intelligence",
      color: "from-violet-500 to-purple-500",
      routes: [
        { path: "/admin/analytics", label: "Analytics", icon: <BarChart />, status: 'complete', requiresAuth: true },
        { path: "/admin/forecasting", label: "Forecasting", icon: <TrendingUp />, status: 'complete', requiresAuth: true },
        { path: "/admin/reports", label: "Reports", icon: <FileText />, status: 'complete', requiresAuth: true },
      ]
    },
    // Development Routes
    {
      id: 'dev',
      title: "Development",
      icon: <Code className="h-5 w-5" />,
      description: "Testing and development tools",
      color: "from-gray-600 to-gray-800",
      routes: [
        { path: "/quick", label: "Quick v1 (Legacy)", icon: <Hash />, status: 'complete' },
        { path: "/quick-2", label: "Quick v2 (This Page)", icon: <Sparkles />, status: 'complete' },
        { path: "/playground", label: "Component Playground", icon: <Palette />, status: 'complete' },
        { path: "/layout-test", label: "Layout Test", icon: <Layers />, status: 'complete' },
        { path: "/search", label: "Global Search", icon: <Search />, status: 'complete' },
      ]
    }
  ]

  // API Routes
  const apiRoutes: Route[] = [
    // Core APIs
    { path: "/api/auth", label: "Authentication", method: 'POST', status: 'complete', tags: ['auth'] },
    { path: "/api/applications", label: "Applications", method: 'GET', status: 'complete', tags: ['onboarding'] },
    { path: "/api/orders", label: "Orders", method: 'GET', status: 'complete', tags: ['orders'] },
    { path: "/api/orders/order-writer/template", label: "Excel Template", method: 'GET', status: 'complete', tags: ['orders', 'excel', 'new'] },
    { path: "/api/orders/order-writer/import", label: "Import Excel Order", method: 'POST', status: 'complete', tags: ['orders', 'excel', 'new'] },
    { path: "/api/placeholder/:width/:height", label: "Image Placeholder", method: 'GET', status: 'complete', params: ['width', 'height'] },
    // Products
    { path: "/api/products", label: "Products", method: 'GET', status: 'complete', tags: ['catalog'] },
    { path: "/api/products/at-once", label: "At-Once Products", method: 'GET', status: 'complete', tags: ['catalog'] },
    { path: "/api/products/prebook", label: "Prebook Products", method: 'GET', status: 'complete', tags: ['catalog'] },
    { path: "/api/products/closeout", label: "Closeout Products", method: 'GET', status: 'complete', tags: ['catalog'] },
    { path: "/api/products/tags", label: "Product Tags", method: 'GET', status: 'complete', tags: ['catalog'] },
    { path: "/api/products/bulk", label: "Bulk Products", method: 'POST', status: 'complete', tags: ['catalog'] },
    { path: "/api/products/variants", label: "Product Variants", method: 'GET', status: 'complete', tags: ['catalog'] },
    // Pricing & Catalogs
    { path: "/api/catalogs", label: "Catalogs", method: 'GET', status: 'complete', tags: ['catalog'] },
    { path: "/api/pricing/calculate", label: "Calculate Pricing", method: 'POST', status: 'complete', tags: ['pricing'] },
    // Quotes
    { path: "/api/quotes", label: "Quotes", method: 'GET', status: 'complete', tags: ['quotes'] },
    { path: "/api/quotes/:id", label: "Quote Detail", method: 'GET', status: 'complete', params: ['id'], tags: ['quotes'] },
    { path: "/api/quotes/:id/convert", label: "Convert Quote", method: 'POST', status: 'complete', params: ['id'], tags: ['quotes'] },
    { path: "/api/quotes/:id/pdf", label: "Quote PDF", method: 'GET', status: 'complete', params: ['id'], tags: ['quotes'] },
    { path: "/api/quotes/templates", label: "Quote Templates", method: 'GET', status: 'complete', tags: ['quotes'] },
    { path: "/api/quotes/check-expiration", label: "Check Expiration", method: 'GET', status: 'complete', tags: ['quotes'] },
    { path: "/api/quotes/expiring", label: "Expiring Quotes", method: 'GET', status: 'complete', tags: ['quotes'] },
    // Analytics
    { path: "/api/analytics/sales", label: "Sales Analytics", method: 'GET', status: 'complete', tags: ['analytics'] },
    { path: "/api/analytics/inventory", label: "Inventory Analytics", method: 'GET', status: 'complete', tags: ['analytics'] },
    { path: "/api/analytics/customers", label: "Customer Analytics", method: 'GET', status: 'complete', tags: ['analytics'] },
    { path: "/api/analytics/kpi", label: "KPI Metrics", method: 'GET', status: 'complete', tags: ['analytics'] },
    { path: "/api/reports/generate", label: "Generate Report", method: 'POST', status: 'complete', tags: ['reports'] },
  ]

  // Test credentials
  const credentials = [
    { email: "john@outdoorretailers.com", role: "Retailer", company: "Outdoor Retailers", tier: "Gold", color: "from-yellow-400 to-orange-500" },
    { email: "sarah@urbanstyle.com", role: "Retailer", company: "Urban Style", tier: "Silver", color: "from-gray-400 to-gray-600" },
    { email: "mike@westcoastsports.com", role: "Retailer", company: "West Coast Sports", tier: "Bronze", color: "from-orange-600 to-red-600" },
    { email: "rep@company.com", role: "Sales Rep", company: "B2B Portal", tier: null, color: "from-blue-500 to-indigo-600" },
    { email: "admin@company.com", role: "Admin", company: "B2B Portal", tier: null, color: "from-purple-500 to-pink-600" },
  ]

  // Helper functions
  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedPath(text)
    setTimeout(() => setCopiedPath(null), 2000)
  }, [])

  const getFullUrl = useCallback((path: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3100'
    // Add role query param for auth routes
    if (path.startsWith('/retailer')) return `${baseUrl}${path}?role=retailer`
    if (path.startsWith('/rep')) return `${baseUrl}${path}?role=rep`
    if (path.startsWith('/admin')) return `${baseUrl}${path}?role=admin`
    return `${baseUrl}${path}`
  }, [])

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }, [])

  // Filtering logic
  const filteredData = useMemo(() => {
    let groups = [...routeGroups]
    let apis = [...apiRoutes]

    // Filter by role
    if (selectedRole !== 'all' && selectedRole !== 'api') {
      groups = groups.filter(group => {
        if (selectedRole === 'public') return group.id === 'auth' || group.id === 'dev'
        if (selectedRole === 'retailer') return group.id.startsWith('retailer')
        if (selectedRole === 'rep') return group.id.startsWith('rep')
        if (selectedRole === 'admin') return group.id.startsWith('admin')
        return false
      })
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      groups = groups.map(group => ({
        ...group,
        routes: group.routes.filter(route =>
          route.label.toLowerCase().includes(query) ||
          route.path.toLowerCase().includes(query) ||
          route.description?.toLowerCase().includes(query) ||
          route.tags?.some(tag => tag.toLowerCase().includes(query))
        )
      })).filter(group => group.routes.length > 0)

      apis = apis.filter(route =>
        route.label.toLowerCase().includes(query) ||
        route.path.toLowerCase().includes(query) ||
        route.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return { groups, apis }
  }, [selectedRole, searchQuery])

  // Stats calculation
  const stats = useMemo(() => {
    const allRoutes = [...routeGroups.flatMap(g => g.routes), ...apiRoutes]
    const byStatus = allRoutes.reduce((acc, route) => {
      acc[route.status] = (acc[route.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: allRoutes.length,
      complete: byStatus.complete || 0,
      partial: byStatus.partial || 0,
      pending: byStatus.pending || 0,
      planned: byStatus.planned || 0,
      completion: Math.round(((byStatus.complete || 0) / allRoutes.length) * 100)
    }
  }, [])

  // Render route card
  const RouteCard = ({ route, groupColor }: { route: Route; groupColor: string }) => (
    <div className="group relative flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200">
      <div className="flex-shrink-0">
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", statusConfig[route.status].color)}>
          {route.icon || <Link2 className="h-4 w-4" />}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <Link
          href={route.path.replace(':id', '1').replace(':customerId', 'company-1').replace(':season', 'spring-2025').replace(':listId', 'active').replace(':width', '400').replace(':height', '300')}
          className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
          target="_blank"
        >
          {route.label}
        </Link>
        {route.description && showDescription && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{route.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          <code className="text-xs text-gray-400 font-mono">{route.path}</code>
          {route.method && (
            <Badge variant="outline" className="text-xs h-4 px-1">
              {route.method}
            </Badge>
          )}
          {route.requiresAuth && (
            <Shield className="h-3 w-3 text-gray-400" />
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.preventDefault()
            copyToClipboard(getFullUrl(route.path))
          }}
        >
          {copiedPath === getFullUrl(route.path) ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
          asChild
        >
          <Link href={route.path.replace(':id', '1').replace(':customerId', 'company-1').replace(':season', 'spring-2025').replace(':listId', 'active')} target="_blank">
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Quick Access v2
                </h1>
              </div>
              <Badge variant="outline" className="hidden sm:inline-flex">
                {stats.total} routes • {stats.completion}% complete
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDescription(!showDescription)}
                className="hidden lg:inline-flex"
              >
                {showDescription ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-none border-x"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'compact' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setViewMode('compact')}
                >
                  <Terminal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search routes, paths, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2"
                  onClick={() => setSearchQuery("")}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as any)} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-6 h-10">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="public">Public</TabsTrigger>
                <TabsTrigger value="retailer">Retailer</TabsTrigger>
                <TabsTrigger value="rep">Rep</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Object.entries(statusConfig).map(([key, config]) => (
              <div
                key={key}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg border",
                  config.color
                )}
              >
                <div className="flex items-center gap-2">
                  <config.icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{config.label}</span>
                </div>
                <span className="text-sm font-bold">{stats[key as keyof typeof stats] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Credentials Card */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Key className="h-5 w-5" />
              Test Credentials
            </h3>
          </div>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {credentials.map((cred, idx) => (
                <div
                  key={idx}
                  className="group relative overflow-hidden rounded-lg border hover:shadow-md transition-all"
                >
                  <div className={cn("absolute inset-0 opacity-5 bg-gradient-to-br", cred.color)} />
                  <div className="relative p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{cred.role}</span>
                      {cred.tier && (
                        <Badge variant="outline" className="text-xs">
                          {cred.tier}
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded flex-1 truncate">
                          {cred.email}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          onClick={() => copyToClipboard(cred.email)}
                        >
                          {copiedPath === cred.email ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">{cred.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        {selectedRole === 'api' ? (
          // API Routes View
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                API Endpoints
              </CardTitle>
              <CardDescription>
                {filteredData.apis.length} endpoints available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={cn(
                viewMode === 'grid' && "grid grid-cols-1 lg:grid-cols-2 gap-2",
                viewMode === 'list' && "space-y-1",
                viewMode === 'compact' && "space-y-0.5"
              )}>
                {filteredData.apis.map((route, idx) => (
                  <RouteCard key={idx} route={route} groupColor="from-gray-500 to-gray-700" />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          // Page Routes View
          <div className="space-y-4">
            {filteredData.groups.map((group) => (
              <Card key={group.id} className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => toggleGroup(group.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-10 w-10 rounded-lg bg-gradient-to-br flex items-center justify-center text-white", group.color)}>
                        {group.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{group.title}</CardTitle>
                        {group.description && (
                          <CardDescription className="text-xs mt-0.5">
                            {group.description}
                          </CardDescription>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {group.routes.length} routes
                      </Badge>
                      <ChevronDown className={cn(
                        "h-5 w-5 text-gray-400 transition-transform",
                        expandedGroups.has(group.id) && "rotate-180"
                      )} />
                    </div>
                  </div>
                </CardHeader>
                {expandedGroups.has(group.id) && (
                  <CardContent className="pt-0">
                    <div className={cn(
                      viewMode === 'grid' && "grid grid-cols-1 lg:grid-cols-2 gap-2",
                      viewMode === 'list' && "space-y-1",
                      viewMode === 'compact' && "space-y-0.5"
                    )}>
                      {group.routes.map((route, idx) => (
                        <RouteCard key={idx} route={route} groupColor={group.color} />
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <Link href="/login" className="hover:text-blue-600">Login</Link>
            <Link href="/quick" className="hover:text-blue-600">Quick v1</Link>
            <a href="https://github.com" target="_blank" className="hover:text-blue-600">GitHub</a>
          </div>
          <p>B2B Portal • Port: 3100 • Environment: Development</p>
          <p className="mt-2 text-xs">
            Press <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border rounded">⌘K</kbd> for quick search
          </p>
        </div>
      </div>
    </div>
  )
}