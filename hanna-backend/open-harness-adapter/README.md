# Open Harness Adapter — TypeScript

A TypeScript re-implementation of the OpenHarness contract for the AFROMATIONS Cloudflare Workers runtime.

## Why a separate adapter?

`vendors/openharness/` is a Python package. Cloudflare Workers runs V8 JavaScript — no Python interop is possible at the edge. This adapter implements the same conceptual contract (observable, replayable, approval-gated executions) in TypeScript without pulling in the Python source.

## Files

| File | Purpose |
|------|---------|
| `harness.contract.ts` | TypeScript interfaces: `HarnessExecution`, `IHarnessRunner`, `createExecution()` |
| `harness-runner.ts` | `HanaHarnessRunner` — executes tasks, writes evidence, enforces approval gate |
| `harness-memory.ts` | `HarnessMemory` — writes nodes/edges to `hana_memory_nodes` / `hana_memory_edges` in Supabase |
| `harness-verifier.ts` | `HarnessVerifier` — pre-flight policy validation (no secrets in code, approval gate, dry-run) |

## Quick start

```typescript
import { HanaHarnessRunner } from './harness-runner'
import { HarnessMemory } from './harness-memory'
import { HarnessVerifier } from './harness-verifier'

const memory = new HarnessMemory(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY)
const verifier = new HarnessVerifier()
const runner = new HanaHarnessRunner(memory, verifier)

const result = await runner.execute({
  taskId: crypto.randomUUID(),
  taskType: 'noble_goose_research',
  description: 'Crawl latest Noble Goose Anime videos',
  params: { limit: 25 },
  approvalRequired: false,
  dryRun: true,
})
```

## Status lifecycle

```
pending → executing → awaiting_approval → completed
                                        ↘ failed
```

## Policy rules (HarnessVerifier)

1. `no_secrets_in_params` — rejects params containing literal API keys or tokens
2. `approval_required_for_publish` — any task type containing `publish` sets `approvalRequired = true`
3. `dry_run_enforced` — if `HANA_DRY_RUN_PUBLISHING=true`, overrides `dryRun` to true
4. `money_movement_requires_approval` — task types containing `payout` or `wallet` always require approval
