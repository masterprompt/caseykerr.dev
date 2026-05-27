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

- [ ] Worker has access to current `resume.json` (mechanism documented in code + PR)
- [ ] System prompt includes grounding data
- [ ] System prompt instructs the LLM to refuse to fabricate
- [ ] `ask "what AWS experience do you have"` returns an answer consistent with resume.json
- [ ] `ask "what's your favorite color"` returns a polite "I don't know — ask Casey directly" rather than fabricating
- [ ] Spot-check ~5 sample questions, accuracy results in PR description
- [ ] Cold-start latency for the first request after deploy noted in PR

## Blocked by

- #4 (Content pipeline: resumatic sync + Skills section)
- #5 (Cloudflare Worker + `ask` command end-to-end)
