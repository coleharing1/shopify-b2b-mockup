import { NextRequest, NextResponse } from 'next/server'

/**
 * @description Mock authentication API endpoint
 * @fileoverview Handles authentication and returns user data with role and companyId
 */

interface User {
  id: string
  email: string
  name: string
  role: 'retailer' | 'rep' | 'admin'
  companyId: string
  companyName: string
}

// Mock user database
const mockUsers: Record<string, User> = {
  'john@outdoorco.com': {
    id: 'user-1',
    email: 'john@outdoorco.com',
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
  'mike@westcoast.com': {
    id: 'user-3',
    email: 'mike@westcoast.com',
    name: 'Mike Wilson',
    role: 'retailer',
    companyId: 'company-3',
    companyName: 'West Coast Sports'
  },
  'alex@b2b.com': {
    id: 'user-4',
    email: 'alex@b2b.com',
    name: 'Alex Chen',
    role: 'rep',
    companyId: 'b2b-internal',
    companyName: 'B2B Portal'
  },
  'admin@b2b.com': {
    id: 'user-5',
    email: 'admin@b2b.com',
    name: 'System Admin',
    role: 'admin',
    companyId: 'b2b-internal',
    companyName: 'B2B Portal'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user by email
    const user = mockUsers[email.toLowerCase()]

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // In demo mode, any password works
    // In production, you would verify the password hash here

    // Create a session token (in production, use JWT or session management)
    const sessionToken = `session_${user.id}_${Date.now()}`

    // Return user data without sensitive information
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
        companyName: user.companyName
      },
      token: sessionToken
    })

    // Set session cookie (in production, use secure, httpOnly cookies)
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const session = request.cookies.get('session')
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Parse session token to get user ID (simplified for demo)
    const parts = session.value.split('_')
    const userId = parts[1]

    // Find user by ID
    const user = Object.values(mockUsers).find(u => u.id === userId)

    if (!user) {
      return NextResponse.json(
        { error: 'Session invalid' },
        { status: 401 }
      )
    }

    // Return current user data
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        companyId: user.companyId,
        companyName: user.companyName
      }
    })
  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { error: 'Failed to check session' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Clear session cookie
    const response = NextResponse.json({ message: 'Logged out successfully' })
    
    response.cookies.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immediately
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}