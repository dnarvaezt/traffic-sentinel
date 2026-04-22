import { X } from "lucide-react"
import * as React from "react"
import { cn } from "@/infrastructure/utils/index"

export interface ToastProps {
  id: string
  title?: string
  description: string
  variant?: "default" | "success" | "destructive"
  onClose: () => void
}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ id, title, description, variant = "default", onClose, ...props }, ref) => {
    return (
      <div
        role="alert"
        ref={ref}
        id={id}
        className={cn(
          "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 transition-all",
          {
            "border-border bg-card": variant === "default",
            "border-green-600 bg-green-50 text-green-900 dark:bg-green-950 dark:text-green-100":
              variant === "success",
            "border-red-600 bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100":
              variant === "destructive",
          },
        )}
        {...props}
      >
        <div className="grid gap-1">
          {title && (
            <div className="text-sm font-semibold leading-none tracking-tight">{title}</div>
          )}
          <div className="text-sm">{description}</div>
        </div>
        <button
          type="button"
          className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:bg-black/10 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  },
)
Toast.displayName = "Toast"

const ToastContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-auto sm:right-0 sm:top-0 sm:flex-col md:max-w-[420px]">
      {children}
    </div>
  )
}

export { ToastContainer }
