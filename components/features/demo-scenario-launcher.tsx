"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingCart, 
  Calendar, 
  Tag, 
  FileText, 
  Users, 
  Package,
  Rocket,
  ArrowRight,
  Sparkles
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAtOnceCart } from "@/lib/contexts/at-once-cart-context"
import { usePrebookCart } from "@/lib/contexts/prebook-cart-context"
import { useCloseoutCart } from "@/lib/contexts/closeout-cart-context"
import { useAuth } from "@/lib/contexts/auth-context"
import { toast } from "sonner"

interface Scenario {
  id: string
  title: string
  description: string
  icon: any
  requiredRole: 'retailer' | 'sales_rep' | 'admin' | 'any'
  actions: () => void
  badge?: string
  color: string
}

/**
 * @description Demo scenario launcher for quick demo walkthroughs
 * @fileoverview Provides pre-configured scenarios with loaded carts and navigation
 */
export function DemoScenarioLauncher() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { user, login } = useAuth()
  const { addToCart: addToRegularCart } = useCart()
  const { addToCart: addToAtOnceCart } = useAtOnceCart()
  const { addToCart: addToPrebookCart } = usePrebookCart()
  const { addToCart: addToCloseoutCart } = useCloseoutCart()

  /**
   * Load sample at-once cart
   */
  const loadAtOnceCart = async () => {
    // Mock products for at-once order
    const products = [
      { id: 'at-1', name: 'Essential Cotton T-Shirt', price: 14.99, quantity: 24 },
      { id: 'at-2', name: 'Premium Fleece Hoodie', price: 29.99, quantity: 12 },
      { id: 'at-3', name: 'Classic Baseball Cap', price: 12.49, quantity: 48 },
    ]

    products.forEach(product => {
      addToAtOnceCart({
        productId: product.id,
        product: {
          id: product.id,
          name: product.name,
          description: 'Demo product for testing',
          msrp: product.price * 2,
          sku: `SKU-${product.id}`,
          category: 'Apparel',
          subcategory: 'Clothing',
          images: ['/api/placeholder/400/400'],
          orderTypes: ['at-once'],
          orderTypeMetadata: {
            'at-once': {
              shipWithin: 2,
              stockLocation: ['Warehouse A'],
              atsInventory: 1000,
              realTimeSync: true,
              evergreenItem: true,
              quickReorderEligible: true,
              backorderAvailable: false
            }
          },
          pricing: {
            Bronze: { price: product.price, minQuantity: 1 },
            Silver: { price: product.price * 0.9, minQuantity: 12 },
            Gold: { price: product.price * 0.8, minQuantity: 24 }
          }
        },
        variantId: `${product.id}-v1`,
        variant: {
          id: `${product.id}-v1`,
          size: 'M',
          color: 'Black',
          sku: `SKU-${product.id}-M-BK`,
          inventory: 100
        },
        quantity: product.quantity,
        unitPrice: product.price
      } as any)
    })

    toast.success('Loaded sample At-Once cart with 3 products')
    router.push('/retailer/at-once')
  }

  /**
   * Load sample prebook cart
   */
  const loadPrebookCart = async () => {
    // Mock products for prebook order
    const products = [
      { id: 'pb-1', name: 'Spring Floral Midi Dress', price: 44.99, quantity: 6 },
      { id: 'pb-2', name: 'Lightweight Linen Shorts', price: 24.99, quantity: 12 },
      { id: 'pb-3', name: 'Quilted Fall Jacket', price: 64.99, quantity: 8 },
    ]

    products.forEach(product => {
      addToPrebookCart({
        productId: product.id,
        product: {
          id: product.id,
          name: product.name,
          description: 'Demo prebook product',
          msrp: product.price * 2,
          sku: `SKU-${product.id}`,
          category: 'Apparel',
          subcategory: 'Seasonal',
          images: ['/api/placeholder/400/400'],
          orderTypes: ['prebook'],
          pricing: {
            Bronze: { price: product.price, minQuantity: 1 },
            Silver: { price: product.price * 0.9, minQuantity: 12 },
            Gold: { price: product.price * 0.8, minQuantity: 24 }
          },
          orderTypeMetadata: {
            'prebook': {
              season: 'Spring 2025',
              collection: 'Fashion',
              deliveryWindow: {
                start: new Date('2025-03-15'),
                end: new Date('2025-03-30'),
                isFlexible: true
              },
              cancellationDeadline: new Date('2025-02-01'),
              modificationDeadline: new Date('2025-02-15'),
              depositPercent: 30,
              requiresFullSizeRun: true,
              minimumUnits: 6,
              productionStatus: 'confirmed'
            }
          }
        },
        variantId: `${product.id}-v1`,
        variant: {
          id: `${product.id}-v1`,
          size: 'M',
          color: 'Blue',
          sku: `SKU-${product.id}-M-BL`,
          inventory: 0
        },
        quantity: product.quantity,
        unitPrice: product.price,
        season: 'Spring 2025',
        deliveryDate: new Date('2025-03-15')
      } as any)
    })

    toast.success('Loaded sample Prebook cart for Spring 2025')
    router.push('/retailer/prebook')
  }

  /**
   * Load sample closeout cart
   */
  const loadCloseoutCart = async () => {
    // Mock products for closeout order
    const products = [
      { id: 'cl-1', name: 'Winter Puffer Jacket - FINAL SALE', price: 59.99, quantity: 3, discount: 60 },
      { id: 'cl-2', name: 'Leather Ankle Boots - CLEARANCE', price: 94.99, quantity: 2, discount: 50 },
    ]

    products.forEach(product => {
      addToCloseoutCart({
        productId: product.id,
        product: {
          id: product.id,
          name: product.name,
          description: 'Demo closeout product',
          msrp: product.price * 2.5,
          sku: `SKU-${product.id}`,
          category: 'Clearance',
          subcategory: 'Final Sale',
          images: ['/api/placeholder/400/400'],
          orderTypes: ['closeout'],
          pricing: {
            Bronze: { price: product.price, minQuantity: 1 },
            Silver: { price: product.price * 0.9, minQuantity: 2 },
            Gold: { price: product.price * 0.8, minQuantity: 4 }
          },
          orderTypeMetadata: {
            'closeout': {
              listId: 'closeout-winter-2025',
              expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
              startedAt: new Date(),
              availableQuantity: 20,
              originalQuantity: 100,
              discountPercent: product.discount,
              finalSale: true,
              minimumOrderQuantity: 2
            }
          }
        },
        variantId: `${product.id}-v1`,
        variant: {
          id: `${product.id}-v1`,
          size: 'L',
          color: 'Navy',
          sku: `SKU-${product.id}-L-NV`,
          inventory: 10
        },
        quantity: product.quantity,
        unitPrice: product.price,
        originalPrice: product.price * 2.5,
        discountPercent: product.discount,
        listId: 'closeout-winter-2025',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      } as any)
    })

    toast.success('Loaded sample Closeout cart with 60% off deals')
    router.push('/retailer/closeouts')
  }

  const scenarios: Scenario[] = [
    {
      id: 'at-once-flow',
      title: 'Place At-Once Order',
      description: 'Load sample cart with evergreen products ready to ship',
      icon: Package,
      requiredRole: 'retailer',
      actions: async () => {
        if (!user || user.role !== 'retailer') {
          await login('john@outdoorretailers.com', 'demo')
        }
        loadAtOnceCart()
        setIsOpen(false)
      },
      badge: 'Popular',
      color: 'bg-green-500'
    },
    {
      id: 'prebook-flow',
      title: 'Place Prebook Order',
      description: 'Experience seasonal ordering with Spring 2025 collection',
      icon: Calendar,
      requiredRole: 'retailer',
      actions: async () => {
        if (!user || user.role !== 'retailer') {
          await login('john@outdoorretailers.com', 'demo')
        }
        loadPrebookCart()
        setIsOpen(false)
      },
      badge: 'New',
      color: 'bg-blue-500'
    },
    {
      id: 'closeout-flow',
      title: 'Browse Closeout Deals',
      description: 'Shop time-limited clearance with deep discounts',
      icon: Tag,
      requiredRole: 'retailer',
      actions: async () => {
        if (!user || user.role !== 'retailer') {
          await login('sarah@urbanstyle.com', 'demo')
        }
        loadCloseoutCart()
        setIsOpen(false)
      },
      badge: '60% Off',
      color: 'bg-red-500'
    },
    {
      id: 'review-apps',
      title: 'Review Applications',
      description: 'Process pending dealer applications as admin',
      icon: FileText,
      requiredRole: 'admin',
      actions: async () => {
        if (user?.role !== 'admin') {
          await login('admin@b2b.com', 'demo')
        }
        router.push('/admin/applications?tab=pending')
        setIsOpen(false)
      },
      color: 'bg-purple-500'
    },
    {
      id: 'manage-customers',
      title: 'Manage Customers',
      description: 'View customer accounts and place orders as sales rep',
      icon: Users,
      requiredRole: 'sales_rep',
      actions: async () => {
        if (!user || user.role !== 'sales_rep') {
          await login('rep@company.com', 'demo')
        }
        router.push('/rep/customers')
        setIsOpen(false)
      },
      color: 'bg-indigo-500'
    },
    {
      id: 'full-demo',
      title: 'Full Demo Tour',
      description: 'Walk through all three order types with sample data',
      icon: Rocket,
      requiredRole: 'any',
      actions: async () => {
        if (!user || user.role !== 'retailer') {
          await login('john@outdoorretailers.com', 'demo')
        }
        // Load all three carts
        loadAtOnceCart()
        setTimeout(() => loadPrebookCart(), 1000)
        setTimeout(() => loadCloseoutCart(), 2000)
        toast.success('Loaded all demo carts! Navigate between order types to explore.')
        setIsOpen(false)
      },
      badge: 'Complete',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    }
  ]

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={() => setIsOpen(true)}
        >
          <Sparkles className="h-5 w-5 mr-2" />
          Demo Scenarios
        </Button>
      </div>

      {/* Scenario Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Quick Demo Scenarios
            </DialogTitle>
            <DialogDescription>
              Launch pre-configured scenarios with sample data for easy demonstration
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {scenarios.map((scenario) => (
              <Card 
                key={scenario.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={scenario.actions}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${scenario.color} bg-opacity-10`}>
                      <scenario.icon className={`h-5 w-5 ${scenario.color.replace('bg-', 'text-')}`} />
                    </div>
                    {scenario.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {scenario.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base mt-3">{scenario.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {scenario.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-between group"
                  >
                    Launch Scenario
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>💡 Tip:</strong> Scenarios will automatically switch to the required role and load sample data. 
              You can also use the role switcher in the header to change roles anytime.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}