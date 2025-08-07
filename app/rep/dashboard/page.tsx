"use client"

import { Suspense } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { RepDashboardPageContent } from "./RepDashboardPageContent"

/**
 * @description Sales Rep Dashboard with performance metrics
 * @fileoverview Main dashboard for sales representatives
 */
export default function RepDashboardPage() {
  return (
    <Suspense fallback={
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </AuthenticatedLayout>
    }>
      <RepDashboardPageContent />
    </Suspense>
  )
}
