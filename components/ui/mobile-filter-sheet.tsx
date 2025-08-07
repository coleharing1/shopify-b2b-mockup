"use client"

import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileFilterSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  onApply?: () => void
  onClear?: () => void
}

/**
 * @description Mobile filter sheet that slides up from bottom
 * @fileoverview Provides touch-friendly filter interface for mobile
 */
export function MobileFilterSheet({
  isOpen,
  onClose,
  title = "Filters",
  children,
  onApply,
  onClear
}: MobileFilterSheetProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center text-center sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-t-lg bg-white text-left shadow-xl transition-all w-full sm:max-w-lg">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b px-4 py-4">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg font-medium text-gray-900">
                      {title}
                    </Dialog.Title>
                    <button
                      type="button"
                      className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 py-4 max-h-[60vh] overflow-y-auto">
                  {children}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t px-4 py-4">
                  <div className="flex gap-3">
                    {onClear && (
                      <Button
                        variant="outline"
                        onClick={onClear}
                        className="flex-1"
                      >
                        Clear All
                      </Button>
                    )}
                    <Button
                      onClick={() => {
                        onApply?.()
                        onClose()
                      }}
                      className="flex-1"
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}