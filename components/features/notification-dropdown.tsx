"use client"

import { useState } from "react"
import { Bell, Package, AlertCircle, DollarSign, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NotificationBadge } from "@/components/ui/notification-badge"
import { cn } from "@/lib/utils"

export interface Notification {
  id: string
  type: "stock" | "order" | "product" | "price" | "info"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

interface NotificationDropdownProps {
  notifications: Notification[]
  onMarkAsRead?: (id: string) => void
  onMarkAllAsRead?: () => void
  onDismiss?: (id: string) => void
}

/**
 * @description Notification dropdown with categorized alerts
 * @fileoverview Shows system notifications in a dropdown menu
 */
export function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDismiss
}: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "stock":
        return <Package className="h-4 w-4" />
      case "order":
        return <ShoppingCart className="h-4 w-4" />
      case "price":
        return <DollarSign className="h-4 w-4" />
      case "product":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "stock":
        return "text-orange-600 bg-orange-100"
      case "order":
        return "text-green-600 bg-green-100"
      case "price":
        return "text-blue-600 bg-blue-100"
      case "product":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <NotificationBadge count={unreadCount} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMarkAllAsRead}
                    className="text-xs"
                  >
                    Mark all as read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No new notifications</p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                        !notification.read && "bg-blue-50/50"
                      )}
                      onClick={() => {
                        onMarkAsRead?.(notification.id)
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl
                        }
                      }}
                    >
                      <div className="flex gap-3">
                        <div className={cn(
                          "p-2 rounded-full flex-shrink-0",
                          getTypeColor(notification.type)
                        )}>
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-medium text-sm text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-0.5">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.timestamp}
                              </p>
                            </div>
                            {onDismiss && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDismiss(notification.id)
                                }}
                                className="h-6 w-6 p-0 flex-shrink-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  View all notifications
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}