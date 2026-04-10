export function CommunitySection() {
  return (
    <section id="community" className="border-t border-white/5 px-6 py-32">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-[10px] font-medium tracking-[0.4em] text-[var(--af-red)] uppercase">
          Join Us
        </p>
        <h2
          className="text-3xl font-bold tracking-tight text-[var(--af-cream)] sm:text-4xl"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          The Biggest Black Anime Community
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[var(--af-grey-light)]">
          Creators, artists, writers, and fans building something that
          doesn&apos;t exist yet. Weekly digests. Creator spotlights. No
          gatekeeping.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <a
            href="https://discord.gg/afromations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-md bg-[var(--af-red)] px-6 text-xs font-semibold tracking-wider text-[var(--af-cream)] transition-colors hover:bg-[var(--af-red-dark)]"
          >
            Join Discord
          </a>
          <a
            href="https://twitter.com/afromations"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center rounded-md border border-white/10 px-6 text-xs font-semibold tracking-wider text-[var(--af-cream)] transition-colors hover:border-white/20"
          >
            Follow @afromations
          </a>
        </div>
      </div>
    </section>
  )
}
