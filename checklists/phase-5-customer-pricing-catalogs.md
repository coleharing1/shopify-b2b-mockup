# Phase 5 — Customer-Specific Pricing & Catalogs (5 days)

## Prerequisites ✅
- [x] Role-aware navigation in place (`/config/nav.config.ts` implemented) — header consumption pending
- [ ] Product APIs return `effectivePrice` (at-once today; extend to prebook and closeout)
- [x] Service layer/config seeds exist (`config/*`, `services/*` directories)
- [x] Authentication system with session verification on all APIs
- [x] Standardized pricing tiers present (`tier-1|tier-2|tier-3`); map to UI labels

## Goals
- [ ] Per-company product catalogs with include/exclude logic
- [ ] Server-side pricing with volume breaks and customer overrides
- [ ] Retailer/Rep UIs filtered by company catalog and custom pricing
- [ ] Admin UIs to manage catalogs and price list assignments
- [ ] Complete pricing audit trail and calculation transparency

## Pre-work (0.5 day): Route scaffolding + Quick sync
- [x] Create placeholder routes to avoid 404s and enable nav wiring:
  - [x] `/retailer/closeouts/[listId]`
  - [x] `/retailer/orders/[orderId]`
  - [x] `/rep/closeouts/manage`
  - [x] `/admin/seasons`
  - [x] `/admin/closeouts`
  - [x] `/admin/products`
  - [x] `/admin/pricing`
  - [x] `/admin/analytics`
- [x] Update `/app/quick` statuses/labels to reflect current reality
- [x] Add admin nav items for the new pages via `config/nav.config.ts`

## Day 1: Data Models & Core APIs

### Morning: Data Structure Setup
- [x] Create `/public/mockdata/company-catalogs.json`
  ```json
  {
    "catalogs": [
      {
        "id": "catalog-1",
        "name": "Premium Outdoor Catalog",
        "companyIds": ["company-1"],
        "productInclusions": ["all"],
        "productExclusions": ["prod-45", "prod-46"],
        "categoryInclusions": ["apparel", "footwear"],
        "categoryExclusions": [],
        "isDefault": false
      }
    ]
  }
  ```

- [x] Create `/public/mockdata/price-lists.json`
  ```json
  {
    "priceLists": [
      {
        "id": "pricelist-1",
        "name": "Volume Buyer Pricing",
        "companyId": "company-1",
        "rules": [
          {
            "productId": "prod-1",
            "volumeBreaks": [
              { "minQty": 1, "discount": 0.35 },
              { "minQty": 50, "discount": 0.40 },
              { "minQty": 100, "discount": 0.45 }
            ],
            "fixedPrice": null
          }
        ]
      }
    ]
  }
  ```

- [x] Create `/types/catalog-types.ts` and `/types/pricing-types.ts`
  - [x] `Catalog`, `CatalogRule`, `PriceList`, `PriceRule`, `VolumeBreak`

### Afternoon: API Implementation
- [x] Create `/app/api/catalogs/route.ts`
  - [x] GET: Return filtered products for authenticated company
  - [x] Include catalog metadata (name, description, product count)
  - [x] Apply both inclusion and exclusion rules

- [x] Create `/app/api/pricing/calculate/route.ts`
  - [x] POST: Calculate price for specific product/quantity/company
  - [x] Apply tier discount → volume break → fixed override
  - [x] Return price breakdown for transparency

- [x] Create `/lib/services/catalog-service.ts`
  - [x] `getCompanyCatalog(companyId): Catalog`
  - [x] `filterProductsByCatalog(products, catalog): Product[]`
  - [x] `isCategoryVisible(categoryId, catalog): boolean`

- [x] Update `/services/business/pricing.service.ts`
  - [x] Add `calculateCustomerPrice(product, quantity, companyId)`
  - [x] Add `getVolumeBreaks(productId, companyId)`
  - [x] Add `getPriceBreakdown(product, quantity, companyId)`

- [x] Wire product APIs to pricing service
  - [x] Add methods for company-specific product filtering
  - [x] Integrate with CatalogService and pricing calculations
  - [x] Return `effectivePrice` for all products

## Day 2: Retailer Integration

### Morning: Product Catalog Updates
- [x] Create pricing UI components
  - [x] PricingCalculator component
  - [x] VolumePricingTable component
  - [x] CatalogBadge component
  - [x] Client-side pricing helpers

- [x] Update `/app/retailer/products/page.tsx`
  - Fetch catalog via `/api/catalogs`
  - Show "Your Catalog: [Name]" header
  - Filter products client-side as backup
  - Add "Not Available" badge for excluded products

- [x] Update `/app/retailer/products/[id]/page.tsx`
  - Check catalog inclusion before display
  - Show volume pricing table when applicable
  - Display "Your Price" with breakdown tooltip
  - Add "Request Access" for excluded products

- [x] Backfill order detail stub
  - [x] Create `/app/retailer/orders/[orderId]/page.tsx` (placeholder UI)

### Afternoon: Order Type Integration
- [x] Update `/app/retailer/at-once/page.tsx`
  - Apply catalog filtering to product list
  - Show customer-specific pricing
  - Display volume break indicators

- [x] Update `/app/retailer/prebook/page.tsx`
  - Filter by catalog for prebook items
  - Show future season custom pricing
  - Display deposit calculations with custom price

- [x] Update `/app/retailer/closeouts/page.tsx`
  - Apply catalog filters to closeout deals
  - Show additional discounts on clearance
  - Calculate savings from list vs. custom price

## Day 3: Sales Rep Integration

### Morning: Customer Context
- [x] Update `/app/rep/order-for/[customerId]/page.tsx`
  - Load customer's catalog and pricing
  - Show "Shopping as: [Customer Name]" banner
  - Display customer's tier and catalog name
  - Apply all customer-specific rules

- [x] Update `/app/rep/customers/[id]/page.tsx`
  - Add "Catalog & Pricing" tab
  - Show assigned catalog details
  - Display price list and volume breaks
  - Add quick product/price lookup

### Afternoon: Rep Tools
- [x] Create `/components/features/pricing-calculator.tsx`
  - [x] Input: product, quantity, customer
  - [x] Output: price breakdown with all discounts
  - [x] Show comparison to list price
  - [x] Export as PDF quote capability (button added)
- [x] Create `/components/features/volume-pricing-table.tsx`
- [x] Create `/components/features/catalog-badge.tsx`

- [x] Update `/app/rep/dashboard/page.tsx`
  - Add "Customer Pricing" quick access
  - Show catalog assignment summary
  - Display pricing exception alerts
  - Link to `/rep/closeouts/manage` placeholder

## Day 4: Admin Management

### Morning: Catalog Management
- [x] Complete `/app/admin/catalogs/page.tsx`
  - List all catalogs with assigned companies
  - Search/filter catalogs
  - View product inclusions/exclusions
  - Preview catalog as customer

- [x] Create `/app/admin/catalogs/[id]/page.tsx`
  - Edit catalog name and description
  - Manage product inclusions/exclusions
  - Manage category rules
  - Clone catalog functionality

### Afternoon: Price List Management
- [x] Create `/app/admin/price-lists/page.tsx`
  - List all price lists with companies
  - View override and volume break summary
  - Quick edit capabilities
  - Import/export CSV functionality

- [x] Create `/app/admin/assignments/page.tsx`
  - Assign catalogs to companies
  - Assign price lists to companies
  - Bulk assignment tools
  - Assignment history/audit log

## Day 5: Polish & Testing

### Morning: UX Enhancements
- [x] Add loading states for pricing calculations
- [x] Implement error boundaries for catalog failures
- [x] Add "Catalog Updated" notifications
- [x] Create pricing transparency tooltips
- [x] Add "Download Catalog PDF" functionality

### Afternoon: Testing & Documentation
- [x] Write tests for `/lib/services/catalog-service.ts`
  - Test inclusion/exclusion logic
  - Test category filtering
  - Test default catalog fallback

- [x] Write tests for `/lib/services/pricing-service.ts`
  - Test tier → volume → override precedence
  - Test price calculation accuracy
  - Test edge cases (0 qty, negative price)

- [ ] Update documentation
  - Add catalog assignment guide
  - Document pricing calculation logic
  - Create troubleshooting guide
  - Sync `/app/quick` route statuses

## Acceptance Criteria
- [x] ✅ Retailers see only their catalog products
- [x] ✅ Prices reflect customer-specific rules
- [x] ✅ Volume breaks display and calculate correctly
- [x] ✅ Reps can shop with customer context
- [x] ✅ Admins can manage all catalogs/pricing
- [x] ✅ Price calculations are transparent
- [x] ✅ System handles missing/default catalogs gracefully
- [x] ✅ No 404s on any routes listed on `/quick`

## Performance Targets
- [ ] Catalog filtering < 100ms
- [ ] Price calculation < 50ms per product
- [ ] Bulk price calculation < 500ms for 50 products
- [ ] Catalog assignment changes reflect immediately

## Security Considerations
- [ ] Verify company access on all catalog endpoints
- [ ] Prevent price manipulation via API
- [ ] Audit log all pricing rule changes
- [ ] Validate quantity inputs for volume breaks

## Dependencies
- ProductService must support catalog filtering
- Auth context must provide company ID reliably
- API client needs proper error handling for 403s

## Rollback Plan
- Feature flag: `ENABLE_CUSTOM_CATALOGS`
- Fallback to tier-only pricing if catalog fails
- Keep existing pricing logic as backup

## Success Metrics
- 100% of products correctly filtered by catalog
- Zero pricing calculation errors in testing
- Admin can assign catalog in < 30 seconds
- Rep can view customer pricing in < 2 clicks