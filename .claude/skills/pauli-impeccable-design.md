# Pauli Impeccable Design — Design Excellence

Achieve impeccable design quality across all AFROMATIONS products and content.

## Source
`git@github.com:executiveusa/pauli-impeccable-design-.git`
Status: SSH-only repo. Clone manually:

```bash
git clone git@github.com:executiveusa/pauli-impeccable-design-.git vendors/pauli-impeccable-design
cp vendors/pauli-impeccable-design/SKILL.md .claude/skills/pauli-impeccable-design.md
```

## Interim Standards (until repo is cloned)

### The Impeccable Design Checklist (AFROMATIONS)

**Layout**
- [ ] 8px grid alignment across all elements
- [ ] Consistent spacing scale: 4, 8, 12, 16, 24, 32, 48px
- [ ] Max content width: 1280px with proper padding
- [ ] Mobile-first breakpoints: 375, 768, 1024, 1280

**Typography**
- [ ] Max 2 typefaces: DM Sans (body) + Sora (headings)
- [ ] Size scale: 12, 14, 16, 18, 24, 32, 48, 64px
- [ ] Line height: 1.5 body, 1.2 headings
- [ ] Letter spacing: -0.01em headings, 0.4em all-caps labels

**Color**
- [ ] Brand tokens used (no raw hex values in components)
- [ ] Contrast: AA minimum (4.5:1) for text
- [ ] Red used as accent only (not background)
- [ ] Dark mode native (black is the canvas)

**Components**
- [ ] No glassmorphism (SYNTHIA violation)
- [ ] No pill badges saturation (>3 per view = violation)
- [ ] No gradient abuse (>2 decorative gradients per section)
- [ ] Interactive elements: 44px minimum touch target

**Motion**
- [ ] Duration: 100-300ms (nothing slower for micro-interactions)
- [ ] Easing: ease-out for enters, ease-in for exits
- [ ] prefers-reduced-motion respected

## When to use
Before shipping any page, component, or visual. Run this checklist.
