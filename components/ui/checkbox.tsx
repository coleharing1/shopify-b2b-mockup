import * as React from "react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

/**
 * @description Checkbox component for boolean selections
 * @fileoverview Standard checkbox with consistent styling and optional label
 */
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const generatedId = React.useId()
    const checkboxId = id || generatedId
    
    return (
      <div className="flex items-center">
        <input
          type="checkbox"
          ref={ref}
          id={checkboxId}
          className={cn(
            "h-4 w-4 rounded border-gray-300 text-primary",
            "focus:ring-2 focus:ring-primary focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={checkboxId}
            className="ml-2 text-sm text-gray-700 cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }