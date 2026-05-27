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

- [x] GoatCounter account created and tracking code identifier in hand — `masterprompt.goatcounter.com`
- [x] Tracking script added via `next/script` in `app/layout.tsx` with `strategy="afterInteractive"`
- [x] Privacy disclosure added to `humans.txt` (THANKS + SITE/Analytics line)
- [ ] Privacy disclosure added to Contact section *(deferred to #08 which builds the Contact section)*
- [x] Verified: no third-party cookies set (GoatCounter's design; confirmed by Casey on the dev server)
- [ ] Pageview events visible in GoatCounter dashboard after deploy *(verified post-push by visiting caseykerr.dev; GoatCounter intentionally skips localhost so dev hits don't pollute stats)*

## Implementation notes

- GoatCounter ships with localhost detection on by default — console logs `not counting because of: localhost` for dev hits. Intentional; keeps dev work out of stats. Real pageviews start flowing on the deployed site.
- Em-dash cleanup of `humans.txt` happened during this slice as well (the original was written before the no-em-dashes rule was established).

## Blocked by

- #1 (Deploy tracer — hello world via CI/CD)
