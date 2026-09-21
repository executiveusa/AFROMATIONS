export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-(--af-black) px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-xs text-(--af-grey-light) sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="font-bold tracking-[0.16em] text-(--af-cream)">AFROMATIONS</div>
          <div className="mt-2">Original Worlds. Real Artists. Community Impact.</div>
        </div>
        <div>© {new Date().getFullYear()} AFROMATIONS</div>
      </div>
    </footer>
  )
}
