/**
 * Open Harness Adapter — Harness Verifier
 * Validates task inputs against AFROMATIONS policy before execution.
 */

import type { HarnessInput } from './harness.contract'

export interface VerifyResult {
  safe: boolean
  reason?: string
  checks: { rule: string; passed: boolean; note?: string }[]
}

const BLOCKED_TASK_TYPES = [
  'auto_payout',
  'force_publish',
  'bypass_approval',
  'delete_production_data',
]

const BLOCKED_CONTENT_PATTERNS = [
  /verbatim\s+copy/i,
  /full\s+transcript/i,
  /exact\s+script/i,
  /stolen\s+content/i,
]

export class HarnessVerifier {
  async verify(input: HarnessInput): Promise<VerifyResult> {
    const checks: { rule: string; passed: boolean; note?: string }[] = []

    // Rule 1: Task type allowlist
    const blockedType = BLOCKED_TASK_TYPES.includes(input.taskType)
    checks.push({
      rule: 'task_type_allowed',
      passed: !blockedType,
      note: blockedType ? `Task type "${input.taskType}" is blocked by policy` : 'OK',
    })

    // Rule 2: Dry-run parity for external actions
    const externalActionsNeedApproval =
      input.approvalRequired && !input.dryRun && input.params.external === true
    checks.push({
      rule: 'external_action_approval',
      passed: !externalActionsNeedApproval,
      note: externalActionsNeedApproval
        ? 'External action requires approval or dry-run mode'
        : 'OK',
    })

    // Rule 3: No copyright-unsafe content
    const descriptionContent = JSON.stringify(input.params)
    const hasUnsafeContent = BLOCKED_CONTENT_PATTERNS.some((p) => p.test(descriptionContent))
    checks.push({
      rule: 'copyright_safe',
      passed: !hasUnsafeContent,
      note: hasUnsafeContent ? 'Input contains copyright-unsafe content patterns' : 'OK',
    })

    // Rule 4: Money movement requires explicit approval
    const involvesMoney =
      input.taskType.includes('payout') ||
      input.taskType.includes('withdrawal') ||
      String(input.params.action ?? '').includes('transfer')
    checks.push({
      rule: 'money_movement_approval',
      passed: !involvesMoney || input.approvalRequired,
      note: involvesMoney && !input.approvalRequired
        ? 'Money movement tasks must have approvalRequired=true'
        : 'OK',
    })

    const failedChecks = checks.filter((c) => !c.passed)
    const safe = failedChecks.length === 0

    return {
      safe,
      reason: failedChecks[0]?.note,
      checks,
    }
  }
}
