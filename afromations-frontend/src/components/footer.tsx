export function Footer() {
  return (
    <footer className="bg-(--af-black)">
      <section className="border-t border-white/5 px-5 py-16 sm:px-8 sm:py-20" aria-labelledby="footer-promise">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.32em] text-(--af-red) uppercase">AFROMATIONS</p>
            <h2
              id="footer-promise"
              className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-[-.035em] text-(--af-cream) sm:text-5xl"
              style={{ fontFamily: 'Sora, sans-serif', textWrap: 'balance' }}
            >
              We use technology to increase the artist&apos;s power—not the platform&apos;s control.
            </h2>
          </div>
          <div className="lg:text-right">
            <p className="text-sm leading-relaxed text-(--af-grey-light)">
              Starting locally with tattoo artists, anime creators, manga artists, and independent studios.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:justify-end">
              <a
                href="/apply?path=artist"
                className="af-btn-primary inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold"
              >
                Join the Artist Circle
              </a>
              <a
                href="/apply?path=hana"
                className="af-btn-secondary inline-flex min-h-12 items-center justify-center rounded-full border px-6 text-sm font-semibold"
              >
                Hire Hana — $1,495
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-white/5 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 text-xs text-(--af-grey-light) lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="font-bold tracking-[0.16em] text-(--af-red)">AFROMATIONS</div>
            <div className="mt-1">AI-assisted. Human-finished. Creator-owned.</div>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-3" aria-label="Footer navigation">
            <a href="/dual" className="transition-colors hover:text-(--af-cream)">Dual</a>
            <a href="/hana" className="transition-colors hover:text-(--af-cream)">Hana</a>
            <a href="/artist-partner-program" className="transition-colors hover:text-(--af-cream)">Tattoo Artists</a>
            <a href="/provenance" className="transition-colors hover:text-(--af-cream)">Sovereignty Vault</a>
            <a href="/apply" className="transition-colors hover:text-(--af-cream)">Apply</a>
          </nav>
          <div className="max-w-md text-[10px] leading-relaxed lg:text-right">
            © {new Date().getFullYear()} AFROMATIONS. Educational information only; not legal advice. Certificates and timestamps support records but do not automatically create copyright.
          </div>
        </div>
      </div>
    </footer>
  )
}
