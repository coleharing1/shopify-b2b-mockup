import { NextRequest, NextResponse } from 'next/server'
import { bulkUpdateTags, getAllOverrides } from '@/lib/services/tag-service'

/**
 * @description Admin-only bulk tags API (demo, in-memory).
 */

export async function GET() {
  return NextResponse.json({ overrides: getAllOverrides() })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const ops = Array.isArray(body?.operations) ? body.operations : []
    const result = bulkUpdateTags(ops)
    return NextResponse.json({ success: true, ...result })
  } catch (e) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
  }
}


