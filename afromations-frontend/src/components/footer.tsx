export function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-widest text-[var(--af-red)]">
            AFROMATIONS
          </span>
          <span className="text-[10px] tracking-[0.3em] text-[var(--af-grey-light)] uppercase">
            Studios
          </span>
        </div>

        <p className="text-[10px] tracking-wider text-[var(--af-grey-light)]">
          &copy; {new Date().getFullYear()} AFROMATIONS Studios. Powered by
          Agent Hanna 花
        </p>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/executiveusa/AFROMATIONS"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--af-grey-light)] transition-colors hover:text-[var(--af-cream)]"
          >
            GitHub
          </a>
          <a
            href="https://discord.gg/afromations"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--af-grey-light)] transition-colors hover:text-[var(--af-cream)]"
          >
            Discord
          </a>
        </div>
      </div>
    </footer>
  )
}
