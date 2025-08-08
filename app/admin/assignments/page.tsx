'use client'

import { useState, useEffect } from 'react'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Users, Book, Tag, Link2, Plus, Save, Upload,
  Search, Filter, AlertCircle, CheckCircle2, History
} from 'lucide-react'
import { toast } from 'sonner'
import { getCompanies, formatCurrency } from '@/lib/mock-data'
import { formatTierLabel, getTierColorClasses } from '@/lib/pricing-helpers'
import { Catalog } from '@/types/catalog-types'
import { PriceList } from '@/types/pricing-types'

interface CompanyAssignment {
  id: string
  name: string
  pricingTier: string
  region: string
  catalog: {
    id: string
    name: string
  } | null
  priceList: {
    id: string
    name: string
  } | null
  lastModified: string
}

export default function AdminAssignmentsPage() {
  const [companies, setCompanies] = useState<CompanyAssignment[]>([])
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [priceLists, setPriceLists] = useState<PriceList[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTier, setFilterTier] = useState<'all' | 'tier-1' | 'tier-2' | 'tier-3'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'assigned' | 'unassigned'>('all')
  const [bulkAction, setBulkAction] = useState<'catalog' | 'pricelist' | null>(null)
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load companies
      const companiesData = await getCompanies()
      
      // Load catalogs
      const catalogResponse = await fetch('/mockdata/company-catalogs.json')
      const catalogData = await catalogResponse.json()
      setCatalogs(catalogData.catalogs)
      
      // Load price lists
      const priceListResponse = await fetch('/mockdata/price-lists.json')
      const priceListData = await priceListResponse.json()
      setPriceLists(priceListData.priceLists)
      
      // Create company assignments
      const assignments: CompanyAssignment[] = companiesData.map((company: any) => {
        // Find assigned catalog
        const assignedCatalog = catalogData.catalogs.find((c: Catalog) => 
          c.companyIds?.includes(company.id)
        )
        
        // Find assigned price list
        const assignment = priceListData.assignments.find((a: any) => 
          a.companyId === company.id
        )
        const assignedPriceList = assignment ? 
          priceListData.priceLists.find((p: PriceList) => p.id === assignment.priceListId) : 
          null
        
        return {
          id: company.id,
          name: company.name,
          pricingTier: company.pricingTier,
          region: company.region,
          catalog: assignedCatalog ? {
            id: assignedCatalog.id,
            name: assignedCatalog.name
          } : null,
          priceList: assignedPriceList ? {
            id: assignedPriceList.id,
            name: assignedPriceList.name
          } : null,
          lastModified: new Date().toISOString()
        }
      })
      
      setCompanies(assignments)
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load assignments')
    } finally {
      setLoading(false)
    }
  }

  const updateCompanyAssignment = (
    companyId: string, 
    type: 'catalog' | 'pricelist', 
    value: string
  ) => {
    setCompanies(prev => prev.map(company => {
      if (company.id === companyId) {
        if (type === 'catalog') {
          const catalog = catalogs.find(c => c.id === value)
          return {
            ...company,
            catalog: catalog ? { id: catalog.id, name: catalog.name } : null,
            lastModified: new Date().toISOString()
          }
        } else {
          const priceList = priceLists.find(p => p.id === value)
          return {
            ...company,
            priceList: priceList ? { id: priceList.id, name: priceList.name } : null,
            lastModified: new Date().toISOString()
          }
        }
      }
      return company
    }))
  }

  const handleBulkAssignment = async (type: 'catalog' | 'pricelist', value: string) => {
    if (selectedCompanies.length === 0) {
      toast.error('No companies selected')
      return
    }

    setSaving(true)
    try {
      // Update all selected companies
      setCompanies(prev => prev.map(company => {
        if (selectedCompanies.includes(company.id)) {
          if (type === 'catalog') {
            const catalog = catalogs.find(c => c.id === value)
            return {
              ...company,
              catalog: catalog ? { id: catalog.id, name: catalog.name } : null,
              lastModified: new Date().toISOString()
            }
          } else {
            const priceList = priceLists.find(p => p.id === value)
            return {
              ...company,
              priceList: priceList ? { id: priceList.id, name: priceList.name } : null,
              lastModified: new Date().toISOString()
            }
          }
        }
        return company
      }))
      
      toast.success(`Updated ${selectedCompanies.length} companies`)
      setSelectedCompanies([])
      setBulkAction(null)
    } catch (error) {
      toast.error('Failed to update assignments')
    } finally {
      setSaving(false)
    }
  }

  const saveAllChanges = async () => {
    setSaving(true)
    try {
      // In production, save to API
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('All assignments saved successfully')
    } catch (error) {
      toast.error('Failed to save assignments')
    } finally {
      setSaving(false)
    }
  }

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = searchTerm === '' || 
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTier = filterTier === 'all' || company.pricingTier === filterTier
    
    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'assigned' && (company.catalog || company.priceList)) ||
      (filterStatus === 'unassigned' && (!company.catalog || !company.priceList))
    
    return matchesSearch && matchesTier && matchesStatus
  })

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading assignments...</p>
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
            <h1 className="text-2xl font-bold">Catalog & Pricing Assignments</h1>
            <p className="text-gray-600">Manage catalog and price list assignments for all companies</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button onClick={saveAllChanges} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save All Changes'}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Companies</p>
                  <p className="text-2xl font-bold">{companies.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">With Catalogs</p>
                  <p className="text-2xl font-bold">
                    {companies.filter(c => c.catalog).length}
                  </p>
                </div>
                <Book className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">With Price Lists</p>
                  <p className="text-2xl font-bold">
                    {companies.filter(c => c.priceList).length}
                  </p>
                </div>
                <Tag className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Unassigned</p>
                  <p className="text-2xl font-bold">
                    {companies.filter(c => !c.catalog || !c.priceList).length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Bulk Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterTier} onValueChange={(v: any) => setFilterTier(v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="tier-1">Bronze</SelectItem>
                  <SelectItem value="tier-2">Silver</SelectItem>
                  <SelectItem value="tier-3">Gold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {selectedCompanies.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-800">
                    {selectedCompanies.length} companies selected
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setBulkAction('catalog')}>
                      Assign Catalog
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setBulkAction('pricelist')}>
                      Assign Price List
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedCompanies([])}>
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assignments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Company Assignments</CardTitle>
            <CardDescription>
              Click on dropdowns to change assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-center py-3 px-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedCompanies.length === filteredCompanies.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCompanies(filteredCompanies.map(c => c.id))
                          } else {
                            setSelectedCompanies([])
                          }
                        }}
                        className="rounded"
                      />
                    </th>
                    <th className="text-left py-3 px-4">Company</th>
                    <th className="text-center py-3 px-4">Tier</th>
                    <th className="text-center py-3 px-4">Region</th>
                    <th className="text-center py-3 px-4">Catalog</th>
                    <th className="text-center py-3 px-4">Price List</th>
                    <th className="text-center py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompanies.map((company) => (
                    <tr key={company.id} className="border-b hover:bg-gray-50">
                      <td className="text-center py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedCompanies.includes(company.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCompanies([...selectedCompanies, company.id])
                            } else {
                              setSelectedCompanies(selectedCompanies.filter(id => id !== company.id))
                            }
                          }}
                          className="rounded"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{company.name}</p>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge className={getTierColorClasses(company.pricingTier)}>
                          {formatTierLabel(company.pricingTier)}
                        </Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant="outline">{company.region}</Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Select 
                          value={company.catalog?.id || 'none'}
                          onValueChange={(value) => updateCompanyAssignment(company.id, 'catalog', value)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select catalog" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Catalog</SelectItem>
                            {catalogs.map(catalog => (
                              <SelectItem key={catalog.id} value={catalog.id}>
                                {catalog.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Select 
                          value={company.priceList?.id || 'none'}
                          onValueChange={(value) => updateCompanyAssignment(company.id, 'pricelist', value)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select price list" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No Price List</SelectItem>
                            {priceLists.map(priceList => (
                              <SelectItem key={priceList.id} value={priceList.id}>
                                {priceList.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="text-center py-3 px-4">
                        {company.catalog && company.priceList ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600 border-orange-300">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Incomplete
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Changes */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Assignment Changes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <History className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Premium Catalog assigned to 3 companies</p>
                  <p className="text-xs text-gray-500">2 hours ago • Admin User</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <History className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Volume Pricing list updated for Mountain Gear</p>
                  <p className="text-xs text-gray-500">Yesterday • Admin User</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <History className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">5 companies migrated to new pricing structure</p>
                  <p className="text-xs text-gray-500">3 days ago • System</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}