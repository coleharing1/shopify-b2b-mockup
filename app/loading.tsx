/**
 * @description Loading state component for page transitions
 * @fileoverview Displays loading skeleton during route changes
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-12 w-12 bg-primary rounded-full mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
        </div>
        <p className="mt-4 text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
}