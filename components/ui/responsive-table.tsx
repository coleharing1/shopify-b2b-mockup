"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ResponsiveTableProps {
  children: ReactNode
  className?: string
}

/**
 * @description Responsive table wrapper with horizontal scroll
 * @fileoverview Ensures tables are scrollable on mobile devices
 */
export function ResponsiveTable({ children, className }: ResponsiveTableProps) {
  return (
    <div className={cn("w-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0", className)}>
      <div className="inline-block min-w-full align-middle">
        {children}
      </div>
    </div>
  )
}