# Cinematic Animations

Apply a cinematic visual animation from the AFROMATIONS component library.

## When to use
- Triggered by "add animation", "make it cinematic", "animate this section"
- When building or updating frontend pages
- Gamma/Primary agent routing: Frontend tasks

## Available Animation Modules

Located in `vendors/cinematic-site-components/`:

| # | Module | Trigger Phrase |
|---|--------|----------------|
| 02 | text-scramble | "scramble text", "katakana effect" |
| 03 | cursor-reactive | "magnetic cursor", "cursor effect" |
| 06 | zoom-parallax | "parallax scroll", "zoom on scroll" |
| 14 | particle-button | "disintegrate button", "particle effect" |
| 15 | glitch-effect | "glitch transition", "anime glitch" |
| 18 | mesh-gradient | "gradient background", "animated mesh" |
| 21 | kinetic-marquee | "scrolling text", "ticker", "marquee" |

## Steps

1. Identify which animation is needed
2. Copy the module JS file from `vendors/cinematic-site-components/[module]/`
3. Integrate into the target page or component:
   - For Next.js: wrap in `'use client'` and `useEffect`
   - For vanilla: direct script inclusion in `<head>`
4. Apply AFROMATIONS brand tokens (colors, fonts) to animation parameters
5. Test at mobile + desktop breakpoints

## Integration Pattern (Next.js)

```tsx
'use client'
import { useEffect, useRef } from 'react'

export function AnimatedSection() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // Init animation from vendor module
  }, [])
  return <div ref={ref}>...</div>
}
```

## Output
Confirm animation added with: module name, target component, mobile-tested status.
