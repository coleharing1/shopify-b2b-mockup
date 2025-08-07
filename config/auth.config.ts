/**
 * Centralized authentication configuration
 * Single source of truth for mock users and roles
 */

export interface MockUser {
  id: string
  email: string
  name: string
  role: 'retailer' | 'sales_rep' | 'admin'
  companyId: string
  companyName: string
}

// Single source of truth for all mock users
export const MOCK_USERS: Record<string, MockUser> = {
  'john@outdoorretailers.com': {
    id: 'user-1',
    email: 'john@outdoorretailers.com',
    name: 'John Smith',
    role: 'retailer',
    companyId: 'company-1',
    companyName: 'Outdoor Retailers Co.'
  },
  'sarah@urbanstyle.com': {
    id: 'user-2',
    email: 'sarah@urbanstyle.com',
    name: 'Sarah Johnson',
    role: 'retailer',
    companyId: 'company-2',
    companyName: 'Urban Style Boutique'
  },
  'mike@westcoastsports.com': {
    id: 'user-3',
    email: 'mike@westcoastsports.com',
    name: 'Mike Wilson',
    role: 'retailer',
    companyId: 'company-3',
    companyName: 'West Coast Sports'
  },
  'rep@company.com': {
    id: 'user-4',
    email: 'rep@company.com',
    name: 'Sales Rep',
    role: 'sales_rep',
    companyId: 'b2b-internal',
    companyName: 'B2B Portal'
  },
  'admin@company.com': {
    id: 'user-5',
    email: 'admin@company.com',
    name: 'Admin User',
    role: 'admin',
    companyId: 'b2b-internal',
    companyName: 'B2B Portal'
  }
}

// Map user IDs to users for quick lookup
export const MOCK_USERS_BY_ID: Record<string, MockUser> = Object.values(MOCK_USERS).reduce(
  (acc, user) => ({ ...acc, [user.id]: user }),
  {}
)

// Session cookie configuration
export const SESSION_CONFIG = {
  name: 'session',
  prefix: 'demo_',
  path: '/',
  // In production, add secure: true, sameSite: 'strict', httpOnly: true
}

// Helper to create session cookie value
export function createSessionCookie(userId: string): string {
  return `${SESSION_CONFIG.prefix}${userId}`
}

// Helper to parse session cookie value
export function parseSessionCookie(cookieValue: string): string | null {
  if (!cookieValue?.startsWith(SESSION_CONFIG.prefix)) return null
  return cookieValue.slice(SESSION_CONFIG.prefix.length)
}

// Auth API endpoints
export const AUTH_ENDPOINTS = {
  login: '/api/auth',
  logout: '/api/auth/logout',
  session: '/api/auth/session',
  refresh: '/api/auth/refresh'
}

// Protected routes configuration
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/apply',
  '/forgot-password',
  '/terms',
  '/privacy',
  '/select-account'
]

// Role-based redirect paths
export const ROLE_REDIRECTS: Record<string, string> = {
  retailer: '/retailer/dashboard',
  sales_rep: '/rep/dashboard',
  admin: '/admin/dashboard'
}