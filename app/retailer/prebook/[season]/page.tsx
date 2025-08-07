"use client"

import { useState, useEffect } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { useParams } from "next/navigation"
// ... (rest of imports)

// ... (component logic)

export default function SeasonPrebookPage() {
  // ... (component logic)

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-6 space-y-6">
        {/* ... (rest of JSX) */}
      </div>
    </AuthenticatedLayout>
  )
}
