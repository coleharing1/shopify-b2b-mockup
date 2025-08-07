"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, FileText, Clock, ArrowRight } from "lucide-react"

/**
 * @description Application submission confirmation page
 * @fileoverview Shows success message and next steps after application
 */
export default function ApplicationSubmittedPage() {
  const [applicationId, setApplicationId] = useState<string>("")
  
  useEffect(() => {
    // Get the application ID from localStorage (set by the apply page)
    const storedId = localStorage.getItem('application-id')
    if (storedId) {
      setApplicationId(storedId)
      // Clear it after reading
      localStorage.removeItem('application-id')
    } else {
      // Fallback for direct navigation
      setApplicationId(`APP-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`)
    }
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader className="text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Application Submitted Successfully!</CardTitle>
            <CardDescription className="text-base mt-2">
              Thank you for applying to become an authorized dealer
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Application Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-medium text-gray-900 mb-3">Your Application Details</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Application ID</span>
                  <span className="font-mono font-medium">{applicationId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Submitted</span>
                  <span className="text-sm">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Under Review
                  </span>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">What Happens Next?</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">1</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Application Review</p>
                    <p className="text-sm text-gray-600">Our team will review your application within 1-2 business days</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">2</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Document Verification</p>
                    <p className="text-sm text-gray-600">We'll verify your resale certificate and other documents</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">3</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Account Approval</p>
                    <p className="text-sm text-gray-600">Once approved, you'll receive an email with login instructions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Save your Application ID:</strong> {applicationId}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                You'll receive a confirmation email shortly. Use your Application ID to check your status anytime.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button variant="outline" className="flex-1" asChild>
                <Link href={`/apply/status/${applicationId}`}>
                  <Clock className="mr-2 h-4 w-4" />
                  Check Application Status
                </Link>
              </Button>
              <Button variant="outline" className="flex-1" asChild>
                <Link href="/">
                  <FileText className="mr-2 h-4 w-4" />
                  Return to Homepage
                </Link>
              </Button>
            </div>

            {/* Contact Info */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Questions? Contact our team at{" "}
                <a href="tel:8005550123" className="text-primary hover:underline">
                  (800) 555-0123
                </a>{" "}
                or{" "}
                <a href="mailto:newaccounts@company.com" className="text-primary hover:underline">
                  newaccounts@company.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}