# Paperclip / Absurd / Pi Architecture Plan

## System Layer Overview

```
AFROMATIONS (company / head architecture)
│
├── Hana (PI agent / manager)
│   ├── Runs on Cloudflare Workers (Hono API)
│   ├── Database: Supabase
│   └── Open Harness Adapter (TypeScript)
│
├── Paperclip (company operations / control plane)
│   ├── Controls which workflows can run
│   ├── Manages approval gates
│   ├── Routes money movement
│   └── Status: Planned / partial
│
├── Absurd (durable workflow engine)
│   ├── Executes long-running artist workflows
│   ├── artist_partner_install
│   ├── afroscribble_asset_pack
│   ├── auction_drop_prepare
│   ├── provenance_record_create
│   ├── hana_public_build_log
│   └── artist_landing_page_create
│
└── Pi (coding / build harness)
    ├── Claude Code sessions
    ├── Manages this repo
    └── Follows CLAUDE.md rules
```

## Paperclip

Paperclip is the **company/control-plane layer**. It sits between Hana and external actions.

Current partial implementations:
- `hanna-backend/api/src/lib/qa/publishing-policy.ts` — policy enforcement
- `hanna-backend/api/src/routes/hana-wallet.ts` — payout approval gates
- `hanna-backend/api/src/routes/hana-publishing.ts` — publish approval gates

Paperclip will eventually be a dedicated service that:
- Manages artist contracts and billing
- Controls which Hana capabilities are licensed to which artist
- Routes payment flows through approved channels
- Logs all external actions with human approval records

## Absurd

Absurd is the **durable workflow engine**. It handles multi-step, long-running workflows that can fail and resume.

Planned workflows:

| Workflow | Description |
|----------|-------------|
| `artist_partner_install` | Full onboarding: account, profile, Hana config, landing page |
| `afroscribble_asset_pack` | Character art → stencil + coloring + printable pack |
| `auction_drop_prepare` | Provenance → listing → drop page → notify |
| `provenance_record_create` | Hash files, record authorship, write Vault entry |
| `hana_public_build_log` | Generate build-in-public update for Dual feed |
| `artist_landing_page_create` | Generate + deploy artist's public landing page |

Implementation approach: Cloudflare Durable Objects or Supabase-backed state machine.

## Pi

Pi is the **coding/build harness** — specifically, the Claude Code sessions operating in this repo.

Pi rules (in CLAUDE.md):
- Inspect before editing
- Preserve working code
- Use compatibility aliases
- Report every changed file
- Run lint/type/build before submitting

Pi does not have its own identity separate from Claude Code. It is a role, not a separate agent.

## Open Harness Adapter

`hanna-backend/open-harness-adapter/` is the TypeScript implementation of the OpenHarness contract for Cloudflare Workers.

This is the bridge between Hana's executions and the Absurd workflow engine when it is implemented.
