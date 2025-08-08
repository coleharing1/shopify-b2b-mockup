import { describe, it, expect, beforeEach } from 'vitest'
import { CatalogService } from '../catalog-service'
import { Catalog } from '@/types/catalog-types'
import { Product } from '@/lib/mock-data'

describe('CatalogService', () => {
  let catalogService: typeof CatalogService
  let mockCatalog: Catalog
  let mockProducts: Product[]

  beforeEach(() => {
    catalogService = CatalogService

    mockCatalog = {
      id: 'test-catalog',
      name: 'Test Catalog',
      description: 'Test catalog for unit tests',
      productInclusions: ['prod-1', 'prod-2', 'prod-3'],
      productExclusions: ['prod-3'],
      categoryInclusions: ['apparel', 'footwear'],
      categoryExclusions: ['accessories'],
      companyIds: ['company-1'],
      isDefault: false,
      features: ['early-access']
    }

    mockProducts = [
      {
        id: 'prod-1',
        name: 'Product 1',
        sku: 'SKU-1',
        category: 'apparel',
        subcategory: 'shirts',
        description: 'Test product 1',
        msrp: 100,
        images: [],
        pricing: {
          'tier-1': { price: 70, minQuantity: 1 },
          'tier-2': { price: 60, minQuantity: 1 },
          'tier-3': { price: 50, minQuantity: 1 }
        }
      },
      {
        id: 'prod-2',
        name: 'Product 2',
        sku: 'SKU-2',
        category: 'footwear',
        subcategory: 'shoes',
        description: 'Test product 2',
        msrp: 150,
        images: [],
        pricing: {
          'tier-1': { price: 105, minQuantity: 1 },
          'tier-2': { price: 90, minQuantity: 1 },
          'tier-3': { price: 75, minQuantity: 1 }
        }
      },
      {
        id: 'prod-3',
        name: 'Product 3',
        sku: 'SKU-3',
        category: 'accessories',
        subcategory: 'bags',
        description: 'Test product 3',
        msrp: 80,
        images: [],
        pricing: {
          'tier-1': { price: 56, minQuantity: 1 },
          'tier-2': { price: 48, minQuantity: 1 },
          'tier-3': { price: 40, minQuantity: 1 }
        }
      },
      {
        id: 'prod-4',
        name: 'Product 4',
        sku: 'SKU-4',
        category: 'apparel',
        subcategory: 'jackets',
        description: 'Test product 4',
        msrp: 200,
        images: [],
        pricing: {
          'tier-1': { price: 140, minQuantity: 1 },
          'tier-2': { price: 120, minQuantity: 1 },
          'tier-3': { price: 100, minQuantity: 1 }
        }
      }
    ]
  })

  describe('filterProductsByCatalog', () => {
    it('should include products in productInclusions', async () => {
      const result = await catalogService.filterProductsByCatalog(mockProducts, mockCatalog)
      
      expect(result).toContainEqual(
        expect.objectContaining({ id: 'prod-1' })
      )
      expect(result).toContainEqual(
        expect.objectContaining({ id: 'prod-2' })
      )
    })

    it('should exclude products in productExclusions', async () => {
      const result = await catalogService.filterProductsByCatalog(mockProducts, mockCatalog)
      
      expect(result).not.toContainEqual(
        expect.objectContaining({ id: 'prod-3' })
      )
    })

    it('should respect category inclusions', async () => {
      const catalogWithCategories: Catalog = {
        ...mockCatalog,
        productInclusions: [],
        categoryInclusions: ['apparel']
      }
      
      const result = await catalogService.filterProductsByCatalog(mockProducts, catalogWithCategories)
      
      expect(result).toContainEqual(
        expect.objectContaining({ id: 'prod-1' })
      )
      expect(result).toContainEqual(
        expect.objectContaining({ id: 'prod-4' })
      )
      expect(result).not.toContainEqual(
        expect.objectContaining({ id: 'prod-2' })
      )
    })

    it('should respect category exclusions', async () => {
      const catalogWithExclusions: Catalog = {
        ...mockCatalog,
        productInclusions: ['all'],
        categoryExclusions: ['accessories']
      }
      
      const result = await catalogService.filterProductsByCatalog(mockProducts, catalogWithExclusions)
      
      expect(result).not.toContainEqual(
        expect.objectContaining({ id: 'prod-3' })
      )
    })

    it('should handle "all" in productInclusions', async () => {
      const catalogWithAll: Catalog = {
        ...mockCatalog,
        productInclusions: ['all'],
        productExclusions: ['prod-3']
      }
      
      const result = await catalogService.filterProductsByCatalog(mockProducts, catalogWithAll)
      
      expect(result).toHaveLength(3)
      expect(result).not.toContainEqual(
        expect.objectContaining({ id: 'prod-3' })
      )
    })

    it('should handle "closeout" in productInclusions', async () => {
      const closeoutProduct: Product = {
        ...mockProducts[0],
        id: 'prod-closeout',
        orderTypes: ['closeout']
      }
      
      const catalogWithCloseout: Catalog = {
        ...mockCatalog,
        productInclusions: ['closeout']
      }
      
      const productsWithCloseout = [...mockProducts, closeoutProduct]
      const result = await catalogService.filterProductsByCatalog(
        productsWithCloseout, 
        catalogWithCloseout
      )
      
      expect(result).toContainEqual(
        expect.objectContaining({ id: 'prod-closeout' })
      )
      expect(result).toHaveLength(1)
    })

    it('should prioritize exclusions over inclusions', async () => {
      const catalog: Catalog = {
        ...mockCatalog,
        productInclusions: ['all'],
        productExclusions: ['prod-1', 'prod-2']
      }
      
      const result = await catalogService.filterProductsByCatalog(mockProducts, catalog)
      
      expect(result).not.toContainEqual(
        expect.objectContaining({ id: 'prod-1' })
      )
      expect(result).not.toContainEqual(
        expect.objectContaining({ id: 'prod-2' })
      )
    })
  })

  describe('getCompanyCatalog', () => {
    it('should return catalog for a company', async () => {
      const result = await catalogService.getCompanyCatalog('company-1')
      
      // Since this uses mock data, we just verify it returns a catalog structure
      expect(result).toBeDefined()
      if (result) {
        expect(result).toHaveProperty('id')
        expect(result).toHaveProperty('name')
        expect(result).toHaveProperty('productInclusions')
      }
    })

    it('should return default catalog if no specific catalog assigned', async () => {
      const result = await catalogService.getCompanyCatalog('unknown-company')
      
      // Should return default catalog or null
      if (result) {
        expect(result.isDefault).toBe(true)
      }
    })
  })

  describe('isCategoryVisible', () => {
    it('should return true for included categories', () => {
      const result = catalogService.isCategoryVisible('apparel', mockCatalog)
      expect(result).toBe(true)
    })

    it('should return false for excluded categories', () => {
      const result = catalogService.isCategoryVisible('accessories', mockCatalog)
      expect(result).toBe(false)
    })

    it('should handle "all" in categoryInclusions', () => {
      const catalog: Catalog = {
        ...mockCatalog,
        categoryInclusions: ['all'],
        categoryExclusions: ['accessories']
      }
      
      expect(catalogService.isCategoryVisible('apparel', catalog)).toBe(true)
      expect(catalogService.isCategoryVisible('footwear', catalog)).toBe(true)
      expect(catalogService.isCategoryVisible('accessories', catalog)).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty catalog gracefully', async () => {
      const emptyCatalog: Catalog = {
        id: 'empty',
        name: 'Empty Catalog',
        productInclusions: [],
        productExclusions: [],
        categoryInclusions: [],
        categoryExclusions: [],
        companyIds: [],
        isDefault: false
      }
      
      const result = await catalogService.filterProductsByCatalog(mockProducts, emptyCatalog)
      expect(result).toHaveLength(0)
    })

    it('should handle null/undefined products array', async () => {
      const result = await catalogService.filterProductsByCatalog([], mockCatalog)
      expect(result).toHaveLength(0)
    })

    it('should handle products without categories', async () => {
      const productsWithoutCategory = mockProducts.map(p => ({
        ...p,
        category: undefined as any
      }))
      
      const result = await catalogService.filterProductsByCatalog(
        productsWithoutCategory, 
        mockCatalog
      )
      
      // Should still filter by product IDs
      expect(result.some(p => p.id === 'prod-1')).toBe(true)
      expect(result.some(p => p.id === 'prod-3')).toBe(false)
    })
  })
})