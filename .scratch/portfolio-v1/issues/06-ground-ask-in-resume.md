# Ground `ask` command in resume.json

Status: needs-triage
Type: AFK

## What to build

Replace the Worker's hardcoded system prompt with a real **Grounding data** path. The Worker embeds the sanitized `resume.json` as grounding context so LLM answers are anchored in real career facts.

**Implementation choice** (pick one during the slice; document in PR):

1. Worker fetches `https://caseykerr.dev/content/resume.json` on cold start, caches in module scope or KV for 24h
2. `resume.json` is committed into the Worker repo and re-deployed when content changes

System prompt becomes (approximate):

> You are Casey Kerr's portfolio assistant. Answer in first person, briefly, and in a friendly engineer-to-engineer tone. The source of truth for Casey's career is the JSON below. Do not invent facts that are not present in the data. If asked something off-resume (favorite color, personal life), politely say you don't know and suggest emailing Casey directly.
>
> [resume.json contents]

## Acceptance criteria

- [x] Worker has access to current `resume.json` (resumatic's `sync:portfolio` now writes to both consumers; Worker imports the file at build time and bundles it into the deployed Worker)
- [x] System prompt includes grounding data (full JSON inlined; ~16k tokens, plenty of headroom in Gemini 2.5 Flash's 1M context)
- [x] System prompt instructs the LLM to refuse to fabricate (RESUME_DATA is named as the only authoritative source)
- [x] `ask what stack do you use` returns Node.js / AWS / React, consistent with resume.json (verified by Casey post-grounding deploy)
- [x] System prompt has explicit privacy rules (no naming current consulting clients; no naming unreleased projects)
- [x] System prompt has explicit fallback rules for off-resume questions (suggest emailing Casey)

## Implementation notes

- The resumatic `sync:portfolio` script now writes to two targets by default: `caseykerr.dev/content/resume.json` AND `caseykerr-dev-worker/content/resume.json`. Single command refreshes both consumers; the JSON is committed in each repo.
- Worker imports the JSON at build time via `import resumeData from "../content/resume.json"`. esbuild (Wrangler's bundler) inlines it into the deployed Worker.
- System prompt explicitly redirects the LLM away from naming current clients or unreleased projects, even when those names appear in the data. Belt-and-suspenders alongside the data-side sanitization the sync script already applies.

## Blocked by

- #4 (Content pipeline: resumatic sync + Skills section)
- #5 (Cloudflare Worker + `ask` command end-to-end)
