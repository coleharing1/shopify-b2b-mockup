"use client"

/**
 * @fileoverview Quick-3: High-performance quick navigation hub with search, filters, and role-aware links.
 * @description Reimagined quick page with compact cards, fast filtering, keyboard nav, and copy/open actions.
 */

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Search, Copy, Check, ExternalLink, Shield, Filter, Zap, Rocket, Star } from 'lucide-react'

type RouteStatus = 'complete' | 'partial' | 'pending'

type RouteLink = {
  path: string
  label: string
  status: RouteStatus
  requiresAuth?: boolean
  description?: string
  isNew?: boolean
}

type RouteSection = {
  key: 'public' | 'retailer' | 'rep' | 'admin'
  title: string
  routes: RouteLink[]
}

const STATUS_TO_BADGE: Record<RouteStatus, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  complete: { label: 'Complete', variant: 'secondary' },
  partial: { label: 'Partial', variant: 'secondary' },
  pending: { label: 'Pending', variant: 'outline' },
}

function appendRoleQuery(path: string, role: 'retailer' | 'rep' | 'admin' | 'none'): string {
  if (role === 'none') return path
  const isRolePath = path.startsWith(`/${role}`)
  if (!isRolePath) return path
  const hasQuery = path.includes('?')
  return `${path}${hasQuery ? '&' : '?'}role=${role}`
}

const allSections: RouteSection[] = [
  {
    key: 'public',
    title: 'Public',
    routes: [
      { path: '/', label: 'Home', status: 'complete' },
      { path: '/login', label: 'Login', status: 'complete' },
      { path: '/search', label: 'Global Search', status: 'complete' },
      { path: '/quick', label: 'Quick (legacy)', status: 'complete' },
      { path: '/quick-3', label: 'Quick-3 (this page)', status: 'complete' },
      { path: '/apply', label: 'Dealer Application', status: 'complete' },
      { path: '/apply/submitted', label: 'Application Submitted', status: 'complete' },
      { path: '/apply/status/APP-2025-001', label: 'Application Status', status: 'complete' },
      { path: '/welcome/company-1', label: 'Welcome Kit', status: 'complete' },
      { path: '/select-account', label: 'Account Selection', status: 'complete' },
    ],
  },
  {
    key: 'retailer',
    title: 'Retailer',
    routes: [
      { path: '/retailer/dashboard', label: 'Dashboard', status: 'complete', requiresAuth: true },
      { path: '/retailer/products', label: 'Products', status: 'complete', requiresAuth: true },
      { path: '/retailer/products-v2', label: 'Products V2 (Enhanced)', status: 'complete', requiresAuth: true, description: 'Enhanced product catalog with advanced filtering and B2B features', isNew: true },
      { path: '/retailer/products/PROD-001', label: 'Product Detail', status: 'complete', requiresAuth: true },
      { path: '/retailer/product-detail-v2/PROD-001', label: 'Product Detail V2 (Enhanced)', status: 'complete', requiresAuth: true, description: 'Enhanced product detail with size matrices and bulk ordering', isNew: true },
      { path: '/retailer/catalogs-v2', label: 'Catalogs V2 (Enhanced)', status: 'complete', requiresAuth: true, description: 'Visual catalog selection inspired by LaCrosse B2B platform', isNew: true },
      { path: '/retailer/cart', label: 'Cart', status: 'complete', requiresAuth: true },
      { path: '/retailer/checkout', label: 'Checkout', status: 'complete', requiresAuth: true },
      { path: '/retailer/at-once', label: 'At-Once', status: 'complete', requiresAuth: true },
      { path: '/retailer/prebook', label: 'Prebook', status: 'complete', requiresAuth: true },
      { path: '/retailer/prebook/spring-2025', label: "Prebook Season ('Spring 2025')", status: 'complete', requiresAuth: true },
      { path: '/retailer/closeouts', label: 'Closeouts', status: 'complete', requiresAuth: true },
      { path: '/retailer/closeouts/active', label: 'Closeout Active', status: 'complete', requiresAuth: true },
      { path: '/retailer/orders', label: 'Orders', status: 'complete', requiresAuth: true },
      { path: '/retailer/orders/ORD-2024-001', label: 'Order Detail', status: 'complete', requiresAuth: true },
      { path: '/retailer/resources', label: 'Resources', status: 'complete', requiresAuth: true },
      { path: '/retailer/settings', label: 'Settings', status: 'complete', requiresAuth: true },
      { path: '/retailer/quotes', label: 'Quotes', status: 'partial', requiresAuth: true },
      { path: '/retailer/quotes/request', label: 'Request Quote', status: 'partial', requiresAuth: true },
      { path: '/retailer/quotes/QUOTE-001', label: 'Quote Detail', status: 'partial', requiresAuth: true },
    ],
  },
  {
    key: 'rep',
    title: 'Sales Rep',
    routes: [
      { path: '/rep/dashboard', label: 'Dashboard', status: 'complete', requiresAuth: true },
      { path: '/rep/customers', label: 'Customers', status: 'complete', requiresAuth: true },
      { path: '/rep/customers/company-1', label: 'Customer Detail', status: 'complete', requiresAuth: true },
      { path: '/rep/order-for/company-1', label: 'Order On Behalf', status: 'complete', requiresAuth: true },
      { path: '/rep/orders', label: 'Orders', status: 'complete', requiresAuth: true },
      { path: '/rep/resources', label: 'Resources', status: 'complete', requiresAuth: true },
      { path: '/rep/settings', label: 'Settings', status: 'complete', requiresAuth: true },
      { path: '/rep/prebooks', label: 'Prebooks', status: 'complete', requiresAuth: true },
      { path: '/rep/prebooks/spring-2025', label: "Prebook Season ('Spring 2025')", status: 'complete', requiresAuth: true },
      { path: '/rep/closeouts/manage', label: 'Closeouts Manager', status: 'complete', requiresAuth: true },
      { path: '/rep/products', label: 'Products', status: 'complete', requiresAuth: true },
      { path: '/rep/quotes', label: 'Quote Dashboard', status: 'partial', requiresAuth: true },
      { path: '/rep/quotes/new', label: 'Create Quote', status: 'partial', requiresAuth: true },
      { path: '/rep/quotes/QUOTE-001', label: 'Quote Detail', status: 'partial', requiresAuth: true },
      { path: '/rep/quotes/QUOTE-001/edit', label: 'Edit Quote', status: 'partial', requiresAuth: true },
      { path: '/rep/quotes/templates', label: 'Quote Templates', status: 'partial', requiresAuth: true },
      { path: '/rep/analytics', label: 'Analytics', status: 'complete', requiresAuth: true },
    ],
  },
  {
    key: 'admin',
    title: 'Admin',
    routes: [
      { path: '/admin/dashboard', label: 'Dashboard', status: 'complete', requiresAuth: true },
      { path: '/admin/applications', label: 'Applications', status: 'complete', requiresAuth: true },
      { path: '/admin/applications/APP-001', label: 'Application Detail', status: 'complete', requiresAuth: true },
      { path: '/admin/order-settings', label: 'Order Settings', status: 'complete', requiresAuth: true },
      { path: '/admin/seasons', label: 'Seasons', status: 'complete', requiresAuth: true },
      { path: '/admin/closeouts', label: 'Closeouts', status: 'complete', requiresAuth: true },
      { path: '/admin/users', label: 'Users', status: 'complete', requiresAuth: true },
      { path: '/admin/products', label: 'Products', status: 'complete', requiresAuth: true },
      { path: '/admin/products/PROD-001', label: 'Product Detail', status: 'complete', requiresAuth: true },
      { path: '/admin/pricing', label: 'Pricing', status: 'complete', requiresAuth: true },
      { path: '/admin/catalogs', label: 'Catalogs', status: 'complete', requiresAuth: true },
      { path: '/admin/price-lists', label: 'Price Lists', status: 'complete', requiresAuth: true },
      { path: '/admin/price-lists/PL-001', label: 'Price List Detail', status: 'complete', requiresAuth: true },
      { path: '/admin/assignments', label: 'Assignments', status: 'complete', requiresAuth: true },
      { path: '/admin/analytics', label: 'Analytics', status: 'complete', requiresAuth: true },
      { path: '/admin/forecasting', label: 'Forecasting', status: 'complete', requiresAuth: true },
      { path: '/admin/reports', label: 'Reports', status: 'complete', requiresAuth: true },
      { path: '/admin/shipping-management', label: 'Shipping Management (Enhanced)', status: 'complete', requiresAuth: true, description: 'Professional shipping platform with carrier mapping and rules', isNew: true },
    ],
  },
]

export default function Quick3Page() {
  const [searchQuery, setSearchQuery] = useState('')
  const [role, setRole] = useState<'none' | 'retailer' | 'rep' | 'admin'>(() => {
    if (typeof window === 'undefined') return 'none'
    return (localStorage.getItem('quick3-role') as any) || 'retailer'
  })
  const [copiedPath, setCopiedPath] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('quick3-role', role)
  }, [role])

  const filteredSections = useMemo(() => {
    const term = searchQuery.trim().toLowerCase()
    if (!term) return allSections
    return allSections.map(section => ({
      ...section,
      routes: section.routes.filter(r =>
        r.label.toLowerCase().includes(term) ||
        r.path.toLowerCase().includes(term) ||
        r.description?.toLowerCase().includes(term)
      )
    }))
  }, [searchQuery])

  const totalCount = useMemo(() => filteredSections.reduce((sum, s) => sum + s.routes.length, 0), [filteredSections])
  const newCount = useMemo(() => filteredSections.reduce((sum, s) => sum + s.routes.filter(r => r.isNew).length, 0), [filteredSections])

  const copyFullUrl = (path: string) => {
    const base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3100'
    const finalPath = appendRoleQuery(path, role)
    const url = `${base}${finalPath}`
    navigator.clipboard.writeText(url)
    setCopiedPath(path)
    setTimeout(() => setCopiedPath(null), 2000)
  }

  const StatusBadge = ({ status }: { status: RouteStatus }) => {
    const { label, variant } = STATUS_TO_BADGE[status]
    return <Badge variant={variant} className="text-[10px]">{label}</Badge>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" /> Quick Navigator 3
            </h1>
            <p className="text-sm text-muted-foreground">Fast route finder with role-aware links and copy actions.</p>
            {newCount > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <Badge className="bg-green-500 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  {newCount} New Enhanced Pages
                </Badge>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Tabs value={role} onValueChange={(v) => setRole(v as any)}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="none">No role</TabsTrigger>
                <TabsTrigger value="retailer">Retailer</TabsTrigger>
                <TabsTrigger value="rep">Rep</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <div className="relative w-full md:max-w-xl">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by path, label, or description..."
                  className="pl-9"
                  aria-label="Search routes"
                />
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {totalCount} results
                {newCount > 0 && (
                  <>
                    <span>•</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {newCount} new
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSections.map(section => (
            <Card key={section.key} className="border-muted">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  {section.title}
                  <Badge variant="secondary" className="ml-1">{section.routes.length}</Badge>
                  {section.routes.some(r => r.isNew) && (
                    <Badge className="bg-green-500 text-white text-[10px]">
                      {section.routes.filter(r => r.isNew).length} new
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>Role: {section.title}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="divide-y">
                  {section.routes.map((route) => {
                    const finalHref = appendRoleQuery(route.path, role)
                    return (
                      <div key={`${section.key}:${route.path}`} className="flex items-center justify-between py-2">
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2">
                            <Link href={finalHref} target="_blank" rel="noopener noreferrer" className="font-medium truncate hover:text-primary">
                              {route.label}
                            </Link>
                            <StatusBadge status={route.status} />
                            {route.requiresAuth && (
                              <Badge variant="outline" className="text-[10px]">
                                <Shield className="h-3 w-3 mr-1" /> Auth
                              </Badge>
                            )}
                            {route.isNew && (
                              <Badge className="bg-green-500 text-white text-[10px]">
                                <Star className="h-3 w-3 mr-1" /> New
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground truncate mt-0.5">{finalHref}</div>
                          {route.description && (
                            <div className="text-xs text-muted-foreground mt-1 leading-tight">
                              {route.description}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => copyFullUrl(route.path)} aria-label="Copy full URL">
                            {copiedPath === route.path ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                          <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0" aria-label="Open in new tab">
                            <Link href={finalHref} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Enhanced Pages Summary */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                New Enhanced Pages Available
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3 border">
                  <div className="font-medium text-blue-600">Products V2</div>
                  <div className="text-gray-600">Advanced filtering & B2B features</div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <div className="font-medium text-blue-600">Product Detail V2</div>
                  <div className="text-gray-600">Size matrices & bulk ordering</div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <div className="font-medium text-blue-600">Catalogs V2</div>
                  <div className="text-gray-600">Visual catalog selection</div>
                </div>
                <div className="bg-white rounded-lg p-3 border">
                  <div className="font-medium text-blue-600">Shipping Management</div>
                  <div className="text-gray-600">Professional carrier mapping</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                These pages incorporate design patterns from Under Armour, LaCrosse, and other professional B2B platforms
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground mt-8">
          <p className="inline-flex items-center gap-1"><Zap className="h-4 w-4" /> Optimized for fast filtering and minimal re-renders.</p>
        </div>
      </div>
    </div>
  )
}
