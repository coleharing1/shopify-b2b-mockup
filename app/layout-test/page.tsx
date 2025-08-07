import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"

/**
 * @description Test page for layout components
 * @fileoverview Temporary page to test navigation and layout
 */
export default function LayoutTestPage() {
  return (
    <AuthenticatedLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Layout Test Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Navigation Test</h2>
            <p className="text-gray-600">
              Check the header navigation and user menu functionality.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Responsive Design</h2>
            <p className="text-gray-600">
              Resize the browser to test mobile menu behavior.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-2">Footer Check</h2>
            <p className="text-gray-600">
              Scroll down to see the footer with demo badge.
            </p>
          </div>
        </div>
        
        <div className="bg-primary-light p-4 rounded-lg">
          <p className="text-primary font-medium">
            ✓ Header and Navigation components are working correctly
          </p>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}