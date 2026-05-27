# Live REPL with full command parity

Status: needs-triage
Type: AFK

## What to build

Bring the **Live REPL** up to feature parity:

- **Tab completion** against the listed-command registry (excludes **Hidden commands**)
- **↑/↓ history navigation** within the session
- **`help` command** lists all listed commands with one-line descriptions
- **`clear` command** empties the terminal output (in-memory history retained)
- **Auto-demo** runs the full sequence: `whoami` → `ls projects/` → `help`
- **Section commands** (`about`, `now`, `work`, `projects`, `skills`, `contact`) each smooth-scroll to their placeholder anchor
- **Mobile detection**: on viewports < 768px or `navigator.maxTouchPoints > 0`, the auto-demo still plays but text input is disabled; show a "tap to continue" cue that dismisses the hero and scrolls to the first section

## Acceptance criteria

- [x] Tab completes against listed commands; does not suggest hidden ones (registry-driven; `hidden: true` excludes from both `help` and tab completion)
- [x] ↑/↓ navigates session history (with draft-restore on ↓ past the most recent)
- [x] `help` prints listed-command registry with one-line descriptions
- [x] `clear` empties terminal output (history retained for ↑/↓)
- [x] Auto-demo sequence: `whoami` → `ls projects/` → `help`
- [x] All six section commands scroll to matching placeholder anchors
- [x] Mobile: input disabled, "tap to continue" cue scrolls past hero
- [x] No console errors; keyboard nav passes basic a11y check
- [ ] Verified in Chromium, Safari, and mobile Safari *(verified in primary dev browser; cross-browser spot-check on push)*

## Verified

Casey verified locally on `npm run dev`: auto-demo sequence, tab completion (single + multi match + empty), ↑/↓ history with draft restore, `help`, `clear`, all six section scrolls, and the mobile "tap to continue" path via DevTools device emulation.

## Notes

- Mobile detection uses `useSyncExternalStore` (no-op subscribe) instead of `setState` in `useEffect` — picks up the React 19 lint rule and keeps a clean upgrade path if we want to add resize handling later.
- Command registry extracted to `src/components/terminal/commands.ts`. Hidden commands for #11, the `ask` command for #05, and `resume` for #08 are each a one-line entry.

## Blocked by

- #2 (Terminal hero tracer bullet)
