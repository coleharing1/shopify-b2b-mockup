import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  categories: string[]
  selectedCategories: string[]
  onCategoryChange: (category: string) => void
  onClearAll: () => void
}

/**
 * @description Product category filter sidebar
 * @fileoverview Allows filtering products by category
 */
export function CategoryFilter({ 
  categories, 
  selectedCategories, 
  onCategoryChange, 
  onClearAll 
}: CategoryFilterProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Categories</CardTitle>
          {selectedCategories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="h-auto p-0 text-xs text-primary hover:text-primary-hover"
            >
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox
              id={category}
              checked={selectedCategories.includes(category)}
              onChange={() => onCategoryChange(category)}
            />
            <label
              htmlFor={category}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {category}
            </label>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}