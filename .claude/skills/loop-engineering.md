---
name: loop-engineering
description: Use for long-running coding and design sessions that must preserve context, evidence, gates, rollback, and quality across many iterations.
---

# Loop Engineering

## Goal
Run long-range work as a sequence of bounded, resumable, evidence-backed stages rather than one giant session.

## Required records
Maintain a run folder with:
- PROJECT-LOCK.md
- BASELINE.md
- BAR.md
- GRAPH.md
- SPEC.md
- GATES.md
- GAUNTLET.md
- STATE.md
- ROLLBACK.md
- RECEIPT.md
- LEARNINGS.md

## Stage flow
INTAKE → DISCOVERY → ARCHITECTURE → GRAPH → SPEC → SLICE → BUILD → VERIFY → GAUNTLET → RELEASE → LEARN

## Rules
- Every stage must produce a durable artifact before moving on.
- Every meaningful claim needs evidence.
- Work in reversible slices.
- Keep one canonical state file so a new agent can resume without reconstructing context from chat.
- Builder and critic are separate roles.
- P0/P1 findings reopen the loop.
- Release requires tested runtime evidence and rollback.

## AFROMATIONS hook
For website work, the bar and browser screenshots live with the run. For agent work, record the intent path, dispatcher, worker, approval, receipt, and final verified state.