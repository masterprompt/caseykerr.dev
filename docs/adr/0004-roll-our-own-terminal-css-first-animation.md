# Roll-our-own terminal, CSS-first animations

The terminal hero is implemented as a small custom React component (~200 LOC) with its own command registry, history (↑/↓), tab completion, and parser. Animations (typewriter, cursor blink, scanlines, smooth scroll) are CSS where possible; we'll only reach for a JS animation library if a specific scene demands spring physics. We chose this over xterm.js (a full PTY emulator at ~250KB — overkill for a fake CLI) and over react-console-emulator (unmaintained), because owning the terminal lets easter eggs live anywhere we want: `sudo` returns a custom message, `curl-style` ANSI rendering toggles, tab completion exposes hidden commands selectively, etc. The bundle is small and there are no third-party-lib breaking-change risks for a site updated infrequently.

## Consequences

- We own ~200 LOC that a library would have given us — a feature, not a bug, given how rarely a portfolio is touched and how thoroughly the easter-egg surface depends on parser internals.
- The terminal component's command registry becomes the canonical place to find every command — listed and hidden. Easter-egg additions are one-line entries.
