# Project showcase + Contact section

Status: needs-triage
Type: HITL

## What to build

**Projects section** — curated cards covering:

- **Endboss Games** — 4 published titles. Each card: YouTube-nocookie embed of the trailer, a representative screenshot, link out to the app store / itch.io / Steam page
- **Waukesha Makerspace** — photo, short description, link to makerspace site
- **Kerrsoft consulting** — short selected highlights (e.g. DSHA, Sightline) with optional links to case-study MDX pages

YouTube embeds use `https://www.youtube-nocookie.com/embed/<id>` and `loading="lazy"` to avoid bloating first paint.

**Contact section**:

- Email: me@caseykerr.com
- LinkedIn: linkedin.com/in/caseykerr
- GitHub: github.com/masterprompt
- Resume PDF download link (PDF synced from resumatic into `public/casey-kerr-resume.pdf`)

**`resume` command** in the terminal triggers PDF download (or scroll to Contact).

## HITL notes

Casey provides:
- Which 4 Endboss titles to feature, and their YouTube video IDs + store links
- Which Kerrsoft case studies to surface (if any get long-form MDX treatment)
- Resume PDF variant to default to (ai-forward vs traditional-fse vs both, with a chooser)

Resume PDF sync: either extend resumatic's `sync:portfolio` (#4) to also copy the latest built PDF, or add a separate small script. Decide during the slice.

## Acceptance criteria

- [ ] Projects section: ≥ 4 Endboss titles, each with embed + screenshot + external link
- [ ] All embeds use `youtube-nocookie.com` and `loading="lazy"`
- [ ] Makerspace card with photo and link
- [ ] Kerrsoft consulting card or sub-list with selected highlights
- [ ] Contact section: email, LinkedIn, GitHub, resume download
- [ ] Resume PDF in `public/casey-kerr-resume.pdf` (sync mechanism documented)
- [ ] `resume` command in terminal works (download or scroll-to-contact, pick during slice)
- [ ] Lighthouse first paint not regressed by ≥ 10% vs #2 baseline

## Blocked by

- #2 (Terminal hero tracer bullet)
