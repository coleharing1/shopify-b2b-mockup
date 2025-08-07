"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface DropdownMenuContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | undefined>(undefined)

function useDropdownMenu() {
  const context = React.useContext(DropdownMenuContext)
  if (!context) {
    throw new Error("useDropdownMenu must be used within a DropdownMenu")
  }
  return context
}

interface DropdownMenuProps {
  children: React.ReactNode
  defaultOpen?: boolean
}

export function DropdownMenu({ children, defaultOpen = false }: DropdownMenuProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">
        {children}
      </div>
    </DropdownMenuContext.Provider>
  )
}

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function DropdownMenuTrigger({ 
  children, 
  asChild, 
  onClick,
  ...props 
}: DropdownMenuTriggerProps) {
  const { open, setOpen } = useDropdownMenu()
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(!open)
    onClick?.(e as any)
  }
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, {
      ...props,
      onClick: handleClick,
      "aria-expanded": open,
      "aria-haspopup": "menu"
    })
  }
  
  return (
    <button 
      {...props} 
      onClick={handleClick}
      aria-expanded={open}
      aria-haspopup="menu"
    >
      {children}
    </button>
  )
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end"
  sideOffset?: number
  portal?: boolean
}

export function DropdownMenuContent({ 
  className, 
  align = "center",
  sideOffset = 4,
  portal = false,
  children,
  ...props 
}: DropdownMenuContentProps) {
  const { open, setOpen } = useDropdownMenu()
  const contentRef = React.useRef<HTMLDivElement>(null)
  
  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
      }
    }
    
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, setOpen])
  
  // Close on outside click
  React.useEffect(() => {
    if (!open) return
    
    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        // Check if the click is on the trigger button (avoid immediate close on open)
        const trigger = contentRef.current.parentElement?.querySelector('[aria-haspopup="menu"]')
        if (trigger && trigger.contains(e.target as Node)) {
          return
        }
        setOpen(false)
      }
    }
    
    // Delay to avoid immediate close when clicking trigger
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside)
    }, 0)
    
    return () => {
      clearTimeout(timer)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])
  
  if (!open) return null
  
  const alignmentClasses = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0"
  }
  
  const content = (
    <div
      ref={contentRef}
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        alignmentClasses[align],
        className
      )}
      style={{ top: `calc(100% + ${sideOffset}px)` }}
      role="menu"
      aria-orientation="vertical"
      {...props}
    >
      {children}
    </div>
  )
  
  // If portal is enabled, render in a portal at body level
  if (portal && typeof document !== "undefined") {
    return React.createPortal(content, document.body)
  }
  
  return content
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
  asChild?: boolean
}

export function DropdownMenuItem({ 
  className, 
  inset,
  asChild,
  onClick,
  children,
  ...props 
}: DropdownMenuItemProps) {
  const { setOpen } = useDropdownMenu()
  
  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e as any)
    // Close menu after item click
    setOpen(false)
  }
  
  const itemClasses = cn(
    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
    "transition-colors focus:bg-gray-100 focus:text-gray-900",
    "hover:bg-gray-100 hover:text-gray-900",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    inset && "pl-8",
    className
  )
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as any, {
      ...props,
      className: itemClasses,
      onClick: handleClick,
      role: "menuitem"
    })
  }
  
  return (
    <div
      className={itemClasses}
      onClick={handleClick}
      role="menuitem"
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
  checked,
  ...props 
}: DropdownMenuItemProps & { checked?: boolean }) {
  return (
    <DropdownMenuItem
      className={cn("pr-2 pl-8", className)}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        {checked && <div className="h-2 w-2 rounded-full bg-current" />}
      </span>
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