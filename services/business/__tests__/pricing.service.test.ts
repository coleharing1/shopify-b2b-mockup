import { describe, it, expect, beforeEach } from 'vitest'
import { 
  calculateCustomerPrice, 
  applyTierDiscount, 
  applyVolumeDiscount,
  applyGlobalDiscount,
  applyClearanceDiscount
} from '../pricing.service'
import { PriceList, VolumeBreak, PriceCalculationInput } from '@/types/pricing-types'
import { Product } from '@/lib/mock-data'

describe('PricingService', () => {
  let mockProduct: Product
  let mockPriceList: PriceList

  beforeEach(() => {
    mockProduct = {
      id: 'test-product',
      name: 'Test Product',
      sku: 'TEST-SKU',
      category: 'apparel',
      subcategory: 'shirts',
      description: 'Test product',
      msrp: 100,
      images: [],
      pricing: {
        'tier-1': { price: 70, minQuantity: 1 },
        'tier-2': { price: 60, minQuantity: 1 },
        'tier-3': { price: 50, minQuantity: 1 }
      }
    }

    mockPriceList = {
      id: 'test-pricelist',
      name: 'Test Price List',
      description: 'Test price list for unit tests',
      rules: [
        {
          productId: 'test-product',
          volumeBreaks: [
            { minQty: 1, discount: 0.30 },
            { minQty: 25, discount: 0.35 },
            { minQty: 50, discount: 0.40 },
            { minQty: 100, discount: 0.45 }
          ]
        }
      ],
      globalDiscount: 0.05
    }
  })

  describe('calculateCustomerPrice', () => {
    it('should calculate price with tier discount only', () => {
      const input: PriceCalculationInput = {
        product: mockProduct,
        quantity: 1,
        companyId: 'company-1',
        pricingTier: 'tier-2'
      }

      const result = calculateCustomerPrice(input)

      expect(result.unitPrice).toBe(60)
      expect(result.totalPrice).toBe(60)
      expect(result.appliedDiscounts).toContain('tier')
    })

    it('should apply volume discount when quantity meets threshold', () => {
      const input: PriceCalculationInput = {
        product: mockProduct,
        quantity: 25,
        companyId: 'company-1',
        pricingTier: 'tier-1'
      }

      const result = calculateCustomerPrice(input, mockPriceList)

      // MSRP: 100, Volume discount: 35% = 65
      expect(result.unitPrice).toBe(65)
      expect(result.totalPrice).toBe(1625)
      expect(result.appliedDiscounts).toContain('volume')
    })

    it('should apply multiple volume breaks correctly', () => {
      const quantities = [1, 25, 50, 100]
      const expectedPrices = [70, 65, 60, 55] // 30%, 35%, 40%, 45% off MSRP

      quantities.forEach((qty, index) => {
        const input: PriceCalculationInput = {
          product: mockProduct,
          quantity: qty,
          companyId: 'company-1',
          pricingTier: 'tier-1'
        }

        const result = calculateCustomerPrice(input, mockPriceList)
        expect(result.unitPrice).toBe(expectedPrices[index])
      })
    })

    it('should apply global discount on top of other discounts', () => {
      const input: PriceCalculationInput = {
        product: mockProduct,
        quantity: 1,
        companyId: 'company-1',
        pricingTier: 'tier-1'
      }

      const priceListWithGlobal = {
        ...mockPriceList,
        globalDiscount: 0.10
      }

      const result = calculateCustomerPrice(input, priceListWithGlobal)

      // MSRP: 100, Volume: 30% = 70, Global: 10% = 63
      expect(result.unitPrice).toBe(63)
      expect(result.appliedDiscounts).toContain('global')
    })

    it('should apply clearance discount for closeout products', () => {
      const closeoutProduct = {
        ...mockProduct,
        orderTypes: ['closeout'],
        orderTypeMetadata: {
          closeout: {
            listId: 'closeout-1',
            originalPrice: 100,
            discountPercent: 50,
            expiresAt: new Date(Date.now() + 86400000),
            remainingQuantity: 10,
            finalSale: true,
            urgency: 'high' as const
          }
        }
      }

      const input: PriceCalculationInput = {
        product: closeoutProduct,
        quantity: 1,
        companyId: 'company-1',
        pricingTier: 'tier-1',
        orderType: 'closeout'
      }

      const result = calculateCustomerPrice(input)

      // Clearance: 50% off = 50
      expect(result.unitPrice).toBe(50)
      expect(result.appliedDiscounts).toContain('clearance')
    })

    it('should apply fixed price override when available', () => {
      const priceListWithFixed: PriceList = {
        ...mockPriceList,
        rules: [
          {
            productId: 'test-product',
            fixedPrice: 45
          }
        ]
      }

      const input: PriceCalculationInput = {
        product: mockProduct,
        quantity: 10,
        companyId: 'company-1',
        pricingTier: 'tier-1'
      }

      const result = calculateCustomerPrice(input, priceListWithFixed)

      expect(result.unitPrice).toBe(45)
      expect(result.appliedDiscounts).toContain('override')
    })

    it('should never go below minimum price', () => {
      const extremePriceList: PriceList = {
        ...mockPriceList,
        rules: [
          {
            productId: 'test-product',
            volumeBreaks: [
              { minQty: 1, discount: 0.99 } // 99% discount
            ]
          }
        ],
        globalDiscount: 0.50 // Additional 50% off
      }

      const input: PriceCalculationInput = {
        product: mockProduct,
        quantity: 1,
        companyId: 'company-1',
        pricingTier: 'tier-1'
      }

      const result = calculateCustomerPrice(input, extremePriceList)

      expect(result.unitPrice).toBeGreaterThanOrEqual(0.01)
    })

    it('should provide detailed price breakdown', () => {
      const input: PriceCalculationInput = {
        product: mockProduct,
        quantity: 50,
        companyId: 'company-1',
        pricingTier: 'tier-2'
      }

      const result = calculateCustomerPrice(input, mockPriceList)

      expect(result.breakdown).toBeDefined()
      expect(result.breakdown.length).toBeGreaterThan(0)
      
      const hasBasePrice = result.breakdown.some(item => item.type === 'base')
      const hasVolumeDiscount = result.breakdown.some(item => item.type === 'volume')
      
      expect(hasBasePrice).toBe(true)
      expect(hasVolumeDiscount).toBe(true)
    })
  })

  describe('Discount Functions', () => {
    describe('applyTierDiscount', () => {
      it('should apply correct tier discount', () => {
        expect(applyTierDiscount(100, 'tier-1')).toBe(70) // 30% off
        expect(applyTierDiscount(100, 'tier-2')).toBe(60) // 40% off
        expect(applyTierDiscount(100, 'tier-3')).toBe(50) // 50% off
      })

      it('should handle invalid tier gracefully', () => {
        expect(applyTierDiscount(100, 'invalid-tier' as any)).toBe(100)
      })
    })

    describe('applyVolumeDiscount', () => {
      it('should apply correct volume break', () => {
        const volumeBreaks: VolumeBreak[] = [
          { minQty: 1, discount: 0.10 },
          { minQty: 10, discount: 0.20 },
          { minQty: 50, discount: 0.30 }
        ]

        expect(applyVolumeDiscount(100, 5, volumeBreaks)).toBe(90)   // 10% off
        expect(applyVolumeDiscount(100, 15, volumeBreaks)).toBe(80)  // 20% off
        expect(applyVolumeDiscount(100, 75, volumeBreaks)).toBe(70)  // 30% off
      })

      it('should return original price when no breaks apply', () => {
        const volumeBreaks: VolumeBreak[] = [
          { minQty: 100, discount: 0.50 }
        ]

        expect(applyVolumeDiscount(100, 10, volumeBreaks)).toBe(100)
      })
    })

    describe('applyGlobalDiscount', () => {
      it('should apply global discount correctly', () => {
        expect(applyGlobalDiscount(100, 0.10)).toBe(90)  // 10% off
        expect(applyGlobalDiscount(50, 0.20)).toBe(40)   // 20% off
      })

      it('should handle zero discount', () => {
        expect(applyGlobalDiscount(100, 0)).toBe(100)
      })
    })

    describe('applyClearanceDiscount', () => {
      it('should apply clearance discount correctly', () => {
        expect(applyClearanceDiscount(100, 50)).toBe(50)   // 50% off
        expect(applyClearanceDiscount(80, 75)).toBe(20)    // 75% off
      })

      it('should handle zero discount', () => {
        expect(applyClearanceDiscount(100, 0)).toBe(100)
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle negative quantities', () => {
      const input: PriceCalculationInput = {
        product: mockProduct,
        quantity: -5,
        companyId: 'company-1',
        pricingTier: 'tier-1'
      }

      const result = calculateCustomerPrice(input)
      expect(result.quantity).toBe(1) // Should default to 1
    })

    it('should handle missing product pricing', () => {
      const productWithoutPricing = {
        ...mockProduct,
        pricing: {} as any
      }

      const input: PriceCalculationInput = {
        product: productWithoutPricing,
        quantity: 1,
        companyId: 'company-1',
        pricingTier: 'tier-1'
      }

      const result = calculateCustomerPrice(input)
      expect(result.unitPrice).toBe(productWithoutPricing.msrp) // Should fall back to MSRP
    })

    it('should handle null price list', () => {
      const input: PriceCalculationInput = {
        product: mockProduct,
        quantity: 50,
        companyId: 'company-1',
        pricingTier: 'tier-2'
      }

      const result = calculateCustomerPrice(input, null as any)
      expect(result.unitPrice).toBe(60) // Should use tier pricing only
    })

    it('should handle empty volume breaks array', () => {
      const priceListNoBreaks: PriceList = {
        ...mockPriceList,
        rules: [
          {
            productId: 'test-product',
            volumeBreaks: []
          }
        ]
      }

      const input: PriceCalculationInput = {
        product: mockProduct,
        quantity: 50,
        companyId: 'company-1',
        pricingTier: 'tier-1'
      }

      const result = calculateCustomerPrice(input, priceListNoBreaks)
      expect(result.unitPrice).toBe(70) // Should use tier pricing only
    })
  })
})