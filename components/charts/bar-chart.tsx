'use client'

import { useMemo } from 'react'

interface BarData {
  label: string
  value: number
  color?: string
  target?: number
}

interface BarChartProps {
  data: BarData[]
  height?: number
  orientation?: 'vertical' | 'horizontal'
  showValues?: boolean
  showTarget?: boolean
  formatValue?: (value: number) => string
  barColor?: string
}

export function BarChart({
  data,
  height = 200,
  orientation = 'vertical',
  showValues = true,
  showTarget = false,
  formatValue = (v) => v.toLocaleString(),
  barColor = '#3b82f6'
}: BarChartProps) {
  const maxValue = useMemo(() => {
    const values = data.flatMap(d => [d.value, ...(d.target ? [d.target] : [])])
    return Math.max(...values) * 1.1
  }, [data])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-sm text-gray-500">No data available</p>
      </div>
    )
  }

  if (orientation === 'horizontal') {
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{item.label}</span>
              {showValues && (
                <span className="font-medium">{formatValue(item.value)}</span>
              )}
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color || barColor
                  }}
                />
              </div>
              {showTarget && item.target && (
                <div
                  className="absolute top-0 h-2 w-0.5 bg-gray-600"
                  style={{ left: `${(item.target / maxValue) * 100}%` }}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="relative" style={{ height }}>
        <svg
          viewBox={`0 0 ${data.length * 60} ${height}`}
          className="w-full h-full"
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(y => (
            <line
              key={y}
              x1="0"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="#e5e7eb"
              strokeWidth="0.5"
            />
          ))}

          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * height
            const x = index * 60 + 10
            const y = height - barHeight
            const barWidth = 40

            return (
              <g key={index}>
                {/* Target line */}
                {showTarget && item.target && (
                  <line
                    x1={x}
                    y1={height - (item.target / maxValue) * height}
                    x2={x + barWidth}
                    y2={height - (item.target / maxValue) * height}
                    stroke="#ef4444"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={item.color || barColor}
                  className="transition-all duration-500 hover:opacity-80"
                />

                {/* Value label */}
                {showValues && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {formatValue(item.value)}
                  </text>
                )}

                <title>{`${item.label}: ${formatValue(item.value)}`}</title>
              </g>
            )
          })}
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2">
        {data.map((item, index) => (
          <div
            key={index}
            className="text-xs text-gray-500 text-center"
            style={{ width: `${100 / data.length}%` }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}