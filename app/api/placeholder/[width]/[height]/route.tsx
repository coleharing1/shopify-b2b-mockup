import { NextRequest, NextResponse } from 'next/server'

/**
 * @description Generates placeholder images for product demos
 * @fileoverview Dynamic placeholder image generation endpoint
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ width: string; height: string }> }
) {
  const { width: widthStr, height: heightStr } = await params
  const width = parseInt(widthStr, 10)
  const height = parseInt(heightStr, 10)

  // Validate dimensions
  if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0 || width > 2000 || height > 2000) {
    return new NextResponse('Invalid dimensions', { status: 400 })
  }

  // Generate SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#e5e7eb"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#6b7280" font-family="system-ui, sans-serif" font-size="${Math.min(width, height) / 10}">
        ${width} × ${height}
      </text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600'
    }
  })
}