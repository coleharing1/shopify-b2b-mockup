# Phase 6 — Quote System MVP (5 days)

## Prerequisites ✅
- [ ] Phase 5 complete (pricing endpoints + catalog filters available)
- [x] Cart systems stable (at-once, prebook, closeout)
- [x] Authentication and session management working
- [x] Product service with filtering and pricing
- [x] Admin portal foundation in place

## Goals
- [ ] Complete quote lifecycle: draft → sent → viewed → revised → accepted → order
- [ ] Retailer RFQ (Request for Quote) workflow
- [ ] Rep quote builder with custom pricing
- [ ] Quote versioning and revision tracking
- [ ] Convert accepted quotes to orders
- [ ] Email notifications (mocked)

## Day 1: Data Models & Core APIs

### Morning: Quote Data Structure
- [ ] Create `/types/quote-types.ts`
  ```typescript
  interface Quote {
    id: string
    number: string // QUOTE-2024-001
    companyId: string
    createdBy: string // userId
    assignedTo?: string // sales rep
    status: 'draft' | 'sent' | 'viewed' | 'revised' | 'accepted' | 'rejected' | 'expired'
    type: 'rfq' | 'proactive' // request vs sales-initiated
    items: QuoteItem[]
    pricing: {
      subtotal: number
      discount: number
      tax: number
      total: number
    }
    terms: {
      validUntil: Date
      paymentTerms: string
      shippingTerms: string
      notes: string
    }
    versions: QuoteVersion[]
    timeline: QuoteEvent[]
  }
  ```

- [ ] Create `/public/mockdata/quotes.json` (empty initial file)
  - Structure for persistent quote storage
  - Include sample quotes for testing

- [ ] Add `/types/quote-types.ts` to `tsconfig` paths if needed

### Afternoon: Quote API Implementation
- [ ] Create `/app/api/quotes/route.ts`
  - GET: List quotes (filtered by role/company)
  - POST: Create new quote (draft or sent)
  - Auth-required with company scoping

- [ ] Create `/app/api/quotes/[id]/route.ts`
  - GET: Single quote with full details
  - PATCH: Update quote (status, items, terms)
  - DELETE: Soft delete (status: 'cancelled')

- [ ] Add `/lib/services/quote-service.ts`
  - `createQuote(items, type, companyId)`
  - `updateQuoteStatus(quoteId, status, userId)`
  - `addQuoteRevision(quoteId, changes)`
  - `convertQuoteToOrder(quoteId)`
  - `calculateQuotePricing(items, companyId)`

- [ ] Create `/lib/services/quote-service.ts`
  - `createQuote(items, type, companyId)`
  - `updateQuoteStatus(quoteId, status, userId)`
  - `addQuoteRevision(quoteId, changes)`
  - `convertQuoteToOrder(quoteId)`
  - `calculateQuotePricing(items, companyId)`

## Day 2: Retailer RFQ Flow

### Morning: Request Quote UI
- [ ] Create `/app/retailer/quotes/request/page.tsx`
  - Product selection interface
  - Quantity input with size runs
  - Add notes and requirements
  - Requested delivery date
  - Submit RFQ button

- [ ] Update product pages with "Request Quote" action
  - `/app/retailer/products/[id]/page.tsx`
  - `/app/retailer/at-once/page.tsx`
  - `/app/retailer/prebook/page.tsx`

- [ ] Create `/components/features/quote-request-form.tsx`
  - Multi-step form wizard
  - Product search and selection
  - Quantity matrix for variants
  - Notes and attachments

### Afternoon: Quote Management
- [ ] Create `/app/retailer/quotes/page.tsx`
  - List all quotes with status badges
  - Filter by status, date, total
  - Search by quote number
  - Quick actions (view, accept, reject)

- [ ] Create `/app/retailer/quotes/[id]/page.tsx`
  - Quote detail view with timeline
  - Line items with pricing
  - Terms and conditions
  - Accept/Request Revision/Reject actions
  - Download PDF button
  - Version history display

- [ ] Add placeholder at `/retailer/quotes` to avoid 404 until MVP complete

## Day 3: Sales Rep Quote Builder

### Morning: Quote Creation
- [ ] Create `/app/rep/quotes/new/page.tsx`
  - Step 1: Select customer
  - Step 2: Add products with search
  - Step 3: Custom pricing adjustments
  - Step 4: Terms and expiration
  - Step 5: Review and send

- [ ] Create `/components/features/quote-builder/`
  - `customer-selector.tsx`
  - `product-selector.tsx`
  - `pricing-editor.tsx`
  - `terms-editor.tsx`
  - `quote-preview.tsx`

### Afternoon: Quote Editing
- [ ] Create `/app/rep/quotes/[id]/edit/page.tsx`
- [ ] Add placeholder at `/rep/quotes` to avoid 404 until MVP complete
  - Edit draft quotes
  - Create revisions for sent quotes
  - Adjust line items and quantities
  - Override pricing with reasons
  - Update terms and validity

- [ ] Add quote templates functionality
  - Save quote as template
  - Start from template
  - Manage template library

## Day 4: Rep Dashboard & Integration

### Morning: Quote Dashboard
- [ ] Update `/app/rep/quotes/page.tsx`
  - Advanced filtering (customer, status, value)
  - Quote metrics cards:
    - Open quote value
    - Conversion rate
    - Avg. quote value
    - Expiring soon count
  - Bulk actions (extend validity, follow up)

- [ ] Update `/app/rep/dashboard/page.tsx`
  - Add quotes summary widget
  - Show urgent quotes (expiring, awaiting response)
  - Quick quote creation link
  - Recent quote activity

### Afternoon: Customer Integration
- [ ] Update `/app/rep/customers/[id]/page.tsx`
  - Add "Quotes" tab
  - List customer's quotes
  - Create quote for customer button
  - Quote history and patterns

- [ ] Create quote follow-up system
  - Automatic reminders for expiring quotes
  - Track customer quote views
  - Suggest follow-up actions
  - Email notification triggers (mocked)

## Day 5: Order Conversion & Polish

### Morning: Quote to Order
- [ ] Implement `convertQuoteToOrder` in quote service
  - Clear existing cart(s)
  - Add quote items with locked prices
  - Preserve quote terms as order notes
  - Create order reference to quote

- [ ] Update checkout to handle quote orders
  - Show "Quote #XXX" reference
  - Lock pricing (no recalculation)
  - Pre-fill order notes
  - Skip payment for Net terms

- [ ] Create post-conversion flow
  - Update quote status to 'converted'
  - Notify sales rep of conversion
  - Create order confirmation
  - Archive quote appropriately

- [ ] Update `/app/quick` statuses for all quote routes

### Afternoon: Polish & Testing
- [ ] Add quote lifecycle notifications
  - Toast messages for all actions
  - Email notification placeholders
  - In-app notification badges

- [ ] Implement quote PDF export
  - Professional quote template
  - Company branding placeholder
  - Terms and conditions
  - Signature blocks

- [ ] Write comprehensive tests
  - Quote state transitions
  - Pricing calculation with overrides
  - Quote to order conversion
  - Permission checks

- [ ] Add quote analytics (basic)
  - Quote funnel visualization
  - Win/loss reasons
  - Average time to close
  - Rep performance metrics

## Acceptance Criteria
- [ ] ✅ Retailers can request quotes for any products
- [ ] ✅ Reps can create and send professional quotes
- [ ] ✅ Quote lifecycle tracked with timeline
- [ ] ✅ Custom pricing preserved through conversion
- [ ] ✅ Quotes expire and update status automatically
- [ ] ✅ Version history maintained for revisions
- [ ] ✅ Accepted quotes convert seamlessly to orders

## Performance Targets
- [ ] Quote creation < 2 seconds
- [ ] Quote list loads < 500ms
- [ ] PDF generation < 3 seconds
- [ ] Quote to order conversion < 1 second

## Security & Validation
- [ ] Company-scoped quote access
- [ ] Role-based quote actions
- [ ] Pricing override audit trail
- [ ] Quote number uniqueness
- [ ] Expiration date validation

## API Endpoints Summary
```
POST   /api/quotes                  Create quote
GET    /api/quotes                  List quotes
GET    /api/quotes/[id]             Get quote
PATCH  /api/quotes/[id]             Update quote
POST   /api/quotes/[id]/revision    Create revision
POST   /api/quotes/[id]/accept      Accept quote
POST   /api/quotes/[id]/reject      Reject quote
POST   /api/quotes/[id]/convert     Convert to order
GET    /api/quotes/[id]/pdf         Generate PDF
```

## UI Routes Summary
```
# Retailer
/retailer/quotes                    Quote list
/retailer/quotes/request            Request quote
/retailer/quotes/[id]               Quote detail

# Sales Rep  
/rep/quotes                          Quote dashboard
/rep/quotes/new                      Create quote
/rep/quotes/[id]                     Quote detail
/rep/quotes/[id]/edit                Edit quote
/rep/quotes/templates                Quote templates
```

## Edge Cases to Handle
- [ ] Quote with discontinued products
- [ ] Quote with out-of-stock items
- [ ] Customer tier change during quote validity
- [ ] Multiple revisions of same quote
- [ ] Partial quote acceptance
- [ ] Quote for inactive customer

## Future Enhancements (Phase 7)
- Real email notifications
- Quote approval workflow
- Competitive quote comparison
- Quote analytics dashboard
- Mobile app quote creation
- Digital signature integration
- CRM integration
- Quote automation rules

## Success Metrics
- 80% of quotes viewable within 24 hours
- 50% quote-to-order conversion rate
- < 3 clicks to create basic quote
- Zero quote pricing errors
- 100% quote audit trail completeness