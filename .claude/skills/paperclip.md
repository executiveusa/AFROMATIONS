# Paperclip — File Handling

Efficient file operations: upload, download, format conversion, and organization.

## Source
`vendors/paperclip/` — File handling utilities.

## When to use
- Triggered by "upload file", "process attachment", "convert format"
- When handling manga page uploads, audio files, GLB exports
- For batch file operations (rename, organize, convert)

## Core Operations

### Upload
```
paperclip.upload(file, destination="gallery", optimize=True)
```

### Convert
```
paperclip.convert("character.fbx", to="glb", optimize_for="web")
paperclip.convert("page-001.png", to="webp", quality=85)
```

### Organize
```
paperclip.organize(source_dir="uploads/", pattern="manga-issue-{n}/page-{p:03d}")
```

### Validate
```
paperclip.validate(file, {
  max_size_mb: 50,
  allowed_types: ["glb", "fbx", "png", "webp"],
  dimensions: { max_width: 4096 }
})
```

## AFROMATIONS File Structure
```
assets/
├── manga/issues/{number}/pages/      → PNG/WebP pages
├── characters/glb/                    → 3D character exports
├── characters/renders/                → PNG character renders
├── audio/lessons/                     → MP3/OGG pronunciation
└── wiki/images/                       → Culture/mythology images
```

## Output
Confirm: file path, size, format, optimization applied.
