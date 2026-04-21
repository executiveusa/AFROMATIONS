# GLB Export

Export a Blender scene or character as web-optimized GLB format.

## When to use
- Triggered by "export GLB", "export for web", "get the 3D file"
- After avatar or scene is finalized and approved
- Alpha agent routing: 3D/Export tasks

## Steps

1. Confirm source object exists in Blender scene
2. Apply optimizations before export:
   - Mesh: decimation to <10k polys for web
   - Textures: compress to WebP, max 1024px
   - Armature: keep if animated; strip if static
3. Export via `/api/hanna/export`
4. Validate file size (<5MB for web real-time, <50MB for download)
5. Return download URL + file metadata

## API Reference

```
POST /api/hanna/export
Body: {
  scene_id: string,
  format: "glb" | "fbx" | "png",
  optimize_for: "web" | "quality" | "archive",
  include_animations: boolean
}
Response: { download_url, file_size_mb, poly_count, texture_count }
```

## File Size Guidelines
- Web viewer: < 5MB
- Download asset: < 50MB
- Archive master: no limit

## Output
Report: format, file size, poly count, download URL.
