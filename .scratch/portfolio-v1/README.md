# portfolio-v1

First-pass build of caseykerr.dev. Vertical slices in `issues/`.

## Index

| # | Title | Type | Blocked by |
|---|---|---|---|
| [01](issues/01-deploy-tracer-hello-world.md) | Deploy tracer — hello world via CI/CD | AFK | — |
| [02](issues/02-terminal-hero-tracer.md) | Terminal hero tracer bullet | AFK | #01 |
| [03](issues/03-live-repl-full-parity.md) | Live REPL with full command parity | AFK | #02 |
| [04](issues/04-resumatic-sync-and-skills-section.md) | Content pipeline: resumatic sync + Skills | AFK | #01 |
| [05](issues/05-worker-and-ask-command.md) | Worker + `ask` command (no grounding) | HITL | #01 |
| [06](issues/06-ground-ask-in-resume.md) | Ground `ask` in resume.json | AFK | #04, #05 |
| [07](issues/07-about-and-now-narrative.md) | Narrative: About + Now | HITL | #02 |
| [08](issues/08-projects-and-contact.md) | Projects + Contact | HITL | #02 |
| [09](issues/09-eggs-static-surface.md) | Eggs — static surface | AFK | #01 |
| [10](issues/10-eggs-network-surface.md) | Eggs — network / Worker surface | AFK | #05 |
| [11](issues/11-eggs-repl-hidden-commands.md) | Eggs — REPL hidden commands | AFK | #03 |
| [12](issues/12-crt-polish.md) | CRT polish + perf pass | AFK | #02 |
| [13](issues/13-goatcounter-analytics.md) | GoatCounter analytics | HITL | #01 |

## Parallel paths

Once #01 lands, three paths run mostly independently:

- **UI path:** #02 → #03 → #11 (+ #07, #08, #12 hanging off #02)
- **Data path:** #04 → #06
- **Backend path:** #05 → #06, #10

## Anchors

- Design intent: [`CONTEXT.md`](../../CONTEXT.md)
- Architectural decisions: [`docs/adr/`](../../docs/adr/)
- Triage label vocabulary: [`docs/agents/triage-labels.md`](../../docs/agents/triage-labels.md)
