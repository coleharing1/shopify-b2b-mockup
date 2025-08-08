/**
 * @fileoverview Service for managing product catalogs and visibility
 * @description Handles catalog filtering, product visibility, and company assignments
 */

import { 
  Catalog, 
  CatalogAssignment, 
  CatalogFilterResult,
  CompanyCatalogContext,
  ProductVisibility,
  CategoryVisibility
} from '@/types/catalog-types'
import { type Product } from '@/lib/mock-data'

/**
 * Service for managing product catalogs
 */
export class CatalogService {
  private static catalogs: Map<string, Catalog> = new Map()
  private static assignments: Map<string, CatalogAssignment> = new Map()
  private static initialized = false

  /**
   * Initialize the service with mock data
   */
  private static async initialize() {
    if (this.initialized) return

    try {
      // Load catalogs from mock data
      const catalogResponse = await fetch('/mockdata/company-catalogs.json')
      const catalogData = await catalogResponse.json()
      
      // Store catalogs
      catalogData.catalogs.forEach((catalog: Catalog) => {
        this.catalogs.set(catalog.id, catalog)
      })

      // Store assignments
      catalogData.assignments.forEach((assignment: CatalogAssignment) => {
        this.assignments.set(assignment.companyId, assignment)
      })

      this.initialized = true
    } catch (error) {
      console.error('Failed to initialize CatalogService:', error)
      // Set default catalog as fallback
      this.catalogs.set('catalog-default', {
        id: 'catalog-default',
        name: 'Default Catalog',
        description: 'Default catalog for all products',
        companyIds: [],
        productInclusions: ['all'],
        productExclusions: [],
        categoryInclusions: ['all'],
        categoryExclusions: [],
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      this.initialized = true
    }
  }

  /**
   * Get catalog for a specific company
   */
  static async getCompanyCatalog(companyId: string): Promise<CompanyCatalogContext> {
    await this.initialize()

    const assignment = this.assignments.get(companyId)
    
    if (assignment) {
      const catalog = this.catalogs.get(assignment.catalogId)
      if (catalog) {
        return {
          companyId,
          catalog,
          assignment,
          effectiveDate: new Date().toISOString()
        }
      }
    }

    // Return default catalog if no assignment
    const defaultCatalog = Array.from(this.catalogs.values()).find(c => c.isDefault)
    if (defaultCatalog) {
      return {
        companyId,
        catalog: defaultCatalog,
        effectiveDate: new Date().toISOString()
      }
    }

    // Fallback to allowing all products
    return {
      companyId,
      catalog: {
        id: 'catalog-fallback',
        name: 'All Products',
        companyIds: [],
        productInclusions: ['all'],
        productExclusions: [],
        categoryInclusions: ['all'],
        categoryExclusions: [],
        isDefault: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      effectiveDate: new Date().toISOString()
    }
  }

  /**
   * Filter products based on catalog rules
   */
  static async filterProductsByCatalog(
    products: Product[], 
    catalog: Catalog
  ): Promise<Product[]> {
    // Handle special inclusion rules
    if (catalog.productInclusions.includes('all')) {
      // Include all products except exclusions
      return products.filter(product => 
        !catalog.productExclusions.includes(product.id) &&
        this.isCategoryAllowed(product.category, catalog)
      )
    }

    if (catalog.productInclusions.includes('closeout')) {
      // Only include closeout products
      return products.filter(product => 
        product.orderTypes?.includes('closeout') &&
        !catalog.productExclusions.includes(product.id) &&
        this.isCategoryAllowed(product.category, catalog)
      )
    }

    // Include only specified products
    return products.filter(product => 
      catalog.productInclusions.includes(product.id) &&
      !catalog.productExclusions.includes(product.id) &&
      this.isCategoryAllowed(product.category, catalog)
    )
  }

  /**
   * Check if a category is visible in the catalog
   */
  static isCategoryVisible(categoryId: string, catalog: Catalog): boolean {
    return this.isCategoryAllowed(categoryId, catalog)
  }

  /**
   * Check if a category is allowed by catalog rules
   */
  private static isCategoryAllowed(categoryId: string, catalog: Catalog): boolean {
    // Check exclusions first
    if (catalog.categoryExclusions.includes(categoryId)) {
      return false
    }

    // Check inclusions
    if (catalog.categoryInclusions.includes('all')) {
      return true
    }

    return catalog.categoryInclusions.includes(categoryId)
  }

  /**
   * Check if a specific product is visible
   */
  static async isProductVisible(
    productId: string, 
    companyId: string
  ): Promise<ProductVisibility> {
    const context = await this.getCompanyCatalog(companyId)
    const catalog = context.catalog

    // Check exclusions first
    if (catalog.productExclusions.includes(productId)) {
      return {
        productId,
        visible: false,
        reason: 'excluded',
        catalogId: catalog.id
      }
    }

    // Check inclusions
    if (catalog.productInclusions.includes('all')) {
      return {
        productId,
        visible: true,
        reason: 'included',
        catalogId: catalog.id
      }
    }

    if (catalog.productInclusions.includes(productId)) {
      return {
        productId,
        visible: true,
        reason: 'included',
        catalogId: catalog.id
      }
    }

    return {
      productId,
      visible: false,
      reason: 'not-in-catalog',
      catalogId: catalog.id
    }
  }

  /**
   * Get catalog filter result summary
   */
  static async getCatalogFilterResult(
    products: Product[],
    companyId: string
  ): Promise<CatalogFilterResult> {
    const context = await this.getCompanyCatalog(companyId)
    const filteredProducts = await this.filterProductsByCatalog(products, context.catalog)

    return {
      catalogId: context.catalog.id,
      catalogName: context.catalog.name,
      totalProducts: products.length,
      visibleProducts: filteredProducts.length,
      hiddenProducts: products.length - filteredProducts.length,
      appliedRules: [
        ...context.catalog.productInclusions.map(v => ({
          type: 'include' as const,
          target: 'product' as const,
          values: Array.isArray(v) ? v : [v]
        })),
        ...context.catalog.productExclusions.length > 0 ? [{
          type: 'exclude' as const,
          target: 'product' as const,
          values: context.catalog.productExclusions
        }] : []
      ]
    }
  }

  /**
   * Get all catalogs
   */
  static async getAllCatalogs(): Promise<Catalog[]> {
    await this.initialize()
    return Array.from(this.catalogs.values())
  }

  /**
   * Get catalog by ID
   */
  static async getCatalogById(catalogId: string): Promise<Catalog | null> {
    await this.initialize()
    return this.catalogs.get(catalogId) || null
  }

  /**
   * Get all assignments
   */
  static async getAllAssignments(): Promise<CatalogAssignment[]> {
    await this.initialize()
    return Array.from(this.assignments.values())
  }

  /**
   * Update catalog assignment (mock implementation)
   */
  static async updateAssignment(
    companyId: string,
    catalogId: string,
    assignedBy: string
  ): Promise<CatalogAssignment> {
    await this.initialize()

    const assignment: CatalogAssignment = {
      companyId,
      catalogId,
      assignedBy,
      assignedAt: new Date().toISOString()
    }

    this.assignments.set(companyId, assignment)
    return assignment
  }
}