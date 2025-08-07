"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface FilterPill {
  id: string
  label: string
  value: string
}

interface FilterPillsProps {
  filters: FilterPill[]
  onRemove: (id: string) => void
  onClearAll?: () => void
}

/**
 * @description Display active filters as removable pills
 * @fileoverview Visual feedback for applied filters
 */
export function FilterPills({ filters, onRemove, onClearAll }: FilterPillsProps) {
  if (filters.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-600">Active filters:</span>
      {filters.map((filter) => (
        <div
          key={filter.id}
          className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light text-primary rounded-full text-sm"
        >
          <span>{filter.label}: {filter.value}</span>
          <button
            onClick={() => onRemove(filter.id)}
            className="ml-1 hover:bg-primary/10 rounded-full p-0.5"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      {filters.length > 1 && onClearAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs"
        >
          Clear all
        </Button>
      )}
    </div>
  )
}