# Hanna Backend — Cloudflare Deploy Instructions

## Prerequisites
wrangler 4.82.2 is installed globally via pnpm.
To activate it in a new terminal:
```powershell
$env:PNPM_HOME = "C:\Users\execu\AppData\Local\pnpm"
$env:Path = "$env:PNPM_HOME;" + $env:Path
wrangler --version   # should print 4.82.2
```

## Step 1 — Authenticate with Cloudflare
**OAuth is broken on this machine** (localhost:8976 callback times out).
Use a Cloudflare API token instead.

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click **Create Token** → **Edit Cloudflare Workers** template
3. Click **Continue to summary** → **Create Token**
4. Copy the token, then:

```powershell
$env:CLOUDFLARE_API_TOKEN = "PASTE_TOKEN_HERE"
wrangler whoami   # should show your account name
```

## Step 2 — Deploy
```powershell
Set-Location "E:\ACTIVE PROJECTS-PIPELINE\ACTIVE PROJECTS-PIPELINE\AFROMATIONS\hanna-backend\api"
wrangler deploy
```

Expected output:
```
Published hanna-api (url: https://hanna-api.afromations.workers.dev)
```

## Step 3 — Set Secrets
After deploy succeeds, run each command below and paste the value when prompted:
```powershell
wrangler secret put GEMINI_API_KEY
# Value: AIzaSyD7IXbH1i1RAbPSHlrBJEiMeYEQb-Y1l_Y

wrangler secret put SUPABASE_URL
# Value: http://31.220.58.212:8001

wrangler secret put SUPABASE_SERVICE_KEY
# Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NzI3NzY2NzMsImV4cCI6MTkzMDQ1NjY3M30.ns9wbGi2xeS2zbZ1foj6fj4NSa4JxSmJKAedmlShF3w
```

## Step 4 — Test
```powershell
Invoke-RestMethod -Method POST `
  -Uri "https://hanna-api.afromations.workers.dev/api/hanna/chat" `
  -ContentType "application/json" `
  -Body '{"message":"Hello Hanna"}'
```

Expected: `{ "agent": "Hanna", "response": "...", "status": "ok" }`

## Notes
- Frontend already points to `https://hanna-api.afromations.workers.dev` via `API_URL` in `src/lib/utils.ts`
- No `.env` changes needed on Vercel side — Vercel env var `NEXT_PUBLIC_HANNA_API` can override if needed
