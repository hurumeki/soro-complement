# 12. Technical Notes

- **Touch events:** Use `touchstart` / `touchend`, with `preventDefault()` to prevent scrolling
- **Bead hit detection:** Tap detection areas should cover not only the bead drawing regions but also generous gaps between beads
- **Game loop:** Update timer via `requestAnimationFrame`
- **Responsive design:** Scale abacus size to screen width using `vw` / `vh` units
- **iOS Safari support:** Set `-webkit-tap-highlight-color: transparent` and disable double-tap zoom
