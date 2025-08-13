"use client"

/**
 * @fileoverview Admin Bulk Editor modal for products (Shopify-style).
 * @description Select fields to edit, apply values to selected products via /api/products/bulk.
 */

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import type { Product } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

type Props = {
  isOpen: boolean
  onClose: () => void
  selectedIds: string[]
  onApplied?: () => void
}

type EditableField = 'name' | 'category' | 'msrp' | 'cogs' | 'orderTypes' | 'description' | 'tags'

export default function ProductBulkEditor({ isOpen, onClose, selectedIds, onApplied }: Props) {
  const [fields, setFields] = useState<EditableField[]>(['msrp'])
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [msrp, setMsrp] = useState('')
  const [cogs, setCogs] = useState('')
  const [orderTypes, setOrderTypes] = useState<string>('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [saving, setSaving] = useState(false)

  const has = (f: EditableField) => fields.includes(f)
  const toggle = (f: EditableField) => {
    setFields(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  const canSubmit = useMemo(() => selectedIds.length > 0 && fields.length > 0, [selectedIds.length, fields.length])

  const submit = async () => {
    if (!canSubmit) return
    setSaving(true)

    // Build product field updates
    const updates: Record<string, any> = {}
    if (has('name') && name) updates.name = name
    if (has('category') && category) updates.category = category
    if (has('msrp') && msrp) updates.msrp = Number(msrp)
    if (has('cogs') && cogs) updates.cogs = Number(cogs)
    if (has('orderTypes') && orderTypes) updates.orderTypes = orderTypes.split(',').map(s => s.trim()).filter(Boolean)
    if (has('description') && description) updates.description = description

    // First call bulk field endpoint
    let ok = true
    if (Object.keys(updates).length > 0) {
      const res = await fetch('/api/products/bulk', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ productIds: selectedIds, updates }) })
      ok = res.ok && ok
    }

    // Tags are handled by tag service
    if (has('tags') && tags) {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)
      const ops = selectedIds.map(id => ({ productId: id, add: tagList }))
      const res2 = await fetch('/api/products/tags', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ operations: ops }) })
      ok = res2.ok && ok
    }

    setSaving(false)
    if (ok) {
      toast.success(`Applied to ${selectedIds.length} products`)
      onApplied?.()
      onClose()
    } else {
      toast.error('Bulk update failed')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Edit Products</DialogTitle>
          <DialogDescription>
            Selected <Badge variant="secondary" className="ml-1">{selectedIds.length}</Badge> products
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={has('name')} onChange={() => toggle('name')} /> Name
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={has('category')} onChange={() => toggle('category')} /> Category
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={has('msrp')} onChange={() => toggle('msrp')} /> MSRP
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={has('cogs')} onChange={() => toggle('cogs')} /> COGS
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={has('orderTypes')} onChange={() => toggle('orderTypes')} /> Order Types
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={has('tags')} onChange={() => toggle('tags')} /> Tags (add)
            </label>
            <label className="flex items-center gap-2 text-sm col-span-2">
              <input type="checkbox" checked={has('description')} onChange={() => toggle('description')} /> Description
            </label>
          </div>

          {has('name') && (
            <div>
              <label className="block text-sm mb-1">Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Leave blank to skip" />
            </div>
          )}
          {has('category') && (
            <div>
              <label className="block text-sm mb-1">Category</label>
              <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. apparel" />
            </div>
          )}
          {has('msrp') && (
            <div>
              <label className="block text-sm mb-1">MSRP</label>
              <Input type="number" inputMode="decimal" value={msrp} onChange={e => setMsrp(e.target.value)} placeholder="e.g. 99.99" />
            </div>
          )}
          {has('cogs') && (
            <div>
              <label className="block text-sm mb-1">COGS</label>
              <Input type="number" inputMode="decimal" value={cogs} onChange={e => setCogs(e.target.value)} placeholder="e.g. 35.50" />
            </div>
          )}
          {has('orderTypes') && (
            <div>
              <label className="block text-sm mb-1">Order Types (comma separated)</label>
              <Input value={orderTypes} onChange={e => setOrderTypes(e.target.value)} placeholder="at-once,prebook,closeout" />
            </div>
          )}
          {has('tags') && (
            <div>
              <label className="block text-sm mb-1">Add Tags (comma separated)</label>
              <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="bestseller,evergreen" />
            </div>
          )}
          {has('description') && (
            <div>
              <label className="block text-sm mb-1">Description (append/replace)</label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="New description" rows={3} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={!canSubmit || saving}>{saving ? 'Saving…' : 'Apply to Selected'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


