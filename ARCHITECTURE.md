# Architecture Documentation

## Overview

This B2B portal follows a modern React/Next.js architecture with a focus on maintainability, type safety, and separation of concerns.

## Core Principles

1. **Configuration-Driven Development**: Centralized configs for auth, navigation, and business rules
2. **Service Layer Pattern**: Business logic separated from UI and API routes
3. **Type Safety**: Comprehensive TypeScript coverage with strict typing
4. **Component Modularity**: Reusable UI components following shadcn/ui patterns
5. **Context Isolation**: Separate contexts for different concerns (auth, carts, app state)

## Directory Structure

### `/app` - Next.js App Router
- **Pages & Layouts**: Server and client components using App Router
- **API Routes**: RESTful endpoints with session validation
- **Role-Based Routing**: `/admin`, `/retailer`, `/rep` subdirectories

### `/config` - Centralized Configuration
- `auth.config.ts`: User definitions, session management
- `nav.config.ts`: Navigation structure per role
- `order-types.config.ts`: Pricing tiers, order type settings
- `app.config.ts`: Application-wide settings

### `/services` - Service Layer
- **API Client** (`/api/client.ts`): Typed fetch wrapper with retry logic
- **Business Services** (`/business/*.service.ts`): Pure business logic functions
- **Data Services**: ProductService for unified data access

### `/lib` - Core Libraries
- **Contexts**: React contexts for state management
- **Services**: Legacy services (being migrated to `/services`)
- **Utils**: Shared utility functions
- **API Auth**: Session verification utilities

### `/components` - UI Components
- **UI** (`/ui`): Base components (Button, Card, Input, etc.)
- **Features** (`/features`): Business feature components
- **Layout** (`/layout`): Page layout components

### `/types` - TypeScript Definitions
- Shared type definitions and interfaces
- Order type specific types with metadata
- API response types

## Data Flow

```
User Action → Component → Context/Hook → Service → API → Mock Data
                ↓                           ↓
            Local State              Business Logic
```

## Key Architectural Decisions

### 1. Unified Product System
- Single `products.json` file as source of truth
- Order type metadata attached to products
- Dynamic filtering based on order type and user context

### 2. Multi-Cart Architecture
- Separate cart contexts for each order type
- Prevents mixing incompatible order types
- Allows different business rules per type

### 3. Pricing Tier System
- Three tiers: Bronze (tier-1), Silver (tier-2), Gold (tier-3)
- Company-level tier assignment
- Dynamic price calculation based on user context

### 4. Authentication & Authorization
- Mock authentication with predefined users
- Session-based with cookie storage
- Role-based access control (RBAC)
- API-level session verification

### 5. Service Layer Pattern
```typescript
// Business logic in services
ProductService.getProductsByOrderType(orderType, filters)
  → Filtering logic
  → Price enhancement
  → Inventory checks
  → Returns enhanced products

// Thin API routes
GET /api/products/at-once
  → Verify session
  → Call ProductService
  → Return JSON response
```

## State Management

### Global State (Contexts)
- **AuthContext**: User session, login/logout
- **AppStateContext**: Application-wide UI state
- **Cart Contexts**: Separate for each order type

### Local State
- Component-specific state using hooks
- Form state management
- UI interaction state

### Server State
- Next.js App Router for server components
- API routes for data fetching
- Mock data as pseudo-database

## Security Considerations

1. **Session Validation**: All API routes verify user session
2. **Role-Based Access**: Different UIs and data based on role
3. **Company Isolation**: Users only see their company's data
4. **Tier-Based Visibility**: Products/categories filtered by tier

## Performance Optimizations

1. **Server Components**: Default to RSC where possible
2. **Code Splitting**: Automatic with App Router
3. **Image Optimization**: Next.js Image component
4. **Memoization**: UseMemo for expensive calculations
5. **Lazy Loading**: Dynamic imports for heavy components

## Testing Strategy

- **Unit Tests**: Business logic in services
- **Component Tests**: UI components with React Testing Library
- **Integration Tests**: API routes and data flow
- **E2E Tests**: Critical user journeys (planned)

## Future Improvements

1. **Real Backend**: Replace mock data with actual API
2. **Cart Unification**: Generic cart engine with facades
3. **Caching Layer**: Redis for session and data caching
4. **WebSocket**: Real-time updates for inventory
5. **PWA Features**: Offline support and push notifications
6. **Analytics**: User behavior tracking
7. **A/B Testing**: Feature flag system

## Migration Path

### From Mock to Production
1. Replace mock data files with API calls
2. Implement real authentication (OAuth/JWT)
3. Add database layer (PostgreSQL/MongoDB)
4. Implement caching (Redis)
5. Add monitoring and logging
6. Deploy with proper CI/CD

### Scaling Considerations
- Microservices for order processing
- CDN for static assets
- Load balancing for API
- Database sharding for large datasets
- Event-driven architecture for order flow