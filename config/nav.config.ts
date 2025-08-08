/**
 * Centralized navigation configuration
 * Single source of truth for all navigation items across the app
 */

export interface NavItem {
  href: string
  label: string
  icon?: string
  badge?: string | number
  children?: NavItem[]
}

// Retailer navigation items
export const RETAILER_NAV: NavItem[] = [
  { href: '/retailer/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/retailer/products', label: 'Products', icon: 'Package' },
  { 
    href: '/retailer/orders', 
    label: 'Orders', 
    icon: 'ShoppingCart',
    children: [
      { href: '/retailer/at-once', label: 'At Once Orders' },
      { href: '/retailer/prebook', label: 'Prebook Orders' },
      { href: '/retailer/closeouts', label: 'Closeout Deals' }
    ]
  },
  { href: '/retailer/quotes', label: 'Quotes', icon: 'FileText' },
  { href: '/retailer/invoices', label: 'Invoices', icon: 'Receipt' },
  { href: '/retailer/resources', label: 'Resources', icon: 'BookOpen' },
  { href: '/retailer/settings', label: 'Settings', icon: 'Settings' }
]

// Sales rep navigation items
export const REP_NAV: NavItem[] = [
  { href: '/rep/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/rep/customers', label: 'Customers', icon: 'Users' },
  { href: '/rep/orders', label: 'Orders', icon: 'ShoppingCart' },
  { 
    href: '/rep/quotes', 
    label: 'Quotes', 
    icon: 'FileText',
    children: [
      { href: '/rep/quotes', label: 'All Quotes' },
      { href: '/rep/quotes/new', label: 'Create Quote' },
      { href: '/rep/quotes/templates', label: 'Templates' }
    ]
  },
  { href: '/rep/products', label: 'Products', icon: 'Package' },
  { href: '/rep/reports', label: 'Reports', icon: 'BarChart' },
  { href: '/rep/resources', label: 'Resources', icon: 'BookOpen' },
  { href: '/rep/settings', label: 'Settings', icon: 'Settings' }
]

// Admin navigation items
export const ADMIN_NAV: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { href: '/admin/applications', label: 'Applications', icon: 'FileText' },
  { href: '/admin/users', label: 'Users', icon: 'Users' },
  { href: '/admin/products', label: 'Products', icon: 'Package' },
  { href: '/admin/catalogs', label: 'Catalogs', icon: 'Book' },
  { href: '/admin/pricing', label: 'Pricing', icon: 'DollarSign' },
  { href: '/admin/seasons', label: 'Seasons', icon: 'Calendar' },
  { href: '/admin/closeouts', label: 'Closeouts', icon: 'TrendingDown' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'BarChart' },
  { href: '/admin/order-settings', label: 'Settings', icon: 'Settings' }
]

// Mobile bottom navigation (simplified)
export const MOBILE_NAV = {
  retailer: [
    { href: '/retailer/dashboard', label: 'Home', icon: 'Home' },
    { href: '/retailer/products', label: 'Products', icon: 'Package' },
    { href: '/retailer/cart', label: 'Cart', icon: 'ShoppingCart' },
    { href: '/retailer/orders', label: 'Orders', icon: 'FileText' },
    { href: '/retailer/settings', label: 'Account', icon: 'User' }
  ],
  rep: [
    { href: '/rep/dashboard', label: 'Home', icon: 'Home' },
    { href: '/rep/customers', label: 'Customers', icon: 'Users' },
    { href: '/rep/orders', label: 'Orders', icon: 'FileText' },
    { href: '/rep/products', label: 'Products', icon: 'Package' },
    { href: '/rep/settings', label: 'Account', icon: 'User' }
  ],
  admin: [
    { href: '/admin/dashboard', label: 'Home', icon: 'Home' },
    { href: '/admin/users', label: 'Users', icon: 'Users' },
    { href: '/admin/applications', label: 'Apps', icon: 'FileText' },
    { href: '/admin/products', label: 'Products', icon: 'Package' },
    { href: '/admin/settings', label: 'Settings', icon: 'Settings' }
  ]
}

// Get navigation items based on user role
export function getNavItemsByRole(role: 'retailer' | 'sales_rep' | 'admin'): NavItem[] {
  switch (role) {
    case 'retailer':
      return RETAILER_NAV
    case 'sales_rep':
      return REP_NAV
    case 'admin':
      return ADMIN_NAV
    default:
      return []
  }
}

// Get mobile navigation items based on user role  
export function getMobileNavByRole(role: 'retailer' | 'sales_rep' | 'admin'): NavItem[] {
  switch (role) {
    case 'retailer':
      return MOBILE_NAV.retailer
    case 'sales_rep':
      return MOBILE_NAV.rep
    case 'admin':
      return MOBILE_NAV.admin
    default:
      return []
  }
}