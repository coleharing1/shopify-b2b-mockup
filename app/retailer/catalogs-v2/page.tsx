"use client"

/**
 * @fileoverview Enhanced catalog selection inspired by LaCrosse B2B platform
 * @description Visual catalog cards with clear category organization and order types
 */

import { useState, useEffect } from "react"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  Package, 
  Clock, 
  Zap, 
  Calendar,
  ArrowRight,
  Filter,
  Grid,
  List
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface Catalog {
  id: string
  name: string
  type: 'at-once' | 'prebook' | 'closeout'
  description: string
  image: string
  productCount: number
  status: 'active' | 'coming-soon' | 'ended'
  availableUntil?: string
  features: string[]
  minimumOrder?: number
  estimatedShip?: string
}

export default function CatalogsV2() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [catalogs, setCatalogs] = useState<Catalog[]>([
    {
      id: 'at-once-danner-lacrosse',
      name: 'At Once Catalog - Danner & LaCrosse',
      type: 'at-once',
      description: 'Professional work boots and outdoor footwear available for immediate shipping',
      image: '/images/catalogs/at-once-catalog.jpg',
      productCount: 984,
      status: 'active',
      features: ['Immediate shipping', 'No minimums', 'Year-round availability'],
      estimatedShip: '1-3 business days'
    },
    {
      id: 'closeout-danner-lacrosse',
      name: 'Closeout Deals - Danner & LaCrosse',
      type: 'closeout',
      description: 'Discounted professional footwear and gear at special pricing',
      image: '/images/catalogs/closeout-catalog.jpg',
      productCount: 156,
      status: 'active',
      availableUntil: '2025-03-15',
      features: ['Up to 40% off', 'Limited quantities', 'Final sale'],
      estimatedShip: '2-5 business days'
    },
    {
      id: 'preseason-danner-lacrosse',
      name: 'Preseason Catalog - Danner & LaCrosse',
      type: 'prebook',
      description: 'Pre-order upcoming seasonal collections with guaranteed availability',
      image: '/images/catalogs/preseason-catalog.jpg',
      productCount: 425,
      status: 'active',
      availableUntil: '2025-02-28',
      features: ['Early access', 'Guaranteed inventory', 'Volume discounts'],
      minimumOrder: 50,
      estimatedShip: 'Spring 2025'
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const filteredCatalogs = catalogs.filter(catalog => {
    const matchesSearch = !searchTerm || 
      catalog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      catalog.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || catalog.type === selectedType
    
    return matchesSearch && matchesType
  })

  const handleCatalogSelect = (catalog: Catalog) => {
    switch (catalog.type) {
      case 'at-once':
        router.push('/retailer/at-once')
        break
      case 'prebook':
        router.push('/retailer/prebook')
        break
      case 'closeout':
        router.push('/retailer/closeouts')
        break
      default:
        router.push('/retailer/products')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'at-once':
        return <Zap className="h-4 w-4" />
      case 'prebook':
        return <Calendar className="h-4 w-4" />
      case 'closeout':
        return <Clock className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'at-once':
        return 'bg-blue-500'
      case 'prebook':
        return 'bg-green-500'
      case 'closeout':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusBadge = (catalog: Catalog) => {
    switch (catalog.status) {
      case 'active':
        return <Badge className="bg-green-500 text-white">Active</Badge>
      case 'coming-soon':
        return <Badge variant="secondary">Coming Soon</Badge>
      case 'ended':
        return <Badge variant="outline">Ended</Badge>
      default:
        return null
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Product Catalogs</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our professional collections designed for your business needs
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search catalogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-64"
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant={selectedType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('all')}
              >
                All
              </Button>
              <Button
                variant={selectedType === 'at-once' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('at-once')}
                className="gap-2"
              >
                <Zap className="h-4 w-4" />
                At Once
              </Button>
              <Button
                variant={selectedType === 'prebook' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('prebook')}
                className="gap-2"
              >
                <Calendar className="h-4 w-4" />
                Prebook
              </Button>
              <Button
                variant={selectedType === 'closeout' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedType('closeout')}
                className="gap-2"
              >
                <Clock className="h-4 w-4" />
                Closeout
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {filteredCatalogs.length} catalog{filteredCatalogs.length !== 1 ? 's' : ''}
            </span>
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Catalogs Grid */}
        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
            : 'space-y-6'
          }
        `}>
          {filteredCatalogs.map(catalog => (
            <Card 
              key={catalog.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg"
              onClick={() => handleCatalogSelect(catalog)}
            >
              <div className="relative overflow-hidden">
                {/* Background Image */}
                <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  {/* Placeholder pattern - in real app would use actual images */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 opacity-90" />
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
                  
                  {/* Type indicator */}
                  <div className={`absolute top-4 left-4 w-12 h-12 ${getTypeColor(catalog.type)} rounded-full flex items-center justify-center text-white`}>
                    {getTypeIcon(catalog.type)}
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    {getStatusBadge(catalog)}
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">
                      {catalog.name}
                    </h2>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="p-6 space-y-4">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {catalog.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {catalog.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>{catalog.productCount.toLocaleString()} products</span>
                    </div>
                    {catalog.estimatedShip && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{catalog.estimatedShip}</span>
                      </div>
                    )}
                    {catalog.minimumOrder && (
                      <div className="flex items-center gap-1">
                        <span>Min: {catalog.minimumOrder} units</span>
                      </div>
                    )}
                  </div>

                  {/* Availability */}
                  {catalog.availableUntil && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-orange-800 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>Available until {new Date(catalog.availableUntil).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}

                  {/* Action */}
                  <Button className="w-full group-hover:bg-blue-600 transition-colors">
                    Browse Catalog
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCatalogs.length === 0 && (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No catalogs found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <Button onClick={() => { setSearchTerm(''); setSelectedType('all') }}>
              Clear filters
            </Button>
          </div>
        )}

        {/* Help Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-blue-900">Need Help?</h3>
              <p className="text-blue-700">
                Contact your sales representative for personalized catalog recommendations
              </p>
              <Button variant="outline" className="mt-4">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}
