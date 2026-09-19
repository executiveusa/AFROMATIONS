# DUAL Hero Production Pipeline

Status: PREPARED — no generation submitted yet.

## Decision

Primary production candidate: **Seedance 2.5 / omni_reference**.
Fallback / identity-control candidate: **Seedance 2.0**.

Why:
- Seedance 2.5 is Higgsfield's current default general-video model and supports multimodal omni-reference generation, editing, and extension up to 30 seconds.
- Seedance 2.0 remains useful for this IP because it supports 4K, an explicit noir genre control, and Higgsfield reusable Elements. It is capped at 15 seconds.
- For DUAL, anime style is driven by references + prompt + camera grammar, not by the version number alone.

## Higgsfield DUAL assets

Reusable character element:
- name: DUAL
- element id: `5cac4a6e-6511-4c2f-8336-2fe174d42084`
- status: completed
- intended use: Seedance 2.0 / supported element-aware image-video models

Direct image references for Seedance 2.5:
- `3d59c75f-d327-4b76-9c35-e16b2090e53b`
- `03a3df41-e418-4f42-93d6-2312f04e5946`
- `7943c5f5-f91c-4ae7-99b9-bb9eda4f1197`
- `97b7cc65-e27e-4692-ac66-205a43ecbc61`
- `13c61f12-90de-42e4-b8fa-899c89c4f3d7`

## Current test economics

Seedance 2.5, 15 sec, 16:9, five references:
- 720p standard: 105 credits
- 1080p high: 180 credits

Seedance 2.0, 15 sec, 16:9, five references:
- 720p standard: 67.5 credits
- 1080p high: 165 credits

Do not submit both at full quality.

Recommended proof sequence:
1. one 720p Seedance 2.5 omni-reference test;
2. identity/camera QA;
3. if identity drifts, run one 720p Seedance 2.0 control test;
4. choose the winner;
5. make the 1080p production master only after approval.

## Canon locks

DUAL is always spelled DUAL.

Preserve:
- deep-brown skin
- purple rope-locs
- teal headband
- dark hood/cowl
- wrapped hands/forearms
- lean athletic build
- fixed left/right face logic
- human-side golden iris
- shadow side never mirrored
- no photoreal redesign
- Seattle 2056, not generic Tokyo

## 15-second cold-open grammar

0.0-3.5 — Ma + Jiwa Pan
Rain-streaked Seattle window → very slow horizontal reveal → DUAL seated on bed.

3.5-7.0 — controlled dolly-in
DUAL lowers hands, lifts head, human-side gold eye appears first; shadow side stays restrained.

7.0-11.0 — Shoe Pan
DUAL rises and walks toward the bedroom door; camera tracks beside him.

11.0-15.0 — detail + knock + Ma
Wrapped hand settles on knob → knock → freeze → tight three-quarter hold → cut to black.

No dialogue. No title generated inside the video. HTML owns all site copy.

## HyperFrames role

Higgsfield generates the source performance. HyperFrames is the deterministic finishing layer.

Use HyperFrames for:
- exact 15-second trim;
- final cut timing;
- optional rain/light sound design synchronization;
- web-safe fade/cut to black;
- poster-frame extraction;
- delivery renders;
- later social derivatives.

Do NOT ask HyperFrames to recreate DUAL. It assembles and finishes approved footage.

## Web delivery contract

The AFROMATIONS hero is already wired to:

`NEXT_PUBLIC_DUAL_HERO_VIDEO_URL`

Behavior:
- if the URL exists: autoplay, muted, loop, playsInline video;
- if absent: preserve the existing DUAL poster;
- poster is always retained as fallback;
- reduced-motion treatment will be added when the final master is selected.

Production copy is not baked into the generated video.

## Approval gate

No paid generation until owner explicitly approves the first test.

Recommended next run:
**Seedance 2.5 · omni_reference · 720p · 15 sec · silent · 16:9**
