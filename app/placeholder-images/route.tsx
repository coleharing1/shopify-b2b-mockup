import { NextRequest, NextResponse } from 'next/server'

/**
 * @description Generates a placeholder image SVG for product demos
 * @fileoverview API route to create placeholder product images
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const width = searchParams.get('w') || '400'
  const height = searchParams.get('h') || '400'
  const text = searchParams.get('text') || 'Product Image'
  const bg = searchParams.get('bg') || '2563eb'
  const fg = searchParams.get('fg') || 'ffffff'

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#${bg}"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#${fg}">
        ${text}
      </text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}