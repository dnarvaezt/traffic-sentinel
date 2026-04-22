"use client"

import { ThemeProvider, useTheme } from "next-themes"
import { useState } from "react"
import { Button } from "@/infrastructure/components/ui"
import { ToastProvider } from "@/infrastructure/components/ui/toast-provider"
import "./theme.scss"

export const ThemeControllerProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="data-theme" enableSystem defaultTheme="light">
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  )
}

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted] = useState(() => typeof window !== "undefined")

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  if (!mounted || !theme) {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="theme-toggle"
        aria-label="Toggle theme"
        suppressHydrationWarning
      >
        🌙
      </Button>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </Button>
  )
}
