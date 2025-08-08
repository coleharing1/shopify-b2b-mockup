'use client'

import { useMemo } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface DataPoint {
  label: string
  value: number
  target?: number
}

interface LineChartProps {
  data: DataPoint[]
  height?: number
  showTarget?: boolean
  color?: string
  targetColor?: string
  showTrend?: boolean
  formatValue?: (value: number) => string
}

export function LineChart({
  data,
  height = 200,
  showTarget = false,
  color = '#3b82f6',
  targetColor = '#9ca3af',
  showTrend = true,
  formatValue = (v) => v.toLocaleString()
}: LineChartProps) {
  const { maxValue, minValue, trend } = useMemo(() => {
    const values = data.flatMap(d => [d.value, ...(d.target ? [d.target] : [])])
    const max = Math.max(...values)
    const min = Math.min(...values)
    const firstValue = data[0]?.value || 0
    const lastValue = data[data.length - 1]?.value || 0
    const trendValue = ((lastValue - firstValue) / firstValue) * 100
    
    return {
      maxValue: max * 1.1, // Add 10% padding
      minValue: min * 0.9,
      trend: trendValue
    }
  }, [data])

  const getY = (value: number) => {
    const range = maxValue - minValue
    const percentage = ((value - minValue) / range) * 100
    return height - (percentage / 100) * height
  }

  const getPath = (points: DataPoint[], getValue: (d: DataPoint) => number) => {
    return points
      .map((point, index) => {
        const x = (index / (points.length - 1)) * 100
        const y = (getY(getValue(point)) / height) * 100
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {showTrend && (
        <div className="absolute top-0 right-0 flex items-center gap-1">
          {trend > 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
          <span className={`text-sm font-medium ${
            trend > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        </div>
      )}
      
      <svg
        viewBox={`0 0 100 ${height}`}
        preserveAspectRatio="none"
        className="w-full"
        style={{ height }}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line
            key={y}
            x1="0"
            y1={`${y}%`}
            x2="100"
            y2={`${y}%`}
            stroke="#e5e7eb"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* Target line */}
        {showTarget && data.some(d => d.target) && (
          <>
            <path
              d={getPath(data.filter(d => d.target), d => d.target!)}
              fill="none"
              stroke={targetColor}
              strokeWidth="1"
              strokeDasharray="4 2"
              vectorEffect="non-scaling-stroke"
            />
            {data.filter(d => d.target).map((point, index) => {
              const x = (index / (data.length - 1)) * 100
              const y = (getY(point.target!) / height) * 100
              return (
                <circle
                  key={`target-${index}`}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="2"
                  fill={targetColor}
                />
              )
            })}
          </>
        )}

        {/* Value line */}
        <path
          d={getPath(data, d => d.value)}
          fill="none"
          stroke={color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />

        {/* Value points */}
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * 100
          const y = (getY(point.value) / height) * 100
          return (
            <g key={index}>
              <circle
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill={color}
              />
              <title>{`${point.label}: ${formatValue(point.value)}`}</title>
            </g>
          )
        })}
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2">
        {data.map((point, index) => (
          <span key={index} className="text-xs text-gray-500">
            {point.label}
          </span>
        ))}
      </div>
    </div>
  )
}