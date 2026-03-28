# 10. File Structure

```
abacus-game/
├── index.html      ← Entry point (single page)
├── style.css       ← All styles
├── game.js         ← Game logic & state management
├── abacus.js       ← Abacus component (rendering & interaction)
├── audio.js        ← Web Audio API sound manager
└── storage.js      ← Local storage manager
```

> **Note:** When implementing with Claude Code, it is recommended to first create a single-file version with everything embedded in `index.html`, verify it works, and then split into separate files.
