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

### Projects (pending — awaiting Casey's resumatic update)

- [ ] Projects section: featured items rendered from `resume.projects` filtered to `public: true`
- [ ] Each featured item: name, description, link, optional media (YouTube `nocookie` embed or thumbnail)
- [ ] If any media: `loading="lazy"` on embeds
- [ ] Casey decides which projects to surface in resumatic (`public: true` flag) before this can land

### Contact (done)

- [x] Contact section: email, LinkedIn, GitHub
- [x] Layout: 3-card grid with dashed amber borders; hover fills border + faint tint; full-clickable area
- [x] All external links open in new tab per `feedback-external-links-new-tab`
- [x] No resume download — Casey explicitly chose contact-only; a one-line note invites email for the resume
- [x] GoatCounter privacy disclosure deliberately NOT in Contact (it's in humans.txt; no legal requirement since GoatCounter sets no cookies)

## Implementation notes

- Skills section opportunistically reworked during the same session: was a `auto-fit` column grid with ragged heights; now a list of horizontal rows (category label left, amber-tinted pills right). Each row predictable height, fills viewport width. Better scanability for recruiters.
- Contact cards stretch evenly via `repeat(auto-fit, minmax(280px, 1fr))`; stack on viewports under 280px wide × 3 (mobile portrait).

## Blocked by

- #2 (Terminal hero tracer bullet)
- Projects half: Casey's update to resumatic's projects array (add `public: true`, URLs, descriptions, optional media)
