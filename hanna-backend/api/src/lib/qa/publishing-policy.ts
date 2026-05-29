/**
 * Publishing Policy
 * Centralized policy enforcement for all external publishing actions.
 */

export interface PolicyCheck {
  allowed: boolean
  reason: string
  requiresApproval: boolean
  riskLevel: 'low' | 'medium' | 'high' | 'blocked'
}

export interface PolicyEnv {
  HANA_PUBLISHING_APPROVAL_MODE?: string
  HANA_DRY_RUN_PUBLISHING?: string
  HANA_AUTOPUBLISH_ENABLED?: string
}

/**
 * Check whether a publishing action is allowed under current policy.
 */
export function checkPublishingPolicy(
  env: Record<string, string | undefined>,
  opts: {
    action: 'post_social' | 'publish_blog' | 'send_email' | 'payout_request' | 'schedule_post'
    approvalStatus?: string
    platform?: string
    amount?: number
  }
): PolicyCheck {
  const approvalMode = env.HANA_PUBLISHING_APPROVAL_MODE !== 'false'
  const dryRun = env.HANA_DRY_RUN_PUBLISHING !== 'false'
  const autopublish = env.HANA_AUTOPUBLISH_ENABLED === 'true'

  // Payout requests always require approval — no exceptions
  if (opts.action === 'payout_request') {
    return {
      allowed: false,
      reason: 'Payout requests require explicit human approval. This is a non-negotiable safety constraint.',
      requiresApproval: true,
      riskLevel: 'high',
    }
  }

  // Dry-run mode: block all live publishing but allow scheduling/queuing
  if (dryRun && (opts.action === 'post_social' || opts.action === 'publish_blog')) {
    return {
      allowed: false,
      reason: 'HANA_DRY_RUN_PUBLISHING=true. Content is queued but not sent live.',
      requiresApproval: false,
      riskLevel: 'low',
    }
  }

  // Autopublish bypasses approval for non-payout actions (payout already returned above)
  if (autopublish) {
    return {
      allowed: true,
      reason: 'HANA_AUTOPUBLISH_ENABLED=true — publishing without approval gate.',
      requiresApproval: false,
      riskLevel: 'medium',
    }
  }

  // Approval mode: check status
  if (approvalMode) {
    if (!opts.approvalStatus || opts.approvalStatus !== 'approved') {
      return {
        allowed: false,
        reason: `Approval required. Current status: ${opts.approvalStatus ?? 'pending'}. Approve in /admin/hana-harness.`,
        requiresApproval: true,
        riskLevel: 'medium',
      }
    }
  }

  return {
    allowed: true,
    reason: `${opts.action} cleared under current policy.`,
    requiresApproval: false,
    riskLevel: 'low',
  }
}

/**
 * Validate that a wallet record is safe to create.
 * Revenue recording is always allowed. Payouts always require approval.
 */
export function validateWalletOperation(
  type: string,
  amount: number
): PolicyCheck {
  if (type === 'payout' || type === 'withdrawal' || type === 'transfer') {
    return {
      allowed: false,
      reason: 'External money movement requires explicit human approval. Record created as pending.',
      requiresApproval: true,
      riskLevel: 'high',
    }
  }

  if (amount < 0 && !['refund', 'adjustment', 'chargeback'].includes(type)) {
    return {
      allowed: false,
      reason: `Negative amount with type "${type}" is not allowed without human review.`,
      requiresApproval: true,
      riskLevel: 'high',
    }
  }

  return {
    allowed: true,
    reason: 'Revenue/tracking record is safe to create.',
    requiresApproval: false,
    riskLevel: 'low',
  }
}
