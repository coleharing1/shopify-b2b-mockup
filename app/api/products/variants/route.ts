import { NextRequest, NextResponse } from 'next/server'
import { updateProductVariants } from '@/lib/services/product-override-service'

/**
 * @description Admin-only variant operations for a single product (demo, in-memory).
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = updateProductVariants(body)
    return NextResponse.json({ success: true, ...result })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
  }
}


