# gBrain — Graph Memory System

Persistent knowledge graph for agent memory across sessions.

## Source
`vendors/gbrain/` — Graph-based memory system with webhook support.

## When to use
- Triggered by "remember this", "store to memory", "recall from memory"
- When connecting concepts across learning sessions
- Building learner's personal knowledge graph (hana_memory_graph)
- Agent session recovery

## Core Concepts
- **Nodes**: facts, concepts, words, decisions
- **Edges**: relationships between nodes (synonym, causes, example_of)
- **Strength**: 0-1, increases with repeated reinforcement
- **Recall**: semantic search across stored nodes

## Integration with Hana OS

Maps directly to:
- `hana_memory_graph` table: nodes
- `hana_memory_edges` table: connections between nodes

```
# Store a new concept
gbrain.store({
  type: "concept",
  label_ja: "妖怪",
  label_en: "yokai",
  description: "Supernatural beings from Japanese folklore",
  strength: 0.6
})

# Connect two concepts
gbrain.connect("妖怪", "鬼", "related_to", weight=0.8)

# Recall
gbrain.recall("spirit Japan folklore", limit=5)
```

## Reinforcement
Each time a learner correctly recalls a concept:
- Node strength += 0.05 (max 1.0)
- Edge weight += 0.02
- `last_reinforced_at` updated

## Output
Return: node created/updated, edges affected, current strength.
