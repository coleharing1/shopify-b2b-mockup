"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { EnhancedProduct, CloseoutMetadata } from "@/types/order-types"
import { toast } from "sonner"

export interface CloseoutCartItem {
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
  originalPrice: number
  discountPercent: number
  listId: string
  expiresAt: Date
  metadata?: CloseoutMetadata
}

interface CloseoutCartContextType {
  items: CloseoutCartItem[]
  addToCart: (item: CloseoutCartItem) => void
  updateQuantity: (productId: string, variantId: string, quantity: number) => void
  removeFromCart: (productId: string, variantId: string) => void
  clearCart: () => void
  getCartTotal: () => number
  getSavingsTotal: () => number
  getItemCount: () => number
  validateQuantityAvailable: (productId: string, variantId: string, quantity: number) => boolean
  getTimeRemaining: (listId: string) => number // minutes remaining
  isExpired: (listId: string) => boolean
  cartType: 'closeout'
}

const CloseoutCartContext = createContext<CloseoutCartContextType | undefined>(undefined)

/**
 * @description Closeout Cart Provider - Manages clearance orders
 * @fileoverview Red-coded cart for time-limited closeout deals
 */
export function CloseoutCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CloseoutCartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("b2b-cart-closeout")
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        // Convert date strings back to Date objects
        const itemsWithDates = parsed.map((item: any) => ({
          ...item,
          expiresAt: new Date(item.expiresAt)
        }))
        
        // Remove expired items
        const validItems = itemsWithDates.filter((item: CloseoutCartItem) => 
          !isExpired(item.listId, item.expiresAt)
        )
        
        if (validItems.length < itemsWithDates.length) {
          toast.warning("Some closeout items have expired and were removed from your cart")
        }
        
        setItems(validItems)
      } catch (error) {
        console.error("Error loading closeout cart:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("b2b-cart-closeout", JSON.stringify(items))
  }, [items])

  // Check for expired items every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prevItems => {
        const validItems = prevItems.filter(item => !isExpired(item.listId, item.expiresAt))
        if (validItems.length < prevItems.length) {
          toast.error("Some closeout items have expired and were removed from your cart")
        }
        return validItems
      })
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const isExpired = (listId: string, expiresAt?: Date): boolean => {
    const expiry = expiresAt || items.find(i => i.listId === listId)?.expiresAt
    if (!expiry) return true
    return new Date() > new Date(expiry)
  }

  const getTimeRemaining = (listId: string): number => {
    const item = items.find(i => i.listId === listId)
    if (!item) return 0
    
    const now = new Date()
    const expiry = new Date(item.expiresAt)
    const diff = expiry.getTime() - now.getTime()
    
    return Math.max(0, Math.floor(diff / 60000)) // Return minutes
  }

  const validateQuantityAvailable = (productId: string, variantId: string, quantity: number): boolean => {
    // In a real app, this would check the closeout list's available quantity
    const item = items.find(i => i.productId === productId && i.variantId === variantId)
    
    if (item?.metadata?.availableQuantity) {
      const currentInCart = item.quantity || 0
      const availableRemaining = item.metadata.availableQuantity - currentInCart
      
      if (quantity > availableRemaining) {
        toast.error(`Only ${availableRemaining} units remaining in this closeout`)
        return false
      }
    }
    
    // Check maximum per customer
    if (item?.metadata?.maximumPerCustomer) {
      if (quantity > item.metadata.maximumPerCustomer) {
        toast.error(`Maximum ${item.metadata.maximumPerCustomer} units per customer`)
        return false
      }
    }
    
    return true
  }

  const addToCart = (newItem: CloseoutCartItem) => {
    // Check if product is eligible for closeout orders
    if (!newItem.product.orderTypes?.includes('closeout')) {
      toast.error("This product is not available as a closeout")
      return
    }

    // Check if closeout has expired
    if (isExpired(newItem.listId, newItem.expiresAt)) {
      toast.error("This closeout offer has expired")
      return
    }

    // Check minimum quantity requirements
    if (newItem.metadata?.minimumOrderQuantity && newItem.quantity < newItem.metadata.minimumOrderQuantity) {
      toast.error(`Minimum order quantity is ${newItem.metadata.minimumOrderQuantity} units`)
      return
    }

    // Validate quantity available
    if (!validateQuantityAvailable(newItem.productId, newItem.variantId, newItem.quantity)) {
      return
    }

    // Show final sale warning
    if (newItem.metadata?.finalSale) {
      toast.warning("Final Sale - No returns or exchanges", {
        duration: 5000
      })
    }

    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.productId === newItem.productId && 
                item.variantId === newItem.variantId &&
                item.listId === newItem.listId
      )

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems]
        const newQuantity = updatedItems[existingItemIndex].quantity + newItem.quantity
        
        // Check quantity limits
        if (!validateQuantityAvailable(newItem.productId, newItem.variantId, newQuantity)) {
          return prevItems
        }
        
        updatedItems[existingItemIndex].quantity = newQuantity
        toast.success(`Updated quantity - ${newItem.discountPercent}% OFF!`)
        return updatedItems
      }

      // Add new item
      const timeRemaining = getTimeRemaining(newItem.listId)
      const hours = Math.floor(timeRemaining / 60)
      const minutes = timeRemaining % 60
      toast.success(`Added to closeout cart - ${newItem.discountPercent}% OFF! (Expires in ${hours}h ${minutes}m)`)
      return [...prevItems, newItem]
    })
  }

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId)
      return
    }

    if (!validateQuantityAvailable(productId, variantId, quantity)) {
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
    toast.success("Removed from closeout cart")
  }

  const clearCart = () => {
    setItems([])
    toast.success("Closeout cart cleared")
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0)
  }

  const getSavingsTotal = () => {
    return items.reduce((total, item) => {
      const originalTotal = item.originalPrice * item.quantity
      const discountedTotal = item.unitPrice * item.quantity
      return total + (originalTotal - discountedTotal)
    }, 0)
  }

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CloseoutCartContext.Provider value={{
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      getSavingsTotal,
      getItemCount,
      validateQuantityAvailable,
      getTimeRemaining,
      isExpired,
      cartType: 'closeout'
    }}>
      {children}
    </CloseoutCartContext.Provider>
  )
}

/**
 * @description Hook to use closeout cart context
 */
export function useCloseoutCart() {
  const context = useContext(CloseoutCartContext)
  if (!context) {
    throw new Error("useCloseoutCart must be used within a CloseoutCartProvider")
  }
  return context
}