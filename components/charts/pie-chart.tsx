'use client'

import { useMemo } from 'react'

interface PieData {
  label: string
  value: number
  color?: string
}

interface PieChartProps {
  data: PieData[]
  size?: number
  showLabels?: boolean
  showLegend?: boolean
  formatValue?: (value: number) => string
  colors?: string[]
}

export function PieChart({
  data,
  size = 200,
  showLabels = true,
  showLegend = true,
  formatValue = (v) => v.toLocaleString(),
  colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // yellow
    '#ef4444', // red
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316'  // orange
  ]
}: PieChartProps) {
  const { paths, total } = useMemo(() => {
    const sum = data.reduce((acc, item) => acc + item.value, 0)
    let currentAngle = -90 // Start at top
    
    const pathData = data.map((item, index) => {
      const percentage = (item.value / sum) * 100
      const angle = (percentage / 100) * 360
      const startAngle = currentAngle
      const endAngle = currentAngle + angle
      currentAngle = endAngle

      const startRadians = (startAngle * Math.PI) / 180
      const endRadians = (endAngle * Math.PI) / 180
      
      const radius = size / 2
      const innerRadius = radius * 0.6
      
      const x1 = radius + radius * Math.cos(startRadians)
      const y1 = radius + radius * Math.sin(startRadians)
      const x2 = radius + radius * Math.cos(endRadians)
      const y2 = radius + radius * Math.sin(endRadians)
      
      const x3 = radius + innerRadius * Math.cos(startRadians)
      const y3 = radius + innerRadius * Math.sin(startRadians)
      const x4 = radius + innerRadius * Math.cos(endRadians)
      const y4 = radius + innerRadius * Math.sin(endRadians)
      
      const largeArcFlag = angle > 180 ? 1 : 0
      
      const path = [
        `M ${x3} ${y3}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        `L ${x4} ${y4}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x3} ${y3}`,
        'Z'
      ].join(' ')
      
      const labelAngle = (startAngle + endAngle) / 2
      const labelRadius = radius * 0.8
      const labelX = radius + labelRadius * Math.cos((labelAngle * Math.PI) / 180)
      const labelY = radius + labelRadius * Math.sin((labelAngle * Math.PI) / 180)
      
      return {
        path,
        percentage,
        color: item.color || colors[index % colors.length],
        label: item.label,
        value: item.value,
        labelX,
        labelY
      }
    })
    
    return { paths: pathData, total: sum }
  }, [data, size, colors])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
          {paths.map((item, index) => (
            <g key={index}>
              <path
                d={item.path}
                fill={item.color}
                className="transition-opacity duration-200 hover:opacity-80 cursor-pointer"
              />
              {showLabels && item.percentage > 5 && (
                <text
                  x={item.labelX}
                  y={item.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-medium fill-white pointer-events-none"
                >
                  {item.percentage.toFixed(0)}%
                </text>
              )}
              <title>{`${item.label}: ${formatValue(item.value)} (${item.percentage.toFixed(1)}%)`}</title>
            </g>
          ))}
        </svg>
        
        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold">{formatValue(total)}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="space-y-2">
          {paths.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <div className="text-sm">
                <span className="text-gray-600">{item.label}</span>
                <span className="ml-2 font-medium">
                  {formatValue(item.value)}
                </span>
                <span className="ml-1 text-gray-500">
                  ({item.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}