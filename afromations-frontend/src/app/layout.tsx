import type { Metadata, Viewport } from 'next'
import { I18nProvider } from '@/lib/i18n'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0a0a0a',
}

export const metadata: Metadata = {
  title: 'AFROMATIONS Studios | Black-Owned Anime Studio',
  description:
    'The biggest black-owned anime community. Powered by Agent Hanna — AI-driven 3D anime production, character design, and storytelling.',
  keywords: [
    'anime',
    'black anime',
    'afromations',
    'anime studio',
    'agent hanna',
    '3d anime',
    'anime community',
  ],
  openGraph: {
    title: 'AFROMATIONS Studios',
    description: 'Black-Owned Anime Studio powered by Agent Hanna',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Sora:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
