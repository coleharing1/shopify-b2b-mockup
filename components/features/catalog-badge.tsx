import { Badge } from '@/components/ui/badge'
import { Book, Lock, Star } from 'lucide-react'

interface CatalogBadgeProps {
  catalogName?: string
  isExclusive?: boolean
  isRestricted?: boolean
  features?: string[]
  className?: string
}

export function CatalogBadge({
  catalogName,
  isExclusive = false,
  isRestricted = false,
  features = [],
  className = ''
}: CatalogBadgeProps) {
  if (!catalogName) return null

  // Determine badge variant and icon based on catalog type
  const getVariantAndIcon = () => {
    if (catalogName.toLowerCase().includes('premium') || catalogName.toLowerCase().includes('gold')) {
      return {
        variant: 'default' as const,
        icon: <Star className="h-3 w-3" />,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      }
    }
    if (catalogName.toLowerCase().includes('preferred') || catalogName.toLowerCase().includes('silver')) {
      return {
        variant: 'secondary' as const,
        icon: <Book className="h-3 w-3" />,
        className: 'bg-gray-100 text-gray-800 border-gray-200'
      }
    }
    if (isRestricted) {
      return {
        variant: 'outline' as const,
        icon: <Lock className="h-3 w-3" />,
        className: 'bg-red-50 text-red-700 border-red-200'
      }
    }
    return {
      variant: 'outline' as const,
      icon: <Book className="h-3 w-3" />,
      className: ''
    }
  }

  const { variant, icon, className: variantClass } = getVariantAndIcon()

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge 
        variant={variant}
        className={`text-xs flex items-center gap-1 ${variantClass}`}
      >
        {icon}
        {catalogName}
      </Badge>
      
      {isExclusive && (
        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
          Exclusive
        </Badge>
      )}
      
      {features.includes('early-access') && (
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
          Early Access
        </Badge>
      )}
      
      {features.includes('custom-colors') && (
        <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
          Custom Colors
        </Badge>
      )}
    </div>
  )
}