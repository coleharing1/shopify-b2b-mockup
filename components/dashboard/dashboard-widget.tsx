'use client'

import { ReactNode, useState } from 'react'
import { MoreVertical, Maximize2, Minimize2, Download, RefreshCw } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface DashboardWidgetProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  onRefresh?: () => void
  onExport?: () => void
  refreshing?: boolean
  actions?: Array<{
    label: string
    onClick: () => void
    icon?: ReactNode
  }>
  collapsible?: boolean
  defaultCollapsed?: boolean
}

export function DashboardWidget({
  title,
  subtitle,
  children,
  className,
  onRefresh,
  onExport,
  refreshing = false,
  actions = [],
  collapsible = false,
  defaultCollapsed = false
}: DashboardWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(!defaultCollapsed)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleToggleExpand = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded)
    }
  }

  const handleToggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleRefresh = () => {
    if (onRefresh && !refreshing) {
      onRefresh()
    }
  }

  const handleExport = () => {
    if (onExport) {
      onExport()
    }
  }

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-200',
        isFullscreen && 'fixed inset-4 z-50',
        className
      )}
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {onRefresh && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
                className="h-8 w-8"
              >
                <RefreshCw className={cn(
                  'h-4 w-4',
                  refreshing && 'animate-spin'
                )} />
              </Button>
            )}
            
            {onExport && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExport}
                className="h-8 w-8"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleFullscreen}
              className="h-8 w-8"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            
            {(actions.length > 0 || collapsible) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {collapsible && (
                    <DropdownMenuItem onClick={handleToggleExpand}>
                      {isExpanded ? 'Collapse' : 'Expand'}
                    </DropdownMenuItem>
                  )}
                  {actions.map((action, index) => (
                    <DropdownMenuItem key={index} onClick={action.onClick}>
                      {action.icon && (
                        <span className="mr-2">{action.icon}</span>
                      )}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className={cn(
          'p-6',
          isFullscreen && 'overflow-auto max-h-[calc(100vh-8rem)]'
        )}>
          {children}
        </div>
      )}
    </div>
  )
}