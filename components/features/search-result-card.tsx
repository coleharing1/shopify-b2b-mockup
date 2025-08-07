"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  FileText, 
  Users, 
  File,
  ShoppingCart,
  Eye,
  Download,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Truck
} from "lucide-react"
import { formatCurrency } from "@/lib/mock-data"
import { useCart } from "@/lib/cart-context"

interface SearchResultCardProps {
  result: {
    id: string
    type: "product" | "order" | "customer" | "resource"
    title: string
    subtitle?: string
    description?: string
    image?: string
    url: string
    metadata?: Record<string, any>
  }
  viewMode: "grid" | "list"
  searchQuery?: string
}

/**
 * @description Enhanced search result card with type-specific rendering
 * @fileoverview Displays search results with highlighted terms and quick actions
 */
export function SearchResultCard({ result, viewMode, searchQuery }: SearchResultCardProps) {
  const { addToCart } = useCart()

  // Highlight search terms in text
  const highlightText = (text: string) => {
    if (!searchQuery) return text
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'))
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === searchQuery.toLowerCase() ? 
            <mark key={i} className="bg-yellow-200 px-0.5 rounded">{part}</mark> : 
            part
        )}
      </span>
    )
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800"
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  const getTypeIcon = () => {
    switch (result.type) {
      case 'product':
        return <Package className="h-5 w-5" />
      case 'order':
        return <FileText className="h-5 w-5" />
      case 'customer':
        return <Users className="h-5 w-5" />
      case 'resource':
        return <File className="h-5 w-5" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (result.type === 'product' && result.metadata?.variants?.[0]) {
      const variant = result.metadata.variants[0]
      addToCart({
        productId: result.id,
        product: {
          id: result.id,
          name: result.title,
          sku: result.subtitle || '',
          category: result.metadata.category || '',
          subcategory: '',
          description: result.description || '',
          msrp: result.metadata.price,
          images: result.image ? [result.image] : [],
          pricing: {
            'tier-1': { price: result.metadata.price * 0.7, minQuantity: 1 },
            'tier-2': { price: result.metadata.price * 0.6, minQuantity: 1 },
            'tier-3': { price: result.metadata.price * 0.5, minQuantity: 1 }
          }
        },
        variantId: variant.id,
        variant: variant,
        quantity: 1,
        unitPrice: result.metadata.price * 0.6 // Apply default discount
      })
    }
  }

  // Product Result Card
  if (result.type === 'product') {
    if (viewMode === 'list') {
      return (
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex gap-4">
              {result.image && (
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={result.image}
                    alt={result.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={result.url} className="hover:text-primary">
                      <h3 className="font-semibold text-gray-900">
                        {highlightText(result.title)}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      SKU: {highlightText(result.subtitle || '')} • {result.metadata?.category}
                    </p>
                    {result.description && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {highlightText(result.description)}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatCurrency(result.metadata?.price || 0)}</p>
                    <p className="text-xs text-gray-500">MSRP</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    {result.metadata?.stock > 0 ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        In Stock ({result.metadata?.stock || 0})
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-red-100 text-red-800">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <Link href={result.url}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Link>
                    </Button>
                    <Button size="sm" onClick={handleQuickAddToCart}>
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    // Grid view for products
    return (
      <Card className="hover:shadow-lg transition-shadow h-full">
        <div className="aspect-square relative bg-gray-50">
          {result.image ? (
            <Image
              src={result.image}
              alt={result.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-16 w-16 text-gray-300" />
            </div>
          )}
          {result.metadata?.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="bg-red-600 text-white">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <Link href={result.url} className="hover:text-primary">
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {highlightText(result.title)}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            {highlightText(result.subtitle || '')}
          </p>
          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="font-bold text-lg">{formatCurrency(result.metadata?.price || 0)}</p>
              <p className="text-xs text-gray-500">MSRP</p>
            </div>
            <Button size="sm" onClick={handleQuickAddToCart}>
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Order Result Card
  if (result.type === 'order') {
    const statusIcons: Record<string, React.ReactElement> = {
      pending: <Clock className="h-4 w-4" />,
      processing: <Clock className="h-4 w-4" />,
      shipped: <Truck className="h-4 w-4" />,
      delivered: <CheckCircle className="h-4 w-4" />,
      cancelled: <AlertCircle className="h-4 w-4" />
    }
    const statusIcon = statusIcons[result.metadata?.status || 'pending'] || <Clock className="h-4 w-4" />

    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <Link href={result.url} className="hover:text-primary">
                  <h3 className="font-semibold text-gray-900">
                    Order #{highlightText(result.title)}
                  </h3>
                </Link>
                <Badge className={getStatusColor(result.metadata?.status || 'pending')}>
                  {statusIcon}
                  {result.metadata?.status || 'pending'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Date:</span>
                  <span className="ml-2 font-medium">{result.subtitle}</span>
                </div>
                <div>
                  <span className="text-gray-500">Total:</span>
                  <span className="ml-2 font-medium">{formatCurrency(result.metadata?.total || 0)}</span>
                </div>
              </div>
              {result.metadata?.items && (
                <p className="text-sm text-gray-600 mt-2">
                  {result.metadata.items.length} items
                </p>
              )}
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href={result.url}>
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Customer Result Card
  if (result.type === 'customer') {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-gray-400" />
                <Link href={result.url} className="hover:text-primary">
                  <h3 className="font-semibold text-gray-900">
                    {highlightText(result.title)}
                  </h3>
                </Link>
                <Badge className={getStatusColor(result.metadata?.status || 'active')}>
                  {result.metadata?.status || 'active'}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                Account: {highlightText(result.subtitle || '')}
              </p>
              {result.description && (
                <p className="text-sm text-gray-600 mt-1">{result.description}</p>
              )}
              {result.metadata?.creditLimit && (
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Credit: {formatCurrency(result.metadata.creditLimit)}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {result.metadata.type}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button size="sm" variant="outline" asChild>
                <Link href={result.url}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
              <Button size="sm" variant="ghost">
                <Phone className="h-4 w-4 mr-1" />
                Call
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Resource Result Card
  if (result.type === 'resource') {
    return (
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <File className="h-5 w-5 text-gray-400" />
                <h3 className="font-semibold text-gray-900">
                  {highlightText(result.title)}
                </h3>
                {result.metadata?.isNew && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    New
                  </Badge>
                )}
              </div>
              {result.subtitle && (
                <p className="text-sm text-gray-500">
                  Category: {highlightText(result.subtitle)}
                </p>
              )}
              {result.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {highlightText(result.description)}
                </p>
              )}
              {result.metadata?.fileSize && (
                <p className="text-xs text-gray-500 mt-2">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {result.metadata.updatedAt} • {result.metadata.fileSize}
                </p>
              )}
            </div>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default card
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {getTypeIcon()}
          <div className="flex-1">
            <Link href={result.url} className="hover:text-primary">
              <h3 className="font-semibold">{highlightText(result.title)}</h3>
            </Link>
            {result.subtitle && (
              <p className="text-sm text-gray-500">{highlightText(result.subtitle)}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}