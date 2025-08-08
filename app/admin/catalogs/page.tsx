'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Book, Eye, EyeOff, Save, Plus, Edit, Trash2, 
  Package, Tag, DollarSign, Users, Search, Filter,
  ChevronRight, Copy, Settings
} from 'lucide-react'
import { toast } from 'sonner'
import { TIER_CONFIG, getTierLabel } from '@/config/order-types.config'
import Link from 'next/link'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Catalog } from '@/types/catalog-types'
import { getCompanies } from '@/lib/mock-data'

interface CatalogWithStats extends Catalog {
  assignedCompanies: number
  productCount: number
  lastModified: string
}

export default function AdminCatalogsPage() {
  const [catalogs, setCatalogs] = useState<CatalogWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')

  useEffect(() => {
    fetchCatalogs()
  }, [])

  const fetchCatalogs = async () => {
    try {
      // Load catalogs from mockdata
      const catalogResponse = await fetch('/mockdata/company-catalogs.json')
      const catalogData = await catalogResponse.json()
      
      // Load companies to get assignment counts
      const companies = await getCompanies()
      
      // Enhance catalogs with stats
      const enhancedCatalogs: CatalogWithStats[] = catalogData.catalogs.map((catalog: Catalog) => {
        const assignedCompanies = companies.filter((c: any) => 
          catalog.companyIds?.includes(c.id)
        ).length
        
        // Calculate product count based on inclusions/exclusions
        let productCount = 0
        if (catalog.productInclusions?.includes('all')) {
          productCount = 150 // Approximate total products
        } else if (catalog.productInclusions?.includes('closeout')) {
          productCount = 25 // Approximate closeout products
        } else {
          productCount = catalog.productInclusions?.length || 0
        }
        productCount -= catalog.productExclusions?.length || 0
        
        return {
          ...catalog,
          assignedCompanies,
          productCount,
          lastModified: new Date().toISOString()
        }
      })
      setCatalogs(enhancedCatalogs)
    } catch (error) {
      console.error('Error fetching catalogs:', error)
      toast.error('Failed to load catalogs')
    } finally {
      setLoading(false)
    }
  }

  const cloneCatalog = async (catalogId: string) => {
    const catalog = catalogs.find(c => c.id === catalogId)
    if (!catalog) return

    const newCatalog: CatalogWithStats = {
      ...catalog,
      id: `catalog-${Date.now()}`,
      name: `${catalog.name} (Copy)`,
      companyIds: [],
      assignedCompanies: 0,
      lastModified: new Date().toISOString()
    }

    setCatalogs([...catalogs, newCatalog])
    toast.success(`Cloned ${catalog.name}`)
  }

  const deleteCatalog = (catalogId: string) => {
    const catalog = catalogs.find(c => c.id === catalogId)
    if (!catalog) return

    if (catalog.assignedCompanies > 0) {
      toast.error('Cannot delete catalog with assigned companies')
      return
    }

    setCatalogs(catalogs.filter(c => c.id !== catalogId))
    toast.success('Catalog deleted')
  }

  const filteredCatalogs = catalogs.filter(catalog => {
    const matchesSearch = searchTerm === '' || 
      catalog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      catalog.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'active' && catalog.isDefault) ||
      (filterStatus === 'inactive' && !catalog.isDefault)
    
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading catalogs...</p>
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
          <h1 className="text-2xl font-bold">Catalog Management</h1>
          <p className="text-gray-600">Manage product catalogs and company assignments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/price-lists">
              <Tag className="h-4 w-4 mr-2" />
              Price Lists
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/catalogs/new">
              <Plus className="h-4 w-4 mr-2" />
              New Catalog
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
                <p className="text-sm text-gray-500">Total Catalogs</p>
                <p className="text-2xl font-bold">{catalogs.length}</p>
              </div>
              <Book className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Companies Assigned</p>
                <p className="text-2xl font-bold">
                  {catalogs.reduce((sum, c) => sum + c.assignedCompanies, 0)}
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
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold">
                  {catalogs.reduce((sum, c) => sum + c.productCount, 0)}
                </p>
              </div>
              <Package className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Default Catalog</p>
                <p className="text-2xl font-bold">
                  {catalogs.filter(c => c.isDefault).length}
                </p>
              </div>
              <Settings className="h-8 w-8 text-orange-500" />
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
                placeholder="Search catalogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
              >
                Active
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('inactive')}
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Catalogs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Catalogs</CardTitle>
          <CardDescription>
            Manage product catalogs and their company assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Catalog</th>
                  <th className="text-center py-3 px-4">Products</th>
                  <th className="text-center py-3 px-4">Companies</th>
                  <th className="text-center py-3 px-4">Features</th>
                  <th className="text-center py-3 px-4">Type</th>
                  <th className="text-center py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCatalogs.map((catalog) => (
                  <tr key={catalog.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{catalog.name}</p>
                        {catalog.description && (
                          <p className="text-sm text-gray-500">{catalog.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="secondary">{catalog.productCount}</Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="outline">{catalog.assignedCompanies}</Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex justify-center gap-1">
                        {catalog.features?.includes('early-access') && (
                          <Badge variant="outline" className="text-xs bg-blue-50">
                            Early Access
                          </Badge>
                        )}
                        {catalog.features?.includes('exclusive-products') && (
                          <Badge variant="outline" className="text-xs bg-purple-50">
                            Exclusive
                          </Badge>
                        )}
                        {catalog.features?.includes('custom-colors') && (
                          <Badge variant="outline" className="text-xs bg-indigo-50">
                            Custom
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge 
                        variant={catalog.isDefault ? "default" : "secondary"}
                      >
                        {catalog.isDefault ? 'Default' : 'Custom'}
                      </Badge>
                    </td>
                    <td className="text-center py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          asChild
                        >
                          <Link href={`/admin/catalogs/${catalog.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => cloneCatalog(catalog.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteCatalog(catalog.id)}
                          disabled={catalog.assignedCompanies > 0}
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

      {/* Catalog Types */}
      <Card>
        <CardHeader>
          <CardTitle>Catalog Types</CardTitle>
          <CardDescription>
            Different catalog configurations for customer segments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Book className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <p className="font-medium">Standard Catalog</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Default catalog with core products. Suitable for new or small accounts.
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">150+ Products</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Book className="h-5 w-5 text-purple-600 mt-1" />
                <div>
                  <p className="font-medium">Premium Catalog</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Expanded selection with exclusive lines and early access to new products.
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">250+ Products</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Book className="h-5 w-5 text-green-600 mt-1" />
                <div>
                  <p className="font-medium">Custom Catalog</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Tailored selection based on customer needs and purchasing history.
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">Varies</Badge>
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