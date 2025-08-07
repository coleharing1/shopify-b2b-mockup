"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

/**
 * @description Error boundary component for handling runtime errors
 * @fileoverview Displays user-friendly error message with recovery option
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to console in development
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl">⚠️</div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Something went wrong!
        </h2>
        <p className="text-gray-600">
          We encountered an error while loading this page. Please try again.
        </p>
        <div className="pt-4">
          <Button onClick={reset}>Try again</Button>
        </div>
      </div>
    </div>
  )
}