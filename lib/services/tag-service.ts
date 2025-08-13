/**
 * @fileoverview In-memory product tag override service for demo mode.
 * @description Supports bulk add/remove/replace of tags and overlaying them onto product data.
 */

import type { Product } from '@/lib/mock-data'

type TagOps = {
  productId: string
  add?: string[]
  remove?: string[]
  replace?: string[]
}

// Module-scoped in-memory store (ephemeral in dev)
const productIdToTagsOverride: Map<string, Set<string>> = new Map()

function normalize(tags: string[] | undefined): string[] {
  if (!tags) return []
  return Array.from(new Set(tags.map(t => t.trim()).filter(Boolean)))
}

export function getAllOverrides(): Record<string, string[]> {
  const out: Record<string, string[]> = {}
  for (const [id, set] of productIdToTagsOverride.entries()) {
    out[id] = Array.from(set)
  }
  return out
}

export function getTagsForProduct(productId: string): string[] {
  return Array.from(productIdToTagsOverride.get(productId) || [])
}

export function applyTagOverrides(products: Product[]): Product[] {
  return products.map(p => {
    const override = productIdToTagsOverride.get(p.id)
    if (!override) return p
    const merged = Array.from(new Set([...(p.tags || []), ...override]))
    return { ...p, tags: merged }
  })
}

export function bulkUpdateTags(operations: TagOps[]): { updated: number } {
  let updated = 0
  for (const op of operations) {
    const add = normalize(op.add)
    const remove = normalize(op.remove)
    const replace = normalize(op.replace)

    if (!productIdToTagsOverride.has(op.productId)) {
      productIdToTagsOverride.set(op.productId, new Set<string>())
    }
    const current = productIdToTagsOverride.get(op.productId) as Set<string>

    if (replace.length > 0) {
      productIdToTagsOverride.set(op.productId, new Set(replace))
      updated++
      continue
    }

    if (add.length > 0) {
      for (const t of add) current.add(t)
    }
    if (remove.length > 0) {
      for (const t of remove) current.delete(t)
    }
    updated++
  }
  return { updated }
}


