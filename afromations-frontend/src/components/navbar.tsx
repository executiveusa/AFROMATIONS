'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useI18n, LOCALES } from '@/lib/i18n'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open; auto-close when viewport grows to desktop
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)')
    const onBreakpoint = (e: MediaQueryListEvent) => {
      if (e.matches) { setOpen(false); setLangOpen(false) }
    }
    mql.addEventListener('change', onBreakpoint)
    return () => mql.removeEventListener('change', onBreakpoint)
  }, [])

  function handleLinkClick() {
    setOpen(false)
    setLangOpen(false)
  }

  return (
    <>
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 border-b border-white/5 transition-all duration-200',
          scrolled
            ? 'bg-(--af-black)/95 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.4)]'
            : 'bg-(--af-black)/80 backdrop-blur-sm'
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0" onClick={handleLinkClick}>
            <span className="text-sm font-bold tracking-widest text-(--af-red)">
              {t('nav.brand')}
            </span>
            <span className="hidden text-[10px] tracking-[0.3em] text-(--af-grey-light) uppercase sm:block">
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
                aria-expanded={langOpen}
              >
                {currentLocale?.flag}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={cn('transition-transform duration-150', langOpen && 'rotate-180')}>
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

          {/* Mobile controls */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={() => { setLangOpen(!langOpen); setOpen(false) }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[14px] text-(--af-grey-light) transition-colors hover:text-(--af-cream)"
              aria-label="Change language"
              aria-expanded={langOpen}
            >
              {currentLocale?.flag}
            </button>
            <button
              onClick={() => { setOpen(!open); setLangOpen(false) }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-(--af-cream)"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path
                  d={open ? 'M5 5l12 12M5 17L17 5' : 'M4 6h14M4 11h14M4 16h14'}
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
            'md:hidden overflow-hidden border-t border-white/5 bg-(--af-black)/95',
            'transition-all duration-200',
            langOpen ? 'max-h-48 py-3' : 'max-h-0 py-0'
          )}
        >
          <div className="flex flex-wrap gap-2 px-4">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLocale(l.code); setLangOpen(false) }}
                className={cn(
                  'rounded-full px-4 py-2 text-xs transition-colors',
                  locale === l.code
                    ? 'bg-(--af-red) text-(--af-cream)'
                    : 'border border-white/10 text-(--af-grey-light)'
                )}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden flex flex-col',
          'bg-(--af-black) transition-all duration-200',
          open
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
        style={{ paddingTop: '56px' }}
        aria-hidden={!open}
      >
        <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-safe">
          {/* Nav links */}
          <nav className="mt-6 flex flex-col gap-1">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={handleLinkClick}
                className={cn(
                  'flex items-center justify-between rounded-xl px-4 py-4 text-base font-medium',
                  'text-(--af-cream) transition-colors active:bg-white/5',
                  'border-b border-white/5 last:border-0',
                  open ? 'opacity-100' : 'opacity-0'
                )}
                style={{
                  transition: `opacity 0.2s ease ${open ? i * 30 : 0}ms, background-color 0.15s ease`,
                }}
              >
                <span>{l.label}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </nav>

          {/* Discord CTA */}
          <div className="mt-8 mb-4">
            <a
              href="https://discord.gg/afromations"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLinkClick}
              className="af-btn-primary flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold tracking-wider"
              aria-label="Join the AFROMATIONS Discord community"
            >
              {t('hero.cta.discord')}
            </a>
          </div>

          {/* Brand mark at bottom */}
          <div className="mt-auto py-6 flex items-center justify-center gap-2 opacity-30">
            <span className="text-xs font-bold tracking-widest text-(--af-red)">AFROMATIONS</span>
            <span className="text-[9px] tracking-[0.3em] text-(--af-grey-light) uppercase">STUDIO</span>
          </div>
        </div>
      </div>
    </>
  )
}
