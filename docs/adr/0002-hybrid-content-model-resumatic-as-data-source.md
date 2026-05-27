# Hybrid content model: narrative in-site, structured data synced from resumatic

The portfolio's narrative content (About prose, Now updates, Work highlights, Project descriptions) is authored directly in this repo as MDX/TS. Structured data (skills list, full career history used as Ask grounding) is consumed from a sanitized `content/resume.json` produced by a sync script in the sibling [resumatic](https://github.com/masterprompt/resumatic) repo and committed here. Resumatic is private; rather than build-time pulling with a PAT (auth-surface + rotation chore) or routing through a public companion repo (extra moving part), the JSON is committed to this repo and reviewable in PR diffs.

## Consequences

- Single source of truth for *structured* facts (skills, job titles, dates) — editing resumatic and re-syncing automatically updates the Skills section and the Ask command's answers.
- Narrative content does not auto-update when resumatic changes — adding a new job in resumatic does not auto-feature it on the site. Casey decides when/if to add narrative around new data.
- Resumatic must implement `npm run sync:portfolio` — strips `meta.phone`, `meta.location-detail` etc., writes to `../caseykerr.dev/content/resume.json` (or a configurable target path).
