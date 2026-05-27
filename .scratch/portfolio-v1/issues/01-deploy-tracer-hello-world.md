# Deploy tracer — hello world via CI/CD

Status: needs-triage
Type: AFK

## What to build

Pure deployment-pipeline tracer. Replace the default Next.js boilerplate with a minimal "Hello, world" page that proves the GitHub Actions → GH Pages → caseykerr.dev path is alive end-to-end. No styling, no terminal, no theme. The purpose is to confirm the deploy pipeline before any feature work lands on top of it.

This is the foundation every other slice depends on.

## Acceptance criteria

- [ ] `src/app/page.tsx` reduced to a minimal "Hello, world." with a one-line note (e.g. "caseykerr.dev — coming soon. — Casey")
- [ ] `npm run build` produces a successful static export to `out/`
- [ ] GitHub Actions workflow runs to completion on push to `main`
- [ ] `https://caseykerr.dev` resolves and shows the hello-world content (no 404, no GH Pages default)
- [ ] CNAME file in `/public` is preserved through the build
- [ ] No console errors on load
- [ ] Build artifact size noted in PR description for future regression comparison

## Blocked by

None — can start immediately.
