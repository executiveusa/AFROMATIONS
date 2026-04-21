# Kinetic Marquee

Add a continuously scrolling text marquee (ticker) to a section.

## When to use
- Triggered by "scrolling text", "ticker", "marquee", "kinetic text", "news ticker"
- Best used on brand sections, press mentions, skill lists, announcement bars

## Steps

1. Identify the text content and scroll direction (horizontal default)
2. Duplicate content 2–3× to ensure seamless looping
3. Apply CSS animation: `translateX(-50%)` over duration
4. Speed: calculate from content length (aim for readable ~6s per screen width)
5. Add `direction-aware` class: pause on hover, reverse on RTL flag

## Implementation Pattern

```tsx
export function KineticMarquee({ items, speed = 30 }: { items: string[]; speed?: number }) {
  const content = [...items, ...items] // duplicate for seamless loop

  return (
    <div className="overflow-hidden whitespace-nowrap border-y border-white/10 py-3">
      <div
        className="inline-flex gap-12 animate-marquee"
        style={{ '--speed': `${speed}s` } as React.CSSProperties}
      >
        {content.map((item, i) => (
          <span key={i} className="text-sm font-semibold tracking-widest uppercase text-[var(--af-red)]">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
```

## Tailwind Config
```js
// tailwind.config.js
keyframes: {
  marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } }
},
animation: { marquee: 'marquee var(--speed, 30s) linear infinite' }
```

## Accessibility
- Mark with `aria-hidden="true"` (decorative)
- Pause with `prefers-reduced-motion: reduce`

## Output
Confirm: content list, speed, direction, accessibility handled.
