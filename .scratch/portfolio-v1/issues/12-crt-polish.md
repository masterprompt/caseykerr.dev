# CRT polish — scanlines, motion preferences, performance pass

Status: needs-triage
Type: AFK

## What to build

Visual polish for the CRT aesthetic, plus a performance pass.

**Scanlines** — fixed-position pseudo-element on the terminal hero with a repeating CSS gradient (e.g. `repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0 1px, transparent 1px 3px)`), subtle (2–4% opacity ish).

**Subtle screen flicker** — a CSS animation that varies opacity by ~1–2% on a slow, irregular interval. Disabled entirely when `prefers-reduced-motion: reduce`.

**Text bloom** — `text-shadow: 0 0 4px currentColor` (or similar) on terminal text to suggest CRT phosphor glow. Tunable via a CSS variable.

**Performance pass**:

- All images use `next/image` or are pre-optimized
- Below-the-fold iframes (YouTube embeds from #8) lazy-load via `loading="lazy"` (already required in #8 — verify)
- Lighthouse score audit on a production build
- Bundle size budget noted in PR

## Acceptance criteria

- [x] Scanlines visible but not distracting on the terminal hero (tuned to opacity 0.45 over a `#141414` bg — Casey signed off)
- [x] Subtle flicker animation present; fully disabled when `prefers-reduced-motion: reduce` (covered by the `@media` block; pending OS-toggle spot-check)
- [x] Text-shadow bloom on terminal text (`--terminal-bloom: 0 0 3px currentColor`)
- [ ] Lighthouse Performance ≥ 95 on mobile (Throttled 4G profile) *(pending Casey running DevTools Lighthouse)*
- [ ] Lighthouse Accessibility ≥ 95 *(pending the same Lighthouse run)*
- [x] First-paint page weight ≤ 200KB excluding below-fold media (~92 KB: 21 KB HTML + 11 KB CSS + 60 KB fonts; JS chunks are async/deferred)
- [x] Bundle size delta vs #2: CSS ~+700B for scanline overlay + flicker keyframes + reduced-motion media query; no JS delta

## Implementation notes

- All three knobs are CSS variables so the look can be tuned without touching markup or JS: `--terminal-bg`, `--terminal-bloom`, `--terminal-scanline-opacity`.
- The scanline overlay uses `.terminal::after` with `pointer-events: none`, so it doesn't interfere with input focus or click-to-focus.
- The reduced-motion media query kills three animations: cursor blink, scanline flicker, dance bounce. Scanlines themselves stay (static is fine).
- Bg was bumped from `#0a0a0a` to `#141414`. Slightly less aggressive black gives the scanlines something to contrast against and reads as more authentic phosphor than pure black anyway.

## Blocked by

- #2 (Terminal hero tracer bullet)
