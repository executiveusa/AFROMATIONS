export type Role = 'user' | 'creator' | 'client' | 'operator' | 'admin';

export interface Actor {
  id: string;
  role: Role;
  name: string;
}

export interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  requiresApproval?: boolean;
  approvalId?: string;
  message?: string;
}

export interface ConsoleEntry {
  type: 'log' | 'warn' | 'error' | 'info' | 'debug' | string;
  text: string;
  timestamp: number;
}

export interface NetworkEntry {
  url: string;
  method: string;
  status?: number;
  requestHeaders: Record<string, string>;
  responseHeaders?: Record<string, string>;
  timestamp: number;
}

export interface PendingApproval {
  id: string;
  tool: string;
  params: unknown;
  reason: string;
  requestedAt: number;
  resolve: (approved: boolean) => void;
}

export interface SessionSummary {
  id: string;
  createdAt: number;
  lastActivityAt: number;
  currentUrl: string;
  consoleLogCount: number;
  networkLogCount: number;
  screenshotCount: number;
  pendingApprovalCount: number;
}
