# Narrative content for About + Now sections

Status: needs-triage
Type: HITL

## What to build

Hand-authored prose for the **About** and **Now** **Sections**.

**About**: 2-3 paragraphs framing Casey as "Senior full-stack engineer + AI builder" with the 20-year arc (PLCs → cloud → AI) as supporting proof — not as the lead. Specific, no LinkedIn buzzwords. References real artifacts (Endboss titles, Waukesha Makerspace) where they earn their place.

**Now**: Sivers-convention `/now` content — what Casey is currently working on (Kerrsoft client work described in general terms, makerspace, AI experiments, side projects), with a "Last updated YYYY-MM-DD" stamp. Refreshed manually by Casey when it changes.

**Routing**: `/now` route alias resolves to the Now section (either via a Next.js page that redirects to `/#now` or by rendering the same section content at `/now`). Lets the site be submitted to [nownownow.com](https://nownownow.com).

Both sections need to be readable inside the CRT theme — consider a slightly less aggressive style for prose passages (still monospace + green, but maybe higher contrast, wider line-height, no scanlines on the prose itself).

## HITL notes

Casey writes the prose. An agent picking this up should request the draft text from Casey before writing — do not invent biographical content. Casey may paste prose into a follow-up comment on this issue.

## Acceptance criteria

- [ ] About section narrative (2-3 paragraphs) in `src/components/sections/About.tsx`
- [ ] Now section narrative in `src/components/sections/Now.tsx` with visible `Last updated:` date
- [ ] `/now` route resolves to the Now section content
- [ ] Both sections styled to be readable within the CRT theme (review against #12)
- [ ] Site submitted to nownownow.com directory (or noted as a follow-up in the closing PR)
- [ ] No invented biographical claims (everything traceable to Casey's draft or `resume.json`)

## Blocked by

- #2 (Terminal hero tracer bullet)
