'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { API_URL } from '@/lib/utils'
import { useI18n } from '@/lib/i18n'
import { TegakiText, TegakiStreamText } from '@/components/tegaki-text'

interface Message {
  role: 'user' | 'hanna'
  text: string
  timestamp: string
}

export function HannaChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { t } = useI18n()

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', text, timestamp: new Date().toISOString() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/hanna/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()

      const hannaMsg: Message = {
        role: 'hanna',
        text: data.response ?? 'No response from Hanna.',
        timestamp: data.timestamp ?? new Date().toISOString(),
      }
      setMessages((prev) => [...prev, hannaMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'hanna',
          text: 'Connection to Hanna API failed. She may be offline.',
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating trigger button — safe-area aware on iOS */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'fixed right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all sm:right-6',
          'bg-(--af-red) text-(--af-cream) hover:bg-(--af-red-dark)',
          open && 'rotate-45'
        )}
        style={{ bottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
        aria-label="Chat with Hanna"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          {open ? (
            <path d="M4 4l12 12M4 16L16 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          ) : (
            <>
              <path d="M3 4h14M3 10h10M3 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="16" cy="4" r="2" fill="var(--af-cream)" />
            </>
          )}
        </svg>
      </button>

      {/* Chat panel — mobile-safe width and positioning */}
      <div
        className={cn(
          'fixed right-4 z-50 flex flex-col overflow-hidden rounded-lg border border-white/10 bg-(--af-black) shadow-md sm:right-6',
          'w-[calc(100vw-2rem)] max-w-[20rem] sm:max-w-[24rem]',
          'transition-all duration-200',
          open ? 'h-[min(28rem,70svh)] opacity-100 translate-y-0' : 'h-0 opacity-0 translate-y-4 pointer-events-none'
        )}
        style={{ bottom: 'calc(max(1.25rem, env(safe-area-inset-bottom)) + 3.75rem)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--af-red) text-sm font-bold text-(--af-cream)">
            花
          </div>
          <div>
            <p className="text-sm font-semibold text-(--af-cream)">{t('hanna.title')}</p>
            <p className="text-[10px] text-(--af-grey-light)">{t('hanna.subtitle')}</p>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center mt-8 gap-3">
              {/* Hanna greeting drawn as handwriting (use-case #13) */}
              <TegakiText font="italianno" size={36} color="var(--af-cream)" className="text-center">
                こんにちは
              </TegakiText>
              <p className="text-center text-xs text-(--af-grey-light)">
                {t('hanna.description').slice(0, 80)}...
              </p>
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn(
                'max-w-[85%] rounded-sm px-3 py-2',
                msg.role === 'user'
                  ? 'ml-auto bg-(--af-red) text-(--af-cream) text-sm'
                  : 'bg-(--af-grey) text-(--af-cream)'
              )}
            >
              {/* Hanna replies use handwriting animation (use-case #4) */}
              {msg.role === 'hanna' ? (
                <TegakiStreamText text={msg.text} font="caveat" size={15} />
              ) : (
                msg.text
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-1 px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-(--af-grey-light) chat-dot" />
              <span className="h-1.5 w-1.5 rounded-full bg-(--af-grey-light) chat-dot" style={{ animationDelay: '150ms' }} />
              <span className="h-1.5 w-1.5 rounded-full bg-(--af-grey-light) chat-dot" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-white/5 px-3 py-3">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send() }}
              placeholder="Talk to Hanna..."
              className="flex-1 bg-transparent text-sm text-(--af-cream) placeholder:text-(--af-grey-light) outline-none"
              maxLength={2000}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-sm bg-(--af-red) text-(--af-cream) transition-colors hover:bg-(--af-red-dark) disabled:opacity-40"
              aria-label="Send message"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
