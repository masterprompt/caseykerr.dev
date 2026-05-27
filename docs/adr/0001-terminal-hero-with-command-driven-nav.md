# Terminal hero with command-driven navigation

The site's hero is an interactive CRT-style terminal: it auto-runs a typed demo on load (so non-typing visitors still get headline content), then becomes a live REPL on desktop that accepts commands which smooth-scroll to anchored content sections below. We chose this over a decorative-only terminal (underuses the conceit) and over a terminal-everywhere site (hostile to recruiters, sharing, and accessibility) because it resolves the recruiter-vs-engineer audience tension in one device: recruiters get content delivered to them; engineers get a thing to poke at and a natural surface for easter eggs.

## Consequences

- Mobile must degrade gracefully: auto-demo plays, but no live REPL (touch keyboards make CLI input unpleasant).
- All section content must also exist as plain HTML below the hero, addressable by anchor, so terminal navigation has somewhere to scroll *to* and so visitors who skip the terminal still see everything.
