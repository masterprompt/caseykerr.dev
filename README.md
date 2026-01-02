# caseykerr.dev

> **Complexity embedded in simplicity.**

My personal site. Built with mass instead of velocity because $E=mc^2$ hits different.

## Stack

```
┌─────────────────────────────────────┐
│  Next.js 16 + TypeScript            │
│  ├── App Router (because /pages     │
│  │   was so 2022)                   │
│  ├── Static Export (SSG go brrr)    │
│  └── Tailwind CSS v4                │
├─────────────────────────────────────┤
│  GitHub Pages                       │
│  └── Actions workflow               │
│      └── Push to main = deploy      │
└─────────────────────────────────────┘
```

## Development

```bash
npm install    # Summon the node_modules void
npm run dev    # localhost:3000
npm run build  # Compile to static artifacts
npm run lint   # Appease the linter gods
```

## Architecture Decision Records

**Q: Why static export instead of server components?**

A: Because I don't need a server to tell you I'm good at building servers.

**Q: Why not just use plain HTML?**

A: I considered it. Then I remembered I actually enjoy TypeScript and component-based architecture. Fight me.

**Q: Why ship now instead of waiting until it's perfect?**

A: Don't let perfection become the enemy of progress.

## License

MIT — Take what you need, build something cool.

---

*Currently mass-producing mass at mass scale.*
