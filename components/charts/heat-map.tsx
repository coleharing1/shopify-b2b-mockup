'use client'

import { useMemo } from 'react'

interface HeatMapData {
  x: string
  y: string
  value: number
}

interface HeatMapProps {
  data: HeatMapData[]
  xLabels: string[]
  yLabels: string[]
  colorScale?: string[]
  showValues?: boolean
  formatValue?: (value: number) => string
  title?: string
}

export function HeatMap({
  data,
  xLabels,
  yLabels,
  colorScale = [
    '#f3f4f6', // gray-100
    '#dbeafe', // blue-100
    '#93c5fd', // blue-300
    '#60a5fa', // blue-400
    '#3b82f6', // blue-500
    '#2563eb', // blue-600
    '#1d4ed8'  // blue-700
  ],
  showValues = true,
  formatValue = (v) => v.toFixed(0),
  title
}: HeatMapProps) {
  const { minValue, maxValue, cellData } = useMemo(() => {
    const values = data.map(d => d.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    
    // Create a map for quick lookup
    const dataMap = new Map(
      data.map(d => [`${d.x}-${d.y}`, d.value])
    )
    
    // Create cell data matrix
    const cells = yLabels.map(y => 
      xLabels.map(x => {
        const value = dataMap.get(`${x}-${y}`) || 0
        return { x, y, value }
      })
    )
    
    return { minValue: min, maxValue: max, cellData: cells }
  }, [data, xLabels, yLabels])

  const getColor = (value: number) => {
    if (maxValue === minValue) return colorScale[0]
    const percentage = ((value - minValue) / (maxValue - minValue)) * 100
    const index = Math.floor((percentage / 100) * (colorScale.length - 1))
    return colorScale[Math.min(index, colorScale.length - 1)]
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 p-2"></th>
              {xLabels.map(label => (
                <th key={label} className="text-center text-xs font-medium text-gray-500 p-2">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cellData.map((row, yIndex) => (
              <tr key={yIndex}>
                <td className="text-left text-xs font-medium text-gray-500 p-2">
                  {yLabels[yIndex]}
                </td>
                {row.map((cell, xIndex) => (
                  <td key={xIndex} className="p-1">
                    <div
                      className="relative w-full h-10 rounded flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer"
                      style={{ backgroundColor: getColor(cell.value) }}
                      title={`${cell.x}, ${cell.y}: ${formatValue(cell.value)}`}
                    >
                      {showValues && (
                        <span className={`text-xs font-medium ${
                          cell.value > (maxValue + minValue) / 2 ? 'text-white' : 'text-gray-700'
                        }`}>
                          {formatValue(cell.value)}
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Color scale legend */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500">Low</span>
        <div className="flex gap-1 flex-1">
          {colorScale.map((color, index) => (
            <div
              key={index}
              className="h-4 flex-1"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span className="text-xs text-gray-500">High</span>
      </div>
    </div>
  )
}