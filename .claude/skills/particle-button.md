# Particle Button

Apply a particle disintegration effect to a button on click.

## When to use
- Triggered by "particle button", "disintegrate button", "explode on click"
- Best used on primary CTAs, submit buttons, dramatic delete confirmations

## Steps

1. Wrap target button in a `particle-trigger` container
2. On click: snapshot button position/size via `getBoundingClientRect`
3. Spawn 30–50 small `<span>` particles at button center
4. Animate particles outward with randomized:
   - Direction (360° spread)
   - Velocity (fast → decelerate)
   - Opacity (1 → 0)
   - Scale (1 → 0)
5. Remove particles after animation completes (300ms)
6. Execute original click handler after delay (150ms)

## Integration Pattern

```tsx
const triggerParticles = (e: React.MouseEvent<HTMLButtonElement>) => {
  const btn = e.currentTarget
  const rect = btn.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('span')
    const angle = (i / 40) * 360
    const distance = 40 + Math.random() * 60
    const dx = Math.cos((angle * Math.PI) / 180) * distance
    const dy = Math.sin((angle * Math.PI) / 180) * distance

    particle.style.cssText = `
      position: fixed; width: 4px; height: 4px;
      background: var(--af-red); border-radius: 50%;
      left: ${centerX}px; top: ${centerY}px;
      pointer-events: none; z-index: 9999;
      animation: particle-fly 0.4s ease-out forwards;
    `
    document.body.appendChild(particle)
    setTimeout(() => particle.remove(), 400)
  }
}
```

## CSS Required
```css
@keyframes particle-fly {
  to { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(0); }
}
```

## Output
Confirm: button targeted, particle count, color matches brand tokens, animation timing.
