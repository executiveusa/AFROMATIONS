# Ralphy — Feedback Loop

Enforce tight feedback loops: one logical change at a time, verify before continuing.

## Source
`vendors/ralphy/` — Code change philosophy + quality standards.

## When to use
- Before starting any coding task (primes the feedback loop mindset)
- When a task feels large and undefined
- Triggered by "use ralphy", "feedback loop", "small steps"

## Core Rules (from vendors/ralphy/CLAUDE.md)

1. **One logical change per commit** — each commit does exactly one thing
2. **Run feedback loops after each change**, not at the end
3. **Prioritize order:** Architecture → Integrations → Unknown risks → Features → Polish
4. **Fail fast on risky work** — save easy wins for later
5. **Simplicity check:** After writing code, ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## Anti-Patterns to Avoid
- Bundling multiple changes into one commit
- Writing tests after all features are done
- Adding features "while I'm in there"
- Refactoring code that wasn't asked to be refactored

## Output
At start of each task: state what ONE thing you will do first. After doing it: report, then ask to continue.
