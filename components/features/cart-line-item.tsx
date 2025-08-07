import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus } from "lucide-react"
import { CartItem } from "@/lib/cart-context"
import { formatCurrency } from "@/lib/mock-data"

interface CartLineItemProps {
  item: CartItem
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}

/**
 * @description Shopping cart line item component
 * @fileoverview Displays individual cart item with quantity controls
 */
export function CartLineItem({ item, onUpdateQuantity, onRemove }: CartLineItemProps) {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= item.variant.inventory) {
      onUpdateQuantity(newQuantity)
    }
  }

  const lineTotal = item.quantity * item.unitPrice

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <Image
              src={item.product.images[0] || "/api/placeholder/100/100"}
              alt={item.product.name}
              width={100}
              height={100}
              className="rounded-md object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-medium text-gray-900">{item.product.name}</h3>
              <p className="text-sm text-gray-600">
                {item.variant.color} / {item.variant.size}
              </p>
              <p className="text-sm text-gray-500">SKU: {item.variant.sku}</p>
            </div>

            {/* Mobile: Quantity and Price */}
            <div className="md:hidden space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
                  className="w-16 text-center h-8"
                  min="1"
                  max={item.variant.inventory}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={item.quantity >= item.variant.inventory}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {formatCurrency(item.unitPrice)} each
                </span>
                <span className="font-medium">{formatCurrency(lineTotal)}</span>
              </div>
            </div>
          </div>

          {/* Desktop: Quantity, Price, and Actions */}
          <div className="hidden md:flex items-center gap-6">
            {/* Unit Price */}
            <div className="text-center">
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-medium">{formatCurrency(item.unitPrice)}</p>
            </div>

            {/* Quantity Controls */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Quantity</p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
                  className="w-16 text-center"
                  min="1"
                  max={item.variant.inventory}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={item.quantity >= item.variant.inventory}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {item.variant.inventory} available
              </p>
            </div>

            {/* Line Total */}
            <div className="text-center">
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-medium">{formatCurrency(lineTotal)}</p>
            </div>

            {/* Remove Button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={onRemove}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile: Remove Button */}
        <div className="md:hidden mt-3 pt-3 border-t">
          <Button
            size="sm"
            variant="ghost"
            onClick={onRemove}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove from Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}