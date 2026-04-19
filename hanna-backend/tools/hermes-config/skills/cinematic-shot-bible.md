# Cinematic Shot Bible — AFROMATIONS Studios

> Hanna's complete reference for camera work, shot composition, and video production.
> Use this when planning shots for Seedance 2.0, OpenMontage pipelines, or any video project.
> Sources: OpenMontage creative skills, StudioBinder, No Film School, Higgsfield AI shot catalog,
> Walter Murch "In the Blink of an Eye", Roger Deakins masterclass notes.

---

## Shot List Template (Higgsfield-Style)

Every video project gets a structured shot list before any generation begins.
Each shot entry follows this format:

```yaml
- shot_number: 1
  shot_type: "wide establishing"
  camera_movement: "slow aerial push-in"
  duration_seconds: 5
  subject: "Neo-Edo cityscape at sunset, holographic billboards flickering"
  action: "Camera descends through clouds revealing the city skyline"
  lighting: "golden hour, volumetric light through haze"
  audio: "distant city hum, wind, faint synthwave bass"
  style: "anamorphic 2.39:1, teal-orange grade, 35mm grain"
  purpose: "establish world, set tone"
  transition_in: "fade from black"
  transition_out: "match cut to shot 2"
  generation_model: "seedance-2.0"
  estimated_cost: "$3.03"
```

---

## I. Camera Shot Types — Complete Reference

### Distance Shots

| Shot | Abbreviation | Framing | Emotional Effect | Best For |
|------|-------------|---------|------------------|----------|
| **Extreme Wide Shot (EWS)** | EWS | Subject tiny in vast landscape | Isolation, scale, awe | World-building, establishing |
| **Wide / Establishing Shot** | WS | Full environment, subject visible | Context, geography, mood | Opening scenes, location shifts |
| **Full Shot** | FS | Subject head-to-toe, some environment | Balance of character + world | Character introductions |
| **Medium Long Shot (Cowboy)** | MLS | Knees up | Action readiness, Western homage | Walk-and-talk, standoffs |
| **Medium Shot** | MS | Waist up | Neutral, conversational | Dialogue, interviews, tutorials |
| **Medium Close-Up** | MCU | Chest up | Intimacy without invasion | Key dialogue, emotional beats |
| **Close-Up** | CU | Face fills frame | Raw emotion, emphasis | Reactions, reveals, tension |
| **Extreme Close-Up (ECU)** | ECU | Single detail (eye, hand, object) | Hyper-focus, tension, beauty | Reveals, horror, product shots |
| **Insert Shot** | INS | Object or detail, not the subject | Information, emphasis | Props, text, UI, hands |

### Angle Shots

| Angle | Effect | When to Use |
|-------|--------|-------------|
| **Eye Level** | Neutral, equal to subject | Default — dialogue, explainers |
| **Low Angle** | Subject appears powerful, dominant, heroic | Hero moments, villains, authority |
| **High Angle** | Subject appears small, vulnerable, weak | Defeat, isolation, submission |
| **Bird's Eye / Top-Down** | God-like omniscience, map view | Overviews, strategy, pattern reveals |
| **Worm's Eye** | Extreme low, looking straight up | Towering buildings, power imbalance |
| **Dutch Angle (Canted)** | Tilted horizon — unease, chaos, disorientation | Tension, madness, surreal moments |
| **Over-the-Shoulder (OTS)** | One subject framed past another's shoulder | Conversations, confrontations |
| **Point-of-View (POV)** | Camera IS the character's eyes | Immersion, horror, games, VR |
| **Shoulder Level** | Camera at subject's shoulder height | Neutral-intimate, documentary |
| **Hip Level** | Camera at waist — emphasizes hands/action | Westerns, hand-to-hand combat |
| **Knee Level** | Low but not extreme | Children's perspective, pets |
| **Ground Level** | Camera on the ground | Footsteps, chase, survival |

---

## II. Camera Movements — Complete Reference

### Basic Movements

| Movement | Description | Emotional Effect | Prompt Language |
|----------|-------------|------------------|-----------------|
| **Static / Locked Off** | No movement at all | Stability, observation, tension | "static shot", "locked camera" |
| **Pan** (L/R) | Camera rotates horizontally on tripod | Reveal, follow, survey | "slow pan left", "whip pan right" |
| **Tilt** (Up/Down) | Camera rotates vertically on tripod | Reveal height, power shift | "tilt up revealing", "slow tilt down" |
| **Dolly In** | Camera physically moves toward subject | Building tension, intimacy | "slow dolly-in", "dolly push" |
| **Dolly Out / Pull Back** | Camera moves away from subject | Reveal context, isolation | "dolly pull-back", "slow retreat" |
| **Truck / Lateral Track** | Camera moves sideways parallel to subject | Parallels movement, reveals | "tracking left", "lateral truck" |
| **Pedestal** (Up/Down) | Camera moves vertically (like an elevator) | Smooth elevation, grandeur | "pedestal up", "camera rises" |
| **Zoom In / Out** | Lens focal length changes (not physical) | Quick emphasis, retro feel | "slow zoom in", "snap zoom" |

### Advanced Movements

| Movement | Description | Emotional Effect | Prompt Language |
|----------|-------------|------------------|-----------------|
| **Crane Shot** | Sweeping vertical arc via crane/jib | Epic reveals, transitions, majesty | "crane up over", "jib sweep" |
| **Arc Shot** | Camera orbits around subject | Dramatic emphasis, 360° reveal | "arc around subject", "orbit shot" |
| **Tracking / Follow Shot** | Camera follows subject in motion | Energy, pursuit, journey | "tracking shot following", "steadicam follow" |
| **Dolly Zoom (Vertigo)** | Dolly one direction + zoom opposite | Disorientation, revelation, dread | "dolly zoom", "vertigo effect", "zolly" |
| **Whip Pan** | Extremely fast pan (motion blur) | Energy, surprise, scene transition | "whip pan to", "snap pan" |
| **Handheld / Shaky Cam** | Intentionally unstable, human feel | Urgency, realism, documentary | "handheld", "raw handheld", "vérité" |
| **Steadicam / Gimbal** | Smooth handheld-style movement | Fluid tracking, immersive | "steadicam glide", "gimbal smooth" |
| **Aerial / Drone** | High altitude, smooth flight path | Landscapes, establishing, scale | "aerial descent", "drone push-in" |
| **Slow Push-In** | Gradual, almost imperceptible forward | Building intimacy, creeping tension | "slow push-in", "creeping forward" |
| **Pull Focus / Rack Focus** | Shift focus between foreground & background | Redirect attention, reveal | "rack focus from X to Y" |
| **Crab Shot** | Diagonal movement (between dolly & truck) | Dynamic energy, disorientation | "crab left", "diagonal track" |
| **Roll / Dutch Roll** | Camera rotates on its axis | Dream, chaos, surrealism | "camera rolls", "rotating horizon" |

### Compound Movements (Cinematic Gold)

| Combination | Description | Use Case |
|-------------|-------------|----------|
| **Crane + Pan** | Rise while rotating | Grand reveals, establishing |
| **Dolly + Tilt** | Move forward while tilting up | Approaching something tall |
| **Track + Zoom** | Sideways movement + zoom | Parallax emphasis |
| **Aerial + Crane Down** | Descend from sky to ground level | World-to-character transition |
| **Arc + Dolly In** | Spiral inward toward subject | Building to climax, confrontation |
| **Steadicam + Tilt** | Smooth follow with vertical reveal | Following subject into new space |

---

## III. Lighting Setups

### Key Lighting Styles

| Style | Description | Mood | Best For |
|-------|-------------|------|----------|
| **Natural Light** | Sun/moon as primary source | Authentic, honest | Documentary, slice-of-life |
| **Golden Hour** | Sun 15° above horizon, warm amber | Romantic, nostalgic, warm | Beauty shots, emotional moments |
| **Blue Hour** | Post-sunset, cool blue ambient | Melancholy, mystery, magic | Transitions, contemplative beats |
| **High-Key** | Bright, even, minimal shadows | Cheerful, clean, approachable | Comedy, lifestyle, tutorials |
| **Low-Key** | Dark, high contrast, deep shadows | Dramatic, mysterious, intense | Thriller, horror, drama |
| **Rembrandt** | Triangle of light on cheek | Classic, dignified, artistic | Portraits, character moments |
| **Film Noir** | Hard side light, extreme shadows | Tension, mystery, danger | Thriller, detective, crime |
| **Volumetric** | Visible light rays (fog, dust, haze) | Atmosphere, divine, epic | Fantasy, sci-fi, spiritual |
| **Backlighting** | Light behind subject, face in shadow | Silhouette, mystery, beauty | Reveals, transitions, mood |
| **Rim / Edge Light** | Light outlines subject from behind | Separation, drama, sci-fi | Character introduction, sci-fi |
| **Practical Lights** | In-frame sources (lamps, neon, candles) | Realism, atmosphere, warmth | Night scenes, interiors |
| **Split Lighting** | Hard light on exactly half the face | Duality, conflict, secrets | Character conflict, two-sided |
| **Butterfly / Paramount** | Light directly above, shadow under nose | Glamour, beauty, classic | Beauty shots, fashion |
| **Cross Lighting** | Two opposing light sources | Tension, energy, visual interest | Action, confrontation |

### Color Temperature Guide

| Source | Kelvin | Mood |
|--------|--------|------|
| Candlelight | 1800K | Intimate, warm, ancient |
| Tungsten / Warm bulb | 2700K | Cozy, domestic, safe |
| Sunset / Golden hour | 3200K | Romantic, nostalgic |
| Fluorescent | 4000K | Clinical, institutional |
| Daylight / Overcast | 5600K | Neutral, natural |
| Shade / Blue sky | 7000K | Cool, detached, sad |
| Moonlight | 4100K (blue-filtered) | Mystery, night, lonely |

---

## IV. Lens & Optical Effects

| Lens / Effect | Description | Emotional Impact |
|---------------|-------------|-----------------|
| **Wide-Angle (16-35mm)** | Broad view, exaggerated perspective | Scale, distortion, environment focus |
| **Normal (35-50mm)** | Natural human perspective | Neutral, documentary |
| **Telephoto (85-200mm)** | Compressed perspective, shallow DOF | Isolation, intimacy, voyeurism |
| **Macro** | Extreme close on tiny subjects | Wonder, detail, science |
| **Anamorphic** | Wider aspect ratio, signature flares | Cinematic, epic, premium |
| **Shallow DOF** | Subject sharp, background bokeh | Focus attention, dreamy |
| **Deep Focus** | Everything sharp, foreground to background | Observation, Kubrick-style |
| **Rack Focus** | Shift focus between planes | Redirect, reveal, connection |
| **Lens Flare** | Streaks from light hitting lens | Cinematic, sci-fi, warmth |
| **Tilt-Shift** | Selective focus plane tilt | Miniature effect, dream |
| **Fisheye** | Ultra-wide barrel distortion | Surreal, skate/music video |
| **Split Diopter** | Two focal planes simultaneously | Tension, De Palma homage |

---

## V. Cinematic Transition Vocabulary

| Transition | Description | When to Use |
|------------|-------------|-------------|
| **Hard Cut** | Instant switch | Scene changes, energy, shock |
| **Match Cut** | Visual similarity bridges two shots | Thematic connection, time passage |
| **J-Cut** | Audio from next scene starts early | Smooth narrative flow |
| **L-Cut** | Audio from current scene continues | Continuity, dialogue scenes |
| **Cross Dissolve** | Gradual blend between shots | Time passage, connection |
| **Fade to Black** | Image fades to darkness | End of sequence, finality |
| **Fade from Black** | Darkness gives way to image | Beginning, rebirth |
| **Whip Pan** | Fast pan blurs to transition | Energy, comedy, speed |
| **Iris In/Out** | Circular reveal/close | Retro, anime, highlight |
| **Smash Cut** | Abrupt jarring cut | Comedy, contrast, shock |
| **Invisible Cut** | Hidden in movement/darkness | Long-take illusion |
| **Graphic Match** | Shape/color similarity bridges | Artistic, associative |
| **Morph** | One image transforms to another | Transformation, evolution |

---

## VI. Pacing & Rhythm

### Average Shot Length by Genre

| Style | Avg. Shot Duration | Cuts/Minute |
|-------|-------------------|-------------|
| Action / Hype Edit | 1-3s | 20-40 |
| Music Video | 2-4s | 15-30 |
| Standard Cinematic | 4-8s | 8-15 |
| Documentary | 6-12s | 5-10 |
| Contemplative / Art | 10-20s | 3-6 |
| Long Take / Oner | 30s-5min | 0-2 |
| Montage Sequence | 1-3s | 20-40 |
| Explainer / Tutorial | 3-5s | 12-20 |
| Anime Action | 1-2s | 30-60 |

### The Breathing Rhythm

Never use the same shot length 3 times in a row:
```
LONG (8s) → MED (5s) → SHORT (3s) → SHORT (2s) → LONG (10s) → MED (6s)
```

### Walter Murch's 6 Priorities (in order)

1. **Emotion** — Does this cut serve the emotional arc?
2. **Story** — Does it advance the narrative?
3. **Rhythm** — Does it feel right in the pacing?
4. **Eye Trace** — Where is the viewer looking?
5. **2D Plane** — Screen geography (180° rule)
6. **3D Space** — Spatial continuity

---

## VII. Shot List Presets by Video Type

### Anime/Manga Explainer (60s)

```yaml
shots:
  - { n: 1, type: "EWS", move: "aerial descent", dur: 5, purpose: "establish world" }
  - { n: 2, type: "MS",  move: "static", dur: 4, purpose: "introduce narrator/host" }
  - { n: 3, type: "CU",  move: "slow push-in", dur: 3, purpose: "hook — key visual" }
  - { n: 4, type: "WS",  move: "pan right", dur: 5, purpose: "concept 1 — show context" }
  - { n: 5, type: "MCU", move: "static", dur: 4, purpose: "concept 1 — explain" }
  - { n: 6, type: "INS", move: "dolly-in", dur: 3, purpose: "detail / diagram" }
  - { n: 7, type: "MS",  move: "arc shot", dur: 5, purpose: "concept 2 — complication" }
  - { n: 8, type: "ECU", move: "rack focus", dur: 3, purpose: "key insight reveal" }
  - { n: 9, type: "WS",  move: "crane up", dur: 5, purpose: "proof / example" }
  - { n: 10, type: "CU", move: "slow dolly-out", dur: 4, purpose: "so what / implications" }
  - { n: 11, type: "EWS", move: "aerial pull-back", dur: 5, purpose: "reframe + close" }
  - { n: 12, type: "MS",  move: "static", dur: 4, purpose: "CTA / end card" }
total_duration: 50s
narration_wpm: 155
```

### Cinematic Trailer (30s)

```yaml
shots:
  - { n: 1, type: "EWS", move: "slow aerial push-in", dur: 4, purpose: "world reveal", audio: "low rumble" }
  - { n: 2, type: "CU",  move: "static", dur: 2, purpose: "character face", audio: "breath" }
  - { n: 3, type: "WS",  move: "tracking", dur: 3, purpose: "action setup", audio: "rising strings" }
  - { n: 4, type: "MCU", move: "handheld", dur: 2, purpose: "tension", audio: "heartbeat" }
  - { n: 5, type: "ECU", move: "snap zoom", dur: 1, purpose: "detail hit", audio: "impact SFX" }
  - { n: 6, type: "WS",  move: "crane sweep", dur: 4, purpose: "spectacle shot", audio: "full score" }
  - { n: 7, type: "MS",  move: "dolly-in", dur: 3, purpose: "emotional peak", audio: "silence → hit" }
  - { n: 8, type: "CU",  move: "slow push-in", dur: 3, purpose: "hero line / tagline", audio: "dialogue" }
  - { n: 9, type: "EWS", move: "dolly zoom", dur: 3, purpose: "final image", audio: "swell → cut" }
  - { n: 10, type: "INS", move: "static", dur: 3, purpose: "title card + date", audio: "bass hit" }
total_duration: 28s
aspect_ratio: "2.39:1"
```

### Product / Brand Film (45s)

```yaml
shots:
  - { n: 1, type: "ECU", move: "macro dolly", dur: 3, purpose: "texture / material beauty" }
  - { n: 2, type: "WS",  move: "tracking", dur: 4, purpose: "product in environment" }
  - { n: 3, type: "CU",  move: "arc shot", dur: 4, purpose: "360° product hero" }
  - { n: 4, type: "MS",  move: "static", dur: 3, purpose: "person using product" }
  - { n: 5, type: "INS", move: "dolly-in", dur: 3, purpose: "feature detail 1" }
  - { n: 6, type: "INS", move: "tilt up", dur: 3, purpose: "feature detail 2" }
  - { n: 7, type: "WS",  move: "crane up", dur: 5, purpose: "lifestyle context" }
  - { n: 8, type: "MCU", move: "slow push-in", dur: 4, purpose: "emotional connection" }
  - { n: 9, type: "CU",  move: "static", dur: 3, purpose: "product close-up with tagline" }
  - { n: 10, type: "WS", move: "pull-back", dur: 4, purpose: "brand lockup + CTA" }
total_duration: 36s
```

### Social Short / Reel (15s)

```yaml
shots:
  - { n: 1, type: "CU",  move: "snap zoom", dur: 1, purpose: "attention grab — HOOK" }
  - { n: 2, type: "MS",  move: "whip pan", dur: 2, purpose: "context / setup" }
  - { n: 3, type: "ECU", move: "handheld", dur: 2, purpose: "detail / reaction" }
  - { n: 4, type: "WS",  move: "tracking", dur: 3, purpose: "action / demo" }
  - { n: 5, type: "CU",  move: "dolly-in", dur: 2, purpose: "payoff / reveal" }
  - { n: 6, type: "MS",  move: "static", dur: 2, purpose: "reaction / CTA" }
total_duration: 12s
aspect_ratio: "9:16"
```

### Educational Documentary (90s)

```yaml
shots:
  - { n: 1, type: "EWS", move: "aerial", dur: 6, purpose: "establish location / topic" }
  - { n: 2, type: "MS",  move: "static", dur: 5, purpose: "expert / narrator intro" }
  - { n: 3, type: "CU",  move: "slow push-in", dur: 4, purpose: "hook question" }
  - { n: 4, type: "WS",  move: "pan", dur: 5, purpose: "context / B-roll" }
  - { n: 5, type: "INS", move: "dolly-in", dur: 4, purpose: "diagram / data viz" }
  - { n: 6, type: "MCU", move: "static", dur: 5, purpose: "concept 1 explain" }
  - { n: 7, type: "WS",  move: "tracking", dur: 5, purpose: "concept 1 B-roll" }
  - { n: 8, type: "CU",  move: "rack focus", dur: 3, purpose: "transition to concept 2" }
  - { n: 9, type: "MCU", move: "static", dur: 5, purpose: "concept 2 explain" }
  - { n: 10, type: "INS", move: "static", dur: 4, purpose: "data / evidence" }
  - { n: 11, type: "WS", move: "crane", dur: 5, purpose: "concept 2 B-roll" }
  - { n: 12, type: "ECU", move: "slow push-in", dur: 3, purpose: "key insight" }
  - { n: 13, type: "MS", move: "arc", dur: 5, purpose: "implications / so-what" }
  - { n: 14, type: "WS", move: "dolly-out", dur: 5, purpose: "proof / example" }
  - { n: 15, type: "CU", move: "static", dur: 4, purpose: "closing thought" }
  - { n: 16, type: "EWS", move: "aerial pull-back", dur: 6, purpose: "reframe + close" }
total_duration: 84s
narration_wpm: 150
```

---

## VIII. Seedance 2.0 Integration

When generating shots via Seedance, map shot list entries to the 8-component prompt:

```
1. Shot type → [Shot / framing]
2. Camera movement → [Camera movement]
3. Subject → [Subject description] (keep consistent across all shots for character identity)
4. Action → [Action beats] (one beat per sentence, use → for multi-shot)
5. Setting → [Setting / environment]
6. Lighting → [Lighting / palette]
7. Style → [Style / grade / era]
8. Audio → [Audio] (ambient, SFX, music direction, quoted dialogue for lip-sync)
```

### Seedance Shot Duration Guide

| Shot Purpose | Duration | Variant |
|-------------|----------|---------|
| Insert / detail | 3-4s | fast |
| Standard scene | 5-8s | standard |
| Multi-shot hero | 10-12s | standard |
| B-roll / atmosphere | 4-5s | fast |
| Lip-sync dialogue | 5-8s | standard |

### Seedance Aspect Ratios

| Format | Ratio | Use |
|--------|-------|-----|
| Cinematic Widescreen | 21:9 | Trailers, brand films |
| Standard | 16:9 | YouTube, explainers |
| Vertical | 9:16 | TikTok, Reels, Shorts |
| Square | 1:1 | Instagram posts |
| Classic | 4:3 | Retro, vintage feel |
| Portrait | 3:4 | Pinterest, portraits |

---

## IX. OpenMontage Pipeline Selection

| Your Video Type | Pipeline | Shot Style | Cost Range |
|----------------|----------|------------|------------|
| Anime explainer | `animation` | Ghibli crossfade + camera motion | $0.15 |
| Cinematic trailer | `cinematic` | Seedance multi-shot | $2-5 |
| Product demo | `animated-explainer` | Data viz + product shots | $0-2 |
| Social short | `animation` or `cinematic` | Fast cuts, vertical | $0.15-3 |
| Documentary | `hybrid` | Mixed source + generated | $1-3 |
| Avatar spokesperson | `avatar-spokesperson` | Talking head + overlays | $1.50 |
| Podcast clip | `podcast-repurpose` | Extracted highlights | $0 |
| Tutorial | `screen-demo` | Screen recording + overlays | $0 |

---

## X. Audio Layering for Cinematic

| Layer | Level | Content |
|-------|-------|---------|
| **Dialogue / Narration** | -12 dB peak | Primary voice |
| **Music / Score** | -24 to -18 dB | Orchestral, ambient, dynamic |
| **Ambient / Room Tone** | -30 to -24 dB | Environmental sound bed |
| **Foley / SFX** | -18 to -12 dB | Specific action sounds |

### Music BPM by Mood

| Mood | BPM | Genre |
|------|-----|-------|
| Contemplative | 60-80 | Ambient piano, soft strings |
| Standard cinematic | 80-100 | Orchestral, atmospheric |
| Energetic | 110-130 | Electronic, upbeat |
| Action / Intense | 140-180 | Percussion-heavy, taiko |
| Anime battle | 160-200 | J-rock, electronic hybrid |

---

## XI. Color Grading Profiles

| Look | Characteristics | Best For |
|------|----------------|----------|
| **Teal & Orange** | Hollywood blockbuster, complementary | Trailers, action |
| **Warm Cinematic** | Orange highlights, lifted shadows | Emotion, nostalgia |
| **Cool Noir** | Blue-steel highlights, crushed blacks | Thriller, mystery |
| **Vintage Film** | Faded, warm tint, reduced contrast | Retro, period pieces |
| **Anime / Ghibli** | Saturated greens, warm golds, soft edges | Anime content |
| **Moody Dark** | Desaturated, deep shadows | Horror, drama |
| **Pastel Dream** | Soft, low contrast, airy | Fantasy, children's |
| **Neon Cyberpunk** | High saturation, neon accents, dark base | Sci-fi, Neo-Edo |

---

## XII. Quality Checklist

Before finalizing any shot list, verify:

- [ ] **Variety** — No more than 2 consecutive shots of the same type
- [ ] **Rhythm** — Shot durations vary (breathing rhythm pattern)
- [ ] **Purpose** — Every shot has a clear narrative function
- [ ] **Continuity** — Character descriptions consistent across shots
- [ ] **180° Rule** — Camera stays on one side of the action line
- [ ] **Eye Trace** — Subject position guides the viewer's eye between cuts
- [ ] **Audio Layers** — At least 2 audio layers per shot (music + ambient minimum)
- [ ] **Color Consistency** — Same grade/LUT across the entire piece
- [ ] **Transitions** — Planned and justified (not random dissolves)
- [ ] **Total Duration** — Shot durations sum to target video length ±10%
