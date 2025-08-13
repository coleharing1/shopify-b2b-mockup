/**
 * @fileoverview In-memory product override service for admin edits.
 * @description Supports bulk edits to product fields and variant-level updates. Demo-only (ephemeral).
 */

import type { Product } from '@/lib/mock-data'

export type ProductFieldUpdates = Partial<Pick<Product, 'name' | 'category' | 'msrp' | 'cogs' | 'orderTypes' | 'description'>>

export type VariantUpdate = {
  variantId: string
  changes: Partial<NonNullable<Product['variants']>[number]>
}

export type VariantAdd = Omit<NonNullable<Product['variants']>[number], 'id'> & { id?: string }

export type VariantOps = {
  productId: string
  updates?: VariantUpdate[]
  add?: VariantAdd[]
  remove?: string[]
}

type ProductOverride = {
  fields?: ProductFieldUpdates
  variants?: {
    update: Map<string, Partial<NonNullable<Product['variants']>[number]>>
    remove: Set<string>
    add: NonNullable<Product['variants']>[number][]
  }
}

const productOverrides: Map<string, ProductOverride> = new Map()

export function getProductOverrides(): Record<string, any> {
  const out: Record<string, any> = {}
  for (const [id, ov] of productOverrides) {
    const v = ov.variants
    out[id] = {
      fields: ov.fields,
      variants: v
        ? {
            update: Object.fromEntries(v.update),
            remove: Array.from(v.remove),
            add: v.add
          }
        : undefined
    }
  }
  return out
}

export function bulkEditProducts(productIds: string[], updates: ProductFieldUpdates): { updated: number } {
  let count = 0
  for (const id of productIds) {
    const existing = productOverrides.get(id) || {}
    existing.fields = { ...(existing.fields || {}), ...updates }
    productOverrides.set(id, existing)
    count++
  }
  return { updated: count }
}

export function updateProductVariants(op: VariantOps): { updated: boolean } {
  const { productId } = op
  const existing = productOverrides.get(productId) || {}
  if (!existing.variants) {
    existing.variants = { update: new Map(), remove: new Set(), add: [] }
  }
  const v = existing.variants

  if (op.updates) {
    for (const u of op.updates) {
      const current = v.update.get(u.variantId) || {}
      v.update.set(u.variantId, { ...current, ...u.changes })
    }
  }
  if (op.remove) {
    for (const id of op.remove) v.remove.add(id)
  }
  if (op.add) {
    for (const add of op.add) {
      const id = add.id || `var-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      v.add.push({ id, ...add })
    }
  }

  productOverrides.set(productId, existing)
  return { updated: true }
}

export function applyProductOverrides(products: Product[]): Product[] {
  return products.map(p => {
    const ov = productOverrides.get(p.id)
    if (!ov) return p
    let product: Product = { ...p, ...(ov.fields || {}) }

    if (product.variants && ov.variants) {
      const updated = product.variants
        .filter(v => !ov.variants!.remove.has(v.id))
        .map(v => ({ ...v, ...(ov.variants!.update.get(v.id) || {}) }))
      const withAdded = [...updated, ...ov.variants.add]
      product = { ...product, variants: withAdded }
    }
    return product
  })
}


