'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class CatalogErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Catalog Error Boundary caught:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
    
    // In production, log to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // logErrorToService(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return <>{this.props.fallback}</>
      }

      const isCatalogError = this.state.error?.message?.toLowerCase().includes('catalog')
      const isPricingError = this.state.error?.message?.toLowerCase().includes('pric')

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                {isCatalogError ? 'Catalog Loading Error' : 
                 isPricingError ? 'Pricing Calculation Error' : 
                 'Something went wrong'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-orange-200 bg-orange-50">
                <AlertDescription className="text-orange-800">
                  {isCatalogError ? (
                    <>
                      We're having trouble loading your product catalog. 
                      You can still browse all products, but custom catalog filters may not be applied.
                    </>
                  ) : isPricingError ? (
                    <>
                      There was an error calculating custom pricing. 
                      Standard pricing will be shown instead.
                    </>
                  ) : (
                    <>
                      An unexpected error occurred. Please try refreshing the page or contact support if the issue persists.
                    </>
                  )}
                </AlertDescription>
              </Alert>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="p-3 bg-gray-100 rounded-lg">
                  <p className="text-xs font-mono text-gray-600 mb-2">
                    Error: {this.state.error.message}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-500">Stack trace</summary>
                      <pre className="mt-2 overflow-auto text-gray-500">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={this.handleReset} className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href="/retailer/products">
                    <Home className="h-4 w-4 mr-2" />
                    Browse All Products
                  </Link>
                </Button>
              </div>

              <p className="text-xs text-center text-gray-500">
                If this issue persists, please contact support with error code: 
                <code className="ml-1 px-1 py-0.5 bg-gray-100 rounded">
                  {Date.now().toString(36).toUpperCase()}
                </code>
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for functional components
export function withCatalogErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <CatalogErrorBoundary fallback={fallback}>
        <Component {...props} />
      </CatalogErrorBoundary>
    )
  }
}