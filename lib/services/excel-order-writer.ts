/**
 * Excel Order Writer Service
 * Handles generation and parsing of Excel order workbooks
 */

import * as XLSX from 'xlsx'
import { Product, getProducts, getCompanyById } from '@/lib/mock-data'
import { getServerBaseUrl } from '@/lib/mock-data'

// TypeScript Interfaces
export interface ExcelMetadata {
  version: string
  generatedAt: string
  exportId: string
  company: {
    id: string
    name: string
    pricingTier: string
  }
  orderType: 'at-once' | 'prebook' | 'closeout'
  columnMap: Record<string, string>
  features: {
    allowPriceOverride: boolean
    enforceMinimums: boolean
    validateInventory: boolean
  }
}

export interface ParsedLineItem {
  productId?: string
  variantId?: string
  sku: string
  name?: string
  quantity: number
  unitPrice?: number
  description?: string
  variant?: string
  upc?: string
  notes?: string
  row?: number
}

export interface ValidationError {
  row: number
  field: string
  message: string
  code: string
}

export interface ValidationWarning {
  row: number
  field: string
  message: string
  code: string
  severity: 'info' | 'warning'
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ParsedOrderResult {
  items: ParsedLineItem[]
  metadata: ExcelMetadata
  validation: ValidationResult
}

export class ExcelOrderWriter {
  /**
   * Generate personalized Excel order form
   */
  async generateOrderWorkbook(params: {
    companyId: string
    orderType: 'at-once' | 'prebook' | 'closeout'
    productIds?: string[]
    season?: string
  }): Promise<Buffer> {
    // Get company info
    const company = await getCompanyById(params.companyId)
    if (!company) {
      throw new Error('Company not found')
    }

    // Get products
    let products = await getProducts()
    
    // Filter by order type
    products = products.filter(p => 
      p.orderTypes?.includes(params.orderType) || 
      (params.orderType === 'at-once' && !p.orderTypes) // Default to at-once
    )

    // Filter by specific product IDs if provided
    if (params.productIds && params.productIds.length > 0) {
      products = products.filter(p => params.productIds!.includes(p.id))
    }

    // Filter by season for prebook orders
    if (params.orderType === 'prebook' && params.season) {
      products = products.filter(p => 
        p.orderTypeMetadata?.prebook?.season === params.season
      )
    }

    // Create workbook
    const wb = XLSX.utils.book_new()

    // Column headers
    const headers = [
      'SKU',
      'Product Name',
      'Category',
      'Color/Size',
      'UPC',
      'MSRP',
      'Your Price',
      'Order Qty',
      'Line Total',
      'Notes'
    ]

    // Create data rows
    const rows: any[] = []
    products.forEach(product => {
      // Calculate price based on company tier and order type
      let price = product.msrp
      if (product.pricing && company.pricingTier) {
        const tierPricing = product.pricing[company.pricingTier]
        if (tierPricing) {
          price = tierPricing.price
        }
      }
      
      // Apply closeout pricing if applicable
      if (params.orderType === 'closeout' && product.orderTypeMetadata?.closeout) {
        const closeoutMeta = product.orderTypeMetadata.closeout
        if (closeoutMeta.originalPrice && closeoutMeta.discountPercent) {
          price = closeoutMeta.originalPrice * (1 - closeoutMeta.discountPercent / 100)
        }
      }

      // Add variants if they exist
      if (product.variants && product.variants.length > 0) {
        product.variants.forEach((variant, index) => {
          // Generate SKU: use variant SKU if available, otherwise create from product SKU
          const variantSku = variant.sku || `${product.sku}-${variant.color}-${variant.size}`.replace(/\s+/g, '')
          
          rows.push([
            variantSku,
            product.name,
            product.category,
            `${variant.color} / ${variant.size}`,
            '', // UPC placeholder
            product.msrp,
            price,
            '', // Order Qty - user fills this
            { f: `G${rows.length + 2}*H${rows.length + 2}` }, // Line Total formula
            '' // Notes
          ])
        })
      } else {
        // Single product without variants
        rows.push([
          product.sku,
          product.name,
          product.category,
          '',
          '', // UPC placeholder
          product.msrp,
          price,
          '', // Order Qty - user fills this
          { f: `G${rows.length + 2}*H${rows.length + 2}` }, // Line Total formula
          '' // Notes
        ])
      }
    })

    // Create Order sheet
    const wsData = [headers, ...rows]
    const ws = XLSX.utils.aoa_to_sheet(wsData)

    // Set column widths
    ws['!cols'] = [
      { width: 15 }, // SKU
      { width: 30 }, // Product Name
      { width: 15 }, // Category
      { width: 15 }, // Color/Size
      { width: 15 }, // UPC
      { width: 12 }, // MSRP
      { width: 12 }, // Your Price
      { width: 10 }, // Order Qty
      { width: 12 }, // Line Total
      { width: 25 }  // Notes
    ]

    // Format currency columns
    for (let i = 2; i <= rows.length + 1; i++) {
      // MSRP column (F)
      if (ws[`F${i}`]) {
        ws[`F${i}`].z = '$#,##0.00'
      }
      // Your Price column (G)
      if (ws[`G${i}`]) {
        ws[`G${i}`].z = '$#,##0.00'
      }
      // Line Total column (I)
      if (ws[`I${i}`]) {
        ws[`I${i}`].z = '$#,##0.00'
      }
    }

    // Add Order sheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Order')

    // Create metadata for validation
    const metadata: ExcelMetadata = {
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      exportId: `EXP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      company: {
        id: company.id,
        name: company.name,
        pricingTier: company.pricingTier
      },
      orderType: params.orderType,
      columnMap: {
        sku: 'A',
        productName: 'B',
        category: 'C',
        variant: 'D',
        upc: 'E',
        msrp: 'F',
        unitPrice: 'G',
        quantity: 'H',
        lineTotal: 'I',
        notes: 'J'
      },
      features: {
        allowPriceOverride: false,
        enforceMinimums: params.orderType === 'closeout',
        validateInventory: params.orderType === 'at-once'
      }
    }

    // Add hidden metadata sheet
    const metaSheet = XLSX.utils.aoa_to_sheet([
      ['Metadata'],
      ['DO NOT MODIFY THIS SHEET'],
      [''],
      [JSON.stringify(metadata)]
    ])
    XLSX.utils.book_append_sheet(wb, metaSheet, '_Meta')

    // Add summary sheet
    const summaryData = [
      ['Order Summary'],
      [''],
      ['Company:', company.name],
      ['Account #:', company.accountNumber],
      ['Order Type:', params.orderType.toUpperCase()],
      ['Generated:', new Date().toLocaleDateString()],
      [''],
      ['Instructions:'],
      ['1. Enter quantities in the "Order Qty" column'],
      ['2. Line totals will calculate automatically'],
      ['3. Add any special notes in the "Notes" column'],
      ['4. Save and upload this file to complete your order'],
      [''],
      ['Terms:'],
      ['Payment Terms:', company.paymentTerms],
      ['Credit Limit:', `$${company.creditLimit.toLocaleString()}`],
      ['Credit Available:', `$${(company.creditLimit - company.creditUsed).toLocaleString()}`]
    ]

    if (params.orderType === 'closeout') {
      summaryData.push(
        [''],
        ['CLOSEOUT TERMS:'],
        ['- All sales final'],
        ['- No returns or exchanges'],
        ['- Limited quantities available']
      )
    }

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    summarySheet['!cols'] = [{ width: 20 }, { width: 40 }]
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary')

    // Generate buffer
    const buffer = XLSX.write(wb, {
      type: 'buffer',
      bookType: 'xlsx',
      bookSST: false
    })

    return buffer
  }

  /**
   * Parse uploaded Excel and validate
   */
  async parseOrderWorkbook(
    buffer: Buffer,
    companyId: string
  ): Promise<ParsedOrderResult> {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []
    const items: ParsedLineItem[] = []

    try {
      // Read workbook
      const wb = XLSX.read(buffer, { type: 'buffer' })

      // Extract metadata
      let metadata: ExcelMetadata
      if (wb.Sheets['_Meta']) {
        const metaSheet = wb.Sheets['_Meta']
        const metaData = XLSX.utils.sheet_to_json(metaSheet, { header: 1 }) as any[][]
        if (metaData.length >= 4) {
          metadata = JSON.parse(metaData[3][0])
        } else {
          throw new Error('Invalid metadata format')
        }
      } else {
        // Create default metadata for files without it
        metadata = {
          version: '1.0.0',
          generatedAt: new Date().toISOString(),
          exportId: 'UNKNOWN',
          company: { id: companyId, name: 'Unknown', pricingTier: 'standard' },
          orderType: 'at-once',
          columnMap: {
            sku: 'A',
            productName: 'B',
            quantity: 'H',
            unitPrice: 'G',
            notes: 'J'
          },
          features: {
            allowPriceOverride: false,
            enforceMinimums: false,
            validateInventory: true
          }
        }
      }

      // Validate company match
      if (metadata.company.id !== companyId) {
        warnings.push({
          row: 0,
          field: 'company',
          message: 'This order form was generated for a different company',
          code: 'COMPANY_MISMATCH',
          severity: 'warning'
        })
      }

      // Parse Order sheet
      const orderSheet = wb.Sheets['Order']
      if (!orderSheet) {
        errors.push({
          row: 0,
          field: 'sheet',
          message: 'Order sheet not found',
          code: 'MISSING_SHEET'
        })
        return {
          items: [],
          metadata,
          validation: { valid: false, errors, warnings }
        }
      }

      // Convert to JSON (skip header row)
      const data = XLSX.utils.sheet_to_json(orderSheet, { header: 1, range: 1 }) as any[][]
      
      // Get products for validation
      const products = await getProducts()
      const productMap = new Map(products.map(p => [p.sku, p]))
      
      // Also map variant SKUs
      products.forEach(p => {
        if (p.variants) {
          p.variants.forEach(v => {
            productMap.set(v.sku, p)
          })
        }
      })

      // Parse each row
      const itemMap = new Map<string, ParsedLineItem>()
      
      // Get company for pricing calculation
      const company = await getCompanyById(companyId)
      
      data.forEach((row, index) => {
        const rowNum = index + 2 // Account for header and 0-indexing
        
        // Skip empty rows
        const quantity = parseInt(row[7]) || 0 // Column H
        if (quantity === 0) return

        const sku = row[0]?.toString().trim() // Column A
        if (!sku) {
          errors.push({
            row: rowNum,
            field: 'sku',
            message: 'SKU is required',
            code: 'MISSING_SKU'
          })
          return
        }

        // Validate SKU exists
        const product = productMap.get(sku)
        if (!product) {
          errors.push({
            row: rowNum,
            field: 'sku',
            message: `SKU "${sku}" not found`,
            code: 'INVALID_SKU'
          })
          return
        }

        // Check order type compatibility
        if (product.orderTypes && !product.orderTypes.includes(metadata.orderType)) {
          errors.push({
            row: rowNum,
            field: 'orderType',
            message: `Product "${sku}" not available for ${metadata.orderType} orders`,
            code: 'INVALID_ORDER_TYPE'
          })
          return
        }

        // Validate quantity
        if (quantity < 1) {
          errors.push({
            row: rowNum,
            field: 'quantity',
            message: 'Quantity must be at least 1',
            code: 'INVALID_QUANTITY'
          })
          return
        }

        // Check minimums for closeout
        if (metadata.orderType === 'closeout' && product.orderTypeMetadata?.closeout?.minimumOrderQuantity) {
          const minQty = product.orderTypeMetadata.closeout.minimumOrderQuantity
          if (quantity < minQty) {
            errors.push({
              row: rowNum,
              field: 'quantity',
              message: `Minimum order quantity is ${minQty} for closeout items`,
              code: 'BELOW_MINIMUM'
            })
            return
          }
        }

        // Calculate price
        let unitPrice = parseFloat(row[6]) || 0 // Column G (Your Price)
        
        // Recalculate price if override not allowed
        if (!metadata.features.allowPriceOverride) {
          if (company && product.pricing && company.pricingTier) {
            const tierPricing = product.pricing[company.pricingTier]
            if (tierPricing) {
              unitPrice = tierPricing.price
            }
          }
          
          // Apply closeout pricing
          if (metadata.orderType === 'closeout' && product.orderTypeMetadata?.closeout) {
            const closeoutMeta = product.orderTypeMetadata.closeout
            if (closeoutMeta.originalPrice && closeoutMeta.discountPercent) {
              unitPrice = closeoutMeta.originalPrice * (1 - closeoutMeta.discountPercent / 100)
            }
          }
        }

        // Check for variant
        let variantId: string | undefined
        const variant = product.variants?.find(v => v.sku === sku)
        if (variant) {
          variantId = variant.id
          
          // Check inventory for at-once orders
          if (metadata.features.validateInventory && metadata.orderType === 'at-once') {
            if (variant.inventory < quantity) {
              warnings.push({
                row: rowNum,
                field: 'inventory',
                message: `Only ${variant.inventory} units available`,
                code: 'LOW_INVENTORY',
                severity: 'warning'
              })
            }
          }
        }

        // Create or merge item
        const key = `${product.id}-${variantId || 'default'}`
        if (itemMap.has(key)) {
          // Merge quantities for duplicate items
          const existing = itemMap.get(key)!
          existing.quantity += quantity
          if (row[9]) { // Notes column J
            existing.notes = [existing.notes, row[9]].filter(Boolean).join('; ')
          }
        } else {
          itemMap.set(key, {
            productId: product.id,
            variantId,
            sku,
            name: product.name,
            quantity,
            unitPrice,
            description: row[1]?.toString() || product.name,
            variant: row[3]?.toString(),
            upc: row[4]?.toString(),
            notes: row[9]?.toString(),
            row: rowNum
          })
        }
      })

      // Convert map to array
      items.push(...itemMap.values())

      // Add credit check warning
      if (company) {
        const orderTotal = items.reduce((sum, item) => 
          sum + (item.unitPrice || 0) * item.quantity, 0
        )
        
        if (company.creditUsed + orderTotal > company.creditLimit) {
          warnings.push({
            row: 0,
            field: 'credit',
            message: `Order total ($${orderTotal.toFixed(2)}) may exceed available credit ($${(company.creditLimit - company.creditUsed).toFixed(2)})`,
            code: 'CREDIT_WARNING',
            severity: 'info'
          })
        }
      }

      return {
        items,
        metadata,
        validation: {
          valid: errors.length === 0,
          errors,
          warnings
        }
      }
    } catch (error) {
      errors.push({
        row: 0,
        field: 'file',
        message: error instanceof Error ? error.message : 'Failed to parse file',
        code: 'PARSE_ERROR'
      })
      
      return {
        items: [],
        metadata: {
          version: '1.0.0',
          generatedAt: new Date().toISOString(),
          exportId: 'ERROR',
          company: { id: companyId, name: 'Unknown', pricingTier: 'standard' },
          orderType: 'at-once',
          columnMap: {},
          features: {
            allowPriceOverride: false,
            enforceMinimums: false,
            validateInventory: false
          }
        },
        validation: {
          valid: false,
          errors,
          warnings
        }
      }
    }
  }

  /**
   * Helper method to validate a single SKU
   */
  async validateSKU(sku: string, companyId: string): Promise<boolean> {
    const products = await getProducts()
    return products.some(p => 
      p.sku === sku || p.variants?.some(v => v.sku === sku)
    )
  }

  /**
   * Format currency value
   */
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  /**
   * Generate unique export ID
   */
  generateExportId(): string {
    return `EXP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
}

// Export singleton instance
export const excelOrderWriter = new ExcelOrderWriter()