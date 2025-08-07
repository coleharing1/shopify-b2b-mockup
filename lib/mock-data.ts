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

/**
 * @description Fetch company data by ID
 */
export async function getCompanyById(companyId: string): Promise<Company | null> {
  try {
    const response = await fetch('/mockdata/companies.json')
    const data = await response.json()
    return data.companies.find((c: Company) => c.id === companyId) || null
  } catch (error) {
    console.error('Error fetching company:', error)
    return null
  }
}

/**
 * @description Fetch orders for a specific company
 */
export async function getOrdersByCompanyId(companyId: string): Promise<Order[]> {
  try {
    const response = await fetch('/mockdata/orders.json')
    const data = await response.json()
    return data.orders.filter((o: Order) => o.companyId === companyId)
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

/**
 * @description Fetch retailer metrics for a company
 */
export async function getRetailerMetrics(companyId: string) {
  try {
    const response = await fetch('/mockdata/metrics.json')
    const data: Metrics = await response.json()
    return data.retailerMetrics[companyId] || null
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return null
  }
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