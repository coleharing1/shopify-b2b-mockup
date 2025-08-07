"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { EnhancedProduct, AtOnceMetadata } from "@/types/order-types"
import { toast } from "sonner"

export interface AtOnceCartItem {
  productId: string
  product: EnhancedProduct
  variantId: string
  variant: {
    id: string
    color: string
    size: string
    inventory: number
    sku: string
    weight?: string
  }
  quantity: number
  unitPrice: number
  shipDate?: Date
  metadata?: AtOnceMetadata
}

interface AtOnceCartContextType {
  items: AtOnceCartItem[]
  addToCart: (item: AtOnceCartItem) => void
  updateQuantity: (productId: string, variantId: string, quantity: number) => void
  removeFromCart: (productId: string, variantId: string) => void
  clearCart: () => void
  getCartTotal: () => number
  getItemCount: () => number
  validateInventory: (productId: string, variantId: string, quantity: number) => boolean
  getEstimatedShipDate: () => Date
  cartType: 'at-once'
}

const AtOnceCartContext = createContext<AtOnceCartContextType | undefined>(undefined)

/**
 * @description At-Once Cart Provider - Manages immediate fulfillment orders
 * @fileoverview Green-coded cart for in-stock items with 1-5 day shipping
 */
export function AtOnceCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<AtOnceCartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("b2b-cart-at-once")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading at-once cart:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("b2b-cart-at-once", JSON.stringify(items))
  }, [items])

  const validateInventory = (productId: string, variantId: string, quantity: number): boolean => {
    // In a real app, this would check real-time inventory
    // For now, we'll simulate with the variant's inventory field
    const item = items.find(i => i.productId === productId && i.variantId === variantId)
    if (!item) return true // New item, check would happen on add
    
    const availableStock = item.variant.inventory || 0
    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} units available in stock`)
      return false
    }
    return true
  }

  const addToCart = (newItem: AtOnceCartItem) => {
    // Check if product is eligible for at-once orders
    if (!newItem.product.orderTypes?.includes('at-once')) {
      toast.error("This product is not available for immediate shipment")
      return
    }

    // Validate inventory
    if (!validateInventory(newItem.productId, newItem.variantId, newItem.quantity)) {
      return
    }

    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.productId === newItem.productId && item.variantId === newItem.variantId
      )

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems]
        const newQuantity = updatedItems[existingItemIndex].quantity + newItem.quantity
        
        // Check inventory for combined quantity
        if (!validateInventory(newItem.productId, newItem.variantId, newQuantity)) {
          return prevItems
        }
        
        updatedItems[existingItemIndex].quantity = newQuantity
        toast.success("Updated quantity in cart")
        return updatedItems
      }

      // Add new item
      toast.success("Added to cart - Ships within 1-5 business days")
      return [...prevItems, newItem]
    })
  }

  const updateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId)
      return
    }

    if (!validateInventory(productId, variantId, quantity)) {
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
    toast.success("Removed from cart")
  }

  const clearCart = () => {
    setItems([])
    toast.success("Cart cleared")
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0)
  }

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getEstimatedShipDate = (): Date => {
    // Calculate estimated ship date based on business days
    const today = new Date()
    const businessDays = 3 // Average between 1-5 days
    let shipDate = new Date(today)
    let daysAdded = 0
    
    while (daysAdded < businessDays) {
      shipDate.setDate(shipDate.getDate() + 1)
      // Skip weekends
      if (shipDate.getDay() !== 0 && shipDate.getDay() !== 6) {
        daysAdded++
      }
    }
    
    return shipDate
  }

  return (
    <AtOnceCartContext.Provider value={{
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      getItemCount,
      validateInventory,
      getEstimatedShipDate,
      cartType: 'at-once'
    }}>
      {children}
    </AtOnceCartContext.Provider>
  )
}

/**
 * @description Hook to use at-once cart context
 */
export function useAtOnceCart() {
  const context = useContext(AtOnceCartContext)
  if (!context) {
    throw new Error("useAtOnceCart must be used within an AtOnceCartProvider")
  }
  return context
}