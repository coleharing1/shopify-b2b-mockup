"use client"

import { useState } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { useParams, useRouter } from "next/navigation"
// ... (rest of imports)

// ... (component logic)

export default function ApplicationDetailPage() {
  // ... (component logic)

  return (
    <AuthenticatedLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* ... (rest of JSX) */}
      </div>
    </AuthenticatedLayout>
  )
}
