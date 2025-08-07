import * as React from "react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center space-x-1 text-sm text-gray-500", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        
        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="h-4 w-4 flex-shrink-0" />}
            
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast && "text-gray-900 font-medium")}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}