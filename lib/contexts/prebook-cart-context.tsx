"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { EnhancedProduct, PrebookMetadata } from "@/types/order-types"
import { toast } from "sonner"

export interface PrebookCartItem {
  productId: string
  product: EnhancedProduct
  variantId: string
  variant: {
    id: string
    color: string
    size: string
    sku: string
  }
  quantity: number
  unitPrice: number
  season: string
  deliveryWindow: {
    start: Date
    end: Date
  }
  metadata?: PrebookMetadata
}

interface PrebookCartContextType {
  items: PrebookCartItem[]
  addToCart: (item: PrebookCartItem) => void
  updateQuantity: (productId: string, variantId: string, quantity: number) => void
  removeFromCart: (productId: string, variantId: string) => void
  clearCart: () => void
  clearSeason: (season: string) => void
  getCartTotal: () => number
  getDepositAmount: () => number
  getItemCount: () => number
  getSeasonGroups: () => Map<string, PrebookCartItem[]>
  validateSizeRun: (productId: string) => boolean
  getCancellationDeadline: (season: string) => Date | null
  cartType: 'prebook'
}

const PrebookCartContext = createContext<PrebookCartContextType | undefined>(undefined)

/**
 * @description Prebook Cart Provider - Manages future season orders
 * @fileoverview Blue-coded cart for seasonal ordering with deposits
 */
export function PrebookCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<PrebookCartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("b2b-cart-prebook")
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        // Convert date strings back to Date objects
        const itemsWithDates = parsed.map((item: any) => ({
          ...item,
          deliveryWindow: {
            start: new Date(item.deliveryWindow.start),
            end: new Date(item.deliveryWindow.end)
          }
        }))
        setItems(itemsWithDates)
      } catch (error) {
        console.error("Error loading prebook cart:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("b2b-cart-prebook", JSON.stringify(items))
  }, [items])

  const validateSizeRun = (productId: string): boolean => {
    // Check if product requires full size run
    const productItems = items.filter(item => item.productId === productId)
    if (productItems.length === 0) return true

    const product = productItems[0].product
    const metadata = product.orderTypeMetadata?.prebook
    
    if (metadata?.requiresFullSizeRun) {
      // Check if all sizes are included
      const allSizes = product.variants?.map(v => v.size) || []
      const cartSizes = productItems.map(item => item.variant.size)
      const missingSizes = allSizes.filter(size => !cartSizes.includes(size))
      
      if (missingSizes.length > 0) {
        toast.error(`Full size run required. Missing sizes: ${missingSizes.join(', ')}`)
        return false
      }
    }
    
    return true
  }

  const addToCart = (newItem: PrebookCartItem) => {
    // Check if product is eligible for prebook orders
    if (!newItem.product.orderTypes?.includes('prebook')) {
      toast.error("This product is not available for prebook ordering")
      return
    }

    // Check minimum quantity requirements
    const metadata = newItem.product.orderTypeMetadata?.prebook
    if (metadata?.minimumUnits && newItem.quantity < metadata.minimumUnits) {
      toast.error(`Minimum order quantity is ${metadata.minimumUnits} units`)
      return
    }

    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.productId === newItem.productId && 
                item.variantId === newItem.variantId &&
                item.season === newItem.season
      )

      if (existingItemIndex > -1) {
        // Update quantity if item exists for same season
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        toast.success(`Updated quantity for ${newItem.season}`)
        return updatedItems
      }

      // Add new item
      const deliveryText = `${newItem.deliveryWindow.start.toLocaleDateString()} - ${newItem.deliveryWindow.end.toLocaleDateString()}`
      toast.success(`Added to prebook cart for ${newItem.season} (Delivery: ${deliveryText})`)
      return [...prevItems, newItem]
    })
  }

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId)
      return
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const removeFromCart = (productId: string, variantId: string) => {
    setItems(prevItems =>
      prevItems.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      )
    )
    toast.success("Removed from prebook cart")
  }

  const clearCart = () => {
    setItems([])
    toast.success("Prebook cart cleared")
  }

  const clearSeason = (season: string) => {
    setItems(prevItems => prevItems.filter(item => item.season !== season))
    toast.success(`Cleared all ${season} items`)
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0)
  }

  const getDepositAmount = (): number => {
    // Calculate deposit based on season requirements (typically 30-50%)
    const seasonGroups = getSeasonGroups()
    let totalDeposit = 0
    
    seasonGroups.forEach((items, season) => {
      const seasonTotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
      // Default to 30% deposit if not specified
      const depositPercent = items[0]?.metadata?.depositPercent || 30
      totalDeposit += seasonTotal * (depositPercent / 100)
    })
    
    return totalDeposit
  }

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getSeasonGroups = (): Map<string, PrebookCartItem[]> => {
    const groups = new Map<string, PrebookCartItem[]>()
    
    items.forEach(item => {
      const season = item.season
      if (!groups.has(season)) {
        groups.set(season, [])
      }
      groups.get(season)!.push(item)
    })
    
    return groups
  }

  const getCancellationDeadline = (season: string): Date | null => {
    const seasonItems = items.filter(item => item.season === season)
    if (seasonItems.length === 0) return null
    
    return seasonItems[0].metadata?.cancellationDeadline || null
  }

  return (
    <PrebookCartContext.Provider value={{
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      clearSeason,
      getCartTotal,
      getDepositAmount,
      getItemCount,
      getSeasonGroups,
      validateSizeRun,
      getCancellationDeadline,
      cartType: 'prebook'
    }}>
      {children}
    </PrebookCartContext.Provider>
  )
}

/**
 * @description Hook to use prebook cart context
 */
export function usePrebookCart() {
  const context = useContext(PrebookCartContext)
  if (!context) {
    throw new Error("usePrebookCart must be used within a PrebookCartProvider")
  }
  return context
}