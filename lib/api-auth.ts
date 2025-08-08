import { NextRequest } from 'next/server'
import { getCompanyById } from '@/lib/mock-data'
import { MOCK_USERS_BY_ID, parseSessionCookie } from '@/config/auth.config'

/**
 * Shared authentication utilities for API routes
 */

export interface AuthenticatedUser {
  id: string
  email: string
  name: string
  role: 'retailer' | 'sales_rep' | 'admin'
  companyId: string
  pricingTier?: string
}

/**
 * Verify session and return user with company context
 */
export async function verifySession(request: NextRequest): Promise<AuthenticatedUser | null> {
  const session = request.cookies.get('session')
  
  if (!session) {
    return null
  }

  // Parse session to get user ID using centralized helper
  const userId = parseSessionCookie(session.value)
  if (!userId) {
    return null
  }
  
  // Get user from centralized config
  const mockUser = MOCK_USERS_BY_ID[userId]
  if (!mockUser) {
    return null
  }
  
  // Convert to AuthenticatedUser format
  const user: Omit<AuthenticatedUser, 'pricingTier'> = {
    id: mockUser.id,
    email: mockUser.email,
    name: mockUser.name,
    companyId: mockUser.companyId,
    role: mockUser.role
  }
  
  // Get company pricing tier for retailers
  if (user.role === 'retailer' && user.companyId) {
    const company = await getCompanyById(user.companyId)
    if (company) {
      return {
        ...user,
        pricingTier: company.pricingTier
      }
    }
  }
  
  return user as AuthenticatedUser
}

/**
 * Check if user has access to view products for a specific company
 */
export function hasCompanyAccess(user: AuthenticatedUser, targetCompanyId: string): boolean {
  // Sales reps and admins can access any company
  if (user.role === 'sales_rep' || user.role === 'admin') {
    return true
  }
  
  // Retailers can only access their own company
  return user.companyId === targetCompanyId
}