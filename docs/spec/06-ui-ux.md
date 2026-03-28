# 6. UI / UX Specification

## 6.1 Design Direction

- **Theme:** Japanese-modern. A fusion of wood-grain abacus frame + contemporary flat UI
- **Color Palette:**
  - Background: Deep indigo (#1a2744) or dark green (#1a3320)
  - Abacus frame: Warm brown with wood-grain texture
  - Beads: Ivory to cream (#f5e6c8), glowing gold when selected
  - Beam: Dark brown (#4a2c0a)
  - Problem digits: White to light gold, large and crisp
  - Locked digits: Grayed out

- **Font:** Bold, highly legible Japanese-compatible font for problem digits (e.g., Noto Sans JP Bold or Zen Kaku Gothic)

## 6.2 Abacus Visual Representation

- Each bead is a rounded ellipse (resembling a real soroban bead silhouette)
- Beads have gloss gradients for a 3D effect
- Frame uses wood-grain texture (CSS or SVG)
- Rods are thin vertical lines with beads sliding smoothly

## 6.3 Animations & Effects

| Event                | Effect |
|----------------------|--------|
| Bead movement        | Physics-like slide animation (ease-out, 30–60ms) |
| Digit carry-over     | Problem digit bounces up with a flash of light |
| Digit lock           | Digit becomes semi-transparent + gray, lock icon appears |
| Clear                | Radial particle explosion, "✓" mark, sound effect (Web Audio API) |
| Simultaneous clear bonus | More intense particles + "COMBO!" text |
| Time-up              | Screen freeze → fade out |
| 10 seconds remaining | Timer flashes red |
| High score update    | Sparkle animation |

## 6.4 Haptic Feedback

- Bead movement: `navigator.vibrate(10)` (light vibration)
- Clear: `navigator.vibrate([20, 30, 50])` (pattern vibration)
- Operation blocked: `navigator.vibrate(100)` (longer vibration)
