"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

/**
 * @description Custom 404 page
 * @fileoverview Displays when a page is not found
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 -mt-8">Page Not Found</h2>
          <p className="mt-4 text-gray-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. 
            It might have been moved or doesn&apos;t exist.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? <Link href="/contact" className="text-primary hover:underline">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  )
}