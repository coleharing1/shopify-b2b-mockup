import { cn } from "@/lib/utils"

interface PageContainerProps {
  children: React.ReactNode
  className?: string
}

/**
 * @description Page container wrapper for consistent layout
 * @fileoverview Wrapper component for page content with responsive padding
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main className={cn(
      "flex-1 w-full",
      "max-w-7xl mx-auto",
      "px-4 sm:px-6 lg:px-8",
      "py-6 sm:py-8",
      className
    )}>
      {children}
    </main>
  )
}