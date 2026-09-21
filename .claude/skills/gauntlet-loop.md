---
name: gauntlet-loop
description: Set a concrete fetchable quality bar, split work into judgeable pieces, and loop builder/critic passes until the AFROMATIONS output survives blind comparison and hard release gates.
---

# Gauntlet Loop

## Bar requirements
A bar must be named, fetchable, and comparable.

For AFROMATIONS website work, use real live references at matched viewports. For code, use a named implementation plus tests/benchmarks. For visual work, use real shipped work or approved canon.

## Loop
1. Get the real bar first.
2. Break the work into the smallest pieces that can be judged independently.
3. Use a builder and a separate critic with fresh context.
4. Critic compares actual output against the bar and names the single largest remaining gap.
5. Repair.
6. Re-render/retest.
7. Repeat until the release gate passes.

Praise is not evidence. Screenshots support verification but do not replace runtime tests.

## Hard stop
Do not ship with unresolved P0/P1 issues, broken conversion, fake proof, mobile overflow, critical accessibility failure, or missing rollback.