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
  title: 'AFROMATIONS | Artist-Owned Anime Studio',
  description:
    'AFROMATIONS connects tattoo artists, anime creators, and original characters to paid collaboration, ethical AI production, merchandise, marketing, and verifiable provenance.',
  keywords: [
    'anime',
    'black anime',
    'afromations',
    'anime studio',
    'agent hana',
    'tattoo artists',
    'artist sovereignty',
    'anime community',
  ],
  openGraph: {
    title: 'AFROMATIONS Studios',
    description: 'Artist-owned anime studio powered by Hana',
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
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,400&family=Sora:wght@400;600;700;800&family=Caveat:wght@400;500;600;700&family=Italianno&family=Tangerine:wght@400;700&family=Parisienne&display=swap"
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
