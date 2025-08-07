"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Product } from "./mock-data"

export interface CartItem {
  productId: string
  product: Product
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
}

interface CartContextType {
  items: CartItem[]
  addToCart: (item: CartItem) => void
  updateQuantity: (productId: string, variantId: string, quantity: number) => void
  removeFromCart: (productId: string, variantId: string) => void
  clearCart: () => void
  getCartTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

/**
 * @description Cart provider component
 * @fileoverview Manages shopping cart state across the application
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("b2b-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Error loading cart:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("b2b-cart", JSON.stringify(items))
  }, [items])

  const addToCart = (newItem: CartItem) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.productId === newItem.productId && item.variantId === newItem.variantId
      )

      if (existingItemIndex > -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += newItem.quantity
        return updatedItems
      }

      // Add new item
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
  }

  const clearCart = () => {
    setItems([])
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0)
  }

  const getItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      getItemCount
    }}>
      {children}
    </CartContext.Provider>
  )
}

/**
 * @description Hook to use cart context
 */
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}