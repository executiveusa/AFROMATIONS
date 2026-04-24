# Kupuri Shader

Apply anime toon shader and Freestyle outlines to a Blender character or scene.

## When to use
- Triggered by "apply toon shader", "anime outline", "cell shade", "kupuri shader"
- After avatar creation, when visual style needs finalizing
- Alpha agent routing: 3D/Shader tasks

## Steps

1. Confirm target object exists in Blender scene (or request GLB import)
2. Apply AFROMATIONS toon shader node group:
   - Base color + shadow threshold (0.4)
   - Highlight rim (intensity: 0.6)
   - Outline weight: 2px (Freestyle)
3. Set lighting to 3-point anime rig (key, fill, back)
4. Render preview (Eevee, 1024×1024)
5. Return preview URL and shader settings

## Shader Settings Reference
```
Toon:
  base_color: per-character (from palette)
  shadow_color: darken 30%
  highlight_color: lighten 15%
  outline_color: #1a1a1a
  outline_weight: 2.0

Lighting:
  key: 45° angle, strength 3.0
  fill: opposite, strength 1.0
  back: behind character, strength 2.0, accent color
```

## Output
Confirm shader applied with: settings summary, preview URL.
