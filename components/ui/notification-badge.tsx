"use client"

import { cn } from "@/lib/utils"

interface NotificationBadgeProps {
  count: number
  className?: string
  showZero?: boolean
}

/**
 * @description Badge component for showing notification count
 * @fileoverview Displays count with proper formatting
 */
export function NotificationBadge({ 
  count, 
  className,
  showZero = false 
}: NotificationBadgeProps) {
  if (count === 0 && !showZero) return null

  const displayCount = count > 99 ? "99+" : count.toString()

  return (
    <span 
      className={cn(
        "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center font-medium",
        className
      )}
      aria-label={`${count} notifications`}
    >
      {displayCount}
    </span>
  )
}