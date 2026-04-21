export function DashboardHeader() {
  return (
    <header className="bg-[var(--af-grey)] border-b border-[var(--af-grey-mid)] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Logo mark */}
        <div
          className="text-xl font-black text-[var(--af-cream)] tracking-tight"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          AFROMATIONS
        </div>
        <span className="hidden sm:block text-[var(--af-grey-light)] text-sm">
          Studio Dashboard
        </span>
      </div>

      {/* Right side — user/status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-[var(--af-grey-light)] hidden sm:block">
            Hanna Online
          </span>
        </div>

        <div
          className="w-8 h-8 rounded-full bg-[var(--af-red)] flex items-center justify-center text-xs font-bold text-white"
          title="Tyshawn"
        >
          T
        </div>
      </div>
    </header>
  )
}
