'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { X, RefreshCw, Info, CheckCircle, AlertCircle } from 'lucide-react'
const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>
const motion = {
  div: ({ children }: any) => <div>{children}</div>
} as any

interface CatalogNotificationProps {
  type: 'update' | 'success' | 'error' | 'info'
  title?: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
  autoHide?: boolean
  autoHideDelay?: number
  onDismiss?: () => void
}

export function CatalogNotification({
  type,
  title,
  message,
  action,
  dismissible = true,
  autoHide = false,
  autoHideDelay = 5000,
  onDismiss
}: CatalogNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (autoHide && isVisible) {
      const timer = setTimeout(() => {
        handleDismiss()
      }, autoHideDelay)
      return () => clearTimeout(timer)
    }
  }, [autoHide, autoHideDelay, isVisible])

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  const getIcon = () => {
    switch (type) {
      case 'update':
        return <RefreshCw className="h-4 w-4" />
      case 'success':
        return <CheckCircle className="h-4 w-4" />
      case 'error':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'update':
        return 'border-blue-200 bg-blue-50 text-blue-800'
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800'
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800'
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Alert className={`relative ${getStyles()}`}>
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getIcon()}</div>
              <div className="flex-1">
                {title && (
                  <h4 className="font-medium mb-1">{title}</h4>
                )}
                <AlertDescription>{message}</AlertDescription>
                {action && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                )}
              </div>
              {dismissible && (
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-black/5 rounded transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for managing notifications
export function useCatalogNotifications() {
  const [notifications, setNotifications] = useState<
    Array<CatalogNotificationProps & { id: string }>
  >([])

  const showNotification = (notification: CatalogNotificationProps) => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { ...notification, id }])
    return id
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return {
    notifications,
    showNotification,
    dismissNotification,
    clearAll
  }
}

// Notification container for stacking multiple notifications
export function CatalogNotificationContainer({ 
  notifications 
}: { 
  notifications: Array<CatalogNotificationProps & { id: string }> 
}) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map(notification => (
        <CatalogNotification
          key={notification.id}
          {...notification}
          onDismiss={() => notification.onDismiss?.()}
        />
      ))}
    </div>
  )
}