"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, ChevronDown, User, LogOut, Settings, ShoppingCart, Zap, Users, UserCheck, Shield, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/contexts/auth-context"
import { NotificationDropdown, type Notification } from "@/components/features/notification-dropdown"
import { GlobalSearch } from "@/components/features/global-search"

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
  const { user, logout, login } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
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

  /**
   * @description Quick demo login function
   */
  const quickDemoLogin = async (email: string, name: string, role: string) => {
    setIsLoading(true)
    try {
      const result = await login(email, 'demo')
      if (result.success) {
        toast.success(`Switched to ${name} (${role})`)
      } else {
        toast.error('Failed to switch role')
      }
    } catch (error) {
      toast.error('Error switching role')
    } finally {
      setIsLoading(false)
    }
  }

  // Get display info for current user
  const getCurrentUserDisplay = () => {
    if (!user) return { name: 'Guest', role: 'Not logged in', icon: User }
    
    const email = user.email
    if (email === 'john@outdoorco.com') return { name: 'John (Outdoor Co)', role: 'Retailer', icon: Users }
    if (email === 'sarah@urbanstyle.com') return { name: 'Sarah (Urban Style)', role: 'Retailer', icon: Users }
    if (email === 'alex@b2b.com') return { name: 'Alex', role: 'Sales Rep', icon: UserCheck }
    if (email === 'admin@b2b.com') return { name: 'Admin', role: 'Administrator', icon: Shield }
    
    return { name: user.name || 'User', role: userRole, icon: User }
  }

  const currentUserDisplay = getCurrentUserDisplay()

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

          {/* Right side - Search, User menu and mobile toggle */}
          <div className="flex items-center space-x-4">
            {/* Global Search - Desktop only */}
            <div className="hidden md:block flex-1 max-w-md">
              <GlobalSearch />
            </div>
            
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
            
            {/* Demo Role Switcher - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                <Zap className="h-3 w-3 mr-1" />
                Demo Mode
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <currentUserDisplay.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{currentUserDisplay.name}</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <span className="font-medium">{currentUserDisplay.name}</span>
                      <span className="text-xs text-gray-500 font-normal">{currentUserDisplay.role}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuLabel className="text-xs text-gray-500">Switch Demo Role</DropdownMenuLabel>
                  
                  <Collapsible>
                    <CollapsibleTrigger className="w-full">
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="font-medium">Retailer Accounts</span>
                        <ChevronDown className="h-4 w-4 ml-auto" />
                      </DropdownMenuItem>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pl-4">
                      <DropdownMenuItem 
                        onClick={() => quickDemoLogin('john@outdoorco.com', 'John', 'Retailer')}
                        className="cursor-pointer"
                      >
                        <div className="flex-1 ml-4">
                          <div className="font-medium">John @ Outdoor Co</div>
                          <div className="text-xs text-gray-500">Premium Account</div>
                        </div>
                        {user?.email === 'john@outdoorco.com' && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => quickDemoLogin('sarah@urbanstyle.com', 'Sarah', 'Retailer')}
                        className="cursor-pointer"
                      >
                        <div className="flex-1 ml-4">
                          <div className="font-medium">Sarah @ Urban Style</div>
                          <div className="text-xs text-gray-500">Standard Account</div>
                        </div>
                        {user?.email === 'sarah@urbanstyle.com' && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </DropdownMenuItem>
                    </CollapsibleContent>
                  </Collapsible>
                  
                  <DropdownMenuItem 
                    onClick={() => quickDemoLogin('alex@b2b.com', 'Alex', 'Sales Rep')}
                    className="cursor-pointer"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    <div className="flex-1">
                      <div className="font-medium">Alex @ B2B</div>
                      <div className="text-xs text-gray-500">Sales Representative</div>
                    </div>
                    {user?.email === 'alex@b2b.com' && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={() => quickDemoLogin('admin@b2b.com', 'Admin', 'Administrator')}
                    className="cursor-pointer"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    <div className="flex-1">
                      <div className="font-medium">Admin @ B2B</div>
                      <div className="text-xs text-gray-500">System Administrator</div>
                    </div>
                    {user?.email === 'admin@b2b.com' && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={() => window.location.href = isRepPortal ? '/rep/settings' : '/retailer/settings'}
                    className="cursor-pointer"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={logout}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Exit Demo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                href={isRepPortal ? "/rep/settings" : "/retailer/settings"}
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