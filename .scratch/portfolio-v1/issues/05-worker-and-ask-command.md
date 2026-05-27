# Cloudflare Worker + `ask` command end-to-end (no grounding yet)

Status: needs-triage
Type: HITL

## What to build

End-to-end **Ask command** path with no **Grounding data** yet (that's #6). Per [ADR-0003](../../../docs/adr/0003-cloudflare-worker-fronting-gemini-flash-for-ask.md):

**Worker** (recommend separate repo `caseykerr-dev-worker` so deploy lifecycles decouple; alternatively `worker/` subdir in this repo — decide during HITL kickoff):

- TypeScript, managed by Wrangler
- `POST /ask { question: string }` → `{ answer: string }`
- Calls Gemini 2.0 Flash with a hardcoded system prompt: "You are Casey Kerr, a senior full-stack engineer. Answer briefly and in first person."
- Per-IP rate limit: 10 requests per IP per UTC day (via Cloudflare KV or Durable Object)
- Quota-exhaustion behavior: return `{ answer: "Daily budget exhausted — reach me at me@caseykerr.com" }` (200, not error)
- Gemini API key stored as Worker secret, never in code

**caseykerr.dev side**:

- `ask <question>` command added to the **Command** registry
- POSTs to Worker URL configured via `NEXT_PUBLIC_ASK_WORKER_URL` env var
- Renders answer with typewriter effect inside the terminal
- Network failure / rate-limited responses produce meaningful in-terminal error messages

## HITL notes

Requires Casey to:
- Decide Worker repo location (separate repo vs subdir)
- Provision Cloudflare account, run `wrangler login`
- Create Google Gemini API key on the free tier
- Set the API key as a Worker secret (`wrangler secret put GEMINI_API_KEY`)
- Confirm rate-limit number (10/IP/day is the default; adjustable)

## Acceptance criteria

- [ ] Worker scaffold with `wrangler.toml` and TypeScript
- [ ] `POST /ask` handler returns generated answers
- [ ] Gemini key only in Worker secrets (grep the repo to confirm)
- [ ] Per-IP rate limit enforced; verified by making 11 requests in a row from one IP
- [ ] Quota-exhaustion fallback message returned (not 4xx/5xx)
- [ ] Worker deployed to a `*.workers.dev` subdomain
- [ ] `ask` command in terminal calls the deployed Worker
- [ ] Worker URL configured via `NEXT_PUBLIC_ASK_WORKER_URL`
- [ ] Answer renders with typewriter effect
- [ ] Network error and rate-limited states produce clear in-terminal messages

## Blocked by

- #1 (Deploy tracer — hello world via CI/CD)
