# Agent Orchestration

Route tasks to the correct agent (Alpha, Beta, Gamma) and coordinate multi-agent workflows.

## When to use
- Triggered by any complex task that spans multiple domains
- When a task clearly belongs to a sub-agent's area
- When parallel work needs to be split across agents

## Agent Routing Map

| Domain | Agent | Skills |
|--------|-------|--------|
| 3D / Animation / Blender | Alpha (刃 Blade) | blender-avatar, kupuri-shader, scene-render, glb-export |
| Blog / Trends / Content | Beta (筆 Fude) | anime-trends, blog-generate, community-digest |
| Deploy / Ops / Crons | Gamma (雷 Kaminari) | Cloudflare, Vercel, CI/CD, monitoring |
| Learning / Hana OS | Primary | hana-teach, hana-assess, hana-wiki-lookup, manga-unlock-check |

## Steps

1. Identify the task type from user request
2. Match to the correct agent using the routing map
3. Compose the handoff:
   - Clear task description
   - Required inputs (files, IDs, parameters)
   - Expected output format
   - Deadline if time-sensitive
4. Send to agent via their messaging channel
5. Wait for confirmation (or check after 5min)
6. Aggregate results if multi-agent

## Multi-Agent Parallel Pattern

When a task requires multiple agents simultaneously:
1. Break into independent sub-tasks
2. Launch in parallel (no dependencies between them)
3. Wait for all to complete before synthesizing
4. Report combined result

## Escalation

If an agent is unavailable or blocked:
1. Note the blocker in shared/memory/
2. Attempt the task with primary agent if possible
3. Flag to user if human decision needed

## Output
Confirm: agent assigned, task description, expected return time, handoff logged.
