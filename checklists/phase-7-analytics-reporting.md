# Phase 7 — Analytics & Reporting (5 days)

## Prerequisites ✅
- [ ] Phase 5 customer pricing & catalogs live (metrics can reflect custom pricing)
- [ ] Phase 6 quote system MVP live (optional, but enables quote analytics)
- [x] Product, orders, applications mock data available (`public/mockdata/*.json`)
- [x] Auth/session guard for APIs (`lib/api-auth.ts`)
- [x] Config-driven nav in place (`config/nav.config.ts`) — add analytics items

## Goals
- [ ] Admin analytics: revenue, orders, products, customers, quotes (if enabled)
- [ ] Sales Rep analytics: territory/customer performance and pipeline
- [ ] CSV export for key reports
- [ ] API endpoints for analytics with company/role scoping
- [ ] Reusable analytics service for aggregations and time-series

## Pre-work (0.5 day): Routes + Quick Sync
- [ ] Scaffold pages to avoid 404s and wire nav
  - `/admin/analytics`
  - `/rep/analytics`
  - (optional) `/retailer/reports`
- [ ] Update `config/nav.config.ts` with analytics items
- [ ] Update `/app/quick` statuses to reflect new routes

## Day 1: Data & Aggregation Layer

### Morning: Types & Service
- [ ] Create `/types/analytics-types.ts`
  - `TimeRange`, `SeriesPoint`, `Kpi`, `BreakdownRow`, `Report`
- [ ] Create `services/business/analytics.service.ts`
  - `aggregateRevenueByPeriod(orders, range)`
  - `aggregateOrdersByStatus(orders)`
  - `topProducts(orders, products, limit)`
  - `topCustomers(orders, companies, limit)`
  - `quoteFunnel(quotes)` (if Phase 6 ready)
  - `aov(orders)` / `conversionRate(quotes, orders)`

### Afternoon: API Endpoints
- [ ] Create `/app/api/analytics/overview/route.ts` (GET)
  - Returns KPIs + small time-series for dashboard
- [ ] Create `/app/api/analytics/orders/route.ts` (GET)
  - Returns order status breakdown, trends
- [ ] Create `/app/api/analytics/products/route.ts` (GET)
  - Returns top products, category performance
- [ ] Create `/app/api/analytics/customers/route.ts` (GET)
  - Returns top customers and segments
- [ ] (Optional) `/app/api/analytics/quotes/route.ts` (GET)
  - Returns quote funnel metrics
- [ ] Ensure all endpoints scope by role/company via `verifySession`

## Day 2: Admin Analytics UI

### Morning: Admin Overview Page
- [ ] Build `/app/admin/analytics/page.tsx`
  - KPI cards: Revenue (period), Orders, AOV, Conversion (if quotes)
  - Charts: Revenue trend, Orders by status
- [ ] Loading and error states for API calls

### Afternoon: Reports & Exports
- [ ] Add tabs/sections: Products, Customers
- [ ] Tables: top products, top customers, sorting + pagination
- [ ] CSV export buttons for each table
- [ ] Utility: `lib/export/csv.ts` (pure function, no DOM)

## Day 3: Rep Analytics UI

### Morning: Territory & Customer Performance
- [ ] Build `/app/rep/analytics/page.tsx`
  - KPIs: Territory revenue, Open pipeline (quotes), AOV
  - Tables: top customers (rep-assigned), recent activity
- [ ] Filters: date range, customer

### Afternoon: Quote Pipeline (if enabled)
- [ ] Quote metrics: open value, expiring soon, win rate
- [ ] Actions: quick links to follow-ups
- [ ] Export quotes summary (CSV)

## Day 4: Admin Report Library (MVP)

### Morning: Saved Reports
- [ ] Add simple “Saved reports” structure (`public/mockdata/reports.json`)
- [ ] Create `/app/admin/reports/page.tsx` (optional, lightweight)
  - List saved definitions (range, filters, type)
  - Run report → navigates to analytics with params

### Afternoon: Polish & Accessibility
- [ ] Empty states for no data
- [ ] Accessible tables/charts (labels, aria)
- [ ] Mobile layout checks for cards and tables

## Day 5: Performance, Tests, Docs

### Morning: Performance
- [ ] Memoize heavy aggregations in `analytics.service.ts`
- [ ] Add simple in-memory cache per query+range while on page
- [ ] Paginate tables (50 rows per page max)

### Afternoon: Tests & Documentation
- [ ] Unit tests for `analytics.service.ts` (aggregations, edge cases)
- [ ] Contract tests for `/api/analytics/*` (shape + scoping)
- [ ] Update `/app/quick` route statuses and descriptions
- [ ] Add "Analytics Overview" doc: metrics definitions and formulas

## Acceptance Criteria
- [ ] ✅ Admin and Rep analytics pages load without 404s
- [ ] ✅ KPIs match aggregation formulas on the same dataset
- [ ] ✅ CSV exports download with correct headers and rows
- [ ] ✅ Role/company scoping enforced on all analytics endpoints
- [ ] ✅ Loading, error, and empty states implemented
- [ ] ✅ Pages responsive and accessible

## Performance Targets
- [ ] Analytics overview API < 300ms for 5k orders (mock)
- [ ] Table pagination fetch < 200ms
- [ ] Client rendering TTI < 2s on mid-tier laptop

## Security & Privacy
- [ ] Scope analytics data by role and company
- [ ] No PII beyond company/aggregate fields in analytics responses
- [ ] Validate date ranges and params server-side

## Dependencies
- Orders/products/companies mock data integrity
- `lib/api-auth.ts` for session checks
- `services/api/client.ts` for API fetches

## Rollback Plan
- Feature flag: `ENABLE_ANALYTICS`
- Fallback to static KPIs if API fails
- Keep exports disabled if dataset missing

## Success Metrics
- Admin: See core KPIs + trends in < 2 clicks
- Rep: Identify top customers and pipeline quickly
- Exports used in demos without errors
- Zero client console errors on analytics pages


