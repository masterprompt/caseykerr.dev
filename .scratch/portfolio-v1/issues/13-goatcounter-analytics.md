# GoatCounter analytics integration

Status: needs-triage
Type: HITL

## What to build

Add GoatCounter (free tier) tracking — privacy-respecting, no cookies, hard ceiling on the free tier so no surprise bills.

**Setup**:
- Sign up at goatcounter.com (free tier, non-commercial)
- Add the GoatCounter tracking script via `next/script` with `strategy="afterInteractive"` in `src/app/layout.tsx`
- Use the JS-disabled fallback `<noscript>` `<img>` beacon too if relevant

**Privacy disclosure**:
- Add an entry to `humans.txt` (#9): "Analytics: GoatCounter — pageviews only, no cookies, no third-party tracking."
- Add a small disclosure line in the Contact section: "This site uses [GoatCounter](https://www.goatcounter.com/) for pageview counts. No cookies. No tracking pixels."

**Verification**: spot-check on the deployed site that no third-party cookies are set.

## HITL notes

Casey creates the GoatCounter account and provides the tracking code identifier (the `data-goatcounter` URL). The agent picking this up should request that value before writing the integration.

## Acceptance criteria

- [ ] GoatCounter account created and tracking code identifier in hand (HITL)
- [ ] Tracking script added via `next/script` in `app/layout.tsx`
- [ ] Privacy disclosure added to `humans.txt`
- [ ] Privacy disclosure added to Contact section
- [ ] Verified: no third-party cookies set on the deployed site (browser devtools → Application → Cookies)
- [ ] Pageview events visible in GoatCounter dashboard after deploy

## Blocked by

- #1 (Deploy tracer — hello world via CI/CD)
