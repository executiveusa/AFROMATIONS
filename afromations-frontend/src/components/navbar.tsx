'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Artists', href: '/artists' },
  { label: 'Community', href: '/community' },
  { label: 'Stories', href: '/stories' },
  { label: 'Studio', href: '/studio' },
  { label: 'Shop', href: '/store' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <nav
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b border-white/5 transition-colors duration-200',
          scrolled || open ? 'bg-(--af-black)/95 backdrop-blur-md' : 'bg-transparent'
        )}
        aria-label="Primary navigation"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="text-sm font-extrabold tracking-[0.16em] text-(--af-cream)" aria-label="AFROMATIONS home">
            AFROMATIONS
          </a>

          <div className="hidden items-center gap-5 lg:flex">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-xs font-medium text-(--af-grey-light) transition-colors hover:text-(--af-cream)">
                {link.label}
              </a>
            ))}
            <a href="/apply?path=project" className="af-btn-primary rounded-full px-5 py-2 text-xs font-semibold">
              Work With Us
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center text-(--af-cream) lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path
                d={open ? 'M5 5l12 12M5 17L17 5' : 'M4 6h14M4 11h14M4 16h14'}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </nav>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-(--af-black) px-5 pt-24 transition-opacity duration-200 lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!open}
      >
        <nav className="border-t border-white/10">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="flex min-h-16 items-center justify-between border-b border-white/10 text-lg font-semibold text-(--af-cream)"
            >
              {link.label}
              <span aria-hidden="true">→</span>
            </a>
          ))}
        </nav>
        <a
          href="/apply?path=project"
          onClick={() => setOpen(false)}
          className="af-btn-primary mt-8 flex min-h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold"
        >
          Work With Us
        </a>
      </div>
    </>
  )
}
