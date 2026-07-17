'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { LOCALES, useI18n } from '@/lib/i18n'

const LINKS = [
  { label: 'Dual', href: '/dual' },
  { label: 'Hana', href: '/hana' },
  { label: 'Tattoo Artists', href: '/artist-partner-program' },
  { label: 'Sovereignty', href: '/provenance' },
  { label: 'Drops', href: '/drops' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { locale, setLocale } = useI18n()

  const currentLocale = LOCALES.find((item) => item.code === locale)

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

  const closePanels = () => {
    setOpen(false)
    setLangOpen(false)
  }

  return (
    <>
      <nav
        className={cn(
          'fixed inset-x-0 top-0 z-50 border-b border-white/5 transition-colors duration-200',
          scrolled ? 'bg-(--af-black)/95 backdrop-blur-md' : 'bg-(--af-black)/82 backdrop-blur-sm'
        )}
        aria-label="Primary navigation"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <a href="/" onClick={closePanels} className="flex items-center gap-2" aria-label="AFROMATIONS home">
            <span className="text-sm font-extrabold tracking-[0.16em] text-(--af-red)">AFROMATIONS</span>
            <span className="hidden text-[9px] tracking-[0.28em] text-(--af-grey-light) uppercase sm:block">
              Artist-owned anime studio
            </span>
          </a>

          <div className="hidden items-center gap-6 lg:flex">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-medium tracking-wide text-(--af-grey-light) transition-colors hover:text-(--af-cream)"
              >
                {link.label}
              </a>
            ))}
            <a href="/apply?path=artist" className="af-btn-primary rounded-full px-5 py-2 text-xs font-semibold">
              Join the Circle
            </a>

            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen((value) => !value)}
                className="flex min-h-10 min-w-10 items-center justify-center text-[10px] font-semibold tracking-wider text-(--af-grey-light)"
                aria-label="Change language"
                aria-expanded={langOpen}
              >
                {currentLocale?.flag}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-36 border border-white/10 bg-(--af-black) p-1 shadow-2xl">
                  {LOCALES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setLocale(item.code)
                        setLangOpen(false)
                      }}
                      className={cn(
                        'flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors hover:bg-white/5',
                        locale === item.code ? 'text-(--af-red)' : 'text-(--af-grey-light)'
                      )}
                    >
                      <span>{item.label}</span>
                      <span>{item.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <button
              type="button"
              onClick={() => {
                setLangOpen((value) => !value)
                setOpen(false)
              }}
              className="flex h-11 w-11 items-center justify-center text-[11px] font-semibold text-(--af-grey-light)"
              aria-label="Change language"
              aria-expanded={langOpen}
            >
              {currentLocale?.flag}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen((value) => !value)
                setLangOpen(false)
              }}
              className="flex h-11 w-11 items-center justify-center text-(--af-cream)"
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
        </div>

        {langOpen && (
          <div className="border-t border-white/5 bg-(--af-black) px-4 py-3 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-wrap gap-2">
              {LOCALES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLocale(item.code)
                    setLangOpen(false)
                  }}
                  className={cn(
                    'rounded-full border px-4 py-2 text-xs',
                    locale === item.code
                      ? 'border-(--af-red) bg-(--af-red) text-(--af-cream)'
                      : 'border-white/10 text-(--af-grey-light)'
                  )}
                >
                  {item.flag} {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div
        className={cn(
          'fixed inset-0 z-40 bg-(--af-black) pt-20 transition-opacity duration-200 lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col overflow-y-auto px-5 pb-safe">
          <div className="text-[10px] font-semibold tracking-[0.3em] text-(--af-red) uppercase">Navigate</div>
          <nav className="mt-5 border-t border-white/10">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closePanels}
                className="flex min-h-16 items-center justify-between border-b border-white/10 text-lg font-semibold text-(--af-cream)"
              >
                {link.label}
                <span className="text-(--af-red)" aria-hidden="true">→</span>
              </a>
            ))}
          </nav>
          <div className="mt-8 space-y-3">
            <a
              href="/apply?path=artist"
              onClick={closePanels}
              className="af-btn-primary flex min-h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold"
            >
              Join the Founding Artist Circle
            </a>
            <a
              href="/apply?path=hana"
              onClick={closePanels}
              className="af-btn-secondary flex min-h-12 w-full items-center justify-center rounded-full border px-6 text-sm font-semibold"
            >
              Build Your World with Hana
            </a>
          </div>
          <p className="mt-auto pb-8 pt-12 text-xs leading-relaxed text-(--af-grey-light)">
            AI drafts. Artists author. AFROMATIONS proves the process.
          </p>
        </div>
      </div>
    </>
  )
}
