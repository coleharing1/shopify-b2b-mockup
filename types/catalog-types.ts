/**
 * @fileoverview TypeScript types for product catalog management
 * @description Defines interfaces for company-specific catalog rules and assignments
 */

/**
 * Product catalog defining what products a company can see
 */
export interface Catalog {
  id: string
  name: string
  description?: string
  companyIds: string[]
  productInclusions: Array<string | 'all' | 'closeout'>
  productExclusions: string[]
  categoryInclusions: Array<string | 'all'>
  categoryExclusions: string[]
  isDefault: boolean
  features?: string[]
  restrictions?: string[]
  createdAt: string
  updatedAt: string
}

/**
 * Assignment of a catalog to a company
 */
export interface CatalogAssignment {
  companyId: string
  catalogId: string
  assignedBy: string
  assignedAt: string
  notes?: string
}

/**
 * Rules for catalog filtering
 */
export interface CatalogRule {
  type: 'include' | 'exclude'
  target: 'product' | 'category'
  values: string[]
}

/**
 * Result of catalog filtering
 */
export interface CatalogFilterResult {
  catalogId: string
  catalogName: string
  totalProducts: number
  visibleProducts: number
  hiddenProducts: number
  appliedRules: CatalogRule[]
}

/**
 * Company catalog context
 */
export interface CompanyCatalogContext {
  companyId: string
  catalog: Catalog
  assignment?: CatalogAssignment
  effectiveDate: string
}

/**
 * Product visibility result
 */
export interface ProductVisibility {
  productId: string
  visible: boolean
  reason?: 'included' | 'excluded' | 'category-excluded' | 'not-in-catalog'
  catalogId: string
}

/**
 * Category visibility result
 */
export interface CategoryVisibility {
  categoryId: string
  categoryName: string
  visible: boolean
  productCount: number
  visibleProductCount: number
}

/**
 * Catalog validation result
 */
export interface CatalogValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
  stats: {
    totalProducts: number
    includedProducts: number
    excludedProducts: number
    totalCategories: number
    includedCategories: number
    excludedCategories: number
  }
}