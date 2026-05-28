# Easter eggs — network / Worker surface

Status: needs-triage
Type: AFK

## What to build

**Eggs** hosted on the Worker — the tech-clever ones.

**`GET /teapot`** — returns HTTP **418 I'm a Teapot** with an ASCII teapot in the body and a `Content-Type: text/plain` header. Per RFC 2324 / RFC 7168.

**Personality response header** — every Worker response carries `X-Made-By: hand` (or similar — `X-Powered-By: bitmoji` if you want playful instead).

**`curl`-UA detection** — when the Worker receives a request whose User-Agent contains `curl` or `wget`, return a fully ANSI-rendered terminal hero in the response body so `curl <worker-or-site>` actually shows the green-on-black terminal in the user's shell. Browser requests are unaffected.

**Routing choice** — `curl caseykerr.dev` should ideally trigger the ANSI response, but GH Pages can't run UA-detection logic. Options:

1. Point `terminal.caseykerr.dev` at the Worker and document that as the "real CLI" entrypoint
2. Add the same logic to GH Pages via a 404 redirect to the Worker for curl UAs (likely too fragile)
3. Have the Worker also serve `caseykerr.dev` (would require migrating hosting — out of scope)

Recommend option 1 for this slice. Document it as an egg in `humans.txt` (#9).

## Acceptance criteria

- [x] `GET /teapot` returns HTTP 418 with ASCII teapot
- [x] All Worker responses include a custom personality header (`X-Made-By: hand`)
- [x] `curl <worker-url>/` returns ANSI-rendered terminal (verified via `cat -v` showing `^[[32m`/`^[[33m` color escapes; renders as green/amber in a real shell)
- [x] Mozilla-UA hits to root return the standard JSON 404; no ANSI leaks into browser-rendered HTML
- [ ] terminal.caseykerr.dev DNS — *deferred*. Workers.dev URL stays the canonical curl entrypoint; documented in `public/humans.txt`. Moving DNS to Cloudflare just for this egg felt like the wrong trade.
- [x] Auto-deploy via GitHub Actions: `.github/workflows/deploy.yml` in the worker repo deploys on push to master (Node 22 + Wrangler 4 + cloudflare/wrangler-action@v3)

## Implementation notes

- Worker handles three routes: `POST /ask`, `GET /teapot`, and `GET /` (only when UA contains `curl|wget|httpie`). All other paths return JSON 404.
- ANSI rendering uses the same color palette as the in-browser CRT theme: bright green for prompts and ASCII art, amber for accents, dim for body text.
- Em-dash audit: caught and fixed one stale em dash in the home-page auto-demo (`Casey Kerr — senior full-stack engineer`) during this slice.

## Auto-deploy gotchas (recorded so future-Casey doesn't re-debug)

1. Repo defaults to `master` not `main`; workflow now triggers on both.
2. Workflow needs Node 22 because `wrangler@^4` requires it. Node 20 caused silent downgrade to `wrangler@3.90` which predates `wrangler.jsonc` support.
3. GitHub Actions secrets vs variables tabs are distinct surfaces; `${{ secrets.X }}` only reads from the Secrets tab.

## Blocked by

- #5 (Cloudflare Worker + `ask` command end-to-end)
