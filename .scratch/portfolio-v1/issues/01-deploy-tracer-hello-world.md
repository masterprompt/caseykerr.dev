# Deploy tracer — hello world via CI/CD

Status: needs-triage
Type: AFK

## What to build

Pure deployment-pipeline tracer. Replace the default Next.js boilerplate with a minimal "Hello, world" page that proves the GitHub Actions → GH Pages → caseykerr.dev path is alive end-to-end. No styling, no terminal, no theme. The purpose is to confirm the deploy pipeline before any feature work lands on top of it.

This is the foundation every other slice depends on.

## Acceptance criteria

- [x] `src/app/page.tsx` reduced to a minimal "Hello, world." with a one-line note (e.g. "caseykerr.dev — coming soon. — Casey") — commit `798626c`
- [x] `npm run build` produces a successful static export to `out/`
- [x] GitHub Actions workflow runs to completion on push to `main`
- [x] `caseykerr.dev` resolves and serves the hello-world content (verified via HTTP — title "Casey Kerr", body matches expected)
- [x] HTTPS works — cert provisioned overnight (2026-05-27 AM); `https://caseykerr.dev` returns 200 and HTTP→HTTPS redirect is active
- [x] CNAME file in `/public` is preserved through the build (confirmed `out/CNAME` contains `caseykerr.dev`)
- [x] No console errors on load
- [x] Build artifact size noted: **1.2 MB**

## Discovery notes

Two things surfaced during deploy verification that weren't anticipated in the original spec:

1. **DNS lived in AWS Route 53, not Squarespace.** Despite the domain being registered through Squarespace (formerly Google Domains), the authoritative nameservers are at AWS Route 53 (`ns-*.awsdns-*`). Records in the Squarespace DNS panel are ignored. The Route 53 hosted zone was set up but contained no apex A/AAAA records — fixed by adding the four GitHub Pages IPs (185.199.108-111.153) plus the four IPv6 equivalents (2606:50c0:8000-8003::153). Saved as a project memory.

2. **GitHub Actions Node.js 20 deprecation.** Workflow runner started emitting a warning about JavaScript actions running on Node 20 ahead of GitHub's 2026-06-02 forced cutover to Node 24. Opted in early via `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"` in the workflow env — commit `d945d1d`, pending push.

## Blocked by

None — can start immediately.
