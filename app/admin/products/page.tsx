'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Plus, Search, Filter, Upload, Download } from "lucide-react"
import ProductBulkEditor from './bulk-editor'
import { Checkbox } from '@/components/ui/checkbox'
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { getProducts, type Product } from "@/lib/mock-data"
import { formatCurrency } from "@/lib/utils"
import TagBulkEditor from "./tag-bulk"

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [orderType, setOrderType] = useState<string>('all')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [bulkOpen, setBulkOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await getProducts()
      setProducts(data)
      setLoading(false)
    }
    load()
  }, [])

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category).filter(Boolean))).sort(), [products])

  const filtered = useMemo(() => {
    let list = [...products]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      )
    }
    if (category !== 'all') list = list.filter(p => p.category === category)
    if (orderType !== 'all') list = list.filter(p => p.orderTypes?.includes(orderType as any))
    return list
  }, [products, searchQuery, category, orderType])

  const allVisibleSelected = useMemo(() => filtered.length > 0 && filtered.every(p => selected.has(p.id)), [filtered, selected])
  const toggleSelectAllVisible = () => {
    const next = new Set(selected)
    if (allVisibleSelected) {
      filtered.forEach(p => next.delete(p.id))
    } else {
      filtered.forEach(p => next.add(p.id))
    }
    setSelected(next)
  }
  const toggleOne = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  return (
    <AuthenticatedLayout>
      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Package className="h-6 w-6" />
              Product Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Using scraped products when available (falls back to products.json)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
            <CardDescription>{filtered.length} of {products.length} products</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger>
                  <SelectValue placeholder="Order Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="at-once">At Once</SelectItem>
                  <SelectItem value="prebook">Prebook</SelectItem>
                  <SelectItem value="closeout">Closeout</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <Button variant="secondary" disabled={selected.size === 0} onClick={() => setBulkOpen(true)}>
                  Bulk Edit ({selected.size})
                </Button>
                {selected.size > 0 && (
                  <Button variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium w-10">
                      <input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAllVisible} />
                    </th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Product</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">SKU</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Category</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">MSRP</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">COGS</th>
                    <th className="text-left px-4 py-3 text-sm font-medium">Order Types</th>
                    <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr><td className="px-4 py-6" colSpan={8}>Loading...</td></tr>
                  ) : filtered.map(p => (
                    <tr className="hover:bg-gray-50" key={p.id}>
                      <td className="px-4 py-3 align-top">
                        <input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleOne(p.id)} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-gray-200 rounded overflow-hidden">
                            {p.images?.[0] && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.images[0]} alt="" className="h-10 w-10 object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{p.name}</p>
                            <p className="text-sm text-muted-foreground">{p.description?.slice(0, 60)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{p.sku}</td>
                      <td className="px-4 py-3 text-sm">{p.category}</td>
                      <td className="px-4 py-3 text-sm">{formatCurrency(p.msrp)}</td>
                      <td className="px-4 py-3 text-sm">{p.cogs ? formatCurrency(p.cogs) : '-'}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-1 flex-wrap">
                          {(p.orderTypes || ['at-once']).map(ot => (
                            <Badge key={ot} variant="secondary">{ot}</Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button size="sm" variant="outline" onClick={() => window.location.href = `/admin/products/${p.id}`}>Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selected.size > 0 && (
              <div className="p-4 border-t bg-muted/40 flex items-center justify-between">
                <p className="text-sm">{selected.size} selected</p>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setBulkOpen(true)}>Bulk Edit</Button>
                  <Button variant="ghost" onClick={() => setSelected(new Set())}>Clear Selection</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bulk tags */}
        <TagBulkEditor />

        {/* Bulk editor modal */}
        <ProductBulkEditor
          isOpen={bulkOpen}
          onClose={() => setBulkOpen(false)}
          selectedIds={Array.from(selected)}
          onApplied={async () => {
            // Reload products after bulk apply
            setLoading(true)
            const data = await getProducts()
            setProducts(data)
            setLoading(false)
          }}
        />
      </div>
    </AuthenticatedLayout>
  )
}