import type { Metadata } from "next"
import "./globals.css"
import { Theme } from "@radix-ui/themes"

export const metadata: Metadata = {
  title: "Traffic Sentinel",
  description: "Traffic monitoring and management system",
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
