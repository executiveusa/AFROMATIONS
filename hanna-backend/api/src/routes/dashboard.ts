import { Hono } from 'hono'

export const dashboardRoutes = new Hono()

// Serve the dashboard HTML app
dashboardRoutes.get('/', (c) => {
  const html = renderDashboard()
  return c.html(html)
})

function renderDashboard(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>AFROMATIONS Control — Agent Hanna Dashboard</title>
  <style>
    :root {
      --af-black: #0a0a0a;
      --af-red: #c41e1e;
      --af-red-dark: #8b1515;
      --af-cream: #f5f0e8;
      --af-grey: #1a1a1a;
      --af-grey-mid: #2a2a2a;
      --af-grey-light: #8a8a8a;
      --af-gold: #d4a017;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--af-black);
      color: var(--af-cream);
      min-height: 100vh;
    }
    .header {
      border-bottom: 1px solid rgba(255,255,255,0.05);
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      background: var(--af-black);
      z-index: 50;
    }
    .brand {
      font-family: 'Sora', sans-serif;
      font-weight: 700;
      font-size: 0.875rem;
      letter-spacing: 0.12em;
      color: var(--af-red);
    }
    .brand-sub {
      font-size: 0.625rem;
      letter-spacing: 0.3em;
      color: var(--af-grey-light);
      text-transform: uppercase;
      margin-left: 0.5rem;
    }
    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22c55e;
      display: inline-block;
    }
    .status-dot.offline { background: var(--af-red); }
    .status-text {
      font-size: 0.625rem;
      color: var(--af-grey-light);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-left: 0.375rem;
    }
    .layout {
      display: grid;
      grid-template-columns: 1fr 400px;
      height: calc(100vh - 49px);
    }
    @media (max-width: 768px) {
      .layout { grid-template-columns: 1fr; }
      .chat-panel { display: none; }
    }

    /* Main panel */
    .main-panel {
      overflow-y: auto;
      padding: 1.5rem;
    }
    .section-label {
      font-size: 0.625rem;
      font-weight: 500;
      letter-spacing: 0.4em;
      text-transform: uppercase;
      color: var(--af-red);
      margin-bottom: 0.75rem;
    }
    .metric-row {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      margin-bottom: 2rem;
    }
    .metric {
      min-width: 120px;
    }
    .metric-value {
      font-family: 'Sora', sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--af-cream);
    }
    .metric-label {
      font-size: 0.625rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--af-grey-light);
      margin-top: 0.125rem;
    }
    .divider {
      height: 1px;
      background: rgba(255,255,255,0.05);
      margin: 1.5rem 0;
    }

    /* Learner table */
    .table-wrap {
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.75rem;
    }
    th {
      text-align: left;
      font-size: 0.625rem;
      font-weight: 500;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--af-grey-light);
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    td {
      padding: 0.625rem 0.75rem;
      border-bottom: 1px solid rgba(255,255,255,0.03);
      color: var(--af-cream);
    }
    tr:hover td {
      background: rgba(255,255,255,0.02);
    }
    .badge {
      display: inline-block;
      font-size: 0.5625rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 0.125rem 0.5rem;
      border-radius: 2px;
    }
    .badge-active { background: rgba(34,197,94,0.15); color: #22c55e; }
    .badge-premium { background: rgba(212,160,23,0.15); color: var(--af-gold); }
    .badge-free { background: rgba(138,138,138,0.1); color: var(--af-grey-light); }
    .badge-scholar { background: rgba(196,30,30,0.15); color: var(--af-red); }

    /* Chat panel */
    .chat-panel {
      border-left: 1px solid rgba(255,255,255,0.05);
      display: flex;
      flex-direction: column;
      height: calc(100vh - 49px);
    }
    .chat-header {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-size: 0.625rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--af-grey-light);
    }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .msg {
      max-width: 85%;
      font-size: 0.8125rem;
      line-height: 1.5;
      padding: 0.625rem 0.875rem;
      border-radius: 2px;
    }
    .msg-user {
      align-self: flex-end;
      background: var(--af-grey-mid);
      color: var(--af-cream);
    }
    .msg-hanna {
      align-self: flex-start;
      background: rgba(196,30,30,0.08);
      border-left: 2px solid var(--af-red);
      color: var(--af-cream);
    }
    .msg-hanna .sender {
      font-size: 0.5625rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--af-red);
      margin-bottom: 0.25rem;
    }
    .msg-system {
      align-self: center;
      font-size: 0.625rem;
      color: var(--af-grey-light);
      letter-spacing: 0.1em;
    }
    .chat-input-wrap {
      padding: 0.75rem 1rem;
      border-top: 1px solid rgba(255,255,255,0.05);
      display: flex;
      gap: 0.5rem;
    }
    .chat-input {
      flex: 1;
      background: var(--af-grey);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 2px;
      padding: 0.5rem 0.75rem;
      color: var(--af-cream);
      font-size: 0.8125rem;
      font-family: inherit;
      outline: none;
    }
    .chat-input:focus {
      border-color: var(--af-red);
    }
    .chat-input::placeholder {
      color: var(--af-grey-light);
    }
    .chat-send {
      background: var(--af-red);
      border: none;
      border-radius: 2px;
      color: var(--af-cream);
      padding: 0.5rem 1rem;
      font-size: 0.6875rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      font-family: inherit;
    }
    .chat-send:hover { background: var(--af-red-dark); }
    .chat-send:disabled { opacity: 0.4; cursor: not-allowed; }

    /* Loading states */
    .skeleton {
      background: rgba(255,255,255,0.03);
      border-radius: 2px;
      animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @media (prefers-reduced-motion: reduce) {
      .skeleton { animation: none; }
    }

    /* Quick actions */
    .actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
    }
    .action-btn {
      background: var(--af-grey);
      border: 1px solid rgba(255,255,255,0.05);
      border-radius: 2px;
      padding: 0.375rem 0.75rem;
      color: var(--af-cream);
      font-size: 0.6875rem;
      cursor: pointer;
      font-family: inherit;
      letter-spacing: 0.05em;
    }
    .action-btn:hover {
      border-color: var(--af-red);
      color: var(--af-red);
    }
  </style>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Sora:wght@600;700&display=swap" rel="stylesheet" />
</head>
<body>
  <header class="header">
    <div style="display:flex;align-items:center;">
      <span class="brand">AFROMATIONS</span>
      <span class="brand-sub">Control</span>
    </div>
    <div style="display:flex;align-items:center;">
      <span class="status-dot" id="statusDot"></span>
      <span class="status-text" id="statusText">Checking...</span>
    </div>
  </header>

  <div class="layout">
    <!-- Main dashboard panel -->
    <div class="main-panel">
      <!-- Quick actions -->
      <p class="section-label">Quick Actions</p>
      <div class="actions">
        <button class="action-btn" onclick="sendChat('show me system metrics')">System Metrics</button>
        <button class="action-btn" onclick="sendChat('scan anime trends')">Scan Trends</button>
        <button class="action-btn" onclick="sendChat('generate a blog post about the latest anime news')">Generate Post</button>
        <button class="action-btn" onclick="sendChat('show learner stats')">Learner Stats</button>
        <button class="action-btn" onclick="sendChat('what are you working on?')">Status Report</button>
      </div>

      <div class="divider"></div>

      <!-- Metrics -->
      <p class="section-label">Overview</p>
      <div class="metric-row" id="metricsRow">
        <div class="metric"><div class="skeleton" style="width:60px;height:24px;margin-bottom:4px;"></div><div class="metric-label">Loading...</div></div>
      </div>

      <div class="divider"></div>

      <!-- Learners table -->
      <p class="section-label">Learners</p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Tier</th>
              <th>Joined</th>
              <th>Last Active</th>
            </tr>
          </thead>
          <tbody id="learnersBody">
            <tr><td colspan="6" style="color:var(--af-grey-light);font-size:0.6875rem;">Loading...</td></tr>
          </tbody>
        </table>
      </div>

      <div class="divider"></div>

      <!-- System info -->
      <p class="section-label">System</p>
      <div id="systemInfo" style="font-size:0.75rem;color:var(--af-grey-light);">Loading system info...</div>
    </div>

    <!-- Chat panel -->
    <div class="chat-panel">
      <div class="chat-header">Agent Hanna — Natural Language Control</div>
      <div class="chat-messages" id="chatMessages">
        <div class="msg msg-hanna">
          <div class="sender">Hanna</div>
          Dashboard connected. I'm ready to help you manage the studio. Ask me anything — check metrics, generate content, scan trends, or manage learners.
        </div>
      </div>
      <div class="chat-input-wrap">
        <input
          class="chat-input"
          id="chatInput"
          placeholder="Talk to Hanna..."
          autocomplete="off"
        />
        <button class="chat-send" id="chatSend" onclick="handleSend()">Send</button>
      </div>
    </div>
  </div>

  <script>
    const BASE = location.origin + '/api';
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');

    // Enter to send
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    });

    // Health check
    async function checkHealth() {
      try {
        const r = await fetch(BASE + '/health');
        const d = await r.json();
        document.getElementById('statusDot').className = 'status-dot';
        document.getElementById('statusText').textContent = d.status || 'Online';
      } catch {
        document.getElementById('statusDot').className = 'status-dot offline';
        document.getElementById('statusText').textContent = 'Offline';
      }
    }

    // Load metrics
    async function loadMetrics() {
      try {
        const r = await fetch(BASE + '/hana/admin/metrics');
        const d = await r.json();
        const row = document.getElementById('metricsRow');
        row.innerHTML = [
          metric(d.learners?.total ?? 0, 'Total Learners'),
          metric(d.learners?.byStatus?.active ?? 0, 'Active'),
          metric(d.sessions?.thisMonth ?? 0, 'Sessions (Month)'),
          metric(d.assessments?.total ?? 0, 'Assessments'),
          metric((d.assessments?.passRate ?? 0) + '%', 'Pass Rate'),
          metric(d.growth?.newLearnersThisMonth ?? 0, 'New This Month'),
        ].join('');
      } catch {
        document.getElementById('metricsRow').innerHTML =
          '<div class="metric"><div class="metric-value">—</div><div class="metric-label">API Unavailable</div></div>';
      }
    }

    function metric(value, label) {
      return '<div class="metric"><div class="metric-value">' + value + '</div><div class="metric-label">' + escapeHtml(label) + '</div></div>';
    }

    // Load learners
    async function loadLearners() {
      try {
        const r = await fetch(BASE + '/hana/admin/learners?limit=20');
        const d = await r.json();
        const tbody = document.getElementById('learnersBody');
        if (!d.learners || d.learners.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="color:var(--af-grey-light);font-size:0.6875rem;">No learners yet</td></tr>';
          return;
        }
        tbody.innerHTML = d.learners.map(function(l) {
          return '<tr>'
            + '<td>' + escapeHtml(l.displayName || '—') + '</td>'
            + '<td style="color:var(--af-grey-light);">' + escapeHtml(l.email || '—') + '</td>'
            + '<td><span class="badge badge-' + escapeHtml(l.status || 'active') + '">' + escapeHtml(l.status || 'active') + '</span></td>'
            + '<td><span class="badge badge-' + escapeHtml(l.subscriptionTier || 'free') + '">' + escapeHtml(l.subscriptionTier || 'free') + '</span></td>'
            + '<td style="color:var(--af-grey-light);">' + formatDate(l.joinedAt) + '</td>'
            + '<td style="color:var(--af-grey-light);">' + formatDate(l.lastActiveAt) + '</td>'
            + '</tr>';
        }).join('');
      } catch {
        document.getElementById('learnersBody').innerHTML =
          '<tr><td colspan="6" style="color:var(--af-grey-light);font-size:0.6875rem;">Could not load learners</td></tr>';
      }
    }

    // Load system info
    async function loadSystem() {
      try {
        const r = await fetch(BASE + '/health');
        const d = await r.json();
        document.getElementById('systemInfo').innerHTML =
          '<div style="display:flex;gap:2rem;flex-wrap:wrap;">'
          + sysItem('Agent', d.agent || 'Hanna')
          + sysItem('Studio', d.studio || 'AFROMATIONS')
          + sysItem('Last Check', new Date(d.timestamp).toLocaleString())
          + '</div>';
      } catch {
        document.getElementById('systemInfo').textContent = 'System info unavailable';
      }
    }

    function sysItem(label, value) {
      return '<div><div style="font-size:0.625rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--af-grey-light);">' + escapeHtml(label) + '</div><div style="color:var(--af-cream);margin-top:2px;">' + escapeHtml(String(value)) + '</div></div>';
    }

    // Chat with Hanna
    function sendChat(message) {
      chatInput.value = message;
      handleSend();
    }

    async function handleSend() {
      const message = chatInput.value.trim();
      if (!message) return;
      chatInput.value = '';
      chatSend.disabled = true;

      // Show user message
      appendMessage('user', message);

      try {
        const r = await fetch(BASE + '/hanna/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: message, context: 'dashboard-admin' }),
        });
        const d = await r.json();
        appendMessage('hanna', d.response || d.error || 'No response');
      } catch (err) {
        appendMessage('system', 'Failed to reach Hanna: ' + err.message);
      }

      chatSend.disabled = false;
      chatInput.focus();
    }

    function appendMessage(role, text) {
      const div = document.createElement('div');
      div.className = 'msg msg-' + role;
      if (role === 'hanna') {
        div.innerHTML = '<div class="sender">Hanna</div>' + escapeHtml(text);
      } else {
        div.textContent = text;
      }
      chatMessages.appendChild(div);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function formatDate(iso) {
      if (!iso) return '—';
      try {
        return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } catch { return '—'; }
    }

    function escapeHtml(str) {
      var div = document.createElement('div');
      div.appendChild(document.createTextNode(str));
      return div.innerHTML;
    }

    // Init
    checkHealth();
    loadMetrics();
    loadLearners();
    loadSystem();

    // Refresh health every 30s
    setInterval(checkHealth, 30000);
  </script>
</body>
</html>`;
}
