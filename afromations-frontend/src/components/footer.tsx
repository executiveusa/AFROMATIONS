const footerLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Artists', href: '/artists' },
  { label: 'Community', href: '/community' },
  { label: 'Stories', href: '/stories' },
  { label: 'Studio', href: '/studio' },
  { label: 'Shop', href: '/store' },
]

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-(--af-black) px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <a href="/" className="text-sm font-bold tracking-[0.16em] text-(--af-cream)">AFROMATIONS</a>
            <div className="mt-3 max-w-md text-xs leading-6 text-(--af-grey-light)">
              Original Worlds. Real Artists. Community Impact.
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-(--af-grey-light)" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-(--af-cream)">
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/8 pt-5 text-[11px] text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} AFROMATIONS</span>
          <a href="/apply?path=project" className="transition-colors hover:text-(--af-cream)">Work With Us</a>
        </div>
      </div>
    </footer>
  )
}
