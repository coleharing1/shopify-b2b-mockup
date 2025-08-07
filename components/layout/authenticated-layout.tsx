'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Header } from './header'
import { Footer } from './footer'
import { Sidebar } from './sidebar'
import { MobileNavDrawer } from './mobile-nav-drawer'
import { MobileBottomNav } from './mobile-bottom-nav'

/**
 * @fileoverview AuthenticatedLayout component.
 * @description Provides the main layout structure for authenticated pages, including header, sidebar, and footer.
 */
export function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false)
  const pathname = usePathname()
  const isRepPortal = pathname.startsWith("/rep")

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen)
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 pb-16 lg:pb-0">
            <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
              {children}
            </div>
          </main>
          <div className="hidden lg:block">
            <Footer />
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNavDrawer 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)}
        isRepPortal={isRepPortal}
      />
      <MobileBottomNav 
        isRepPortal={isRepPortal}
        onMenuClick={toggleMobileNav}
      />
    </>
  )
}
