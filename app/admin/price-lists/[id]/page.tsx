"use client"

/**
 * @fileoverview Admin Price List detail page with editor and calculator preview.
 * @description Loads a price list from mock data, allows editing rules, and previews pricing for a product.
 */

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AuthenticatedLayout } from "@/components/layout/authenticated-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { toast } from "sonner"
import { resolveDataUrl } from "@/lib/mock-data"

type VolumeBreak = { minQty: number; price: number }
type Rule = { id: string; productId: string; basePrice?: number; volumeBreaks: VolumeBreak[] }
type PriceList = { id: string; name: string; description?: string; rules: Rule[] }

export default function AdminPriceListDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [priceList, setPriceList] = useState<PriceList | null>(null)
  const [saving, setSaving] = useState(false)
  const [productId, setProductId] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(resolveDataUrl('/mockdata/price-lists.json'))
        const data = await res.json()
        const list = data.priceLists.find((pl: PriceList) => pl.id === params.id)
        if (!list) {
          toast.error('Price list not found')
          router.push('/admin/price-lists')
          return
        }
        setPriceList(list)
      } catch (e) {
        toast.error('Failed to load price list')
      }
    }
    load()
  }, [params.id, router])

  const calculatedPrice = useMemo(() => {
    if (!priceList || !productId) return null
    const rule = priceList.rules.find(r => r.productId === productId)
    if (!rule) return null
    const sorted = [...(rule.volumeBreaks || [])].sort((a, b) => b.minQty - a.minQty)
    const match = sorted.find(vb => quantity >= vb.minQty)
    if (match) return match.price
    return rule.basePrice ?? null
  }, [priceList, productId, quantity])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    toast.success('Saved (mock)')
  }

  if (!priceList) {
    return (
      <AuthenticatedLayout>
        <div className="p-6">Loading...</div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout>
      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{priceList.name}</h1>
            {priceList.description && (
              <p className="text-sm text-muted-foreground">{priceList.description}</p>
            )}
          </div>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </div>

        <Tabs defaultValue="rules">
          <TabsList className="grid grid-cols-2 w-full md:w-auto">
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="rules">
            <Card>
              <CardHeader>
                <CardTitle>Rules</CardTitle>
                <CardDescription>Simple inline editor (mock)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {priceList.rules.map(rule => (
                  <div key={rule.id} className="border rounded p-4 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label>Product ID</Label>
                        <Input value={rule.productId} readOnly />
                      </div>
                      <div>
                        <Label>Base Price</Label>
                        <Input type="number" step="0.01" value={rule.basePrice ?? ''} onChange={e => {
                          const v = e.target.value ? Number(e.target.value) : undefined
                          setPriceList(pl => pl ? ({...pl, rules: pl.rules.map(r => r.id === rule.id ? { ...r, basePrice: v } : r)}) : pl)
                        }} />
                      </div>
                    </div>
                    <div>
                      <Label>Volume Breaks</Label>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                        {rule.volumeBreaks.map((vb, idx) => (
                          <div key={idx} className="flex gap-2">
                            <Input type="number" value={vb.minQty} onChange={e => {
                              const val = Number(e.target.value)
                              setPriceList(pl => pl ? ({...pl, rules: pl.rules.map(r => r.id === rule.id ? { ...r, volumeBreaks: r.volumeBreaks.map((x,i) => i===idx ? { ...x, minQty: val } : x) } : r)}) : pl)
                            }} />
                            <Input type="number" step="0.01" value={vb.price} onChange={e => {
                              const val = Number(e.target.value)
                              setPriceList(pl => pl ? ({...pl, rules: pl.rules.map(r => r.id === rule.id ? { ...r, volumeBreaks: r.volumeBreaks.map((x,i) => i===idx ? { ...x, price: val } : x) } : r)}) : pl)
                            }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Calculator</CardTitle>
                <CardDescription>Preview price for a product and quantity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Product</Label>
                    <Select value={productId} onValueChange={setProductId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {priceList.rules.map(r => (
                          <SelectItem key={r.productId} value={r.productId}>{r.productId}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Quantity</Label>
                    <Input type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Calculated Price</Label>
                    <Input readOnly value={calculatedPrice ?? ''} />
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

