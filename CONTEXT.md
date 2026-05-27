# caseykerr.dev

Personal portfolio site for Casey Kerr, designed to land with both 30-second-scan recruiters and view-source engineers from the same page. The visual identity is a polished CRT/terminal aesthetic and the AI competence claim is demonstrated by the site itself, not just stated.

## Language

### Site structure

**Hero**:
The first viewport. In this project, the hero is always the **Terminal hero** — no other hero type exists.
_Avoid_: "banner", "splash"

**Section**:
An anchored content area below the hero. The site is single-page; sections are reached by anchor scroll, including from **Command** input. The six sections are About, Now, Work, Projects, Skills, Contact.
_Avoid_: "page" (the site only has one page; sections are not pages)

**Now**:
The section describing what Casey is currently working on. Also doubles as the `/now` page per the [nownownow.com](https://nownownow.com) convention.
_Avoid_: "current", "today"

### Terminal

**Terminal hero**:
The interactive CLI element at the top of the site. Encompasses both the auto-demo and the live REPL phases.
_Avoid_: "terminal widget", "console"

**Auto-demo**:
The typewriter sequence that runs automatically on page load before any user input is accepted. Delivers headline content to non-typing visitors (recruiters, mobile).
_Avoid_: "intro animation", "boot sequence"

**Live REPL**:
The state of the terminal hero after the auto-demo finishes, in which the visitor can type real commands. Desktop-only — mobile stops at auto-demo.
_Avoid_: "interactive mode", "prompt"

**Command**:
A parseable instruction the visitor types into the live REPL (e.g. `whoami`, `projects`, `ask`, `resume`). Commands have a registry; `help` lists the listed ones.
_Avoid_: "input", "query"

**Hidden command**:
A command that works but is intentionally not listed by `help`. Hidden commands are the primary surface for terminal-based easter eggs (`sudo`, `vim`, `dance`, etc.).
_Avoid_: "secret command", "undocumented"

### AI feature

**Ask command**:
The `ask "<question>"` command in the live REPL. Sends the question to the **Worker**, which returns a generated answer about Casey grounded in his resume.
_Avoid_: "chat", "chatbot"

**Worker**:
The Cloudflare Worker that fronts Google Gemini Flash on behalf of the ask command. Keeps the API key server-side, applies rate limiting, and stuffs the grounding data into the system prompt.
_Avoid_: "API", "backend"

**Grounding data**:
The sanitized resume JSON embedded in the Worker's system prompt to anchor LLM answers in real facts. Sourced from `content/resume.json`.
_Avoid_: "context" (overloaded with this file), "training data" (it's not — it's runtime context)

### Content pipeline

**Resumatic**:
Casey's sibling project at `~/Projects/Personal/resumatic/` (private repo: `github.com/masterprompt/resumatic`). The single source of truth for resume content. The portfolio is a downstream consumer.
_Avoid_: "the resume repo"

**Sync script**:
`npm run sync:portfolio` in resumatic. Reads `content/resume.yaml`, strips PII (phone, address), writes the result to `caseykerr.dev/content/resume.json`. Run by Casey manually; the JSON is committed.
_Avoid_: "build", "export"

**resume.json**:
The sanitized resume data committed at `content/resume.json` in this repo. Feeds the Skills section at build time and the Worker's grounding data at request time.
_Avoid_: "data file", "content"

### Easter eggs

**Egg**:
A hidden delight discoverable by curious visitors. Lives in HTML source (comments, meta), the console (load-time logs, callable globals), the network layer (custom headers, `/.well-known/`, 418 responses), or the live REPL (hidden commands).
_Avoid_: "easter egg" (long form acceptable in prose, but `egg` in code/PRs)

### Audience

**Recruiter**:
Non-engineer visitor: time-poor, keyword-scanning, frequently on mobile, will not type. Design decisions that mention them prioritize: scannable HTML below the hero, auto-demo content delivery, downloadable PDF, recognizable role/skill keywords.
_Avoid_: "non-technical visitor" (some recruiters are technical), "hiring manager" (distinct role with different patterns)

**Engineer-reader**:
Visitor who will view-source, read carefully, expect platform fluency, and is rewarded by **Eggs**. Design decisions that mention them prioritize: tech-clever details, clean HTML, REPL polish, refusal to do user-hostile tracking.
_Avoid_: "developer visitor", "technical user"

## Relationships

- The **Terminal hero** contains an **Auto-demo** phase followed (on desktop) by a **Live REPL** phase
- The **Live REPL** accepts **Commands**, including **Hidden commands**
- The **Ask command** is a **Command** that calls the **Worker**
- The **Worker** uses **Grounding data** sourced from **resume.json**
- **resume.json** is produced by the **Sync script** in **Resumatic** and committed to this repo
- **Commands** like `projects`, `work`, `contact` smooth-scroll to the matching **Section**
- **Eggs** are scattered across HTML, console, network, and the **Live REPL** (as **Hidden commands**)
- Both **Recruiter** and **Engineer-reader** see the same site; the design serves both through layered affordances

## Example dialogue

> **Casey:** "Should the `whoami` output mention the makerspace?"
> **Future-Casey:** "It's in the **Auto-demo** — the recruiter sees it for 2 seconds. Keep it punchy. Save the deeper makerspace story for the Now **Section** below."

> **Casey:** "What happens when the Worker's daily Gemini quota is blown?"
> **Future-Casey:** "The **Ask command** should fall back to a static 'budget exhausted today — email me' message. The rest of the **Live REPL** still works."

## Flagged ambiguities

- "Context" was almost used for both this file and the **Worker**'s grounding data — resolved by renaming the latter to **Grounding data**.
- "Page" was used loosely to mean Section — resolved: this is a single-page site; only "Section" is correct.
