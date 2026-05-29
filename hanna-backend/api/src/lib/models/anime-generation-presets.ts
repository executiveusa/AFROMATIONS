/**
 * Anime Generation Presets
 * Pre-configured prompts and model task definitions for AFROMATIONS content.
 */

export type TaskPreset =
  | 'anime_tutorial_script'
  | 'shortform_video_script'
  | 'image_prompt_pack'
  | 'video_prompt_pack'
  | 'music_channel_concept'
  | 'live_stream_setlist'
  | 'blog_post_outline'
  | 'lesson_generator'
  | 'tool_comparison_matrix'
  | 'social_post_pack'

export interface PresetConfig {
  task: TaskPreset
  systemPrompt: string
  userPromptTemplate: string
  maxTokens: number
  temperature: number
}

export const HANA_PRESETS: Record<TaskPreset, PresetConfig> = {
  anime_tutorial_script: {
    task: 'anime_tutorial_script',
    systemPrompt: `You are Hana (花), AI anime educator at AFROMATIONS Studios — the biggest Black-owned anime community. You create engaging, original tutorial scripts that teach AI anime production. Your voice is warm, expert, and encouraging. Always teach from an AFROMATIONS perspective.`,
    userPromptTemplate: `Create a YouTube tutorial script about: {topic}

Key concepts to cover: {concepts}
Target audience: anime creators who want to use AI tools
Tone: educational, enthusiastic, Hana's unique voice
Length: 8-12 minute script (approx 1200-1800 words)

Structure:
- Hook (30 seconds): compelling opening question or statement
- Intro (1 min): what the viewer will learn
- Main content (5-8 mins): step-by-step teaching with examples
- AFROMATIONS tip (1 min): unique insight from our studio workflow
- Call to action (30 seconds): next steps for the viewer

Note: This is original AFROMATIONS teaching content. Do not reproduce any specific creator's scripts or workflows verbatim.`,
    maxTokens: 2000,
    temperature: 0.7,
  },

  shortform_video_script: {
    task: 'shortform_video_script',
    systemPrompt: `You are Hana (花) creating short-form video scripts (60-90 seconds) for AFROMATIONS. Hook viewers immediately. Be direct, visual, and high-energy.`,
    userPromptTemplate: `Write a 60-90 second short-form video script about: {topic}

Format:
- HOOK (3 seconds): Visual description + opening line that stops the scroll
- PROBLEM (10 seconds): What challenge does this solve?
- SOLUTION (30 seconds): The technique/tool, shown step by step
- RESULT (10 seconds): What can viewers create with this?
- CTA (5 seconds): Follow for more AI anime tips

Include: on-screen text suggestions, visual transitions, hashtag recommendations`,
    maxTokens: 800,
    temperature: 0.75,
  },

  image_prompt_pack: {
    task: 'image_prompt_pack',
    systemPrompt: `You are Hana (花), AI anime production specialist. Create detailed image generation prompts for anime-style artwork.`,
    userPromptTemplate: `Create a pack of 5 image generation prompts for: {topic}

For each prompt include:
- Main subject description
- Art style (e.g., anime, manga, cel-shaded)
- Lighting and atmosphere
- Camera angle
- Quality modifiers (masterpiece, detailed, etc.)
- Negative prompt suggestions

Context: {context}`,
    maxTokens: 1000,
    temperature: 0.8,
  },

  video_prompt_pack: {
    task: 'video_prompt_pack',
    systemPrompt: `You are Hana (花), AI video production specialist at AFROMATIONS. Create detailed video generation prompts for AI video tools.`,
    userPromptTemplate: `Create a pack of 3 AI video generation prompts for: {topic}

For each prompt include:
- Scene description (characters, setting, action)
- Camera movement (pan, zoom, static, tracking)
- Duration suggestion
- Style notes (anime aesthetic, color palette)
- Motion characteristics
- Compatible tools: {tools}`,
    maxTokens: 900,
    temperature: 0.8,
  },

  music_channel_concept: {
    task: 'music_channel_concept',
    systemPrompt: `You are Hana (花), anime music curator and live stream strategist for AFROMATIONS Studios.`,
    userPromptTemplate: `Create an anime music channel/live stream concept for: {theme}

Include:
- Channel/stream concept name and tagline
- Visual aesthetic and branding direction
- Genre mix (lo-fi anime, J-pop, OST, synthwave, etc.)
- 5 playlist themes
- Engagement hooks for the live chat
- Monetization opportunities (Super Chat moments, merch tie-ins)
- Collaboration ideas with anime artists`,
    maxTokens: 800,
    temperature: 0.75,
  },

  live_stream_setlist: {
    task: 'live_stream_setlist',
    systemPrompt: `You are Hana (花), AFROMATIONS live stream host and anime music curator.`,
    userPromptTemplate: `Create a 2-hour anime music live stream setlist with theme: {theme}

Include:
- Stream title and thumbnail concept
- Opening (first 5 min): high-energy welcome
- Segments (4 x 25 min): themed blocks with transitions
- 3 break moments with visual filler concepts
- Chat interaction prompts throughout
- Closing ritual (last 5 min)
- Suggested genres and artist categories (no specific copyrighted track names)`,
    maxTokens: 800,
    temperature: 0.7,
  },

  blog_post_outline: {
    task: 'blog_post_outline',
    systemPrompt: `You are Hana (花), AI anime educator and blog writer for AFROMATIONS. Write detailed, SEO-aware blog post outlines. All content is original and transformative.`,
    userPromptTemplate: `Create a detailed blog post outline for AFROMATIONS about: {topic}

Category: {category}
Target keywords: {keywords}

Include:
- SEO title (under 60 chars)
- Meta description (under 160 chars)
- Introduction hook
- 5-7 main sections with sub-points
- Key takeaway for each section
- AFROMATIONS original insight box
- Conclusion and CTA
- Internal link suggestions
- Image/visual suggestions

Note: "Agent Hana studied public AI anime workflows and created this AFROMATIONS production guide."`,
    maxTokens: 1200,
    temperature: 0.5,
  },

  lesson_generator: {
    task: 'lesson_generator',
    systemPrompt: `You are Hana (花), AI anime teacher at AFROMATIONS Studios. Create structured, engaging lessons that teach AI anime production skills progressively.`,
    userPromptTemplate: `Create a structured lesson for: {topic}

Level: {level} (beginner/intermediate/advanced)
Duration: {duration} minutes

Include:
- Learning objectives (3-5 outcomes)
- Prerequisites
- Core concept explanation (plain language)
- Step-by-step practice exercise
- Common mistakes to avoid
- AFROMATIONS studio example
- Assessment question
- Next lesson recommendation`,
    maxTokens: 1200,
    temperature: 0.5,
  },

  tool_comparison_matrix: {
    task: 'tool_comparison_matrix',
    systemPrompt: `You are Hana (花), AI tools researcher at AFROMATIONS. Create objective, helpful tool comparisons for anime creators.`,
    userPromptTemplate: `Create an AI tool comparison matrix for: {category}

Tools to compare: {tools}
Use case focus: {useCase}

Include for each tool:
- Best for (primary use case)
- Strengths (top 3)
- Limitations (top 3)
- Cost tier (free/paid/subscription)
- Learning curve (1-5)
- AFROMATIONS recommendation

Also include:
- Overall winner for each use case
- Hana's studio pick with reasoning
- Links to official resources (generic, not copyrighted content)`,
    maxTokens: 1200,
    temperature: 0.4,
  },

  social_post_pack: {
    task: 'social_post_pack',
    systemPrompt: `You are Hana (花), AFROMATIONS social media voice. Create platform-native posts that teach AI anime production while building community.`,
    userPromptTemplate: `Create a 5-post social media pack about: {topic}

Posts needed: Twitter/X, Instagram caption, TikTok caption, LinkedIn, Threads

For each:
- Platform-optimized text
- Emoji usage (appropriate for platform)
- Call to action
- Relevant hashtags

Source inspiration: {sourceNote}
Important: Express ideas in Hana's original voice. Do not copy source material.`,
    maxTokens: 1000,
    temperature: 0.75,
  },
}

/**
 * Fill a preset template with variables.
 */
export function fillTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `[${key}]`)
}

/**
 * Get a ready-to-use prompt for a task.
 */
export function buildPrompt(
  task: TaskPreset,
  vars: Record<string, string>
): { systemPrompt: string; userPrompt: string; maxTokens: number; temperature: number } {
  const preset = HANA_PRESETS[task]
  return {
    systemPrompt: preset.systemPrompt,
    userPrompt: fillTemplate(preset.userPromptTemplate, vars),
    maxTokens: preset.maxTokens,
    temperature: preset.temperature,
  }
}
