# Zoom Parallax

Apply scroll-triggered zoom and parallax movement to images or sections.

## When to use
- Triggered by "parallax", "zoom on scroll", "scroll zoom", "depth effect"
- Best used on hero images, gallery sections, story pages

## Steps

1. Identify target element (image, background, or section)
2. Add `data-parallax` attribute with depth value (0.1–0.5)
3. Attach IntersectionObserver + scroll listener
4. Apply transform on scroll:
   - Y-offset: `scrollY * depthValue` (vertical parallax)
   - Scale: `1 + (scrollRatio * 0.1)` (subtle zoom)
5. Use `will-change: transform` for GPU acceleration
6. Cap parallax at ±50px to avoid content clipping

## Integration Pattern

```tsx
useEffect(() => {
  const el = ref.current
  if (!el) return

  const onScroll = () => {
    const rect = el.getBoundingClientRect()
    const scrollRatio = (window.innerHeight - rect.top) / window.innerHeight
    const depth = parseFloat(el.dataset.parallax || '0.2')
    el.style.transform = `translateY(${scrollRatio * depth * 50}px) scale(${1 + scrollRatio * 0.05})`
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  return () => window.removeEventListener('scroll', onScroll)
}, [])
```

## Performance Notes
- Always use `{ passive: true }` on scroll listener
- `will-change: transform` only on elements that animate
- Test on mobile: disable parallax if `prefers-reduced-motion`

## Output
Confirm: target element, depth value, mobile behavior, performance impact estimated.
