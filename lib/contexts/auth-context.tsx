"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export type UserRole = 'retailer' | 'rep' | 'admin'

interface User {
  id: string
  email: string
  name: string
  role: UserRole
  companyId: string
  companyName?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  logout: () => void
  switchRole: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * @description Authentication provider that manages user session and role-based access
 * @fileoverview Provides auth context to track logged-in user's role and companyId
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Load user from localStorage on mount and check for URL params
  useEffect(() => {
    const checkUrlParams = async () => {
      // Check for deep-link auto-login
      const role = searchParams?.get('role')
      const scenario = searchParams?.get('scenario')
      const company = searchParams?.get('company')
      
      if (role) {
        // Map role to email for auto-login
        let email = ''
        switch(role) {
          case 'retailer':
            email = company === 'urban' ? 'sarah@urbanstyle.com' : 'john@outdoorco.com'
            break
          case 'rep':
            email = 'alex@b2b.com'
            break
          case 'admin':
            email = 'admin@b2b.com'
            break
        }
        
        if (email) {
          // Auto-login with the selected role
          const result = await login(email, 'demo')
          if (result.success && scenario) {
            // Handle scenario-based navigation
            handleScenario(scenario, role)
          }
          return
        }
      }
      
      // Otherwise load from localStorage
      const storedUser = localStorage.getItem('b2b-user')
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser(parsedUser)
        } catch (error) {
          // Failed to parse stored user, clear invalid data
          localStorage.removeItem('b2b-user')
        }
      }
      setIsLoading(false)
    }
    
    checkUrlParams()
  }, [searchParams])

  // Protect routes based on authentication
  useEffect(() => {
    if (!isLoading) {
      const publicRoutes = [
        '/',
        '/login',
        '/apply',
        '/apply/submitted',
        '/welcome',
        '/search',
        '/select-account'
      ]
      
      const isPublicRoute = publicRoutes.includes(pathname || '') || 
                           pathname?.startsWith('/apply/') || 
                           pathname?.startsWith('/welcome/')
      
      if (!user && !isPublicRoute) {
        router.push('/login')
      } else if (user && (pathname === '/login')) {
        // Redirect logged-in users to their dashboard
        if (user.role === 'retailer') {
          router.push('/retailer/dashboard')
        } else if (user.role === 'rep') {
          router.push('/rep/dashboard')
        } else if (user.role === 'admin') {
          router.push('/admin/dashboard')
        }
      }
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    // Mock authentication - in production, this would call an API
    const mockUsers: Record<string, User> = {
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

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const foundUser = mockUsers[email.toLowerCase()]
    
    if (!foundUser) {
      return { success: false, error: 'Invalid email or password' }
    }

    // Store user in state and localStorage
    setUser(foundUser)
    localStorage.setItem('b2b-user', JSON.stringify(foundUser))
    
    // Set session cookie for API authentication
    document.cookie = `session=demo_${foundUser.id}; path=/`
    
    return { success: true, user: foundUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('b2b-user')
    localStorage.removeItem('b2b-cart') // Clear cart on logout
    localStorage.removeItem('b2b-prebook-cart') // Clear prebook cart
    localStorage.removeItem('b2b-closeout-cart') // Clear closeout cart
    // Clear session cookie
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/')
  }

  const switchRole = (role: UserRole) => {
    if (!user) return
    
    // Update user role (for demo purposes)
    const updatedUser = { ...user, role }
    setUser(updatedUser)
    localStorage.setItem('b2b-user', JSON.stringify(updatedUser))
    
    // Redirect to appropriate dashboard
    if (role === 'retailer') {
      router.push('/retailer/dashboard')
    } else if (role === 'rep') {
      router.push('/rep/dashboard')
    } else if (role === 'admin') {
      router.push('/admin/dashboard')
    }
  }
  
  // Handle scenario-based navigation
  const handleScenario = (scenario: string, role: string) => {
    switch(scenario) {
      case 'at-once-order':
        router.push('/retailer/at-once')
        break
      case 'prebook-order':
        router.push('/retailer/prebook')
        break
      case 'closeout-deals':
        router.push('/retailer/closeouts')
        break
      case 'review-applications':
        router.push('/admin/dashboard')
        break
      case 'manage-customers':
        router.push('/rep/customers')
        break
      default:
        // Default to dashboard
        if (role === 'retailer') router.push('/retailer/dashboard')
        else if (role === 'rep') router.push('/rep/dashboard')
        else if (role === 'admin') router.push('/admin/applications')
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * @description Hook to access authentication context
 * @returns {AuthContextType} Authentication context with user, login, logout functions
 * @throws {Error} If used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}