'use client'

import Link from 'next/link'
import { Home, Package, Users, BarChart2, LifeBuoy, LogOut, Settings, Clock, Tag, Truck } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'

/**
 * @fileoverview Sidebar component.
 * @description Provides the main sidebar navigation for authenticated users.
 */
export function Sidebar({ isOpen }: { isOpen: boolean; toggleSidebar: () => void }) {
  const pathname = usePathname()
  const isRepPortal = pathname.startsWith('/rep')
  const isAdminPortal = pathname.startsWith('/admin')
  
  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex items-center justify-between h-16 p-4 border-b border-gray-200">
        <span className={`font-bold text-primary ${!isOpen && 'hidden'}`}>B2B Portal</span>
      </div>
      <nav className="mt-4">
        <ul>
          {isRepPortal ? (
            <>
              <li>
                <Link href="/rep/dashboard" className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
                  <Home className="h-6 w-6" />
                  <span className={`ml-4 ${!isOpen && 'hidden'}`}>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/rep/customers" className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
                  <Users className="h-6 w-6" />
                  <span className={`ml-4 ${!isOpen && 'hidden'}`}>Customers</span>
                </Link>
              </li>
              <li>
                <Link href="/rep/orders" className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
                  <Package className="h-6 w-6" />
                  <span className={`ml-4 ${!isOpen && 'hidden'}`}>Orders</span>
                </Link>
              </li>
              <li>
                <Link href="/rep/resources" className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
                  <BarChart2 className="h-6 w-6" />
                  <span className={`ml-4 ${!isOpen && 'hidden'}`}>Resources</span>
                </Link>
              </li>
            </>
          ) : isAdminPortal ? (
            <>
              <li>
                <Link href="/admin/dashboard" className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
                  <Home className="h-6 w-6" />
                  <span className={`ml-4 ${!isOpen && 'hidden'}`}>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/applications" className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
                  <Package className="h-6 w-6" />
                  <span className={`ml-4 ${!isOpen && 'hidden'}`}>Applications</span>
                </Link>
              </li>
              <li>
                <Link href="/admin/order-settings" className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
                  <Settings className="h-6 w-6" />
                  <span className={`ml-4 ${!isOpen && 'hidden'}`}>Order Settings</span>
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/retailer/dashboard" className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
                  <Home className="h-6 w-6" />
                  <span className={`ml-4 ${!isOpen && 'hidden'}`}>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link href="/retailer/products" className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
                  <Package className="h-6 w-6" />
                  <span className={`ml-4 ${!isOpen && 'hidden'}`}>All Products</span>
                </Link>
              </li>
              <li>
                <Link href="/retailer/at-once" className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
                  <Truck className="h-6 w-6 text-green-600" />
                  <span className={`ml-4 flex items-center gap-2 ${!isOpen && 'hidden'}`}>
                    At-Once Orders
                    <Badge className="bg-green-500 text-white text-xs">Stock</Badge>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/retailer/prebook" className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <span className={`ml-4 flex items-center gap-2 ${!isOpen && 'hidden'}`}>
                    Prebook Orders
                    <Badge className="bg-blue-500 text-white text-xs">Future</Badge>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/retailer/closeouts" className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
                  <Tag className="h-6 w-6 text-red-600" />
                  <span className={`ml-4 flex items-center gap-2 ${!isOpen && 'hidden'}`}>
                    Closeout Deals
                    <Badge className="bg-red-500 text-white text-xs">Sale</Badge>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/retailer/orders" className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
                  <Users className="h-6 w-6" />
                  <span className={`ml-4 ${!isOpen && 'hidden'}`}>Order History</span>
                </Link>
              </li>
              <li>
                <Link href="#" className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
                  <BarChart2 className="h-6 w-6" />
                  <span className={`ml-4 ${!isOpen && 'hidden'}`}>Reports</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      <div className="absolute bottom-0 w-full">
        <ul>
          <li>
            <Link href={isRepPortal ? "/rep/settings" : isAdminPortal ? "/admin/order-settings" : "/retailer/settings"} className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
              <Settings className="h-6 w-6" />
              <span className={`ml-4 ${!isOpen && 'hidden'}`}>Settings</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
              <LifeBuoy className="h-6 w-6" />
              <span className={`ml-4 ${!isOpen && 'hidden'}`}>Support</span>
            </Link>
          </li>
          <li>
            <Link href="/login" className="flex items-center p-4 text-gray-600 hover:bg-gray-50 hover:text-primary">
              <LogOut className="h-6 w-6" />
              <span className={`ml-4 ${!isOpen && 'hidden'}`}>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
