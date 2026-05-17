/**
 * @afromations/browser-harness
 *
 * Public API surface for the Hana browser-control harness.
 * Import from here, not from internal modules.
 */

// Primary entry point for programmatic use
export { handleHanaRequest } from './tools/hana-adapter.js';
export type { HanaToolRequest } from './tools/hana-adapter.js';

// Session management (read-only access for integrations)
export { listSessions, hasSession } from './browser/session-manager.js';

// Tool registry (schemas and descriptions)
export { ToolSchemas, TOOL_DESCRIPTIONS } from './tools/registry.js';
export type { ToolName, ToolParams } from './tools/registry.js';

// Voice scaffold
export {
  parseVoiceCommand,
  voiceCommandToHanaRequest,
} from './voice/scaffold.js';
export type {
  ParsedVoiceCommand,
  TranscriptionAdapter,
} from './voice/scaffold.js';

// Health checks
export { runHealthCheck } from './health/check.js';
export type { HealthReport } from './health/check.js';

// Operator console
export { startOperatorConsole } from './operator/console.js';

// Approval management
export {
  recordOperatorApproval,
  revokeOperatorApproval,
} from './tools/hana-adapter.js';

// Types
export type { ToolResult, Role, Actor, SessionSummary } from './types.js';
export type { Config } from './config.js';
