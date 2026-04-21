# Blender Avatar

Generate an anime-style character avatar using Blender bpy pipeline.

## When to use
- Triggered by "create avatar", "generate character", "make anime avatar"
- When user supplies character name, style, or description
- Alpha agent routing: 3D/Animation tasks

## Steps

1. Parse character description from request:
   - Name, style (`anime` | `chibi` | `semi-realistic`), hair color, pose
2. Send POST to `/api/hanna/avatar` with character params
3. Poll job status (status: `queued` → `processing` → `complete`)
4. When complete, fetch GLB/PNG from gallery endpoint
5. Report asset URL + preview thumbnail to user

## API Reference

```
POST /api/hanna/avatar
Body: {
  character_name: string,
  style: "anime" | "chibi" | "semi-realistic",
  hair_color: string,          // brand color token or hex
  pose: string,                // "standing" | "action" | "portrait"
  description?: string
}
Response: { task_id, status, message, timestamp }
```

## Error Handling
- If Blender job fails: report error, suggest simpler style
- If timeout (>10min): escalate to user with task_id for manual check
- Never silently discard failures

## Output
Confirm asset creation with: character name, style, asset URL, estimated time.
