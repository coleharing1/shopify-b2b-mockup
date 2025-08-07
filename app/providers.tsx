"use client"

import { Suspense } from "react"
import { CartProvider } from "@/lib/cart-context"
import { AtOnceCartProvider } from "@/lib/contexts/at-once-cart-context"
import { PrebookCartProvider } from "@/lib/contexts/prebook-cart-context"
import { CloseoutCartProvider } from "@/lib/contexts/closeout-cart-context"
import { AuthProvider } from "@/lib/contexts/auth-context"
import { AppStateProvider } from "@/lib/contexts/app-state-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    }>
      <AuthProvider>
        <AppStateProvider>
          <CartProvider>
            <AtOnceCartProvider>
              <PrebookCartProvider>
                <CloseoutCartProvider>
                  {children}
                </CloseoutCartProvider>
              </PrebookCartProvider>
            </AtOnceCartProvider>
          </CartProvider>
        </AppStateProvider>
      </AuthProvider>
    </Suspense>
  )
}