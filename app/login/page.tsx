"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AlertCircle, ShoppingBag, Users, UserCheck, Shield, ArrowRight, PlusCircle } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"

/**
 * @description Login page with mock authentication
 * @fileoverview Demo login that routes to different dashboards based on email
 */
export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showEmailForm, setShowEmailForm] = useState(false)

  /**
   * @description Login function that uses auth context
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
    
    // Use auth context login
    const result = await login(email, password)
    
    if (!result.success) {
      setError(result.error || "Login failed")
      setIsLoading(false)
      return
    }
    
    // Auth context will handle the redirect
    setIsLoading(false)
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
            <CardTitle className="text-2xl">Choose Demo Role</CardTitle>
            <CardDescription>
              Select a role to explore the B2B portal features
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!showEmailForm ? (
              <div className="space-y-4">
                {/* Role Selection Cards */}
                <div className="grid grid-cols-1 gap-3">
                  <Card 
                    className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary"
                    onClick={() => {
                      setIsLoading(true)
                      login('john@outdoorretailers.com', 'demo').then(() => {
                        setIsLoading(false)
                      })
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">John @ Outdoor Co</h3>
                            <p className="text-sm text-gray-600">Retailer - Premium Account</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary"
                    onClick={() => {
                      setIsLoading(true)
                      login('sarah@urbanstyle.com', 'demo').then(() => {
                        setIsLoading(false)
                      })
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Users className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Sarah @ Urban Style</h3>
                            <p className="text-sm text-gray-600">Retailer - Standard Account</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary"
                    onClick={() => {
                      setIsLoading(true)
                      login('rep@company.com', 'demo').then(() => {
                        setIsLoading(false)
                      })
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <UserCheck className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Alex @ B2B</h3>
                            <p className="text-sm text-gray-600">Sales Representative</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary"
                    onClick={() => {
                      setIsLoading(true)
                      login('admin@company.com', 'demo').then(() => {
                        setIsLoading(false)
                      })
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 rounded-lg">
                            <Shield className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Admin @ B2B</h3>
                            <p className="text-sm text-gray-600">System Administrator</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowEmailForm(true)}
                >
                  Sign in with email
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">New to B2B Portal?</span>
                  </div>
                </div>
                
                <Link href="/apply" className="block">
                  <Button variant="default" className="w-full bg-green-600 hover:bg-green-700">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Apply for Dealer Account
                  </Button>
                </Link>
              </div>
            ) : (
            <>
            {/* Demo Credentials */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p><strong>Retailer 1:</strong> john@outdoorretailers.com</p>
                <p><strong>Retailer 2:</strong> sarah@urbanstyle.com</p>
                <p><strong>Sales Rep:</strong> rep@company.com</p>
                <p><strong>Admin:</strong> admin@company.com</p>
                <p className="text-xs pt-1">Password: any (demo mode)</p>
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
            
            <div className="mt-6 text-center">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowEmailForm(false)}
              >
                ← Back to role selection
              </Button>
            </div>
            </>
            )}
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