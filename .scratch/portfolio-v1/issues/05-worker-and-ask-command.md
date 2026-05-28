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

- [x] Worker scaffold with `wrangler.jsonc` and TypeScript (sibling repo at `~/Projects/Personal/caseykerr-dev-worker/`)
- [x] `POST /ask` handler returns generated answers
- [x] Gemini key only in Worker secrets (`wrangler secret put GEMINI_API_KEY`)
- [x] Per-IP rate limit enforced (10/UTC day, KV-backed via `ASK_RATE_LIMIT`)
- [x] Quota-exhaustion fallback returned with HTTP 200 + `rateLimited: true` (never 4xx/5xx for visitor-facing errors)
- [x] Worker deployed at `https://caseykerr-dev-worker.caseykerr.workers.dev`
- [x] `ask` command in terminal calls the deployed Worker
- [x] Worker URL configurable via `NEXT_PUBLIC_ASK_WORKER_URL` (deployed URL is the hardcoded default)
- [x] Answer renders with typewriter effect (~12ms/char)
- [x] Network error + rate-limited states produce clear in-terminal messages

## Implementation notes

- CommandResult schema gained an optional `async` continuation field so the registry can support async commands; `ask` is the first user.
- CORS allowlist reflects request origin (localhost + caseykerr.dev) rather than wildcard.
- Free-tier gotcha: gemini-2.0-flash was moved off the free tier mid-2026 for new projects (429 with `limit: 0`). Worker uses gemini-2.5-flash instead.
- Initial deploy hallucinated stack details (Python / FastAPI). Grounded with resume.json in #06.

## Blocked by

- #1 (Deploy tracer — hello world via CI/CD)
