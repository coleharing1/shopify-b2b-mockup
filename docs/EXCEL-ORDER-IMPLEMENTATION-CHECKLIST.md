# Excel Order Writer Implementation Checklist

## Pre-Implementation Verification ✅

### Confirm Dependencies
- [x] `xlsx` package installed (v0.18.5) - **VERIFIED**
- [x] `lib/api-auth.ts` has `verifySession` - **VERIFIED**
- [x] `POST /api/orders` endpoint exists - **VERIFIED**
- [x] ProductService at `lib/services/product-service.ts` - **VERIFIED**
- [x] CatalogService at `lib/services/catalog-service.ts` - **VERIFIED**
- [x] PricingService at `services/business/pricing.service.ts` - **VERIFIED**

---

## Phase 1: Core Service Implementation (Day 1-2)

### 1.1 Create Excel Order Writer Service
**File**: `lib/services/excel-order-writer.ts`

```typescript
// Checklist for implementation:
```

- [ ] Import required dependencies
  ```typescript
  import * as XLSX from 'xlsx'
  import { Product } from '@/types/product'
  import { ProductService } from './product-service'
  import { CatalogService } from './catalog-service'
  import { PricingService } from '@/services/business/pricing.service'
  import { MOCK_USERS_BY_ID } from '@/config/auth.config'
  ```

- [ ] Define TypeScript interfaces
  ```typescript
  interface ExcelMetadata {
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
  
  interface ParsedLineItem {
    sku: string
    quantity: number
    description?: string
    variant?: string
    upc?: string
    unitPrice?: number
    notes?: string
    row?: number
  }
  
  interface ValidationResult {
    valid: boolean
    errors: ValidationError[]
    warnings: ValidationWarning[]
  }
  ```

- [ ] Implement `generateOrderWorkbook` method
  - [ ] Get products using `ProductService.getProductsForCompany(companyId)`
  - [ ] Filter by catalog using `CatalogService.filterProductsByCatalog()`
  - [ ] Calculate prices using `PricingService.calculateCustomerPrice()`
  - [ ] Create workbook with XLSX.utils.book_new()
  - [ ] Add "Order" sheet with headers
  - [ ] Add product rows with formulas
  - [ ] Add hidden "_Meta" sheet with JSON
  - [ ] Apply formatting (currency, freeze panes)
  - [ ] Return buffer using XLSX.write()

- [ ] Implement `parseOrderWorkbook` method
  - [ ] Read workbook with XLSX.read(buffer)
  - [ ] Extract metadata from "_Meta" sheet
  - [ ] Parse "Order" sheet rows
  - [ ] Map columns using metadata.columnMap
  - [ ] Validate each row:
    - [ ] Check SKU exists
    - [ ] Verify catalog visibility
    - [ ] Validate quantities
    - [ ] Recalculate prices
  - [ ] Return parsed items with validation

- [ ] Add helper methods
  - [ ] `validateSKU(sku: string, companyId: string): boolean`
  - [ ] `resolveVariant(sku: string, variantText: string): string`
  - [ ] `formatCurrency(value: number): string`
  - [ ] `generateExportId(): string`

### 1.2 Create Unit Tests
**File**: `lib/services/__tests__/excel-order-writer.test.ts`

- [ ] Test workbook generation
  ```typescript
  describe('generateOrderWorkbook', () => {
    it('creates workbook with Order and _Meta sheets')
    it('includes correct headers in Order sheet')
    it('filters products by catalog')
    it('calculates customer-specific pricing')
    it('generates unique exportId')
  })
  ```

- [ ] Test workbook parsing
  ```typescript
  describe('parseOrderWorkbook', () => {
    it('extracts metadata correctly')
    it('parses line items with quantities')
    it('validates unknown SKUs')
    it('recalculates prices server-side')
    it('handles missing columns gracefully')
  })
  ```

- [ ] Test round-trip fidelity
  ```typescript
  it('maintains data integrity through export/import cycle')
  ```

---

## Phase 2: API Endpoints (Day 3-4)

### 2.1 Create Template Export Endpoint
**File**: `app/api/orders/order-writer/template/route.ts`

- [ ] Import dependencies
  ```typescript
  import { NextRequest, NextResponse } from 'next/server'
  import { verifySession } from '@/lib/api-auth'
  import { ExcelOrderWriter } from '@/lib/services/excel-order-writer'
  import { getCompanyById } from '@/lib/mock-data'
  ```

- [ ] Implement GET handler
  - [ ] Verify session using `verifySession(request)`
  - [ ] Extract query parameters:
    - [ ] `orderType` (required)
    - [ ] `productIds` (optional array)
    - [ ] `season` (for prebook orders)
  - [ ] Get company details from mock data
  - [ ] Call `excelWriter.generateOrderWorkbook()`
  - [ ] Return Response with proper headers:
    ```typescript
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="order-${orderType}-${Date.now()}.xlsx"`,
        'Cache-Control': 'no-cache'
      }
    })
    ```

- [ ] Add error handling
  - [ ] Invalid session → 401
  - [ ] Missing parameters → 400
  - [ ] Generation failure → 500

### 2.2 Create Import Endpoint
**File**: `app/api/orders/order-writer/import/route.ts`

- [ ] Import dependencies
  ```typescript
  import { NextRequest, NextResponse } from 'next/server'
  import { verifySession } from '@/lib/api-auth'
  import { ExcelOrderWriter } from '@/lib/services/excel-order-writer'
  ```

- [ ] Implement POST handler
  - [ ] Verify session
  - [ ] Parse multipart form data:
    ```typescript
    const formData = await request.formData()
    const file = formData.get('file') as File
    const buffer = Buffer.from(await file.arrayBuffer())
    ```
  - [ ] Parse workbook using service
  - [ ] Check validation results
  - [ ] If valid, create order:
    ```typescript
    const orderData = {
      companyId: user.companyId,
      items: parsedResult.items,
      orderType: parsedResult.metadata.orderType,
      poNumber: `EXCEL-${Date.now()}`,
      status: 'pending'
    }
    
    // Use existing order creation endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    })
    ```
  - [ ] Return success with orderId or errors

- [ ] Add validation response
  ```typescript
  if (!result.validation.valid) {
    return NextResponse.json({
      success: false,
      errors: result.validation.errors,
      warnings: result.validation.warnings
    }, { status: 400 })
  }
  ```

### 2.3 Create API Tests
**File**: `app/api/orders/order-writer/__tests__/route.test.ts`

- [ ] Test template endpoint
  - [ ] Requires authentication
  - [ ] Returns Excel file
  - [ ] Filters by order type
  - [ ] Includes specified products only

- [ ] Test import endpoint
  - [ ] Requires authentication
  - [ ] Accepts multipart form data
  - [ ] Validates Excel structure
  - [ ] Creates order on success
  - [ ] Returns validation errors

---

## Phase 3: UI Components (Day 5)

### 3.1 Add Export Buttons to Order Pages

#### For At-Once Orders
**File**: `app/retailer/at-once/page.tsx`

- [ ] Import Download icon from lucide-react
- [ ] Add state for loading
  ```typescript
  const [isExporting, setIsExporting] = useState(false)
  ```

- [ ] Add export handler
  ```typescript
  const handleExcelExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch('/api/orders/order-writer/template?orderType=at-once')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `at-once-order-${Date.now()}.xlsx`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Excel order form downloaded')
    } catch (error) {
      toast.error('Failed to download order form')
    } finally {
      setIsExporting(false)
    }
  }
  ```

- [ ] Add button to page header
  ```tsx
  <Button 
    onClick={handleExcelExport}
    disabled={isExporting}
    variant="outline"
    className="flex items-center gap-2"
  >
    <Download className="h-4 w-4" />
    {isExporting ? 'Generating...' : 'Download Excel Order Form'}
  </Button>
  ```

#### For Prebook Orders
**File**: `app/retailer/prebook/page.tsx`

- [ ] Repeat same pattern as at-once
- [ ] Include season parameter in API call
- [ ] Update filename to include season

#### For Closeout Orders
**File**: `app/retailer/closeouts/page.tsx`

- [ ] Repeat same pattern
- [ ] Use 'closeout' order type
- [ ] Consider adding list filtering

#### For Sales Rep Orders
**File**: `app/rep/order-for/[customerId]/page.tsx`

- [ ] Add export button with customer context
- [ ] Pass customerId to API
- [ ] Update filename to include customer

### 3.2 Create Import Modal Component
**File**: `components/features/excel-import-modal.tsx`

- [ ] Create modal structure
  ```tsx
  import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react'
  ```

- [ ] Add file upload state
  ```typescript
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [validation, setValidation] = useState<ValidationResult | null>(null)
  const [parsedOrder, setParsedOrder] = useState<ParsedOrder | null>(null)
  ```

- [ ] Implement file handler
  ```typescript
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.name.match(/\.(xlsx|xlsm)$/)) {
      setFile(file)
      setValidation(null)
    } else {
      toast.error('Please select an Excel file (.xlsx or .xlsm)')
    }
  }
  ```

- [ ] Implement upload handler
  ```typescript
  const handleUpload = async () => {
    if (!file) return
    
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/orders/order-writer/import', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (result.success) {
        toast.success('Order created successfully')
        router.push(`/retailer/orders/${result.orderId}`)
      } else {
        setValidation(result)
      }
    } catch (error) {
      toast.error('Failed to import order')
    } finally {
      setIsUploading(false)
    }
  }
  ```

- [ ] Create UI sections
  - [ ] File selection area
  - [ ] Validation errors display
  - [ ] Validation warnings display
  - [ ] Parsed order preview
  - [ ] Action buttons

### 3.3 Add Import Buttons to Order Pages

- [ ] Update `app/retailer/at-once/page.tsx`
  ```tsx
  <Button 
    onClick={() => setImportModalOpen(true)}
    variant="outline"
    className="flex items-center gap-2"
  >
    <Upload className="h-4 w-4" />
    Import Excel Order
  </Button>
  
  <ExcelImportModal 
    open={importModalOpen}
    onClose={() => setImportModalOpen(false)}
    orderType="at-once"
  />
  ```

- [ ] Repeat for prebook and closeout pages
- [ ] Add to rep order-for page

---

## Phase 4: Integration Testing (Day 6)

### 4.1 Create E2E Test Flow
**File**: `__tests__/excel-order-flow.test.ts`

- [ ] Test complete export flow
  ```typescript
  it('exports Excel with correct products and pricing')
  it('includes metadata in hidden sheet')
  it('applies catalog filters')
  ```

- [ ] Test complete import flow
  ```typescript
  it('accepts valid Excel file')
  it('rejects invalid SKUs')
  it('creates order with correct items')
  it('redirects to order detail page')
  ```

- [ ] Test error scenarios
  ```typescript
  it('handles corrupted files')
  it('shows validation errors')
  it('prevents duplicate imports')
  ```

### 4.2 Manual Testing Checklist

- [ ] **Export Testing**
  - [ ] Download from at-once page
  - [ ] Download from prebook page
  - [ ] Download from closeout page
  - [ ] Download as sales rep
  - [ ] Open in Excel
  - [ ] Open in Google Sheets
  - [ ] Open in Numbers (Mac)
  - [ ] Verify formulas work
  - [ ] Check pricing accuracy

- [ ] **Import Testing**
  - [ ] Upload original exported file
  - [ ] Upload edited file with quantities
  - [ ] Upload file with invalid SKU
  - [ ] Upload file with negative quantity
  - [ ] Upload non-Excel file
  - [ ] Upload very large file (1000+ rows)
  - [ ] Test network interruption
  - [ ] Verify order creation
  - [ ] Check order details accuracy

---

## Phase 5: Documentation & Training (Day 7)

### 5.1 Create User Documentation
**File**: `docs/user-guides/excel-orders.md`

- [ ] Write export instructions
- [ ] Write import instructions
- [ ] Document Excel structure
- [ ] Add troubleshooting section
- [ ] Include screenshots

### 5.2 Create Video Tutorial

- [ ] Record export process
- [ ] Show Excel editing
- [ ] Record import process
- [ ] Demonstrate error handling

### 5.3 Update Help Section

- [ ] Add FAQ entries
- [ ] Update feature list
- [ ] Add to navigation

---

## Phase 6: Performance Optimization (Day 8)

### 6.1 Optimize Generation

- [ ] Implement streaming for large datasets
  ```typescript
  // For > 1000 products
  const stream = new PassThrough()
  XLSX.stream.to_csv(worksheet, stream)
  ```

- [ ] Add caching for product data
  ```typescript
  const cacheKey = `products-${companyId}-${orderType}`
  const cached = cache.get(cacheKey)
  ```

- [ ] Implement progress tracking
  ```typescript
  const progress = { current: 0, total: products.length }
  ```

### 6.2 Optimize Import

- [ ] Add file size validation (max 10MB)
- [ ] Implement chunked parsing
- [ ] Add progress indicator
- [ ] Queue large imports

---

## Phase 7: Monitoring & Analytics (Day 9)

### 7.1 Add Tracking

- [ ] Track export events
  ```typescript
  analytics.track('excel_export', {
    orderType,
    productCount,
    companyId,
    userId
  })
  ```

- [ ] Track import events
  ```typescript
  analytics.track('excel_import', {
    success,
    itemCount,
    validationErrors,
    processingTime
  })
  ```

### 7.2 Create Dashboard

- [ ] Add metrics to admin dashboard
  - [ ] Export count by type
  - [ ] Import success rate
  - [ ] Average order size
  - [ ] Error frequency

### 7.3 Set Up Alerts

- [ ] Alert on high error rate
- [ ] Alert on performance degradation
- [ ] Alert on unusual usage patterns

---

## Phase 8: Security Hardening (Day 10)

### 8.1 Add Rate Limiting

- [ ] Limit exports per user per hour
- [ ] Limit imports per user per hour
- [ ] Implement exponential backoff

### 8.2 Enhance Validation

- [ ] Sanitize all input data
- [ ] Validate file signatures
- [ ] Check for malicious formulas
- [ ] Implement CSP headers

### 8.3 Add Audit Trail

- [ ] Log all exports with user/timestamp
- [ ] Log all imports with validation results
- [ ] Store original uploaded files (30 days)
- [ ] Create audit report endpoint

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Documentation complete
- [ ] Performance benchmarks met
- [ ] Security review complete
- [ ] Feature flag configured

### Deployment Steps

- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Enable for beta users
- [ ] Monitor metrics
- [ ] Gradual rollout
- [ ] Full production release

### Post-Deployment

- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Plan improvements
- [ ] Update documentation

---

## Success Criteria

### Technical Metrics
- [ ] ✅ Export generation < 3 seconds
- [ ] ✅ Import processing < 5 seconds
- [ ] ✅ Zero data loss in round-trip
- [ ] ✅ 99% uptime

### Business Metrics
- [ ] ✅ 20% adoption in first month
- [ ] ✅ <5% support tickets
- [ ] ✅ 50% reduction in manual entry
- [ ] ✅ 4.5+ user satisfaction

### Quality Metrics
- [ ] ✅ 90% code coverage
- [ ] ✅ <2% error rate
- [ ] ✅ All accessibility standards met
- [ ] ✅ Works on all major browsers

---

## Rollback Plan

### If Issues Occur

1. **Immediate Actions**
   - [ ] Disable feature flag
   - [ ] Notify users of temporary unavailability
   - [ ] Revert to previous version

2. **Investigation**
   - [ ] Analyze error logs
   - [ ] Review recent changes
   - [ ] Identify root cause

3. **Fix & Re-deploy**
   - [ ] Implement fix
   - [ ] Add regression tests
   - [ ] Deploy to staging first
   - [ ] Gradual re-rollout

---

## Notes & Considerations

### Current Limitations
- Mock data only (no real database)
- Inventory checks are informational only
- Credit limits not enforced
- No real email notifications

### Future Enhancements
- Background job processing
- Email submission support
- Template customization
- Collaborative editing
- Mobile app support
- AI-powered mapping

### Dependencies to Monitor
- `xlsx` library updates
- Next.js compatibility
- Browser API changes
- Excel format evolution

---

## Team Assignments

### Development
- [ ] Backend service: _________
- [ ] API endpoints: _________
- [ ] UI components: _________
- [ ] Testing: _________

### Support
- [ ] Documentation: _________
- [ ] Training: _________
- [ ] Monitoring: _________
- [ ] User feedback: _________

---

*Last Updated: [Date]*
*Version: 1.0*
*Owner: [Your Name]*