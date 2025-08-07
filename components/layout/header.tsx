"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, User, LogOut, Settings, ShoppingCart } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { NotificationDropdown, type Notification } from "@/components/features/notification-dropdown"

/**
 * @description Navigation items configuration
 */
const retailerNavItems = [
  { href: "/retailer/dashboard", label: "Dashboard" },
  { href: "/retailer/products", label: "Products" },
  { href: "/retailer/orders", label: "Orders" },
  { href: "/retailer/resources", label: "Resources" },
]

const repNavItems = [
  { href: "/rep/dashboard", label: "Dashboard" },
  { href: "/rep/customers", label: "Customers" },
  { href: "/rep/orders", label: "Orders" },
  { href: "/rep/resources", label: "Resources" },
]

/**
 * @description Header navigation component with responsive menu
 * @fileoverview Main navigation header for B2B portal
 */
export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const pathname = usePathname()
  const { getItemCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false)
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: "1",
      type: "stock",
      title: "Low Stock Alert",
      message: "Alpine Pro Jacket (Size M) is running low",
      timestamp: "2 hours ago",
      read: false,
      actionUrl: "/retailer/products/product-1"
    },
    {
      id: "2",
      type: "order",
      title: "Order Shipped",
      message: "Order #ORD-2024-1289 has been shipped",
      timestamp: "5 hours ago",
      read: false
    },
    {
      id: "3",
      type: "product",
      title: "New Products Available",
      message: "Spring 2024 collection is now available",
      timestamp: "Yesterday",
      read: true,
      actionUrl: "/retailer/products"
    }
  ])
  
  // Determine which navigation to show based on current path
  const isRepPortal = pathname.startsWith("/rep")
  const navItems = isRepPortal ? repNavItems : retailerNavItems
  const userRole = isRepPortal ? "Sales Rep" : "Retailer"
  const itemCount = getItemCount()
  
  /**
   * @description Toggle mobile menu state
   */
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  
  /**
   * @description Close mobile menu when route changes
   */
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  /**
   * @description Handle notification actions
   */
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center space-x-8">
            <Button variant="ghost" onClick={toggleSidebar} aria-label="Toggle sidebar" className="hidden md:block">
              <Menu className="h-6 w-6" />
            </Button>
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl text-primary">B2B Portal</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary-light text-primary"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side - User menu and mobile toggle */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon - Show only for retailers */}
            {!isRepPortal && (
              <Link href="/retailer/cart" className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}
            
            {/* Notifications */}
            <NotificationDropdown
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onDismiss={handleDismissNotification}
            />
            
            {/* User Menu - Desktop */}
            <div className="hidden md:block relative">
              <Button
                variant="ghost"
                className="flex items-center space-x-2"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User className="h-5 w-5" />
                <span className="text-sm">John Smith</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                      {userRole}
                    </div>
                    <Link
                      href="/select-account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Switch Account
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="inline h-4 w-4 mr-2" />
                      Settings
                    </Link>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" />
                      Logout
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-3 py-2 text-base font-medium rounded-md",
                      isActive
                        ? "bg-primary-light text-primary"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50"
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
              <hr className="my-2" />
              <Link
                href="/select-account"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              >
                Switch Account
              </Link>
              <Link
                href="/settings"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              >
                Settings
              </Link>
              <Link
                href="/login"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50"
              >
                Logout
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}