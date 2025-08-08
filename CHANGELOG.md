# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2025-01-07

### Added
- **Unified Product System**: Consolidated all products into single `products.json` with order type metadata
- **Configuration Layer**: Added centralized configs for auth, navigation, and order types
- **Service Layer**: Implemented ProductService and API client for business logic separation
- **Admin Portal**: Complete admin interface with:
  - Application review and approval system
  - Catalog management with tier-based visibility controls
  - User management with impersonation feature
- **Three Order Types**:
  - At-Once orders for immediate stock
  - Prebook orders for future seasons
  - Closeout orders for clearance deals
- **Dynamic Pricing Tiers**: Bronze (tier-1), Silver (tier-2), Gold (tier-3) with 30%, 40%, 50% discounts
- **Authentication System**: Centralized auth config with mock users and session management
- **API Security**: Added session verification to all product API routes

### Changed
- **Pricing System**: Standardized tier naming from mixed formats to consistent `tier-1`, `tier-2`, `tier-3`
- **User Authentication**: Migrated from hardcoded users to centralized `auth.config.ts`
- **Product APIs**: Updated to use unified ProductService with proper filtering
- **Dropdown Menu**: Fixed implementation with proper state management and positioning
- **Navigation**: Planning migration to centralized `nav.config.ts`

### Fixed
- **Pricing Tier Bugs**: Fixed hardcoded "Silver" references to use dynamic pricing tiers
- **API Authentication**: Added missing session validation to product endpoints
- **Dropdown Cutoff**: Resolved desktop dropdown menus being cut off
- **Session Management**: Fixed email/ID mismatches across the codebase
- **Product Filtering**: Corrected order type filtering logic

### Technical Debt Addressed
- Eliminated 400+ lines of duplicated cart logic (pending unification)
- Removed hardcoded company references
- Consolidated scattered user definitions
- Standardized pricing tier formats

## [0.1.0] - 2025-01-01

### Initial Release
- Basic B2B portal with retailer and sales rep interfaces
- Product catalog with static data
- Shopping cart functionality
- Order management system
- Responsive design with mobile support