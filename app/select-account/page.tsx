"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Users } from "lucide-react"
import { useAuth } from "@/lib/contexts/auth-context"
import { toast } from "sonner"

/**
 * @description Account type selection page
 * @fileoverview Allows users with multiple roles to choose their portal view
 */
export default function SelectAccountPage() {
  const router = useRouter()
  const { login } = useAuth()

  const handleRetailerSelect = async () => {
    // Login as retailer demo user
    await login("john@outdoorretailers.com", "demo123")
    toast.success("Logged in as retailer")
    router.push("/retailer/dashboard")
  }

  const handleRepSelect = async () => {
    // Login as sales rep demo user
    await login("rep@company.com", "demo123")
    toast.success("Logged in as sales rep")
    router.push("/rep/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Select Account Type</h1>
          <p className="mt-2 text-gray-600">Choose how you&apos;d like to access the portal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleRetailerSelect}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary-light p-4 rounded-full w-fit mb-4">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Continue as Retailer</CardTitle>
              <CardDescription>
                Access your account to place orders, view pricing, and manage your business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="default">
                Retailer Portal
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleRepSelect}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary-light p-4 rounded-full w-fit mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Continue as Sales Rep</CardTitle>
              <CardDescription>
                Manage customer accounts, place orders on behalf, and track performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary">
                Sales Rep Portal
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button variant="link" onClick={() => router.push("/login")}>
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  )
}