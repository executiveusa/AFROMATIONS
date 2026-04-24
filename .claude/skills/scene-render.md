# Scene Render

Render a 3D scene to image or animation using Blender Eevee or Cycles.

## When to use
- Triggered by "render scene", "render animation", "render this"
- After scene is set up and shader is applied
- Alpha agent routing: 3D/Render tasks

## Steps

1. Confirm scene is ready (objects, lights, camera set)
2. Determine render engine from quality request:
   - Draft: Eevee, 512px, 32 samples
   - Standard: Eevee, 1080p, 64 samples
   - Final: Cycles, 1080p, 256 samples
3. Set camera angle if specified
4. Send render job to `/api/hanna/render`
5. Poll until complete (timeout: 20min)
6. Return rendered image/video URL

## API Reference

```
POST /api/hanna/render
Body: {
  scene_id: string,
  engine: "eevee" | "cycles",
  resolution: "512" | "1080" | "4k",
  samples: number,
  camera_angle?: string,
  output_format: "png" | "jpg" | "mp4"
}
Response: { task_id, status, output_url }
```

## Error Handling
- Memory errors → reduce samples, switch to Eevee
- Timeout → report task_id, suggest checking later

## Output
Report: engine used, resolution, duration, output URL.
