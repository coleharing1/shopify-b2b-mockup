/**
 * Application-wide configuration
 * Environment variables and global settings
 */

// Environment detection
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_TEST = process.env.NODE_ENV === 'test'

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
}

// App URLs
export const APP_CONFIG = {
  name: 'B2B Portal',
  description: 'Wholesale ordering platform',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  supportEmail: 'support@b2bportal.com',
  companyName: 'B2B Portal Inc.',
}

// Feature flags
export const FEATURES = {
  enableRealTimeUpdates: false,
  enableAdvancedSearch: true,
  enableNotifications: true,
  enableFileUpload: false,
  enableQuickOrder: true,
  enableBulkActions: true,
  enableExport: true,
  enableImpersonation: !IS_PRODUCTION,
  showDebugInfo: IS_DEVELOPMENT,
}

// Pagination defaults
export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 50, 100],
  maxPageSize: 100,
}

// File upload limits
export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.pdf'],
}

// Toast/notification settings
export const NOTIFICATION_CONFIG = {
  duration: 4000, // 4 seconds
  position: 'bottom-right' as const,
  maxVisible: 3,
}

// Session/auth timeouts
export const SESSION_CONFIG = {
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  rememberMeDuration: 30 * 24 * 60 * 60 * 1000, // 30 days
}

// Cache configuration
export const CACHE_CONFIG = {
  productsTTL: 5 * 60 * 1000, // 5 minutes
  ordersTTL: 2 * 60 * 1000, // 2 minutes
  usersTTL: 10 * 60 * 1000, // 10 minutes
  enableCache: !IS_DEVELOPMENT,
}

// Mock data paths
export const MOCK_DATA_PATHS = {
  products: '/mockdata/products.json',
  companies: '/mockdata/companies.json',
  orders: '/mockdata/orders.json',
  applications: '/mockdata/applications.json',
}

// Error messages
export const ERROR_MESSAGES = {
  generic: 'Something went wrong. Please try again.',
  network: 'Network error. Please check your connection.',
  unauthorized: 'You are not authorized to perform this action.',
  notFound: 'The requested resource was not found.',
  validation: 'Please check your input and try again.',
  timeout: 'Request timed out. Please try again.',
}