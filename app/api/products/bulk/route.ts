import { NextRequest, NextResponse } from 'next/server'
import { bulkEditProducts, getProductOverrides } from '@/lib/services/product-override-service'

/**
 * @description Admin-only bulk product field updates (demo, in-memory).
 */

export async function GET() {
  return NextResponse.json({ overrides: getProductOverrides() })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const ids = Array.isArray(body?.productIds) ? body.productIds : []
    const updates = body?.updates || {}
    const result = bulkEditProducts(ids, updates)
    return NextResponse.json({ success: true, ...result })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
  }
}


