# Cursor Reactive

Add a magnetic cursor effect that reacts to interactive elements on hover.

## When to use
- Triggered by "cursor effect", "magnetic cursor", "cursor react", "cursor tracking"
- Best used on portfolio, gallery, or high-impact landing pages

## Steps

1. Create cursor overlay element (fixed, pointer-events:none, z-index:9999)
2. Track mouse position via `mousemove` listener
3. For elements with `data-magnetic` attribute: apply magnetic pull
   - Calculate distance from cursor to element center
   - Apply CSS transform offset (proportional to distance)
4. Animate cursor: scale up on hover, blend-mode change
5. Apply AFROMATIONS red accent to cursor

## Integration Pattern (Next.js)

```tsx
'use client'
import { useEffect, useRef } from 'react'

export function CursorReactive() {
  useEffect(() => {
    const cursor = document.createElement('div')
    cursor.className = 'cursor-dot'
    document.body.appendChild(cursor)

    const onMove = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cursor.remove()
    }
  }, [])
  return null
}
```

## CSS Required
```css
.cursor-dot {
  position: fixed;
  width: 8px;
  height: 8px;
  background: var(--af-red);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: transform 0.1s ease;
}
```

## Output
Confirm: cursor element created, magnetic elements marked, mobile disabled (touch).
