"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface DropdownMenuProps {
  children: React.ReactNode
}

export function DropdownMenu({ children }: DropdownMenuProps) {
  return <div className="relative inline-block text-left">{children}</div>
}

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function DropdownMenuTrigger({ children, asChild, ...props }: DropdownMenuTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, props)
  }
  
  return (
    <button {...props}>
      {children}
    </button>
  )
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end"
  sideOffset?: number
}

export function DropdownMenuContent({ 
  className, 
  align = "center",
  sideOffset = 4,
  children,
  ...props 
}: DropdownMenuContentProps) {
  const [open, setOpen] = React.useState(false)
  
  React.useEffect(() => {
    setOpen(true)
    return () => setOpen(false)
  }, [])
  
  if (!open) return null
  
  return (
    <div 
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-900 shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
}

export function DropdownMenuItem({ 
  className, 
  inset,
  children,
  ...props 
}: DropdownMenuItemProps) {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
        "transition-colors focus:bg-gray-100 focus:text-gray-900",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownMenuCheckboxItem({ 
  className,
  children,
  checked,
  ...props 
}: DropdownMenuItemProps & { checked?: boolean }) {
  return (
    <DropdownMenuItem
      className={cn("pr-2 pl-8", className)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <Check className="h-4 w-4" />}
      </span>
      {children}
    </DropdownMenuItem>
  )
}

export function DropdownMenuRadioItem({ 
  className,
  children,
  ...props 
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuItem
      className={cn("pr-2 pl-8", className)}
      {...props}
    >
      {children}
    </DropdownMenuItem>
  )
}

export function DropdownMenuLabel({ 
  className,
  inset,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-sm font-semibold",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({ 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
      {...props}
    />
  )
}

export function DropdownMenuShortcut({ 
  className,
  ...props 
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}

export function DropdownMenuGroup({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function DropdownMenuPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function DropdownMenuSub({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function DropdownMenuSubContent({ 
  className,
  ...props 
}: React.HTMLAttributes<HTMLDivElement>) {
  return <DropdownMenuContent className={className} {...props} />
}

export function DropdownMenuSubTrigger({ 
  className,
  inset,
  children,
  ...props 
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuItem
      className={cn("cursor-default select-none", className)}
      {...props}
    >
      {children}
    </DropdownMenuItem>
  )
}

export function DropdownMenuRadioGroup({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}