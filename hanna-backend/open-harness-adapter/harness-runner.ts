/**
 * Open Harness Adapter — Harness Runner
 * Executes harness tasks with observability, approval gates, and memory writes.
 */

import type {
  IHarnessRunner,
  HarnessInput,
  HarnessExecution,
  HarnessStatus,
} from './harness.contract'
import { createExecution } from './harness.contract'
import { HarnessMemory } from './harness-memory'
import { HarnessVerifier } from './harness-verifier'

export class HanaHarnessRunner implements IHarnessRunner {
  private executions = new Map<string, HarnessExecution>()
  private memory: HarnessMemory
  private verifier: HarnessVerifier

  constructor(memory: HarnessMemory, verifier: HarnessVerifier) {
    this.memory = memory
    this.verifier = verifier
  }

  async execute(input: HarnessInput): Promise<HarnessExecution> {
    const exec = createExecution(input)
    this.executions.set(exec.executionId, exec)

    exec.status = 'planning'
    exec.evidence.observations.push(`Task started: ${input.taskType}`)

    // Compliance check: approval gate
    if (input.approvalRequired && !input.dryRun) {
      exec.status = 'awaiting_approval'
      exec.evidence.observations.push('Awaiting human approval before executing external actions')
      return exec
    }

    exec.status = 'executing'

    try {
      // Verify the execution plan
      const verifyResult = await this.verifier.verify(input)
      exec.evidence.complianceChecks.push(...verifyResult.checks)

      if (!verifyResult.safe) {
        exec.status = 'failed'
        exec.errors.push(verifyResult.reason ?? 'Verification failed')
        return exec
      }

      // Simulate execution (in production, this dispatches to actual tools)
      exec.output = {
        result: { task: input.taskType, params: input.params },
        artifacts: [],
        memoryWrites: [],
      }

      // Write to memory
      await this.memory.writeExecution(exec)
      exec.output.memoryWrites = [
        {
          nodeType: 'execution',
          title: `${input.taskType}: ${input.description}`,
          summary: `Harness execution completed for ${input.taskType}`,
          content: JSON.stringify(exec.output.result),
        },
      ]

      exec.status = 'completed'
      exec.completedAt = new Date().toISOString()
    } catch (err) {
      exec.status = 'failed'
      exec.errors.push(err instanceof Error ? err.message : String(err))
    }

    return exec
  }

  async replay(executionId: string): Promise<HarnessExecution> {
    const original = this.executions.get(executionId)
    if (!original) throw new Error(`Execution ${executionId} not found`)

    // Re-run with same input
    return this.execute({
      ...original.input,
      taskId: crypto.randomUUID(),
    })
  }

  async getStatus(executionId: string): Promise<HarnessStatus> {
    return this.executions.get(executionId)?.status ?? 'failed'
  }

  async approve(executionId: string, stepId: string, by: string): Promise<void> {
    const exec = this.executions.get(executionId)
    if (!exec) throw new Error(`Execution ${executionId} not found`)

    exec.approvalLog.push({ action: 'approved', by, at: new Date().toISOString() })

    if (exec.status === 'awaiting_approval') {
      // Re-execute now that approval is granted
      const updatedInput = { ...exec.input, approvalRequired: false }
      const resumed = await this.execute(updatedInput)
      exec.status = resumed.status
      exec.output = resumed.output
      exec.completedAt = resumed.completedAt
    }
  }

  async reject(executionId: string, _stepId: string, by: string, reason: string): Promise<void> {
    const exec = this.executions.get(executionId)
    if (!exec) throw new Error(`Execution ${executionId} not found`)

    exec.approvalLog.push({ action: 'rejected', by, at: new Date().toISOString(), note: reason })
    exec.status = 'cancelled'
    exec.completedAt = new Date().toISOString()
  }
}
