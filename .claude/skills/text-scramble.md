# Text Scramble

Apply katakana character scramble effect to a heading or text element.

## When to use
- Triggered by "scramble text", "katakana effect", "anime text reveal", "text scramble"
- Common use: hero headings, page titles, dramatic reveal moments

## Steps

1. Locate the heading/text element to animate
2. Apply scramble using built-in pattern (already in `hero-section.tsx`):
   ```ts
   const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ花刀剣侍忍闇光影夢'
   ```
3. Set scramble parameters:
   - `totalFrames`: 18 (default)
   - `frameInterval`: 40ms
   - `delay`: 600ms after mount
4. Attach via `useEffect` + `ref`
5. Verify it fires once on mount (not repeating)

## Code Reference

Existing implementation: `afromations-frontend/src/components/hero-section.tsx:6-24`

## New Element Integration

```tsx
const ref = useRef<HTMLHeadingElement>(null)
useEffect(() => {
  const el = ref.current
  if (!el) return
  const final = el.textContent ?? ''
  const timer = setTimeout(() => scramble(el, final), 600)
  return () => clearTimeout(timer)
}, [])
```

## Output
Confirm: element targeted, character set used, delay applied, tested in browser.
