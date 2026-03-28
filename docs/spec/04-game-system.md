# 4. Game System

## 4.1 Problem Generation

- Number of digits is determined at game start (difficulty selection or automatic)
- Each digit is a random value from 1–9 (leading digit is always ≥ 1)
- An initial batch of problems is generated and queued; more are added as needed

## 4.2 Addition Logic

### Addition Timing

Digits are evaluated **one at a time**, from the least significant to the most significant.

**When the 1st digit (least significant) sums to 10 with the problem digit:**
- Only that digit is added
- The problem's 1st digit carries over (+1 to the 2nd digit)
- The abacus 1st digit is **locked (no further operation)**
- A carry-over animation is displayed

**When the 2nd digit also sums to 10 (with 1st digit already locked):**
- The 2nd digit is added
- The problem's 2nd digit carries over
- The abacus 2nd digit is also locked
- With digits 1 and 2 locked, the player can only operate the 3rd digit

**When the most significant digit (3rd) also sums to 10 (all lower digits locked):**
- All digits are cleared together
- Problem clear animation fires
- Abacus resets to 0 on all rods (locks released), next problem begins

### Concrete Example (3 digits, problem: 123)

```
State A: Abacus = 007
  → Digit 1: 3 + 7 = 10 → carry
  → Problem updates to: 130
  → Abacus digit 1: locked (stays at 7), digits 2 & 3 operable

State B: Abacus = 077 (digit 1 locked)
  → Digit 2: 3 + 7 = 10 → carry
  → Problem updates to: 200
  → Abacus digit 2: also locked (stays at 7), only digit 3 operable

State C: Abacus = 877 (only digit 3 operable)
  → Digit 3: 2 + 8 = 10 → all digits cleared!
  → Problem: 1000 (clear animation)
  → Abacus: reset all to 0, unlock, next problem
```

### Out-of-Order Operation Penalty

- Operating a higher digit before completing a lower digit does **not trigger addition** (beads can move but the problem number is not affected)
- Example: Setting the 2nd digit to 8 before completing the 1st digit has no effect on the problem

## 4.3 Score System

### Base Score

| Clear Method              | Score                              |
|---------------------------|------------------------------------|
| Sequential (1 digit at a time) | digits × 10 points            |
| 2-digit simultaneous clear | 2 × 15 points (+50% bonus)       |
| 3-digit simultaneous clear | 3 × 20 points (+100% bonus)      |
| N-digit simultaneous clear | N × (10 + N×5) points             |

**Simultaneous clear definition:** At the moment the most significant digit is added, all lower digits are also confirmed within the same frame (not sequentially from the least significant digit).

### Bonuses

- **Speed bonus:** The faster a problem is cleared from display, the more points are awarded (up to +50%)
- **Consecutive clear bonus:** Multiplier increases with each consecutive clear (up to ×3)

### Penalties

- Attempting to operate a locked digit: visual/haptic feedback only (vibration, red flash), no score change

## 4.4 Difficulty Levels

| Difficulty   | Digits | Problem Characteristics | Notes |
|-------------|--------|------------------------|-------|
| Practice    | 2      | Each digit 1–5         | Real-time per-digit hint display (see below) |
| Easy        | 2      | Each digit 1–9         | —     |
| Normal      | 3      | Each digit 1–9         | —     |
| Hard        | 4      | Each digit 1–9         | —     |
| Challenge   | 5      | Each digit 1–9         | —     |

### Practice Mode — Special Display

A real-time indicator is shown above each rod (below the problem digit), showing the relationship between the current abacus value and the required complement.

| Abacus Value vs Required Complement | Display |
|--------------------------------------|---------|
| Too low (need more)                  | Blue down arrow ▼ or "More" |
| Exactly right                        | Green check ✓ |
| Too high                             | Red up arrow ▲ or "Less" |

**Purpose:** Helps the player visually understand that even if the 2nd digit is correct, addition won't occur if the 1st digit is not yet complete. If the 2nd digit shows ✓ but the 1st digit still shows ▼, addition will not trigger.
