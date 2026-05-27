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

- [ ] `GET /teapot` returns HTTP 418 with ASCII teapot
- [ ] All Worker responses include a custom personality header
- [ ] `curl -A "curl/8.0" <worker-url>/` returns ANSI-rendered terminal (color codes work in a real shell)
- [ ] `curl -A "Mozilla/5.0..." <worker-url>/` returns the normal JSON/text response
- [ ] No ANSI leakage into browser-rendered HTML
- [ ] If using `terminal.caseykerr.dev`: DNS configured, documented in humans.txt
- [ ] Tested in a real shell (iTerm2, macOS Terminal)

## Blocked by

- #5 (Cloudflare Worker + `ask` command end-to-end)
