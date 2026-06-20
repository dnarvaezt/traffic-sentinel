import type { Metadata } from "next"
import "./globals.css"
import { Theme } from "@radix-ui/themes"

export const metadata: Metadata = {
  title: "InsightHub",
  description: "Data analysis and visualization platform",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Theme appearance="dark" accentColor="grass" grayColor="sand">
          {children}
        </Theme>
      </body>
    </html>
  )
}
