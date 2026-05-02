# DUAL Agent

## Overview

DUAL is a multi-purpose agent based on Space Agent architecture. Unlike traditional chatbots trapped in text boxes, DUAL lives in the browser runtime itself — working directly with the same framework, modules, and UI it is reshaping.

## Origin

DUAL is the protagonist of the O.W.P.I.L universe, set in Seattle 2056. The name represents the duality of purpose — creation and destruction, tradition and innovation, individual and community.

**Japanese**: 目的なき者は滅びる  
**English**: One Without Purpose Is Lost

## Architecture

DUAL is built on Space Agent (https://github.com/agent0ai/space-agent), an open-source framework for building self-modifying agents.

### Core Principles

1. **Browser-Native Runtime**
   - Runs in the browser layer itself
   - Works directly with the same framework and UI it reshapes
   - No API wall between agent and interface

2. **Text-Based Skills**
   - New capabilities live in simple SKILL.md files
   - Agent can write and extend skills itself in plain text
   - No complex APIs or JSON schemas required

3. **Token-Efficient Execution**
   - No bulky tool-call JSON
   - Plain text and plain JavaScript in the same message
   - Fast and cheap execution

4. **Puzzle-Piece Modularity**
   - Core stays small
   - Add, remove, or swap pieces cleanly
   - Not welded into one rigid application

## Use Cases

### Interface Building
Ask for a page, dashboard, or widget and DUAL builds it live into your workspace. No waiting for deployments.

### Workflow Automation
Create custom workflows that connect tools, APIs, and processes. DUAL writes the automation logic in plain text.

### Tool Development
Need a new capability? DUAL can write SKILL.md files that extend what the agent can do — and keep extending.

### Team Collaboration
Scale from personal assistant to hierarchical team system. Per-user workspaces with group sharing when ready.

### Admin & Recovery
When things break, admin mode gives you a stable control plane. Git-backed history lets you roll back cleanly.

### Modular Extensibility
The core stays small. Add, remove, or swap pieces cleanly. Nothing is welded into one rigid application.

## Relationship to Agent Hana

While Agent Hana is the "Warrior Scholar" — focused on education, Japanese language, and creative skills — DUAL is the "Builder" — focused on creation, automation, and interface construction.

| Aspect | Agent Hana | DUAL Agent |
|--------|-----------|------------|
| Role | Educator | Builder |
| Focus | Learning, language, culture | Creation, automation, interfaces |
| Style | Structured lessons | On-demand building |
| Domain | Japanese, AI for Artists | Workflows, tools, spaces |

Both agents are part of the O.W.P.I.L universe and share the same philosophy: purpose drives creation.

## Integration with AFROMATIONS

DUAL is integrated into the AFROMATIONS platform as:

1. **Feature Card** (`/src/components/dual-feature.tsx`)
   - Appears on homepage after Hana's feature card
   - Seattle 2056 background with DUAL avatar
   - Overview of capabilities and use cases

2. **Dedicated Page** (`/app/dual/page.tsx`)
   - Full introduction to DUAL Agent
   - Use cases with detailed descriptions
   - Architecture explanation
   - O.W.P.I.L philosophy section

3. **Navigation**
   - Linked in main navbar
   - Accessible via `/dual` route

## Visual Identity

- **Avatar**: SVG representation with blindfold, dreadlocks, golden eyes
- **Background**: Seattle 2056 cityscape
- **Colors**: Red (#C41E3A), cream, dark grays
- **Symbol**: O.W.P.I.L flower/rose emblem

## DUAL Studio (AI Creative Suite)

DUAL powers the AI Studio at `/studio`, providing access to 200+ AI models for creative production. Built on [Open-Generative-AI](https://github.com/Anil-matcha/Open-Generative-AI).

### Studio Modes

| Mode | Models | Description |
|------|--------|-------------|
| **Image Studio** | 50+ | Text-to-image and image-to-image (Flux, Nano Banana 2, Midjourney, GPT-4o) |
| **Video Studio** | 60+ | Text-to-video and image-to-video (Kling, Sora, Veo, Runway) |
| **Lip Sync Studio** | 9 | Audio-driven portrait animation (Infinite Talk, Wan 2.2 Speech) |
| **Cinema Studio** | Pro | Cinematic camera controls (lenses, apertures, film stocks) |
| **Blender Control** | AI | 3D modeling with local + cloud control |
| **Workflow Studio** | Chain | Multi-step AI pipeline builder |

### Blender Integration

DUAL can control Blender locally or in the cloud:

- **Local Control:** Connect to Blender on localhost:5000 for real-time AI-assisted modeling
- **Cloud GPU:** Offload to RunPod, Vast.ai, or AWS for heavy renders
- **AI Assist:** Generate 3D models, apply anime shaders, auto-rig characters via prompts

### Capabilities

- Generate images from text or transform existing images
- Create cinematic videos from text or static frames
- Animate portraits with audio-driven lip sync
- Control virtual cameras with pro settings
- Build automated multi-step creative pipelines
- Control Blender for 3D character and scene creation

## Future Development

- [ ] Interactive DUAL workspace demo
- [ ] SKILL.md file browser
- [ ] Live interface building playground
- [ ] Integration with Space Agent backend
- [ ] Multi-user workspace support
- [ ] Full Blender Python API bridge
- [ ] Real-time collaboration in Studio
