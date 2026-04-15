'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useI18n, LOCALES } from '@/lib/i18n'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { locale, setLocale, t } = useI18n()

  const links = [
    { label: t('nav.studio'), href: '#studio' },
    { label: t('nav.hanna'), href: '#hanna' },
    { label: t('nav.academy'), href: '#education' },
    { label: t('nav.gallery'), href: '#gallery' },
    { label: t('nav.blog'), href: '#blog' },
    { label: t('nav.community'), href: '#community' },
  ]

  const currentLocale = LOCALES.find((l) => l.code === locale)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-(--af-black)/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        {/* Logo mark */}
        <a href="/" className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-widest text-(--af-red)">
            {t('nav.brand')}
          </span>
          <span className="text-[10px] tracking-[0.3em] text-(--af-grey-light) uppercase">
            {t('nav.brand.sub')}
          </span>
        </a>

        {/* Desktop links + language toggle */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs tracking-wider text-(--af-grey-light) transition-colors hover:text-(--af-cream)"
            >
              {l.label}
            </a>
          ))}

          {/* Language toggle */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-[10px] font-medium tracking-wider text-(--af-grey-light) uppercase transition-colors hover:text-(--af-cream)"
              aria-label="Change language"
            >
              {currentLocale?.flag}
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={cn('transition-transform', langOpen && 'rotate-180')}>
                <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-32 overflow-hidden rounded-sm border border-white/10 bg-(--af-black)">
                {LOCALES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLocale(l.code); setLangOpen(false) }}
                    className={cn(
                      'flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-white/5',
                      locale === l.code ? 'text-(--af-red)' : 'text-(--af-grey-light)'
                    )}
                  >
                    <span className="text-[10px] font-medium tracking-wider">{l.flag}</span>
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Mobile language button */}
          <button
            onClick={() => { setLangOpen(!langOpen); setOpen(false) }}
            className="text-[10px] font-medium tracking-wider text-(--af-grey-light) uppercase"
            aria-label="Change language"
          >
            {currentLocale?.flag}
          </button>
          <button
            onClick={() => { setOpen(!open); setLangOpen(false) }}
            className="text-(--af-cream)"
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
      </div>

      {/* Mobile language panel */}
      <div
        className={cn(
          'md:hidden overflow-hidden border-t border-white/5 bg-(--af-black)',
          'transition-all duration-200',
          langOpen ? 'max-h-48 py-2' : 'max-h-0 py-0'
        )}
      >
        <div className="flex flex-wrap gap-2 px-6">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLocale(l.code); setLangOpen(false) }}
              className={cn(
                'rounded-sm px-3 py-1.5 text-xs transition-colors',
                locale === l.code
                  ? 'bg-(--af-red) text-(--af-cream)'
                  : 'border border-white/10 text-(--af-grey-light) hover:border-white/20'
              )}
            >
              {l.flag} {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile nav panel */}
      <div
        className={cn(
          'md:hidden overflow-hidden border-t border-white/5 bg-(--af-black)',
          'transition-all duration-200',
          open ? 'max-h-64 py-4' : 'max-h-0 py-0'
        )}
      >
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className="block px-6 py-2 text-sm text-(--af-grey-light) hover:text-(--af-cream)"
          >
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
