# Easter eggs — REPL hidden commands

Status: needs-triage
Type: AFK

## What to build

**Hidden commands** in the **Live REPL** — work but are not surfaced by `help` and are not suggested by tab completion. The playful seasoning on top of the tech-clever spine.

| Command | Behavior |
|---------|----------|
| `sudo <anything>` | Prints: `Nice try. Permission denied for delusions of grandeur.` |
| `dance` | Renders `public/bitmoji-thats-all.png` inline in terminal output, with a small CSS bounce animation. Caption: "that's all, folks." |
| `coffee` | Prints an ASCII coffee mug + a quip (rotate from a small pool, e.g. "Black, no sugar. Like my terminal.") |
| `vim` | Prints: `You'll be stuck here forever. Press :q to leave (just kidding — you can't).` Then "exits" after 3 seconds with `<Press any key to wake up>` |
| `rm -rf /` | Rapid faux file-deletion log scroll for ~2s (`rm: removing '/etc/...'` ×N), then: `just kidding — your filesystem is fine.` |

**Custom command-not-found** — rotates through ≥3 messages, e.g.:
- `I don't speak <command>. Try \`help\`.`
- `<command>: command not found. (try \`help\`, or just vibes.)`
- `Hmm, never heard of \`<command>\`. \`help\` lists what I know.`

All hidden commands documented in `src/components/terminal/commands.ts` with a `hidden: true` flag so the registry remains the single source of truth (per [ADR-0004](../../../docs/adr/0004-roll-our-own-terminal-css-first-animation.md)).

## Acceptance criteria

- [ ] All five hidden commands implemented
- [ ] None appear in `help` output
- [ ] Tab completion does not suggest any of them
- [ ] `dance` renders the bitmoji asset inline (verify `public/bitmoji-thats-all.png` ships)
- [ ] Custom command-not-found rotates through ≥ 3 messages
- [ ] Hidden commands have `hidden: true` flag in `commands.ts`
- [ ] Manual spot-check: `sudo apt-get install joy` returns the expected snark
- [ ] No accessibility regression (commands still work via screen reader for completeness)

## Blocked by

- #3 (Live REPL with full command parity)
