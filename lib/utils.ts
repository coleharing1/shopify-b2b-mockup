import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * @description Combines class names using clsx and tailwind-merge for proper Tailwind class merging
 * @param inputs - Class values to be merged
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * @description Format a number as USD currency (or generic currency with locale)
 */
export function formatCurrency(value: number, locale: string = 'en-US', currency: string = 'USD') {
  if (typeof value !== 'number' || Number.isNaN(value)) return '$0.00'
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value)
  } catch {
    return `$${value.toFixed(2)}`
  }
}