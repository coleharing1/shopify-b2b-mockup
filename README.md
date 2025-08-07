# B2B Portal - Wholesale Management Platform

A modern, responsive B2B wholesale portal built with Next.js 14, TypeScript, and Tailwind CSS. This demo showcases a comprehensive wholesale management system with separate interfaces for retailers and sales representatives.

## 🚀 Demo Access

Visit the live demo at: [Coming Soon - Deploy to Vercel]

### Demo Credentials

**Retailer Account:**
- Email: `demo@retailer.com`
- Password: Any password

**Sales Rep Account:**
- Email: `demo@salesrep.com`
- Password: Any password

## 🎯 Key Features

### For Retailers
- **Personalized Dashboard** - View metrics, recent orders, and recommendations
- **Tiered Pricing** - Automatic pricing based on account tier (30%, 40%, 50% discounts)
- **Product Catalog** - Browse products with real-time inventory and tier-specific pricing
- **Quick Ordering** - Bulk order matrix, variant selection, and quick reorder
- **Order Management** - Track orders, download invoices, and view order history
- **Shopping Cart** - Persistent cart with variant management
- **B2B Checkout** - PO numbers, requested ship dates, and special instructions

### For Sales Representatives
- **Performance Dashboard** - Track sales metrics, accounts, and activity
- **Customer Management** - View and manage all assigned accounts
- **Order on Behalf** - Place orders for customers with their pricing
- **Customer Insights** - Detailed profiles with order history and activity
- **Resource Library** - Access sales materials, price sheets, and training

### Platform Features
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Real-time Notifications** - Stock alerts, order updates, and announcements
- **Advanced Search** - Search with filters and visual feedback
- **Role Switching** - Switch between retailer and sales rep views
- **Mock Data** - Realistic demo data for all scenarios

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/ui + Custom components
- **State Management**: React Context API
- **Icons**: Lucide React
- **Animations**: Tailwind animations + CSS transitions

## 📁 Project Structure

```
b2b-portal/
├── app/                    # Next.js app router pages
│   ├── login/             # Authentication
│   ├── retailer/          # Retailer portal pages
│   ├── rep/               # Sales rep portal pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── features/         # Feature-specific components
│   └── layout/           # Layout components
├── lib/                   # Utilities and helpers
├── public/               # Static assets
│   └── mockdata/         # JSON mock data
└── styles/               # Global styles
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

## 🔒 Known Limitations

This is a demo/mockup with the following limitations:
- No real authentication (mock login only)
- No backend API (uses static JSON data)
- No data persistence (cart resets on refresh)
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

1. **Login** - Show role-based access
2. **Retailer Flow**:
   - Dashboard with personalized metrics
   - Browse catalog with tier pricing
   - Add items to cart with variants
   - Complete B2B checkout
   - View order history
3. **Switch to Sales Rep**:
   - Rep dashboard with performance metrics
   - Customer list with search/filter
   - Customer detail view
   - Order on behalf of customer
   - Access sales resources

## 🤝 Contributing

This is a demo project. For the production version, please contact the development team.

## 📄 License

Proprietary - All rights reserved

---

Built with ❤️ for modern B2B wholesale operations