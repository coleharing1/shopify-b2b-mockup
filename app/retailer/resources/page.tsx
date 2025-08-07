import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"

/**
 * @description Placeholder for resource center
 * @fileoverview Temporary page - Phase 2 implementation
 */
export default function ResourceCenterPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Resource Center</h1>
        <p className="text-gray-600">This page will be implemented in Phase 2</p>
      </div>
    </AuthenticatedLayout>
  )
}