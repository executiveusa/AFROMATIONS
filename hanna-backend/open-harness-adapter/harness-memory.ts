/**
 * Open Harness Adapter — Harness Memory
 * Persists harness executions and knowledge graph nodes.
 * Writes to Supabase hana_memory_nodes / hana_memory_edges tables.
 */

import type { HarnessExecution, HarnessMemoryWrite } from './harness.contract'

export interface MemoryNode {
  id?: string
  nodeType: string
  title: string
  summary?: string
  content?: string
  metadata?: Record<string, unknown>
}

export interface MemoryEdge {
  fromNodeId: string
  toNodeId: string
  relationshipType: string
  strength?: number
  metadata?: Record<string, unknown>
}

export class HarnessMemory {
  private supabaseUrl: string
  private supabaseKey: string

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabaseUrl = supabaseUrl
    this.supabaseKey = supabaseKey
  }

  private headers() {
    return {
      apikey: this.supabaseKey,
      Authorization: `Bearer ${this.supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }
  }

  async writeNode(node: MemoryNode): Promise<string | null> {
    try {
      const res = await fetch(`${this.supabaseUrl}/rest/v1/hana_memory_nodes`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          node_type: node.nodeType,
          title: node.title,
          summary: node.summary ?? null,
          content: node.content ?? null,
          metadata: node.metadata ?? {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(10000),
      })

      if (!res.ok) return null
      const data = await res.json() as { id?: string }[]
      return data[0]?.id ?? null
    } catch {
      return null
    }
  }

  async writeEdge(edge: MemoryEdge): Promise<boolean> {
    try {
      const res = await fetch(`${this.supabaseUrl}/rest/v1/hana_memory_edges`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({
          from_node_id: edge.fromNodeId,
          to_node_id: edge.toNodeId,
          relationship_type: edge.relationshipType,
          strength: edge.strength ?? 1.0,
          metadata: edge.metadata ?? {},
          created_at: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(10000),
      })

      return res.ok
    } catch {
      return false
    }
  }

  async writeExecution(exec: HarnessExecution): Promise<string | null> {
    return this.writeNode({
      nodeType: 'harness_execution',
      title: `Execution: ${exec.input.taskType}`,
      summary: `${exec.input.description} — status: ${exec.status}`,
      content: JSON.stringify({
        executionId: exec.executionId,
        taskType: exec.input.taskType,
        status: exec.status,
        startedAt: exec.startedAt,
        completedAt: exec.completedAt,
      }),
      metadata: {
        executionId: exec.executionId,
        taskType: exec.input.taskType,
        status: exec.status,
        approvalRequired: exec.input.approvalRequired,
        dryRun: exec.input.dryRun,
      },
    })
  }

  async writeMemoryBatch(writes: HarnessMemoryWrite[]): Promise<string[]> {
    const ids: string[] = []
    for (const write of writes) {
      const id = await this.writeNode({
        nodeType: write.nodeType,
        title: write.title,
        summary: write.summary,
        content: write.content,
        metadata: write.metadata,
      })
      if (id) ids.push(id)
    }
    return ids
  }
}
