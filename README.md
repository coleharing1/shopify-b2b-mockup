# B2B Portal - Wholesale Management Platform

A modern, responsive B2B wholesale portal built with Next.js 15, TypeScript, and Tailwind CSS v4. This demo showcases a comprehensive wholesale management system with separate interfaces for retailers, sales representatives, and administrators.

## 🚀 Demo Access

Visit the live demo at: [Coming Soon - Deploy to Vercel]

### Demo Credentials

**Retailer Accounts:**
- Gold Tier: `john@outdoorretailers.com` / `demo`
- Silver Tier: `sarah@sportinggoods.com` / `demo`  
- Bronze Tier: `mike@adventuregear.com` / `demo`

**Sales Rep Account:**
- Email: `tom@company.com` / `demo`

**Admin Account:**
- Email: `admin@company.com` / `demo`

## 🎯 Key Features

### For Retailers
- **Three Order Types**:
  - **At-Once Orders** - Immediate stock with real-time inventory
  - **Prebook Orders** - Future season ordering with delivery windows
  - **Closeout Orders** - Clearance deals with urgency indicators
- **Dynamic Pricing Tiers** - Bronze (30%), Silver (40%), Gold (50%) discounts
- **Multi-Cart System** - Separate carts for each order type
- **Product Catalog** - Browse with category filters and tier-specific visibility
- **Order Management** - Track orders, download invoices, and view history
- **B2B Checkout** - PO numbers, requested ship dates, special instructions

### For Sales Representatives
- **Performance Dashboard** - Track sales metrics, accounts, and activity
- **Customer Management** - View and manage all assigned accounts
- **Order on Behalf** - Place orders for customers with their pricing
- **Customer Insights** - Detailed profiles with order history and activity
- **Prebook Management** - Manage seasonal ordering for clients
- **Resource Library** - Access sales materials and training

### For Administrators
- **Application Review** - Approve/reject new retailer applications
- **Catalog Management** - Control category visibility per pricing tier
- **User Management** - View users and impersonate for testing
- **Order Settings** - Configure order types and business rules
- **Performance Metrics** - Platform-wide analytics and insights

### Platform Features
- **Advanced Analytics** - Real-time dashboards with customizable KPIs
- **Comprehensive Reporting** - Generate reports in PDF, CSV, Excel formats
- **Data Visualization** - Interactive charts, heat maps, and geographic analysis
- **Performance Optimization** - Caching, debouncing, and virtual scrolling
- **Role-Based Insights** - Tailored analytics for each user type

### Technical Features
- **Unified Product System** - Single source of truth for all products
- **Service Layer Architecture** - Centralized business logic
- **Configuration-Driven** - Centralized configs for auth, navigation, pricing
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Real-time Notifications** - Stock alerts and order updates
- **Advanced Search** - Full-text search with filters

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.4.6 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui + Custom components
- **State Management**: React Context API
- **Icons**: Lucide React
- **Animations**: Tailwind animations + CSS transitions
- **Testing**: Jest + React Testing Library

## 📁 Project Structure

```
b2b-portal/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin portal pages
│   ├── retailer/          # Retailer portal pages
│   ├── rep/               # Sales rep portal pages
│   ├── api/               # API routes
│   └── login/             # Authentication
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── features/         # Feature-specific components
│   └── layout/           # Layout components
├── config/               # Centralized configuration
│   ├── auth.config.ts    # Authentication & users
│   ├── nav.config.ts     # Navigation structure
│   └── order-types.ts    # Order types & pricing
├── services/             # Service layer
│   ├── api/              # API client
│   └── business/         # Business logic
├── lib/                  # Utilities and contexts
│   ├── contexts/         # React contexts
│   └── services/         # Product service
├── types/                # TypeScript types
├── public/               # Static assets
│   └── mockdata/         # JSON mock data
└── hooks/                # Custom React hooks
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd b2b-portal
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## 🎨 Design System

The portal uses a consistent design system with:
- **Colors**: Primary blue (#1e40af), success green, warning yellow, error red
- **Typography**: System font stack with consistent sizing
- **Spacing**: 4px base unit with Tailwind spacing scale
- **Components**: Reusable components following shadcn/ui patterns

## 📱 Responsive Design

The portal is fully responsive with:
- Mobile-first approach
- Bottom navigation for mobile
- Slide-out navigation drawer
- Responsive tables that convert to cards
- Touch-friendly interactions (44px minimum touch targets)

## 🏗️ Architecture Highlights

- **Unified Product System**: Single `products.json` with order type metadata
- **Service Layer**: Business logic separated from UI and API routes
- **Configuration-Driven**: Centralized configs for maintainability
- **Type Safety**: Comprehensive TypeScript interfaces and type guards
- **Multi-Company Context**: Dynamic pricing and access per company
- **Cart Isolation**: Separate cart contexts for each order type

## 🔒 Known Limitations

This is a demo/mockup with the following limitations:
- No real authentication (mock login with demo users)
- No backend API (uses static JSON data)
- No data persistence (state resets on refresh)
- No real payment processing
- No email sending functionality
- Mock search and filtering only

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Deploy with default settings

### Environment Variables

No environment variables required for the demo.

## 📝 Demo Flow Script

1. **Login** - Show role-based access with different tiers
2. **Retailer Flow**:
   - Dashboard with personalized metrics
   - Browse at-once products with tier pricing
   - Explore prebook for future seasons
   - Check closeout deals with urgency indicators
   - Add items to separate carts
   - Complete B2B checkout
   - View order history
3. **Sales Rep Flow**:
   - Rep dashboard with performance metrics
   - Customer list with search/filter
   - Customer detail view with order types
   - Order on behalf of customer
   - Manage prebook deadlines
4. **Admin Flow**:
   - Review pending applications
   - Configure catalog visibility per tier
   - Impersonate users for testing
   - Manage order settings

## 🤝 Contributing

This is a demo project. For the production version, please contact the development team.

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ for modern B2B wholesale operations