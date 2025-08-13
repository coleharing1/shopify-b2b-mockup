'use client'

/**
 * @fileoverview Admin product detail for variant management (demo overrides).
 */

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getProducts, type Product } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function AdminProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [name, setName] = useState('')
  const [msrp, setMsrp] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const load = async () => {
      const all = await getProducts()
      const p = all.find(p => p.id === params.id)
      if (!p) { toast.error('Product not found'); router.push('/admin/products'); return }
      setProduct(p)
      setName(p.name)
      setMsrp(String(p.msrp))
      setDescription(p.description)
    }
    load()
  }, [params.id, router])

  const saveFields = async () => {
    const body = { productIds: [product!.id], updates: { name, msrp: Number(msrp), description } }
    const res = await fetch('/api/products/bulk', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
    if (!res.ok) { toast.error('Failed to save'); return }
    toast.success('Saved (override)')
  }

  const addVariant = async () => {
    const body = { productId: product!.id, add: [{ color: 'New', size: 'One Size', sku: `${product!.sku}-NEW`, inventory: 0 }] }
    const res = await fetch('/api/products/variants', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
    if (!res.ok) { toast.error('Failed to add variant'); return }
    toast.success('Variant added (override)')
  }

  if (!product) return (
    <AuthenticatedLayout>
      <div className="p-6">Loading...</div>
    </AuthenticatedLayout>
  )

  return (
    <AuthenticatedLayout>
      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Product</CardTitle>
            <CardDescription>Fields save as demo overrides</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm mb-1">MSRP</label>
                <Input type="number" value={msrp} onChange={e => setMsrp(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <Textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <Button onClick={saveFields}>Save</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
            <CardDescription>Add/edit/remove variants (overrides)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 text-sm">ID</th>
                    <th className="text-left px-3 py-2 text-sm">Color</th>
                    <th className="text-left px-3 py-2 text-sm">Size</th>
                    <th className="text-left px-3 py-2 text-sm">SKU</th>
                    <th className="text-left px-3 py-2 text-sm">Inventory</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {product.variants?.map(v => (
                    <tr key={v.id}>
                      <td className="px-3 py-2 text-sm">{v.id}</td>
                      <td className="px-3 py-2 text-sm">{v.color}</td>
                      <td className="px-3 py-2 text-sm">{v.size}</td>
                      <td className="px-3 py-2 text-sm">{v.sku}</td>
                      <td className="px-3 py-2 text-sm">{v.inventory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button variant="outline" onClick={addVariant}>Add Variant</Button>
          </CardContent>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}


