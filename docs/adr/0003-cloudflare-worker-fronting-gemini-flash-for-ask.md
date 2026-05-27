# Cloudflare Worker fronting Gemini Flash for the `ask` command

The `ask` command in the terminal hero proves the "AI builder" positioning by returning real LLM-generated answers grounded in Casey's resume. A small Cloudflare Worker holds the API key server-side, applies IP-based rate limiting, embeds `resume.json` as grounding data in the system prompt, and forwards the request to Google's Gemini 2.0 Flash free tier. We picked this over Anthropic/OpenAI APIs (would cost real money — Casey requires $0/mo with no surprise-bill risk), over Cloudflare Workers AI (free, but Llama 8B answer quality is weaker for this constrained Q&A task), and over a fully static pre-computed Q&A approach (feels canned for off-script questions, undermines the AI-competence claim).

## Consequences

- The Worker is a runtime dependency separate from the GH Pages-hosted site — a second piece of infra to maintain.
- The Worker must enforce rate limits in code (per-IP, per-day) so that a hostile actor cannot exhaust Gemini's free-tier daily quota in minutes. If the quota is exhausted, the `ask` command must degrade to a static "budget exhausted today — reach Casey at me@caseykerr.com" message rather than 500.
- Google could change Gemini's free-tier terms; if they do, the Worker is the single point of swap (to Workers AI, to a different provider, or to a static fallback).
- The Worker is the natural place to host the `humans.txt`, `/.well-known/security.txt`, `/teapot` 418, and `X-Made-By` header easter eggs — keeping easter-egg surfaces in one infrastructure file rather than scattered.
