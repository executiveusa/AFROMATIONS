# Open Harness Adapter

**Location:** `hanna-backend/open-harness-adapter/`  
**Based on:** OpenHarness framework (vendors/openharness — Python)  
**Language:** TypeScript (Cloudflare Workers compatible)

---

## Overview

The Open Harness Adapter is a TypeScript implementation of the OpenHarness contract patterns, adapted for AFROMATIONS's Cloudflare Workers runtime. It makes every Hana workflow:

- **Observable** — every step produces a structured record
- **Replayable** — executions can be re-run with the same inputs
- **Testable** — contract interfaces enable unit testing
- **Memory-writing** — all executions write to the knowledge graph
- **Approval-gated** — external actions require human sign-off

---

## Files

| File | Purpose |
|------|---------|
| `harness.contract.ts` | Core TypeScript interfaces and types |
| `harness-runner.ts` | Execution engine with approval gate |
| `harness-memory.ts` | Knowledge graph write operations |
| `harness-verifier.ts` | Pre-execution policy validation |

---

## Harness Contract

```typescript
interface HarnessExecution {
  executionId: string
  input: HarnessInput        // Task description + params
  plan?: HarnessPlan         // Step-by-step execution plan
  status: HarnessStatus      // pending | executing | awaiting_approval | completed | failed
  evidence: HarnessEvidence  // Sources, citations, compliance checks
  output?: HarnessOutput     // Results + artifacts + memory writes
  approvalLog: [...]         // Who approved/rejected and when
  errors: string[]
}
```

---

## Usage

```typescript
import { HanaHarnessRunner } from './harness-runner'
import { HarnessMemory } from './harness-memory'
import { HarnessVerifier } from './harness-verifier'

const memory = new HarnessMemory(supabaseUrl, supabaseKey)
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

---

## vs OpenHarness Python

| Feature | Python (vendors/openharness) | TypeScript Adapter |
|---------|--------------------|--------------------|
| Runtime | Python 3.10+ | Cloudflare Workers |
| Memory | Custom store | Supabase |
| Transport | HTTP/stdio | HTTP (fetch) |
| Approval gate | CLI | Supabase + Admin UI |
| Test coverage | pytest | vitest (planned) |

The adapter implements the same conceptual contract as OpenHarness but is purpose-built for the AFROMATIONS Workers runtime.
