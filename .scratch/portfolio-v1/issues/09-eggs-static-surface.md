# Easter eggs — static / source surface

Status: needs-triage
Type: AFK

## What to build

All **Eggs** that live in static files or HTML output. Tech-clever spine with light playful seasoning.

**`public/humans.txt`** — formatted per [humanstxt.org](https://humanstxt.org) spec. Sections: TEAM (Casey, contact, location), THANKS (tooling credits: Next.js, Tailwind, Cloudflare, Gemini, GoatCounter), SITE (last updated, language, doctype, components). Tone: tech-clever, mildly warm.

**`public/.well-known/security.txt`** — valid format with `Contact:`, `Expires:` (set to one year out), and `Preferred-Languages:`.

**Console art on load** — in a top-level `useEffect` (client-side only), `console.log` a multi-line ASCII art (the Kerrsoft logo or a typed "CASEY KERR"), styled with `%c` CSS, ending with: `Looking under the hood? Try typing help() in the console.`

**`window.help` global** — defined alongside the console art. Prints a list of "console commands":
- `casey.career()` — log structured career data from `resume.json`
- `casey.skills()` — log skills list
- `casey.contact()` — log contact info
- `casey.eggs()` — log a list of *places* easter eggs live (without spoiling specifics)

**HTML source comment** — a long `<!-- ... -->` block in `<head>` containing ASCII art of the Kerrsoft logo, a one-line tagline ("hand-crafted in Waukesha"), and a reference to a real RFC (e.g. `Built with deference to RFC 2324 (HTCPCP/1.0)` — see also #10's `/teapot`).

## Acceptance criteria

- [x] `public/humans.txt` exists, valid format (TEAM / THANKS / SITE / NOTES sections per humanstxt.org)
- [x] `public/.well-known/security.txt` exists with valid `Contact:`, `Expires:` (2027-05-27), `Preferred-Languages:`, `Canonical:` per RFC 9116
- [x] Console art logs on page load (KERRSOFT ANSI-shadow banner + hint to type `help()`)
- [x] `window.help()` callable from console; output formatted clearly with %c styling
- [x] `window.casey` namespace with `.career()`, `.skills()`, `.contact()`, `.eggs()` methods
- [x] HTML head includes ASCII-art "comment" ≥ 20 lines tall (delivered via inert `<script type="application/x-source-art">` — see implementation notes)
- [x] None produce visible elements or affect first paint (script tag is inert; ConsoleEgg returns null)
- [x] No a11y violations (no visible DOM additions; screen readers ignore inert script and dev-only console output)

## Implementation notes

- JSX can't render real HTML comments (React strips them), so the "in-head comment" is delivered as `<script type="application/x-source-art">` with `dangerouslySetInnerHTML`. Browser ignores the unknown script type entirely; view-source renders the ASCII art and credits cleanly right inside `<head>`. Intent of the AC is met (visible to source-viewers, invisible to renders).
- Career / skills data in `ConsoleEgg.tsx` is hand-stubbed for now. #04 swaps to reads from `content/resume.json` once the resumatic sync lands.
- Globals are typed via `declare global { interface Window { ... } }` and cleaned up on unmount (effect cleanup) so re-mounts in dev don't leave stale references.

## Blocked by

- #1 (Deploy tracer — hello world via CI/CD)
