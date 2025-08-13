'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, Save, Plus, Trash2, Search, X,
  Package, Users, Settings, History, AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Catalog } from '@/types/catalog-types'
import { getProducts, getCompanies, Product } from '@/lib/mock-data'
import { Input as UiInput } from '@/components/ui/input'

interface CatalogDetail extends Catalog {
  assignedCompanies: any[]
  availableProducts: Product[]
}

export default function CatalogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [catalog, setCatalog] = useState<CatalogDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('details')
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: [] as string[]
  })
  const [searchProduct, setSearchProduct] = useState('')
  const [searchCompany, setSearchCompany] = useState('')
  const [productQuery, setProductQuery] = useState('')
  const [companyQuery, setCompanyQuery] = useState('')

  useEffect(() => {
    loadCatalog()
  }, [params.id])

  const loadCatalog = async () => {
    try {
      // Load catalog data
      const catalogResponse = await fetch('/mockdata/company-catalogs.json')
      const catalogData = await catalogResponse.json()
      const foundCatalog = catalogData.catalogs.find((c: Catalog) => c.id === params.id)
      
      if (!foundCatalog) {
        toast.error('Catalog not found')
        router.push('/admin/catalogs')
        return
      }
      
      // Load companies and products
      const companies = await getCompanies()
      const products = await getProducts()
      
      // Get assigned companies
      const assignedCompanies = companies.filter((c: any) => 
        foundCatalog.companyIds?.includes(c.id)
      )
      
      const catalogDetail: CatalogDetail = {
        ...foundCatalog,
        assignedCompanies,
        availableProducts: products
      }
      
      setCatalog(catalogDetail)
      setFormData({
        name: foundCatalog.name,
        description: foundCatalog.description || '',
        features: foundCatalog.features || []
      })
      
    } catch (error) {
      console.error('Error loading catalog:', error)
      toast.error('Failed to load catalog')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // In production, save to API
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Catalog saved successfully')
    } catch (error) {
      toast.error('Failed to save catalog')
    } finally {
      setSaving(false)
    }
  }

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const addProductInclusion = (productId: string) => {
    if (!catalog) return
    
    setCatalog(prev => prev ? {
      ...prev,
      productInclusions: [...(prev.productInclusions || []), productId]
    } : null)
  }

  const removeProductInclusion = (productId: string) => {
    if (!catalog) return
    
    setCatalog(prev => prev ? {
      ...prev,
      productInclusions: prev.productInclusions?.filter(id => id !== productId) || []
    } : null)
  }

  const addCompanyAssignment = (companyId: string) => {
    if (!catalog) return
    
    setCatalog(prev => prev ? {
      ...prev,
      companyIds: [...(prev.companyIds || []), companyId]
    } : null)
  }

  const removeCompanyAssignment = (companyId: string) => {
    if (!catalog) return
    
    setCatalog(prev => prev ? {
      ...prev,
      companyIds: prev.companyIds?.filter(id => id !== companyId) || []
    } : null)
  }

  if (loading) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading catalog...</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  if (!catalog) {
    return (
      <AuthenticatedLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Catalog not found</p>
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/admin/catalogs">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{catalog.name}</h1>
              <p className="text-gray-600">Catalog ID: {catalog.id}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/admin/catalogs')}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Catalog Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Features</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.features.includes('early-access')}
                        onCheckedChange={() => toggleFeature('early-access')}
                      />
                      <Label className="font-normal">Early Access to New Products</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.features.includes('exclusive-products')}
                        onCheckedChange={() => toggleFeature('exclusive-products')}
                      />
                      <Label className="font-normal">Exclusive Product Lines</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.features.includes('custom-colors')}
                        onCheckedChange={() => toggleFeature('custom-colors')}
                      />
                      <Label className="font-normal">Custom Color Options</Label>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Default Catalog</Label>
                  <div className="mt-2">
                    <Switch checked={catalog.isDefault} />
                    <p className="text-sm text-gray-500 mt-1">
                      Default catalogs are assigned to new companies automatically
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Rules</CardTitle>
                <CardDescription>
                  Configure which products are included or excluded from this catalog
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product picker */}
                <div className="space-y-2">
                  <Label>Add products by ID or search</Label>
                  <div className="flex gap-2">
                    <UiInput
                      placeholder="Search products..."
                      value={productQuery}
                      onChange={(e) => setProductQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        const found = catalog.availableProducts.find(p => p.id === productQuery || p.sku === productQuery)
                        if (found) {
                          addProductInclusion(found.id)
                          setProductQuery('')
                        } else {
                          toast.info('Enter an exact Product ID or SKU; type-ahead coming next.')
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Inclusion Rules</Label>
                  <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                    {catalog.productInclusions?.includes('all') ? (
                      <Badge variant="default">All Products Included</Badge>
                    ) : catalog.productInclusions?.includes('closeout') ? (
                      <Badge variant="secondary">Closeout Products Only</Badge>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          {catalog.productInclusions?.length || 0} specific products included
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label>Excluded Products</Label>
                  <div className="mt-2">
                    {catalog.productExclusions?.length > 0 ? (
                      <div className="space-y-2">
                        {catalog.productExclusions.map(productId => (
                          <div key={productId} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{productId}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeProductInclusion(productId)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No products excluded</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Category Rules</Label>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Included Categories</p>
                      {catalog.categoryInclusions?.includes('all') ? (
                        <Badge variant="outline">All Categories</Badge>
                      ) : (
                        <p className="text-sm text-gray-500">
                          {catalog.categoryInclusions?.length || 0} categories
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Excluded Categories</p>
                      <p className="text-sm text-gray-500">
                        {catalog.categoryExclusions?.length || 0} categories
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assigned Companies</CardTitle>
                <CardDescription>
                  {catalog.assignedCompanies.length} companies using this catalog
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search companies..."
                      value={searchCompany}
                      onChange={(e) => setSearchCompany(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Company picker */}
                  <div className="flex gap-2">
                    <UiInput
                      placeholder="Enter Company ID to assign"
                      value={companyQuery}
                      onChange={(e) => setCompanyQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (!companyQuery) return
                        addCompanyAssignment(companyQuery)
                        setCompanyQuery('')
                      }}
                    >
                      Assign
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {catalog.assignedCompanies.map(company => (
                      <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-sm text-gray-500">
                            {company.pricingTier.replace('-', ' ').toUpperCase()} • {company.region}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeCompanyAssignment(company.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    
                    {catalog.assignedCompanies.length === 0 && (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No companies assigned</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Company
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modification History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3 pb-3 border-b">
                    <History className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Catalog created</p>
                      <p className="text-xs text-gray-500">January 1, 2024 • Admin User</p>
                    </div>
                  </div>
                  <div className="flex gap-3 pb-3 border-b">
                    <Settings className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Features updated</p>
                      <p className="text-xs text-gray-500">January 15, 2024 • Admin User</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">2 companies assigned</p>
                      <p className="text-xs text-gray-500">January 20, 2024 • Admin User</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AuthenticatedLayout>
  )
}