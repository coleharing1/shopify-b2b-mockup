"use client"

/**
 * @fileoverview Minimal tooltip primitives (no-op) to satisfy imports in demo
 */
import * as React from "react"

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function Tooltip({ children, open }: { children: React.ReactNode; open?: boolean }) {
  return <>{children}</>
}

export function TooltipTrigger({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) {
  return <>{children}</>
}

export function TooltipContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={"text-xs bg-black text-white px-2 py-1 rounded shadow " + (className || '')}>{children}</div>
}


