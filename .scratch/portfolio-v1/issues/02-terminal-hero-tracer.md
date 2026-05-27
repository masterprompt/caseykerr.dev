# Terminal hero tracer bullet — frame, one command, one section

Status: needs-triage
Type: AFK

## What to build

The first slice of the real design. Replace the hello-world page with a **Terminal hero** (per `CONTEXT.md`) that:

- Renders a CRT-style frame (green-on-black + amber accents, monospace, blinking caret)
- Plays a single-line **Auto-demo** on page load: `$ whoami` → `Casey Kerr — senior full-stack engineer`
- Transitions to **Live REPL** on desktop after the auto-demo completes
- Exposes one **Command**: `about`, which smooth-scrolls to a placeholder About **Section** below the hero
- Prints `command not found: <name>` for unknown input

CRT theme tokens are defined as CSS variables (`--terminal-bg`, `--terminal-fg`, `--terminal-accent`, `--terminal-font`) for later slices to consume. Tab completion, history, `help`, and other commands are out of scope — those come in #3.

Respect the architecture in [ADR-0001](../../../docs/adr/0001-terminal-hero-with-command-driven-nav.md) and [ADR-0004](../../../docs/adr/0004-roll-our-own-terminal-css-first-animation.md).

## Acceptance criteria

- [x] Terminal hero component at `src/components/terminal/Terminal.tsx`
- [x] CRT theme tokens defined in `globals.css` (`--terminal-bg`, `--terminal-fg`, `--terminal-accent`, `--terminal-font`)
- [x] Auto-demo plays `whoami` on page load with typewriter timing (~500ms in practice; close to 600ms target)
- [x] Live REPL prompt is keyboard-focused after auto-demo on desktop
- [x] Typing `about` + Enter smooth-scrolls to a placeholder section anchored at `#about`
- [x] Placeholder About section is `<h2>About</h2><p>Coming soon.</p>` — narrative is #7
- [x] Unknown commands print `command not found: <name>`
- [x] Vocabulary from `CONTEXT.md` used in code (Terminal hero, Auto-demo, Live REPL, Command)
- [ ] Deploys via existing workflow; site updates on push *(pending push)*

## Verified

Casey verified locally on `npm run dev`: typewriter animation, focus handoff to live REPL, `about` smooth-scroll, and unknown-command error all behave as expected.

## Blocked by

- #1 (Deploy tracer — hello world via CI/CD)
