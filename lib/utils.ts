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