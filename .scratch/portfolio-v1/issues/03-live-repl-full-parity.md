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

- [ ] Tab completes against listed commands; does not suggest hidden ones
- [ ] ↑/↓ navigates session history
- [ ] `help` prints listed-command registry with one-line descriptions
- [ ] `clear` empties terminal output (history retained for ↑/↓)
- [ ] Auto-demo sequence: `whoami` → `ls projects/` → `help`
- [ ] All six section commands scroll to matching placeholder anchors
- [ ] Mobile: input disabled, "tap to continue" cue scrolls past hero
- [ ] No console errors; keyboard nav passes basic a11y check
- [ ] Verified in Chromium, Safari, and mobile Safari

## Blocked by

- #2 (Terminal hero tracer bullet)
