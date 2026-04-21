'use client'

import { useState } from 'react'

const QUICK_ACTIONS = [
  {
    label: 'Make My Character',
    sublabel: 'Create a new anime avatar',
    icon: '🧍',
    href: '/studio/avatar',
    primary: true,
  },
  {
    label: 'Render a Scene',
    sublabel: 'Turn your 3D scene into an image',
    icon: '🎬',
    href: '/studio/render',
    primary: false,
  },
  {
    label: 'Export for Web',
    sublabel: 'Get a 3D file ready to share',
    icon: '📦',
    href: '/studio/export',
    primary: false,
  },
  {
    label: 'View My Characters',
    sublabel: 'See everything you\'ve made',
    icon: '🖼️',
    href: '/studio/gallery',
    primary: false,
  },
]

const RECENT_RENDERS = [
  { name: 'Warrior Pose v3', status: 'done', time: '2h ago' },
  { name: 'Battle Scene Draft', status: 'done', time: '1d ago' },
  { name: 'Character Sheet', status: 'processing', time: 'running...' },
]

export function StudioQuadrant() {
  return (
    <section className="bg-[var(--af-black)] p-6 flex flex-col gap-5 min-h-[420px]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xl">
          🏯
        </div>
        <div>
          <h2
            className="text-lg font-bold text-[var(--af-cream)]"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            3D Studio
          </h2>
          <p className="text-xs text-[var(--af-grey-light)]">
            Create characters &amp; scenes
          </p>
        </div>
      </div>

      {/* Primary action — big and obvious */}
      <a
        href={QUICK_ACTIONS[0].href}
        className="btn-large flex items-center gap-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-5 py-4 transition-colors"
      >
        <span className="text-3xl">{QUICK_ACTIONS[0].icon}</span>
        <div>
          <div className="font-bold text-base">{QUICK_ACTIONS[0].label}</div>
          <div className="text-indigo-200 text-sm">{QUICK_ACTIONS[0].sublabel}</div>
        </div>
        <span className="ml-auto text-2xl text-indigo-300">→</span>
      </a>

      {/* Secondary actions */}
      <div className="grid grid-cols-3 gap-2">
        {QUICK_ACTIONS.slice(1).map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="btn-large flex flex-col items-center justify-center gap-1.5 bg-[var(--af-grey)] hover:bg-[var(--af-grey-mid)] rounded-xl p-3 transition-colors text-center"
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-xs font-semibold text-[var(--af-cream)] leading-tight">
              {action.label.split(' ').slice(0, 2).join(' ')}
            </span>
          </a>
        ))}
      </div>

      {/* Recent renders */}
      <div>
        <p className="text-xs font-semibold text-[var(--af-grey-light)] uppercase tracking-wider mb-2">
          Recent
        </p>
        <div className="space-y-1.5">
          {RECENT_RENDERS.map((r) => (
            <div
              key={r.name}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-[var(--af-grey)]/50"
            >
              <span className="text-sm text-[var(--af-cream)] truncate">{r.name}</span>
              <span
                className={`text-xs shrink-0 ml-3 ${
                  r.status === 'done'
                    ? 'text-green-400'
                    : 'text-yellow-400 animate-pulse'
                }`}
              >
                {r.status === 'done' ? '✓' : '⟳'} {r.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
