'use client'

/**
 * @fileoverview Footer component.
 * @description Provides a simple footer with copyright information.
 */
export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-500">
      &copy; {new Date().getFullYear()} B2B Portal. All rights reserved.
    </footer>
  )
}
