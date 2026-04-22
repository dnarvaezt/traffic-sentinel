"use client"

import { createContext, useCallback, useContext, useState } from "react"
import { Toast, ToastContainer, type ToastProps } from "./toast"

interface ToastContextType {
  showToast: (props: Omit<ToastProps, "id" | "onClose">) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([])

  const showToast = useCallback((props: Omit<ToastProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substring(7)
    const toast: ToastProps & { id: string } = {
      ...props,
      id,
      onClose: () => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      },
    }

    setToasts((prev) => [...prev, toast])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}
