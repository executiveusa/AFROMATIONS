# Tegaki — Japanese Handwriting Input

Enable Japanese handwriting recognition and input for learner assessments.

## Source
`vendors/tegaki/` — Japanese handwriting recognition component.
GitHub: https://github.com/KurtGokhan/tegaki

## When to use
- Triggered by "handwriting", "write kanji", "draw character", "tegaki"
- For writing-based assessments in the Hana Learning OS
- When learner wants to practice kanji by drawing

## Integration (Frontend)

```tsx
'use client'
import { useEffect, useRef } from 'react'

export function HandwritingInput({ onResult }: { onResult: (kanji: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Initialize tegaki on canvas element
    // See vendors/tegaki/README.md for full API
    const canvas = canvasRef.current
    if (!canvas) return
    // tegaki.init(canvas, { onResult })
  }, [])

  return (
    <div className="handwriting-container">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="border border-[var(--af-grey-mid)] rounded bg-[var(--af-cream)]"
        style={{ touchAction: 'none' }}
      />
      <p className="text-xs text-[var(--af-grey-light)] mt-2">
        Draw the character here
      </p>
    </div>
  )
}
```

## Assessment Integration (Hana)
1. Learner draws kanji on canvas
2. Tegaki recognizes character
3. Compare to expected answer
4. Score: Correct (100%) / Stroke-order issue (70%) / Wrong (0%)
5. Submit to `/api/hana/assess/reading`

## Output
Return recognized character + confidence score.
