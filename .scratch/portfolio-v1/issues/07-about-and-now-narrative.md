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

- [x] About section narrative (4 paragraphs: positioning, origins, career arc, off-the-clock) in `src/components/sections/AboutSection.tsx`
- [x] Now section narrative in `src/components/sections/NowSection.tsx` with visible `Last updated:` date
- [x] `/now` route resolves to the Now section content (real standalone page, not a redirect — better for nownownow.com indexing)
- [x] Both sections styled to be readable within the CRT theme (full-viewport-width per the updated `feedback-full-width-content` rule; the scanline overlay only sits on `.terminal::after` so prose isn't striped)
- [ ] Site submitted to nownownow.com directory *(manual follow-up for Casey once the site is fully built and deployed)*
- [x] No invented biographical claims — every fact traced to either Casey's input in conversation or the synced resume data

## Voice / privacy rules surfaced during this slice (saved as memories)

- No em dashes in prose (`feedback-no-em-dashes`)
- No current client names in publicly-indexed content (`feedback-no-client-names-in-portfolio`)
- No unreleased project names — names can be sniped (`feedback-no-unreleased-project-names`)
- All content sections full-viewport-width, including prose (`feedback-full-width-content` updated to remove the prose exception)
- External links open in a new tab (`feedback-external-links-new-tab`)

## Blocked by

- #2 (Terminal hero tracer bullet)
