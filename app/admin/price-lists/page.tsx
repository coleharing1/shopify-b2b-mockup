'use client'

import { useState, useEffect } from 'react'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Tag, DollarSign, TrendingUp, Users, Plus, Edit, 
  Trash2, Copy, Download, Upload, Search, Filter,
  ChevronRight, AlertCircle, FileSpreadsheet
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { PriceList, VolumeBreak } from '@/types/pricing-types'
import { getCompanies, formatCurrency } from '@/lib/mock-data'
import { formatTierLabel } from '@/lib/pricing-helpers'

interface PriceListWithStats extends PriceList {
  assignedCompanies: number
  totalRules: number
  lastModified: string
}

export default function AdminPriceListsPage() {
  const [priceLists, setPriceLists] = useState<PriceListWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'volume' | 'fixed' | 'global'>('all')
  const [showNewPriceList, setShowNewPriceList] = useState(false)

  useEffect(() => {
    loadPriceLists()
  }, [])

  const loadPriceLists = async () => {
    try {
      // Load price lists from mockdata
      const response = await fetch('/mockdata/price-lists.json')
      const data = await response.json()
      
      // Load companies to get assignment counts
      const companies = await getCompanies()
      
      // Enhance price lists with stats
      const enhancedPriceLists: PriceListWithStats[] = data.priceLists.map((priceList: PriceList) => {
        const assignedCompanies = data.assignments.filter((a: any) => 
          a.priceListId === priceList.id
        ).length
        
        return {
          ...priceList,
          assignedCompanies,
          totalRules: priceList.rules?.length || 0,
          lastModified: new Date().toISOString()
        }
      })
      
      setPriceLists(enhancedPriceLists)
    } catch (error) {
      console.error('Error loading price lists:', error)
      toast.error('Failed to load price lists')
    } finally {
      setLoading(false)
    }
  }

  const clonePriceList = (priceListId: string) => {
    const priceList = priceLists.find(p => p.id === priceListId)
    if (!priceList) return

    const newPriceList: PriceListWithStats = {
      ...priceList,
      id: `pricelist-${Date.now()}`,
      name: `${priceList.name} (Copy)`,
      assignedCompanies: 0,
      lastModified: new Date().toISOString()
    }

    setPriceLists([...priceLists, newPriceList])
    toast.success(`Cloned ${priceList.name}`)
  }

  const deletePriceList = (priceListId: string) => {
    const priceList = priceLists.find(p => p.id === priceListId)
    if (!priceList) return

    if (priceList.assignedCompanies > 0) {
      toast.error('Cannot delete price list with assigned companies')
      return
    }

    setPriceLists(priceLists.filter(p => p.id !== priceListId))
    toast.success('Price list deleted')
  }

  const exportPriceList = (priceListId: string) => {
    const priceList = priceLists.find(p => p.id === priceListId)
    if (!priceList) return

    // In production, this would generate and download a CSV
    toast.success(`Exported ${priceList.name} to CSV`)
  }

  const filteredPriceLists = priceLists.filter(priceList => {
    const matchesSearch = searchTerm === '' || 
      priceList.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      priceList.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === 'all' ||
      (filterType === 'volume' && priceList.rules?.some(r => r.volumeBreaks && r.volumeBreaks.length > 0)) ||
      (filterType === 'fixed' && priceList.rules?.some(r => r.fixedPrice)) ||
      (filterType === 'global' && (priceList as any).globalDiscount)
    
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading price lists...</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Price List Management</h1>
            <p className="text-gray-600">Configure custom pricing rules and volume discounts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button asChild>
              <Link href="/admin/price-lists/new">
                <Plus className="h-4 w-4 mr-2" />
                New Price List
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Price Lists</p>
                  <p className="text-2xl font-bold">{priceLists.length}</p>
                </div>
                <Tag className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Companies Assigned</p>
                  <p className="text-2xl font-bold">
                    {priceLists.reduce((sum, p) => sum + p.assignedCompanies, 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Rules</p>
                  <p className="text-2xl font-bold">
                    {priceLists.reduce((sum, p) => sum + p.totalRules, 0)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Volume Discounts</p>
                  <p className="text-2xl font-bold">
                    {priceLists.filter(p => p.rules?.some(r => r.volumeBreaks?.length > 0)).length}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search price lists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'volume' ? 'default' : 'outline'}
                  onClick={() => setFilterType('volume')}
                >
                  Volume
                </Button>
                <Button
                  variant={filterType === 'fixed' ? 'default' : 'outline'}
                  onClick={() => setFilterType('fixed')}
                >
                  Fixed
                </Button>
                <Button
                  variant={filterType === 'global' ? 'default' : 'outline'}
                  onClick={() => setFilterType('global')}
                >
                  Global
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price Lists Table */}
        <Card>
          <CardHeader>
            <CardTitle>Price Lists</CardTitle>
            <CardDescription>
              Manage pricing rules and customer assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Price List</th>
                    <th className="text-center py-3 px-4">Rules</th>
                    <th className="text-center py-3 px-4">Companies</th>
                    <th className="text-center py-3 px-4">Discount Type</th>
                    <th className="text-center py-3 px-4">Status</th>
                    <th className="text-center py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPriceLists.map((priceList) => (
                    <tr key={priceList.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{priceList.name}</p>
                          {priceList.description && (
                            <p className="text-sm text-gray-500">{priceList.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant="secondary">{priceList.totalRules}</Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant="outline">{priceList.assignedCompanies}</Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex justify-center gap-1">
                          {priceList.rules?.some(r => r.volumeBreaks?.length > 0) && (
                            <Badge variant="outline" className="text-xs bg-blue-50">
                              Volume
                            </Badge>
                          )}
                          {priceList.rules?.some(r => r.fixedPrice) && (
                            <Badge variant="outline" className="text-xs bg-purple-50">
                              Fixed
                            </Badge>
                          )}
                          {(priceList as any).globalDiscount && (
                            <Badge variant="outline" className="text-xs bg-green-50">
                              Global {(((priceList as any).globalDiscount as number) * 100).toFixed(0)}%
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant="default">Active</Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                          >
                            <Link href={`/admin/price-lists/${priceList.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => clonePriceList(priceList.id)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => exportPriceList(priceList.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deletePriceList(priceList.id)}
                            disabled={priceList.assignedCompanies > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Strategies */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Strategies</CardTitle>
            <CardDescription>
              Common pricing configurations for different customer segments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium">Volume-Based Pricing</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Offer better prices as order quantities increase. Ideal for wholesale customers.
                    </p>
                    <div className="mt-3 space-y-1">
                      <div className="text-xs">
                        <span className="font-medium">1-24 units:</span> 30% off MSRP
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">25-49 units:</span> 35% off MSRP
                      </div>
                      <div className="text-xs">
                        <span className="font-medium">50+ units:</span> 40% off MSRP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <Tag className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-medium">Fixed Product Pricing</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Set specific prices for individual products. Perfect for negotiated deals.
                    </p>
                    <div className="mt-3">
                      <Badge variant="outline" className="text-xs">
                        Custom contracts
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium">Global Discounts</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Apply a percentage discount across all products for VIP customers.
                    </p>
                    <div className="mt-3">
                      <Badge variant="outline" className="text-xs">
                        5-15% additional off
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}