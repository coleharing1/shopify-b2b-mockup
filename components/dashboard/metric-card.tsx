'use client'

import { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
  onClick?: () => void
  loading?: boolean
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  icon,
  trend,
  className,
  onClick,
  loading = false
}: MetricCardProps) {
  const getTrend = () => {
    if (trend) return trend
    if (change === undefined) return 'neutral'
    return change > 0 ? 'up' : change < 0 ? 'down' : 'neutral'
  }

  const currentTrend = getTrend()

  const getTrendIcon = () => {
    switch (currentTrend) {
      case 'up':
        return <TrendingUp className="h-4 w-4" />
      case 'down':
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getTrendColor = () => {
    switch (currentTrend) {
      case 'up':
        return 'text-green-600 bg-green-50'
      case 'down':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/3" />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
            </div>
            {icon && (
              <div className="ml-4 p-3 bg-blue-50 rounded-lg">
                {icon}
              </div>
            )}
          </div>
          
          {change !== undefined && (
            <div className="mt-4 flex items-center gap-2">
              <div className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium',
                getTrendColor()
              )}>
                {getTrendIcon()}
                <span>
                  {change > 0 && '+'}{change}%
                </span>
              </div>
              <span className="text-xs text-gray-500">{changeLabel}</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}