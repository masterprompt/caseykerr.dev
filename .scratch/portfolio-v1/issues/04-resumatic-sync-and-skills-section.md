# Content pipeline: resumatic sync + Skills section renders from resume.json

Status: needs-triage
Type: AFK

## What to build

This slice cuts across two repos per [ADR-0002](../../../docs/adr/0002-hybrid-content-model-resumatic-as-data-source.md).

**In resumatic** (`~/Projects/Personal/resumatic/`):

- Add `scripts/sync-portfolio.js` that reads `content/resume.yaml`, strips PII (drop `meta.phone`, keep `location` to city/state only, drop `facebook` and `twitter` from output), and writes a JSON file to a target path
- Default target: `../caseykerr.dev/content/resume.json` (overridable via env var `PORTFOLIO_TARGET`)
- Sanitization rules documented in a top-of-file comment (what's stripped and why)
- Add `"sync:portfolio": "node scripts/sync-portfolio.js"` to `package.json` scripts

**In caseykerr.dev**:

- Commit `content/resume.json` (the sanitized output)
- Add `src/lib/resume.ts` exporting a typed loader returning a parsed `Resume` object (zod schema or hand-written types; pick whichever is lower-friction)
- Build fails clearly if `resume.json` is missing or schema-invalid
- Skills section renders skills grouped by category from `resume.json` (replaces placeholder)

Vocabulary: **Resumatic**, **Sync script**, **resume.json** per `CONTEXT.md`.

## Acceptance criteria

- [ ] Resumatic: `scripts/sync-portfolio.js` created
- [ ] Resumatic: `npm run sync:portfolio` produces a valid JSON at the target path
- [ ] Resumatic: PII stripped per sanitization rules (verify by inspecting output)
- [ ] caseykerr.dev: `content/resume.json` committed
- [ ] caseykerr.dev: `src/lib/resume.ts` exports a typed loader
- [ ] caseykerr.dev: build fails with a clear error if `resume.json` is missing or malformed
- [ ] Skills section renders skills grouped by category (frontend, backend, devops, databases, testing, etc.)
- [ ] Skills section visually consistent with CRT theme

## Blocked by

- #1 (Deploy tracer — hello world via CI/CD)
