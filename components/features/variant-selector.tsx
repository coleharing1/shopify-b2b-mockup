import { Button } from "@/components/ui/button"

interface Variant {
  id: string
  color: string
  size: string
  inventory: number
  sku: string
  weight?: string
}

interface VariantSelectorProps {
  variants: Variant[]
  selectedVariant: Variant | null
  onVariantSelect: (variant: Variant) => void
}

/**
 * @description Product variant selector for size/color
 * @fileoverview Displays available variants with inventory indicators
 */
export function VariantSelector({ variants, selectedVariant, onVariantSelect }: VariantSelectorProps) {
  // Group variants by color
  const variantsByColor = variants.reduce((acc, variant) => {
    if (!acc[variant.color]) {
      acc[variant.color] = []
    }
    acc[variant.color].push(variant)
    return acc
  }, {} as Record<string, Variant[]>)

  return (
    <div className="space-y-4">
      {Object.entries(variantsByColor).map(([color, colorVariants]) => (
        <div key={color}>
          <h4 className="text-sm font-medium text-gray-700 mb-2">{color}</h4>
          <div className="flex flex-wrap gap-2">
            {colorVariants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id
              const isOutOfStock = variant.inventory === 0
              const isLowStock = variant.inventory > 0 && variant.inventory < 10

              return (
                <Button
                  key={variant.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  disabled={isOutOfStock}
                  onClick={() => onVariantSelect(variant)}
                  className="relative"
                >
                  {variant.size}
                  {isLowStock && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full" />
                  )}
                </Button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}