# OpenMontage Integration Skill — AFROMATIONS Studios

> Teaches Hanna how to use OpenMontage for video production.
> OpenMontage is an agentic video production system that handles research,
> scripting, asset generation, editing, and final composition.

---

## What OpenMontage Does

OpenMontage turns plain-language descriptions into finished videos through a pipeline of stages:
`idea → research → proposal → script → scene_plan → assets → edit → compose → publish`

Each stage has a "director skill" (markdown instructions) that governs creative decisions.

---

## Available Pipelines

| Pipeline | Use Case | Cost |
|----------|----------|------|
| **animation** | Anime/Ghibli style, motion graphics, illustrated sequences | ~$0.15/30s |
| **cinematic** | Trailers, brand films, dramatic edits | ~$2-5 |
| **animated-explainer** | Data viz, charts, educational content | $0 (free tools) |
| **talking-head** | Interview/presenter with B-roll | Varies |
| **hybrid** | Mixed source footage + AI-generated support | ~$1-3 |
| **avatar-spokesperson** | AI avatar presenter + overlays | ~$1.50 |
| **screen-demo** | Software tutorials, screen recordings | $0 |
| **clip-factory** | Short-form batch extraction from long content | $0 |
| **podcast-repurpose** | Podcast → video clips | $0 |
| **documentary-montage** | Documentary-style assembly | ~$1-3 |
| **localization-dub** | Localize/dub existing video | Varies |

---

## Style Playbooks

Apply visual consistency using playbooks:

- **anime-ghibli.yaml** — Warm watercolor aesthetic, Ghibli-style greens/golds, firefly particles
- **clean-professional.yaml** — Corporate/startup, clean modern look
- **flat-motion-graphics.yaml** — Bold colors, geometric shapes, explainer default
- **minimalist-diagram.yaml** — Technical diagrams, blueprint aesthetic

---

## Using OpenMontage with Seedance 2.0

For the highest-quality AI-generated video clips:

1. **Plan shots** using the Cinematic Shot Bible
2. **Create an OpenMontage project** via `create_project` with the appropriate pipeline
3. **Add scenes** with detailed Seedance-compatible prompts (8-component structure)
4. **Generate clips** via the `seedance-mcp` tools (`generate_video`, `generate_explainer`)
5. **Compose** using OpenMontage's Remotion composition engine

### Prompt Translation Flow

```
Shot List Entry → Seedance 8-Component Prompt → generate_video tool call
```

Example:
```yaml
# Shot list entry:
- shot: 3
  type: "CU"
  move: "slow push-in"
  subject: "Hanna, 27, silver-white hair, violet eyes, miko robes"
  action: "Opens her eyes, looks directly at camera"
  lighting: "volumetric blue light, rim light from behind"
  style: "anime, anamorphic, shallow DOF"
```

Becomes Seedance prompt:
```
Close-up, slow push-in.
Hanna — 27 years old, silver-white hair cascading past shoulders,
violet eyes, traditional white miko robes with red accents.
She slowly opens her eyes and looks directly into camera.
Setting: dark temple interior, floating particles of light.
Lighting: volumetric blue ambient with warm rim light from behind.
Style: anime aesthetic, anamorphic lens, shallow depth of field, film grain.
Audio: soft wind chime, distant taiko pulse, fabric rustle.
```

---

## Cost Management

Always estimate costs BEFORE generating:

| Component | Typical Cost |
|-----------|-------------|
| FLUX image (via fal.ai) | ~$0.01-0.03/image |
| Seedance 2.0 standard (10s) | ~$3.03/clip |
| Seedance 2.0 fast (5s) | ~$1.21/clip |
| Piper TTS (local) | Free |
| ElevenLabs TTS | ~$0.30/min |
| Music (Pixabay/free) | Free |
| Remotion render | Free (local) |

---

## AFROMATIONS Defaults

When Hanna creates videos for AFROMATIONS Studios:

- **Default pipeline**: `animation` (anime-ghibli playbook)
- **Default aspect ratio**: 16:9 for YouTube, 9:16 for socials
- **Default narration**: Hanna's voice (warm, precise, storytelling cadence)
- **Character consistency**: Always describe Hanna with the same physical anchors:
  - Silver-white hair, violet eyes, 27 years old
  - Traditional-meets-futuristic aesthetic (Neo-Edo 2087)
  - Confident posture, precise movements
- **Quality standard**: "Would Miyazaki approve?"
- **Target audience**: Tyshawn (age-appropriate, educational, inspiring)
