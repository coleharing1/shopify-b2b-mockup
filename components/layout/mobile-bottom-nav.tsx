"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, ShoppingCart, FileText, Users, Menu, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"

interface MobileBottomNavProps {
  isRepPortal?: boolean
  onMenuClick?: () => void
}

/**
 * @description Mobile bottom navigation bar
 * @fileoverview Fixed bottom navigation for mobile devices
 */
export function MobileBottomNav({ isRepPortal = false, onMenuClick }: MobileBottomNavProps) {
  const pathname = usePathname()
  const { getItemCount } = useCart()
  const itemCount = getItemCount()

  const retailerNavItems = [
    { href: "/retailer/dashboard", label: "Home", icon: Home, badge: 0 },
    { href: "/retailer/products", label: "Products", icon: Package, badge: 0 },
    { href: "/retailer/cart", label: "Cart", icon: ShoppingCart, badge: itemCount },
    { href: "/retailer/orders", label: "Orders", icon: FileText, badge: 0 },
  ]

  const repNavItems = [
    { href: "/rep/dashboard", label: "Home", icon: Home, badge: 0 },
    { href: "/rep/customers", label: "Customers", icon: Users, badge: 0 },
    { href: "/rep/products", label: "Products", icon: Package, badge: 0 },
    { href: "/rep/orders", label: "Orders", icon: FileText, badge: 0 },
  ]

  const adminNavItems = [
    { href: "/admin/dashboard", label: "Home", icon: Home, badge: 0 },
    { href: "/admin/applications", label: "Apps", icon: FileText, badge: 0 },
    { href: "/admin/order-settings", label: "Settings", icon: Settings, badge: 0 },
  ]

  const isAdminPortal = pathname.startsWith('/admin')
  const isRep = isRepPortal || pathname.startsWith('/rep')
  const navItems = isAdminPortal ? adminNavItems : isRep ? repNavItems : retailerNavItems

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-40">
      <nav className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 relative",
                isActive
                  ? "text-primary"
                  : "text-gray-600"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-4 min-w-4 px-1 flex items-center justify-center font-medium">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </Link>
          )
        })}
        
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center gap-1 text-gray-600"
        >
          <Menu className="h-5 w-5" />
          <span className="text-xs">Menu</span>
        </button>
      </nav>
    </div>
  )
}