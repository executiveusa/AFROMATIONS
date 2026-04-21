# Glitch Effect

Apply an anime-style digital glitch transition to an element or page transition.

## When to use
- Triggered by "glitch", "anime glitch", "digital glitch", "glitch transition"
- Best used on page transitions, hover states, error states, dramatic reveals

## Steps

1. Identify trigger: hover | load | route-change | error state
2. Clone target element 2× (before/after pseudo-elements)
3. Apply RGB split: shift R channel +3px left, B channel +3px right, slight Y offset
4. Apply scanline overlay (repeating-linear-gradient)
5. Run animation for 300–500ms, then restore
6. Optional: add CRT screen flicker

## Implementation Pattern

```css
.glitch {
  position: relative;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  opacity: 0.8;
}

.glitch::before {
  animation: glitch-r 0.3s steps(2) infinite;
  clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
  color: var(--af-red);
  left: 2px;
}

.glitch::after {
  animation: glitch-b 0.3s steps(2) infinite reverse;
  clip-path: polygon(0 60%, 100% 60%, 100% 80%, 0 80%);
  color: #00f;
  left: -2px;
}

@keyframes glitch-r {
  0%   { transform: translate(0, 0); }
  33%  { transform: translate(2px, -1px); clip-path: polygon(0 20%, 100% 20%, 100% 40%, 0 40%); }
  66%  { transform: translate(-1px, 2px); clip-path: polygon(0 70%, 100% 70%, 100% 90%, 0 90%); }
  100% { transform: translate(0, 0); }
}
```

## Trigger on Route Change (Next.js)

```tsx
'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function GlitchTransition() {
  const path = usePathname()
  useEffect(() => {
    document.body.classList.add('glitch-active')
    const t = setTimeout(() => document.body.classList.remove('glitch-active'), 400)
    return () => clearTimeout(t)
  }, [path])
  return null
}
```

## Output
Confirm: trigger event, animation duration, RGB channel offsets, mobile tested.
