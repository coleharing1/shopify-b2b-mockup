"use client"

/**
 * @fileoverview Minimal AlertDialog primitives using Radix Dialog under the hood
 * @description API-compatible surface for quote edit pages (Action/Cancel, Content, Header, Footer).
 */

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

export function AlertDialog(
  { open, onOpenChange, children }:
  { open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }
) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog.Root>
  )
}

export function AlertDialogContent(
  { className, children }: { className?: string; children: React.ReactNode }
) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/20" />
      <Dialog.Content className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-white p-6 shadow-lg",
        className
      )}>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  )
}

export function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-4", className)} {...props} />
}

export function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-4 flex justify-end gap-2", className)} {...props} />
}

export function AlertDialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <Dialog.Title className={cn("text-lg font-semibold", className)} {...props} />
}

export function AlertDialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <Dialog.Description className={cn("text-sm text-gray-600", className)} {...props} />
}

export function AlertDialogAction({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Dialog.Close asChild>
      <button className={cn("inline-flex h-9 items-center rounded-md bg-black px-3 text-white", className)} {...props} />
    </Dialog.Close>
  )
}

export function AlertDialogCancel({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Dialog.Close asChild>
      <button className={cn("inline-flex h-9 items-center rounded-md border px-3", className)} {...props} />
    </Dialog.Close>
  )
}


