"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, ShoppingBag } from "lucide-react"

/**
 * @description Login page with mock authentication
 * @fileoverview Demo login that routes to different dashboards based on email
 */
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  /**
   * @description Mock login function that validates credentials and routes users
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Basic validation
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address")
      return
    }
    
    setIsLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock authentication logic
    const validUsers = [
      { email: "demo@retailer.com", password: "demo", redirect: "/retailer/dashboard" },
      { email: "demo@salesrep.com", password: "demo", redirect: "/rep/dashboard" },
      { email: "buyer@sportinggoods.com", password: "demo", redirect: "/retailer/dashboard" },
      { email: "admin@company.com", password: "demo", redirect: "/admin/dashboard" }
    ]
    
    const user = validUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      setError("Invalid email address")
      setIsLoading(false)
      return
    }
    
    if (user.password !== password) {
      setError("Incorrect password")
      setIsLoading(false)
      return
    }
    
    // Success - redirect to appropriate dashboard
    router.push(user.redirect)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      {/* Demo Mode Badge */}
      <div className="fixed top-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
        <AlertCircle className="h-4 w-4" />
        Demo Mode
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">B2B Portal</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Demo Credentials */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p><strong>Retailer:</strong> demo@retailer.com</p>
                <p><strong>Sales Rep:</strong> demo@salesrep.com</p>
                <p><strong>Admin:</strong> admin@company.com</p>
                <p className="text-xs pt-1">Password: demo</p>
              </div>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  aria-label="Email address"
                  autoComplete="email"
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  aria-label="Password"
                  autoComplete="current-password"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Checkbox
                  id="remember"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <Link 
                  href="#" 
                  className="text-sm text-primary hover:underline"
                  tabIndex={isLoading ? -1 : 0}
                >
                  Forgot password?
                </Link>
              </div>
              
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600">
              <p className="font-medium mb-2">Demo Accounts:</p>
              <div className="space-y-1 text-xs">
                <p>
                  <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">demo@retailer.com</span> / demo
                </p>
                <p>
                  <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">demo@salesrep.com</span> / demo
                </p>
                <p>
                  <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">admin@company.com</span> / demo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/apply" className="text-primary hover:underline font-medium">
              Apply to become a dealer
            </Link>
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}