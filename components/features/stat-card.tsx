import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
}

/**
 * @description Dashboard statistic card component
 * @fileoverview Displays key metrics with optional trend indicators
 */
export function StatCard({ title, value, description, icon: Icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          {trend && (
            <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}