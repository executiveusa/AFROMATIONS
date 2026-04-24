# Mesh Gradient

Add an animated mesh gradient background to a section or hero area.

## When to use
- Triggered by "gradient background", "mesh gradient", "animated background", "color mesh"
- Best used on hero sections, feature highlights, loading screens

## Steps

1. Identify the target section or element
2. Create gradient using CSS custom properties + animation:
   - Colors: AFROMATIONS palette (black, red, indigo, cream)
   - 3–5 gradient points moving slowly (8–20s cycle)
3. Apply `mix-blend-mode` overlay if on top of content
4. Use `@keyframes` or `animation` API for smooth movement
5. Ensure contrast ratio passes WCAG AA (4.5:1) against text

## Implementation Pattern

```css
.mesh-gradient {
  background: radial-gradient(
    ellipse at var(--x1) var(--y1),
    var(--af-red) 0%,
    transparent 50%
  ),
  radial-gradient(
    ellipse at var(--x2) var(--y2),
    indigo 0%,
    transparent 50%
  ),
  var(--af-black);
  animation: mesh-move 12s ease-in-out infinite alternate;
}

@keyframes mesh-move {
  0%   { --x1: 20%; --y1: 30%; --x2: 80%; --y2: 70%; }
  100% { --x1: 70%; --y1: 60%; --x2: 20%; --y2: 20%; }
}
```

## Performance Notes
- Use `@property` for CSS custom property animation (Chrome/Edge)
- Fallback: JS-driven keyframes for Firefox
- GPU layer: add `will-change: background-position` carefully (check memory)
- Always test with `prefers-reduced-motion: reduce` fallback (static gradient)

## Output
Confirm: target element, color points, animation duration, accessibility contrast check.
