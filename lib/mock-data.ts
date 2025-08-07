/**
 * @description Mock data fetching utilities
 * @fileoverview Functions to load and filter mock data for demo purposes
 */

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: 'retailer' | 'sales_rep'
  companyId?: string
  repId?: string
}

export interface Company {
  id: string
  name: string
  type: string
  accountNumber: string
  taxId?: string
  creditLimit: number
  creditUsed: number
  paymentTerms: string
  yearToDatePurchases: number
  lastOrderDate: string
  status: string
  pricingTier: string
  primaryContact?: {
    name: string
    email: string
    phone: string
  }
  shippingAddresses?: Array<{
    id: string
    label: string
    address1: string
    address2?: string
    city: string
    state: string
    zip: string
    isDefault: boolean
  }>
  assignedRepId: string
}

export interface Order {
  id: string
  companyId: string
  orderDate: string
  poNumber: string
  requestedShipDate?: string
  status: string
  subtotal?: number
  tax?: number
  shipping?: number
  total: number
  items?: Array<{
    productId: string
    variantId?: string
    name: string
    sku?: string
    quantity: number
    unitPrice: number
    lineTotal: number
  }>
}

export interface Product {
  id: string
  sku: string
  name: string
  category: string
  subcategory: string
  description: string
  msrp: number
  images: string[]
  features?: string[]
  variants?: Array<{
    id: string
    color: string
    size: string
    sku: string
    inventory: number
    weight?: string
  }>
  pricing: {
    [tier: string]: {
      price: number
      minQuantity: number
    }
  }
  // Unified order type fields
  orderTypes?: ('at-once' | 'prebook' | 'closeout')[]
  tags?: string[]
  orderTypeMetadata?: {
    'at-once'?: {
      atsInventory?: number
      shipWithin?: number
      evergreenItem?: boolean
      stockLocation?: string[]
      backorderAvailable?: boolean
      expectedRestockDate?: string
    }
    'prebook'?: {
      season?: string
      collection?: string
      deliveryWindow?: {
        start: string
        end: string
      }
      depositPercent?: number
      cancellationDeadline?: string
      minimumUnits?: number
      requiresFullSizeRun?: boolean
    }
    'closeout'?: {
      originalPrice?: number
      discountPercent?: number
      availableQuantity?: number
      expiresAt?: string
      finalSale?: boolean
      minimumOrderQuantity?: number
    }
  }
}

export interface Metrics {
  retailerMetrics: {
    [companyId: string]: {
      recentActivity: Array<{
        date: string
        type: string
        description: string
        trackingNumber?: string
        amount?: number
      }>
      recommendations: string[]
    }
  }
  repMetrics: {
    topAccounts: Array<{
      companyName: string
      ytdPurchases: number
      trend: string
    }>
  }
}

export interface Resource {
  id: string
  title: string
  description: string
  category: string
  type: 'pdf' | 'video' | 'link'
  url: string
  size?: string
  updatedAt: string
}

function getServerBaseUrl(): string {
  // Prefer explicit base URL when provided
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL
  }
  // Vercel/hosted env
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }
  // Local dev fallback; Next exposes PORT
  const devDefaultPort = process.env.NODE_ENV === 'development' 
    ? (process.env.NEXT_PUBLIC_DEV_PORT || '3002')
    : '3000'
  const port = process.env.PORT || devDefaultPort
  return `http://localhost:${port}`
}

function resolveDataUrl(pathOrUrl: string): string {
  // In the browser, relative paths are fine
  if (typeof window !== 'undefined') {
    return pathOrUrl
  }
  // On the server, make absolute URLs for fetch
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }
  const base = getServerBaseUrl()
  return `${base}${pathOrUrl}`
}

async function fetchData(url: string, key: string) {
  try {
    const response = await fetch(resolveDataUrl(url))
    const data = await response.json()
    return data[key]
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error)
    return []
  }
}

export async function getCompanies(): Promise<Company[]> {
  return fetchData('/mockdata/companies.json', 'companies')
}

export async function getCompanyById(companyId: string): Promise<Company | null> {
  const companies = await getCompanies()
  return companies.find((c: Company) => c.id === companyId) || null
}

export async function getOrdersByCompanyId(companyId: string): Promise<Order[]> {
  const orders = await fetchData('/mockdata/orders.json', 'orders')
  if (companyId === '*') return orders // Return all orders for reps
  return orders.filter((o: Order) => o.companyId === companyId)
}

export async function getRetailerMetrics(companyId: string) {
  const data = await fetchData('/mockdata/metrics.json', 'metrics')
  return data?.retailerMetrics?.[companyId] || null
}

export async function getProducts(): Promise<Product[]> {
  return fetchData('/mockdata/products.json', 'products')
}

export async function getResources(): Promise<Resource[]> {
  return fetchData('/mockdata/resources.json', 'resources')
}

/**
 * @description Format currency values
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * @description Format date strings
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}