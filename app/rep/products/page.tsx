"use client"

/**
 * @fileoverview Rep Products page reusing retailer product catalog UI so all roles can browse products.
 * @description Delegates to the same catalog experience used by retailers, with cart actions hidden for reps.
 */

import RetailerProducts from "@/app/retailer/products/page"

export default function RepProductsPage() {
  return <RetailerProducts />
}

