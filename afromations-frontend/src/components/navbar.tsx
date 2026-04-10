'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const links = [
  { label: 'Studio', href: '#studio' },
  { label: 'Hanna', href: '#hanna' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Blog', href: '#blog' },
  { label: 'Community', href: '#community' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[var(--af-black)]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo mark */}
        <a href="/" className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-widest text-[var(--af-red)]">
            AFROMATIONS
          </span>
          <span className="text-[10px] tracking-[0.3em] text-[var(--af-grey-light)] uppercase">
            Studios
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs tracking-wider text-[var(--af-grey-light)] transition-colors hover:text-[var(--af-cream)]"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-[var(--af-cream)]"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d={open ? 'M4 4l12 12M4 16L16 4' : 'M3 5h14M3 10h14M3 15h14'}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Mobile panel */}
      <div
        className={cn(
          'md:hidden overflow-hidden border-t border-white/5 bg-[var(--af-black)]',
          'transition-all duration-200',
          open ? 'max-h-64 py-4' : 'max-h-0 py-0'
        )}
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="block px-6 py-2 text-sm text-[var(--af-grey-light)] hover:text-[var(--af-cream)]"
          >
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
