const SERVICES = [
  { name: 'API', status: 'online' },
  { name: 'Database', status: 'online' },
  { name: 'Browser', status: 'online' },
  { name: 'Build', status: 'idle' },
]

export function StatusBar() {
  return (
    <div className="bg-[var(--af-grey)] border-b border-[var(--af-grey-mid)] px-6 py-2 flex items-center gap-6 overflow-x-auto">
      {SERVICES.map((s) => (
        <div key={s.name} className="flex items-center gap-1.5 shrink-0">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              s.status === 'online'
                ? 'bg-green-400'
                : s.status === 'idle'
                ? 'bg-[var(--af-grey-light)]'
                : 'bg-[var(--af-red)]'
            }`}
          />
          <span className="text-xs text-[var(--af-grey-light)]">{s.name}</span>
        </div>
      ))}
    </div>
  )
}
