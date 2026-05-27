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

- [ ] `public/humans.txt` exists, valid format
- [ ] `public/.well-known/security.txt` exists with valid `Contact:` and `Expires:` fields
- [ ] Console art logs on page load — verified in both Chrome and Safari devtools
- [ ] `window.help()` callable from console; output formatted clearly
- [ ] `window.casey` namespace with `.career()`, `.skills()`, `.contact()`, `.eggs()` methods
- [ ] HTML head includes ASCII-art comment ≥ 20 lines tall
- [ ] None of the above produce visible elements or affect first paint
- [ ] None of the above introduce a11y violations (comments don't break screen readers; console code only runs client-side)

## Blocked by

- #1 (Deploy tracer — hello world via CI/CD)
