import type { Metadata, Viewport } from "next"
import { CartProvider } from "@/lib/cart-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "B2B Portal - Wholesale Management Platform",
  description: "Professional B2B wholesale portal for retailers and sales representatives",
  keywords: "wholesale, B2B, portal, retail, sales, inventory, ordering",
  authors: [{ name: "B2B Portal Team" }],
  creator: "B2B Portal",
  publisher: "B2B Portal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "B2B Portal - Wholesale Management Platform",
    description: "Professional B2B wholesale portal for retailers and sales representatives",
    type: "website",
    locale: "en_US",
    siteName: "B2B Portal",
  },
  twitter: {
    card: "summary_large_image",
    title: "B2B Portal - Wholesale Management Platform",
    description: "Professional B2B wholesale portal for retailers and sales representatives",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1e40af",
}

/**
 * @description Root layout component for the application
 * @fileoverview Main layout wrapper with global styles
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}