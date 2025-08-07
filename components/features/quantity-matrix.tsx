import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

interface QuantityMatrixProps {
  variants: Array<{
    id: string
    color: string
    size: string
    inventory: number
  }>
  quantities: Record<string, number>
  onQuantityChange: (variantId: string, quantity: number) => void
}

/**
 * @description Quantity input matrix for bulk ordering
 * @fileoverview B2B-style grid for entering quantities across variants
 */
export function QuantityMatrix({ variants, quantities, onQuantityChange }: QuantityMatrixProps) {
  // Group variants by color
  const variantsByColor = variants.reduce((acc, variant) => {
    if (!acc[variant.color]) {
      acc[variant.color] = []
    }
    acc[variant.color].push(variant)
    return acc
  }, {} as Record<string, typeof variants>)

  // Get unique sizes
  const allSizes = Array.from(new Set(variants.map(v => v.size)))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quantity Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left font-medium text-gray-600 pb-2 pr-4">Color</th>
                {allSizes.map(size => (
                  <th key={size} className="text-center font-medium text-gray-600 pb-2 px-2 min-w-[80px]">
                    {size}
                  </th>
                ))}
                <th className="text-center font-medium text-gray-600 pb-2 pl-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(variantsByColor).map(([color, colorVariants]) => {
                const colorTotal = colorVariants.reduce(
                  (sum, v) => sum + (quantities[v.id] || 0),
                  0
                )

                return (
                  <tr key={color} className="border-b">
                    <td className="py-3 pr-4 font-medium">{color}</td>
                    {allSizes.map(size => {
                      const variant = colorVariants.find(v => v.size === size)
                      
                      if (!variant) {
                        return <td key={size} className="text-center px-2">-</td>
                      }

                      const isLowStock = variant.inventory > 0 && variant.inventory < 10
                      const quantity = quantities[variant.id] || 0

                      return (
                        <td key={size} className="px-2 py-2">
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              max={variant.inventory}
                              value={quantity || ""}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0
                                onQuantityChange(variant.id, Math.min(value, variant.inventory))
                              }}
                              className="text-center h-8"
                              placeholder="0"
                            />
                            {isLowStock && (
                              <div className="absolute -top-1 -right-1">
                                <AlertCircle className="h-3 w-3 text-yellow-600" />
                              </div>
                            )}
                            <div className="text-xs text-gray-500 text-center mt-1">
                              {variant.inventory} avail
                            </div>
                          </div>
                        </td>
                      )
                    })}
                    <td className="text-center pl-4 font-medium">{colorTotal}</td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
              <tr>
                <td className="pt-3 font-bold">Total</td>
                {allSizes.map(size => {
                  const sizeTotal = variants
                    .filter(v => v.size === size)
                    .reduce((sum, v) => sum + (quantities[v.id] || 0), 0)
                  
                  return (
                    <td key={size} className="pt-3 text-center font-medium">
                      {sizeTotal || "-"}
                    </td>
                  )
                })}
                <td className="pt-3 text-center font-bold">
                  {Object.values(quantities).reduce((sum, q) => sum + q, 0)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-800 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            Consider ordering 10-15% extra as buffer stock to avoid stockouts between orders.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}