'use client'

import { useMemo } from 'react'

interface RegionData {
  region: string
  value: number
  label?: string
}

interface GeoMapProps {
  data: RegionData[]
  height?: number
  showValues?: boolean
  formatValue?: (value: number) => string
  colorScale?: string[]
}

// Simplified US regions for demo
const REGIONS = [
  { id: 'west', name: 'West', path: 'M 50 100 L 150 100 L 150 200 L 50 200 Z', x: 100, y: 150 },
  { id: 'midwest', name: 'Midwest', path: 'M 150 100 L 250 100 L 250 200 L 150 200 Z', x: 200, y: 150 },
  { id: 'northeast', name: 'Northeast', path: 'M 250 50 L 350 50 L 350 150 L 250 150 Z', x: 300, y: 100 },
  { id: 'south', name: 'South', path: 'M 150 200 L 350 200 L 350 300 L 150 300 Z', x: 250, y: 250 },
  { id: 'mountain', name: 'Mountain', path: 'M 50 200 L 150 200 L 150 300 L 50 300 Z', x: 100, y: 250 },
  { id: 'pacific', name: 'Pacific', path: 'M 20 50 L 50 50 L 50 200 L 20 200 Z', x: 35, y: 125 }
]

export function GeoMap({
  data,
  height = 350,
  showValues = true,
  formatValue = (v) => v.toLocaleString(),
  colorScale = [
    '#f3f4f6', // gray-100
    '#bfdbfe', // blue-200
    '#93c5fd', // blue-300
    '#60a5fa', // blue-400
    '#3b82f6', // blue-500
    '#2563eb'  // blue-600
  ]
}: GeoMapProps) {
  const { minValue, maxValue, regionMap } = useMemo(() => {
    const values = data.map(d => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    
    const map = new Map(
      data.map(d => [d.region.toLowerCase(), d])
    )
    
    return { minValue: min, maxValue: max, regionMap: map }
  }, [data])

  const getColor = (region: string) => {
    const regionData = regionMap.get(region.toLowerCase())
    if (!regionData) return colorScale[0]
    
    if (maxValue === minValue) return colorScale[Math.floor(colorScale.length / 2)]
    
    const percentage = ((regionData.value - minValue) / (maxValue - minValue)) * 100
    const index = Math.floor((percentage / 100) * (colorScale.length - 1))
    return colorScale[Math.min(index, colorScale.length - 1)]
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-gray-50 rounded-lg p-4" style={{ height }}>
        <svg viewBox="0 0 400 350" className="w-full h-full">
          {REGIONS.map(region => {
            const regionData = regionMap.get(region.id)
            const color = getColor(region.id)
            
            return (
              <g key={region.id}>
                <path
                  d={region.path}
                  fill={color}
                  stroke="#e5e7eb"
                  strokeWidth="2"
                  className="transition-all duration-200 hover:opacity-80 cursor-pointer"
                />
                {showValues && regionData && (
                  <text
                    x={region.x}
                    y={region.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="pointer-events-none"
                  >
                    <tspan className="text-xs font-medium fill-gray-700">
                      {region.name}
                    </tspan>
                    <tspan x={region.x} dy="15" className="text-sm font-bold fill-gray-900">
                      {formatValue(regionData.value)}
                    </tspan>
                  </text>
                )}
                <title>
                  {region.name}: {regionData ? formatValue(regionData.value) : 'No data'}
                </title>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from(regionMap.entries())
          .sort((a, b) => b[1].value - a[1].value)
          .map(([region, data]) => {
            const regionInfo = REGIONS.find(r => r.id === region)
            if (!regionInfo) return null
            
            return (
              <div key={region} className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: getColor(region) }}
                  />
                  <span className="text-sm font-medium">{regionInfo.name}</span>
                </div>
                <span className="text-sm font-bold">{formatValue(data.value)}</span>
              </div>
            )
          })}
      </div>

      {/* Color scale */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>Low</span>
        <div className="flex gap-0.5 flex-1">
          {colorScale.map((color, index) => (
            <div
              key={index}
              className="h-2 flex-1"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span>High</span>
      </div>
    </div>
  )
}