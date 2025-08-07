"use client"

import { useState, useCallback, useEffect } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  isLoading?: boolean
  className?: string
  showClearButton?: boolean
  debounceMs?: number
}

/**
 * @description Enhanced search bar with loading state and clear button
 * @fileoverview Reusable search component with debouncing
 */
export function SearchBar({
  placeholder = "Search...",
  value: controlledValue,
  onChange,
  onSearch,
  isLoading = false,
  className,
  showClearButton = true,
  debounceMs = 300
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("")
  const value = controlledValue !== undefined ? controlledValue : internalValue

  /**
   * @description Debounced search handler
   */
  useEffect(() => {
    if (!onSearch || debounceMs === 0) return

    const timer = setTimeout(() => {
      onSearch(value)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [value, onSearch, debounceMs])

  /**
   * @description Handle input change
   */
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }, [controlledValue, onChange])

  /**
   * @description Clear search input
   */
  const handleClear = useCallback(() => {
    if (controlledValue === undefined) {
      setInternalValue("")
    }
    onChange?.("")
    onSearch?.("")
  }, [controlledValue, onChange, onSearch])

  /**
   * @description Handle form submission
   */
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(value)
  }, [value, onSearch])

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {isLoading ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <Input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={cn(
            "pl-10",
            showClearButton && value && "pr-10"
          )}
          aria-label="Search"
        />
        {showClearButton && value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 px-3 hover:bg-transparent"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </Button>
        )}
      </div>
    </form>
  )
}