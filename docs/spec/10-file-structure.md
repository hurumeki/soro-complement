# 10. File Structure

```
soro-complement/
├── index.html                ← Entry point (Vite root)
├── package.json              ← Dependencies & scripts
├── vite.config.js            ← Vite configuration
├── netlify.toml              ← Netlify deploy configuration
├── public/                   ← Static assets (copied as-is)
├── docs/
│   ├── SPECIFICATION.md      ← Specification table of contents
│   └── spec/                 ← Specification sections
├── src/
│   ├── main.js               ← Application entry point & screen router
│   ├── styles/
│   │   └── main.css          ← All styles
│   ├── screens/
│   │   ├── title.js          ← Title / difficulty selection screen
│   │   ├── game.js           ← Game screen (header, abacus, footer)
│   │   └── result.js         ← Result / high score screen
│   └── game/
│       ├── state.js          ← Game state management
│       ├── abacus.js         ← Abacus component (rendering & interaction)
│       ├── problem.js        ← Problem generation & addition logic
│       ├── audio.js          ← Web Audio API sound manager
│       └── storage.js        ← Local storage manager
└── CLAUDE.md                 ← AI assistant instructions
```

## Build & Development

- **Dev server:** `npm run dev` (Vite dev server with HMR)
- **Build:** `npm run build` (outputs to `dist/`)
- **Preview:** `npm run preview` (serve built files locally)
