import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AFROMATIONS — Tyshawn Dashboard',
  description: 'Your studio control panel',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain">{children}</body>
    </html>
  )
}
