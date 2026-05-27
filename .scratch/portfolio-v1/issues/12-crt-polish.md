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

- [ ] Scanlines visible but not distracting on the terminal hero
- [ ] Subtle flicker animation present; fully disabled when `prefers-reduced-motion: reduce` (verified by toggling OS setting)
- [ ] Text-shadow bloom on terminal text
- [ ] Lighthouse Performance ≥ 95 on mobile (Throttled 4G profile)
- [ ] Lighthouse Accessibility ≥ 95
- [ ] First-paint page weight ≤ 200KB excluding below-fold media
- [ ] Bundle size delta vs #2 noted in PR description

## Blocked by

- #2 (Terminal hero tracer bullet)
