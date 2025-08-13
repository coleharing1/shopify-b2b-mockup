"use client"

import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X, Home, Package, ShoppingCart, FileText, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MobileNavDrawerProps {
  isOpen: boolean
  onClose: () => void
  isRepPortal?: boolean
}

/**
 * @description Mobile navigation drawer component
 * @fileoverview Slide-out navigation menu for mobile devices
 */
export function MobileNavDrawer({ isOpen, onClose, isRepPortal = false }: MobileNavDrawerProps) {
  const pathname = usePathname()

  const retailerNavItems = [
    { href: "/retailer/dashboard", label: "Dashboard", icon: Home },
    { href: "/retailer/products", label: "Products", icon: Package },
    { href: "/retailer/cart", label: "Cart", icon: ShoppingCart },
    { href: "/retailer/orders", label: "Orders", icon: FileText },
    { href: "/retailer/resources", label: "Resources", icon: FileText },
  ]

  const repNavItems = [
    { href: "/rep/dashboard", label: "Dashboard", icon: Home },
    { href: "/rep/customers", label: "Customers", icon: Users },
    { href: "/rep/products", label: "Products", icon: Package },
    { href: "/rep/orders", label: "Orders", icon: FileText },
    { href: "/rep/resources", label: "Resources", icon: FileText },
  ]

  const navItems = isRepPortal ? repNavItems : retailerNavItems

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/80" />
        </Transition.Child>

        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                  <button type="button" className="-m-2.5 p-2.5" onClick={onClose}>
                    <span className="sr-only">Close sidebar</span>
                    <X className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              
              <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
                <div className="flex h-16 shrink-0 items-center">
                  <span className="text-xl font-bold text-primary">B2B Portal</span>
                </div>
                
                <nav className="flex flex-1 flex-col">
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navItems.map((item) => {
                          const isActive = pathname === item.href
                          const Icon = item.icon
                          
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                  "group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-semibold",
                                  isActive
                                    ? "bg-primary-light text-primary"
                                    : "text-gray-700 hover:text-primary hover:bg-gray-50"
                                )}
                              >
                                <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                                {item.label}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    </li>
                    
                    <li className="mt-auto">
                      <Link
                        href="/select-account"
                        onClick={onClose}
                        className="group -mx-2 flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary"
                      >
                        Switch Account
                      </Link>
                      <Link
                        href="/login"
                        onClick={onClose}
                        className="group -mx-2 flex gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary"
                      >
                        Sign out
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}