/**
 * Open Harness Adapter — Harness Contract
 * TypeScript adapter inspired by the OpenHarness Python framework (vendors/openharness).
 * Defines the contract that every Hana workflow must satisfy to be observable,
 * replayable, testable, and approval-gated.
 */

export type HarnessStatus =
  | 'pending'
  | 'planning'
  | 'executing'
  | 'awaiting_approval'
  | 'completed'
  | 'failed'
  | 'cancelled'

export interface HarnessInput {
  taskId: string
  taskType: string
  description: string
  params: Record<string, unknown>
  requestedBy?: string
  approvalRequired: boolean
  dryRun: boolean
}

export interface HarnessPlan {
  steps: HarnessPlanStep[]
  estimatedDuration?: number
  requiredTools: string[]
  requiredSkills: string[]
  riskLevel: 'low' | 'medium' | 'high'
}

export interface HarnessPlanStep {
  stepId: string
  name: string
  description: string
  tool?: string
  skill?: string
  inputs: Record<string, unknown>
  dependsOn?: string[]
  requiresApproval?: boolean
}

export interface HarnessEvidence {
  sourceIds: string[]
  citations: Record<string, unknown>[]
  toolOutputs: Record<string, unknown>[]
  observations: string[]
  complianceChecks: { rule: string; passed: boolean; note?: string }[]
}

export interface HarnessOutput {
  result: unknown
  artifacts: { type: string; id: string; url?: string }[]
  memoryWrites: HarnessMemoryWrite[]
  regressionTests?: HarnessRegressionTest[]
}

export interface HarnessMemoryWrite {
  nodeType: string
  title: string
  summary: string
  content?: string
  metadata?: Record<string, unknown>
}

export interface HarnessRegressionTest {
  testId: string
  description: string
  input: Record<string, unknown>
  expectedOutput: Record<string, unknown>
  passed?: boolean
}

export interface HarnessExecution {
  executionId: string
  input: HarnessInput
  plan?: HarnessPlan
  status: HarnessStatus
  evidence: HarnessEvidence
  output?: HarnessOutput
  startedAt: string
  completedAt?: string
  approvalLog: { action: string; by?: string; at: string; note?: string }[]
  errors: string[]
}

/**
 * Contract interface that all Hana harness runners must implement.
 */
export interface IHarnessRunner {
  /** Execute a harness task end-to-end */
  execute(input: HarnessInput): Promise<HarnessExecution>

  /** Replay a previous execution with the same inputs */
  replay(executionId: string): Promise<HarnessExecution>

  /** Get execution status */
  getStatus(executionId: string): Promise<HarnessStatus>

  /** Approve a pending action within an execution */
  approve(executionId: string, stepId: string, by: string): Promise<void>

  /** Reject a pending action within an execution */
  reject(executionId: string, stepId: string, by: string, reason: string): Promise<void>
}

/**
 * Factory to create a harness execution record.
 */
export function createExecution(input: HarnessInput): HarnessExecution {
  return {
    executionId: crypto.randomUUID(),
    input,
    status: 'pending',
    evidence: {
      sourceIds: [],
      citations: [],
      toolOutputs: [],
      observations: [],
      complianceChecks: [],
    },
    startedAt: new Date().toISOString(),
    approvalLog: [],
    errors: [],
  }
}
