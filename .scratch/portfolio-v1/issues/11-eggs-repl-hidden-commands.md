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

- [x] All five hidden commands implemented (`sudo`, `dance`, `coffee`, `vim`, `rm`)
- [x] None appear in `help` output (`listedCommands()` filters `hidden: true`)
- [x] Tab completion does not suggest any of them (same filter)
- [x] `dance` renders the bitmoji asset inline (uses `/bitmoji-thats-all.png` from public/)
- [x] Custom command-not-found rotates through ≥ 3 messages (5 in the pool)
- [x] Hidden commands have `hidden: true` flag in `commands.ts`
- [x] Manual spot-check: `sudo apt-get install joy` returns the expected snark (args ignored)
- [x] No accessibility regression (image has alt text; delayed lines preserve normal text rendering)

## Implementation notes

- `CommandLine` extended with an `image` kind to support `dance`'s bitmoji.
- `CommandResult` extended with `delayedLines: { delayMs, lines }[]` so `vim` (3s wake-up) and `rm` (12-step ~2s deletion scroll) can stream output without bespoke effect code in the component.
- `commandNotFoundMessage(name)` exported from `commands.ts` keeps the rotating-message pool in the registry file.
- `rm` matches the bare command name; args are ignored, so `rm`, `rm -rf /`, and `rm anyfile.txt` all trigger the joke. Intentional — slightly funnier than requiring exact "-rf /" string match.

## Blocked by

- #3 (Live REPL with full command parity)
