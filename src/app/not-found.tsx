import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "404 - Page Not Found",
}

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-8xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground">Page not found</p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
        >
          Go Home
        </Link>
      </div>
    </main>
  )
}
