# Agent Decision Checklist

**Use this before building any feature, fixing any bug, or making any design decision.**

---

## Pre-Build Checklist (5 Questions)

### Question 1: Mission Alignment
- [ ] Does this teach or empower someone?
- [ ] Could a community member benefit from this?
- [ ] Is this solving a real problem or creating artificial needs?

**If all NO:** Reconsider. If unsure: Ask in discussion.

### Question 2: Extractive Risk
- [ ] Could this be used to exploit users?
- [ ] Are we collecting data we don't need?
- [ ] Does someone feel forced or manipulated to buy/engage?

**If any YES:** Redesign. If unsure: Add friction/transparency.

### Question 3: Token Integrity
- [ ] Would token holders feel this respects their stake?
- [ ] Could this make tokens feel like a casino?
- [ ] Are we respecting the "no speculation" principle?

**If NO:** Not approved for launch.

### Question 4: Replicability
- [ ] Can a Seattle community member learn from this and replicate it?
- [ ] Are we keeping knowledge open-source?
- [ ] Could this knowledge help someone get hired or start a business?

**If NO:** Consider adding free educational context.

### Question 5: Long-term Sustainability
- [ ] Does this build sustainable revenue or burn out the community?
- [ ] Are we setting expectations we can maintain forever?
- [ ] Is this a one-time feature or repeatable system?

**If burn-out risk:** Phase it differently or scale slower.

---

## Design Decision Tree

```
Is this decision about EDUCATION?
├─ YES: Prioritize clarity over aesthetics
│   └─ Use Steve Krug's "Don't Make Me Think" principles
├─ NO: Is this about ENGAGEMENT?
│   ├─ YES: Check for dark patterns
│   │   └─ FOMO? Urgency? Social proof hacks? ❌ REMOVE
│   └─ NO: Is this about MONETIZATION?
│       ├─ YES: Check for extractive risk
│       │   ├─ Predatory pricing? ❌ NO
│       │   ├─ Artificial scarcity on knowledge? ❌ NO
│       │   ├─ Fair price for sustainable work? ✅ YES
│       │   └─ Reinvests 30%+ in mission? ✅ YES → APPROVED
│       └─ NO: Aesthetic/UX only → Apply design guidelines
```

---

## Feature Categorization

### ✅ GREEN LIGHT (Build Immediately)
- Free educational content
- Community governance tools (voting, forums)
- Creator tools that studios would license
- Youth employment programs
- Premium advanced tracks (optional)
- Print-on-demand merch
- Analytics that serve users (not exploit them)

### 🟡 YELLOW LIGHT (Needs Review)
- Subscription paywalls (ensure free tier exists)
- Limited-time offers (ensure no false urgency)
- Leaderboards/reputation systems (ensure can't be gamed)
- Referral programs (ensure not predatory)
- Community tokens (ensure not speculative)

### 🛑 RED LIGHT (Do Not Build)
- Pay-to-win mechanics
- Dark patterns (FOMO, urgency, social proof hacks)
- Artificial scarcity on knowledge
- Influencer worship
- User data monetization
- Speculative token markets
- Predatory pricing (>80% markup)

---

## Copy Decision Guide

### When Writing Product Copy:

**DO:**
- Explain actual benefits (what can you learn? what can you make? who will you meet?)
- Acknowledge limitations (this course is 8 weeks, intermediate level, etc.)
- Highlight community (built by creators, for creators)
- Show real examples (student work, case studies)

**DON'T:**
- Use urgency language ("Only 5 spots left!" "Sale ends today!")
- Make guarantees ("Get rich with AI!" "Become a professional in 30 days!")
- Use celebrity endorsements ("Famous YouTuber recommends this!")
- Hide pricing or complexity
- Create artificial scarcity

**Example (Bad):**
> "Join 10,000+ students learning AI animation TODAY. Limited spots available. Join now before you miss out!"

**Example (Good):**
> "Learn 3D character animation in 8 weeks. Topics: modeling, rigging, rendering. Includes 1-on-1 feedback from industry veterans. $199. Enroll anytime."

---

## Community Governance Decision Guide

### When Deciding What Goes to a Vote:

**Should Go to Vote (Token Holders):**
- New course topics
- Merch design/drops
- Fund allocation (how we spend profit)
- Partnership decisions
- Feature priorities
- Community program focus areas

**Should NOT Go to Vote:**
- Day-to-day product decisions (button color, copy edits)
- Pricing of core educational content
- Hiring decisions
- Legal/compliance matters
- Safety/moderation policies

**Voting Mechanics:**
- 1 token = 1 vote (no quadratic voting complexity)
- 7-day voting period minimum
- 50% quorum required
- Results publicly posted with rationale
- Non-binding advisory votes become binding if ~80% consensus

---

## Pricing Decision Guide

### How to Price Products

**Formula:**
- **Educational Content:** Cost + 50-100% markup (balance accessibility with sustainability)
  - Example: $5 production cost → $9.99 monthly subscription
  
- **Merch:** Cost + 60% markup (covers operations + missions)
  - Example: $15 POD cost → $24-28 retail
  
- **B2B Tools:** 3-5x markup (higher value for studios)
  - Example: $2,000 development cost → $5,000-10,000/month licensing

- **Services:** Hourly + 40% overhead
  - Example: $50/hour artist time → $70/hour billed

**Fairness Check:**
- Would you buy this at this price?
- Does it feel extractive or fair?
- Can a community member on minimum wage access this?
- Is the free tier actually useful or just a demo?

---

## Mobile Optimization Checklist

**BEFORE launching any feature on mobile:**
- [ ] Text is readable (minimum 16px font)
- [ ] Tap targets are 44x44px minimum
- [ ] Images scale appropriately (no distortion)
- [ ] Forms require <5 taps to complete
- [ ] Loading indicators show progress
- [ ] No horizontal scrolling needed
- [ ] Tested on actual phone (not just browser)

**If any fail:** Fix before shipping.

---

## Error Handling Checklist

**For every API call/async operation:**
- [ ] Error state has helpful message (not "Error 500")
- [ ] User knows what to do next
- [ ] Fallback content displays if service unavailable
- [ ] Retry button available
- [ ] Log error for debugging (don't expose to user)

**Example (Bad):**
```
"Error loading products"
```

**Example (Good):**
```
"Couldn't load products. Check your connection or try again in a moment.
[Retry Button]"
```

---

## Performance Checklist

**Before shipping any page:**
- [ ] Lighthouse score >85 on mobile
- [ ] First Contentful Paint <2 seconds
- [ ] Time to Interactive <3.5 seconds
- [ ] Core Web Vitals all green
- [ ] Images optimized (WebP, lazy loading)
- [ ] No render-blocking resources

**If any fail:** Optimize before shipping.

---

## Accessibility Checklist

**For every component:**
- [ ] Keyboard navigable (Tab through entire page)
- [ ] Semantic HTML (buttons are `<button>`, links are `<a>`)
- [ ] Color not the only indicator (icon + color for errors)
- [ ] Alt text on images (descriptive, not "image.jpg")
- [ ] Headings follow order (h1, h2, h3... not h1, h3, h4)
- [ ] Form labels visible and associated
- [ ] Focus indicators visible

**If any fail:** Fix before shipping.

---

## Decision Escalation Path

### When Unsure, Ask:

1. **Technical question?** → Check existing code patterns
2. **Design question?** → Refer to Design Guidelines + DUAL branding
3. **Mission question?** → Read Master Plan, ask core team
4. **Revenue question?** → Check revenue model section
5. **Community question?** → Ask in Discord, get consensus vote

### Who Decides What?

| Decision | Authority | Process |
|----------|-----------|---------|
| Core feature | Core team + community vote | Proposal → discussion → vote |
| Design/UX | Design system + accessibility | Follow guidelines, test mobile |
| Pricing | Core team | Formula-based, fairness check |
| Partnerships | Core team | Mission alignment review |
| Community programs | Community vote | Proposal → discussion → vote |
| Product copy | Content team | Review for manipulation |
| API integrations | Engineering | Security + cost review |

---

## Red Flags (Stop and Re-evaluate)

🛑 **STOP if you hear:**
- "Users won't notice if we..."
- "Just one dark pattern won't hurt"
- "Everyone else charges 2x more"
- "Token holders don't understand anyway"
- "We need this feature for growth metrics"
- "Mission can wait, revenue first"

🛑 **STOP if you find yourself:**
- Optimizing for engagement time over learning outcomes
- Creating artificial urgency
- Hiding costs/pricing
- Building features only power users need
- Adding complexity to justify price

**If any red flags appear:** Discuss with core team before proceeding.

---

## Monthly Review Questions

**Every month, ask:**
1. Are we still teaching more than we're selling?
2. Do community members feel ownership, not extracted from?
3. Have we been transparent about all decisions?
4. Is free content growing faster than paid content?
5. Would we recommend this to a friend, or are we hiding things?
6. Are token holders engaged, or is this failing?
7. Could another company replicate us if we disappeared?

**If majority "no":** Course correction needed.

---

*Checklist v1.0 — Referenced by all agents*  
*Last updated: May 1, 2026*
