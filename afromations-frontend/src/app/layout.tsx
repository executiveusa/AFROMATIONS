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
  metadataBase: new URL('https://afromations.netlify.app'),
  title: {
    default: 'AFROMATIONS — Original Worlds. Real Artists. Community Impact.',
    template: '%s — AFROMATIONS',
  },
  description:
    'AFROMATIONS is a Seattle-based art and animation studio creating original worlds, working with real artists, and connecting creative projects to community impact.',
  keywords: [
    'AFROMATIONS',
    'anime studio',
    'animation studio',
    'original IP',
    'manga',
    'artist collaborations',
    'Seattle artists',
    'community art',
    'DUAL',
    'Hana',
  ],
  openGraph: {
    title: 'AFROMATIONS',
    description: 'Original Worlds. Real Artists. Community Impact.',
    type: 'website',
    siteName: 'AFROMATIONS',
    url: 'https://afromations.netlify.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AFROMATIONS',
    description: 'Original Worlds. Real Artists. Community Impact.',
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
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Sora:wght@400;600;700;800&family=Caveat:wght@400;500;600;700&family=Italianno&family=Tangerine:wght@400;700&family=Parisienne&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  )
}
