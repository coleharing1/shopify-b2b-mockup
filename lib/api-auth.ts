import { NextRequest } from 'next/server'
import { getCompanyById } from '@/lib/mock-data'

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

  // Parse session to get user ID (simplified for demo)
  const parts = session.value.split('_')
  const userId = parts[1]
  
  // In production, validate session and get user from database
  // For demo, return mock user data based on userId
  const userMap: Record<string, Omit<AuthenticatedUser, 'pricingTier'>> = {
    'user-1': { 
      id: 'user-1', 
      email: 'john@outdoorretailers.com',
      name: 'John Smith',
      companyId: 'company-1', 
      role: 'retailer' 
    },
    'user-2': { 
      id: 'user-2',
      email: 'sarah@urbanstyle.com', 
      name: 'Sarah Johnson',
      companyId: 'company-2', 
      role: 'retailer' 
    },
    'user-3': { 
      id: 'user-3',
      email: 'mike@westcoastsports.com',
      name: 'Mike Wilson', 
      companyId: 'company-3', 
      role: 'retailer' 
    },
    'user-4': { 
      id: 'user-4',
      email: 'rep@company.com',
      name: 'Sales Rep', 
      companyId: 'b2b-internal', 
      role: 'sales_rep' 
    },
    'user-5': { 
      id: 'user-5',
      email: 'admin@company.com',
      name: 'Admin User', 
      companyId: 'b2b-internal', 
      role: 'admin' 
    }
  }
  
  const user = userMap[userId]
  if (!user) return null
  
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