'use client'

/**
 * @fileoverview Admin bulk tag editor for products.
 * @description Simple UI to add/remove/replace tags in bulk via the in-memory tags API.
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

type Operation = {
  productId: string
  add?: string[]
  remove?: string[]
  replace?: string[]
}

export default function TagBulkEditor() {
  const [productIds, setProductIds] = useState('')
  const [addTags, setAddTags] = useState('')
  const [removeTags, setRemoveTags] = useState('')
  const [replaceTags, setReplaceTags] = useState('')
  const [loading, setLoading] = useState(false)

  const toList = (s: string) => s.split(',').map(v => v.trim()).filter(Boolean)

  const submit = async () => {
    const ids = toList(productIds)
    if (ids.length === 0) {
      toast.error('Enter at least one product ID')
      return
    }
    const add = toList(addTags)
    const remove = toList(removeTags)
    const replace = toList(replaceTags)
    const ops: Operation[] = ids.map(id => ({ productId: id, ...(add.length?{add}:{}), ...(remove.length?{remove}:{}), ...(replace.length?{replace}:{}) }))
    setLoading(true)
    const res = await fetch('/api/products/tags', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ operations: ops }) })
    setLoading(false)
    if (!res.ok) { toast.error('Failed to update tags'); return }
    const data = await res.json()
    toast.success(`Updated ${data.updated} products`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Tag Editor</CardTitle>
        <CardDescription>Add, remove, or replace tags across multiple products</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Product IDs (comma separated)</label>
          <Textarea rows={2} value={productIds} onChange={e => setProductIds(e.target.value)} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm mb-1">Add Tags</label>
            <Input placeholder="e.g. evergreen,bestseller" value={addTags} onChange={e => setAddTags(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Remove Tags</label>
            <Input placeholder="e.g. closeout" value={removeTags} onChange={e => setRemoveTags(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Replace Tags</label>
            <Input placeholder="e.g. prebook,summer" value={replaceTags} onChange={e => setReplaceTags(e.target.value)} />
          </div>
        </div>
        <Button onClick={submit} disabled={loading}>{loading ? 'Saving...' : 'Apply Changes'}</Button>
      </CardContent>
    </Card>
  )
}


