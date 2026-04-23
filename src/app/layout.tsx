import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Traffic Sentinel",
  description: "Traffic monitoring and management system",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
