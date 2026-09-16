---
name: full-stack-wiring-audit
description: Audit every visible AFROMATIONS control or promise through the complete frontend-to-backend path before polishing UI.
---

# Full Stack Wiring Audit

## Core chain
USER INTENT → UI/AFFORDANCE → HANDLER → API/COMMAND → BACKEND CAPABILITY → DEPENDENCY → CANONICAL STATE → OBSERVABLE RESULT → EVIDENCE

If any link is missing, classify it.

## Status classes
VERIFIED / PARTIAL / BROKEN / DUPLICATE / FAKE / STATIC / DEAD / UNSAFE / UNKNOWN

## Audit surfaces
- page routes and CTAs
- forms and confirmation states
- agent commands
- background jobs
- social publishing
- merchandise actions
- artist/community applications
- lead routing
- dashboards
- voice commands
- payment or spend actions

Runtime truth outranks docs and intent. A successful request is not complete until the authoritative state and user feedback are verified.

Never add visual polish over a fake-success or dead conversion path.