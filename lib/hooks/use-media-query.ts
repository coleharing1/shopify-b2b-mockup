"use client"

import { useEffect, useState } from "react"

/**
 * @description Hook to detect media query matches
 * @fileoverview Provides responsive breakpoint detection
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    
    // Set initial value
    setMatches(media.matches)

    // Create event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add event listener
    if (media.addEventListener) {
      media.addEventListener("change", listener)
    } else {
      // Fallback for older browsers
      media.addListener(listener)
    }

    // Remove event listener on cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", listener)
      } else {
        // Fallback for older browsers
        media.removeListener(listener)
      }
    }
  }, [query])

  return matches
}

/**
 * @description Preset media query hooks for common breakpoints
 */
export function useIsMobile() {
  return useMediaQuery("(max-width: 639px)")
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 640px) and (max-width: 1023px)")
}

export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)")
}