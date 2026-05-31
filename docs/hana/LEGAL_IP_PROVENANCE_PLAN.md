# Legal IP and Provenance Plan

## Positioning

AFROMATIONS provides **educational information** about IP for creators. It does not provide legal advice. Every IP/legal page must carry the disclaimer:

> "Educational information only. This is not legal advice. Work with a licensed attorney for legal decisions."

## What We Can Say (Truthfully)

### Copyright
- Human-authored characters with documented creative process have the strongest copyright position
- AI-assisted works have an unclear copyright status in most jurisdictions as of 2025–2026
- Documenting human authorship (sketches, notes, process photos) strengthens copyright claims
- Registration with the US Copyright Office creates legal presumptions of validity

### Trademark
- Character names and distinctive marks can be trademarked separately from copyright
- Trademark protects commercial use in a class of goods/services
- AI-generated elements may complicate trademark registration — consult an attorney
- A character bible helps establish prior use dates

### Blockchain / Provenance
- Blockchain timestamps evidence but does not create copyright or trademark rights
- Timestamping does not replace registration with government agencies
- Provenance records are useful for disputes, licensing, and auction provenance
- The Provenance Vault records evidence; an attorney handles legal claims

### Contracts
- Commission agreements should specify: ownership, rights granted, derivative use, payment
- Licensing agreements should specify: scope, territory, duration, royalties, termination
- Work-for-hire agreements transfer copyright to the commissioner — know what you're signing
- Always get agreements in writing before starting work

## Provenance Vault Data Model

```typescript
interface ProvenanceRecord {
  id: string
  artistId: string
  characterId: string
  projectId?: string
  title: string
  sourceFiles: string[]         // original file paths / URLs
  finalFiles: string[]          // final output paths / URLs
  fileHashes: Record<string, string>  // SHA-256 hashes
  humanContributionNotes: string      // artist's own description
  aiToolsUsed: string[]               // e.g., ["Flux", "AfroScribble"]
  promptsUsed?: string[]              // optional: prompts that produced outputs
  licenseTerms?: string               // current license
  copyrightStatus: 'human_authored' | 'ai_assisted' | 'ai_generated' | 'unknown'
  trademarkStatus?: string
  auctionDropId?: string
  publicProofUrl?: string             // public-facing permalink
  createdAt: string
  updatedAt: string
}
```

## Blockchain Disclaimer (Required on Provenance Pages)

> "Blockchain can timestamp evidence, but it does not replace copyright, trademark, contracts, or legal advice."

## Blog Article Plan

| Slug | Title |
|------|-------|
| `ai-copyright` | Why AI-only characters are weak IP |
| `character-protection` | How artists can document human authorship |
| `copyright-vs-trademark` | Copyright vs trademark for character creators |
| `blockchain-limits` | What blockchain can and cannot protect |
| `licensing-prep` | How to prepare a character for licensing |
| `character-bible` | Why every artist needs a character bible |
| `ai-ownership` | How to use AI without losing ownership clarity |
| `commission-agreements` | Commission agreements for anime artists |
| `character-auctions` | How to run a clean character auction |
| `before-you-publish` | What to save before publishing your character online |

All articles: educational only, disclaimer required, no legal advice, recommend consulting an attorney.
