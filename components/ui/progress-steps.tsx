import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface Step {
  id: number
  title: string
  description?: string
}

interface ProgressStepsProps {
  steps: Step[]
  currentStep: number
  className?: string
}

/**
 * @description Progress indicator for multi-step forms
 * @fileoverview Shows visual progress through a stepped process
 */
export function ProgressSteps({ steps, currentStep, className }: ProgressStepsProps) {
  return (
    <div className={cn("w-full", className)}>
      <ol className="flex items-center w-full">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          const isLast = index === steps.length - 1
          
          return (
            <li
              key={step.id}
              className={cn(
                "flex items-center",
                !isLast && "w-full"
              )}
            >
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                    isCompleted && "bg-primary border-primary text-white",
                    isCurrent && "border-primary text-primary",
                    !isCompleted && !isCurrent && "border-gray-300 text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      (isCompleted || isCurrent) ? "text-gray-900" : "text-gray-400"
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                  )}
                </div>
              </div>
              
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors",
                    isCompleted ? "bg-primary" : "bg-gray-300"
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/**
 * @description Mobile-friendly progress steps
 * @fileoverview Compact version for mobile screens
 */
export function MobileProgressSteps({ steps, currentStep, className }: ProgressStepsProps) {
  const currentStepData = steps.find(s => s.id === currentStep)
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-900">
          Step {currentStep} of {steps.length}
        </p>
        <p className="text-sm text-gray-600">{currentStepData?.title}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}