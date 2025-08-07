"use client"

import { useEffect, useState } from "react"
import { X, CheckCircle, XCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "warning" | "info"

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastProps extends Toast {
  onDismiss: (id: string) => void
}

/**
 * @description Individual toast notification component
 * @fileoverview Displays temporary notification messages
 */
function ToastItem({ id, type, title, message, duration = 5000, onDismiss }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id)
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [id, duration, onDismiss])

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />
  }

  const styles = {
    success: "bg-green-50 text-green-800 border-green-200",
    error: "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    info: "bg-blue-50 text-blue-800 border-blue-200"
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg animate-in slide-in-from-top-2 fade-in duration-300",
        styles[type]
      )}
      role="alert"
    >
      <span className="flex-shrink-0">{icons[type]}</span>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        {message && <p className="text-sm mt-1 opacity-90">{message}</p>}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onDismiss: (id: string) => void
}

/**
 * @description Container for toast notifications
 * @fileoverview Manages display of multiple toasts
 */
export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <div className="space-y-2 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} onDismiss={onDismiss} />
        ))}
      </div>
    </div>
  )
}

// Additional exports for compatibility with toaster component
export const Toast = ToastItem as any
export const ToastClose = () => null
export const ToastDescription = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const ToastTitle = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const ToastProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
export const ToastViewport = () => null

/**
 * @description Hook for managing toast notifications
 * @fileoverview Provides functions to show and dismiss toasts
 */
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (toast: Omit<Toast, "id">) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { ...toast, id }])
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return {
    toasts,
    showToast,
    dismissToast
  }
}