# 3. Abacus Specification

## 3.1 Bead Configuration (per rod)

Follows the Japanese soroban standard.

- **Upper bead (heaven bead):** 1 bead, value = 5
- **Lower beads (earth beads):** 4 beads, value = 1 each
- Beads are counted when pushed toward the beam (hari)

| Upper Bead State       | Lower Bead State  | Rod Value |
|------------------------|-------------------|-----------|
| Away from beam         | 0 beads pushed    | 0         |
| Away from beam         | 1 bead pushed     | 1         |
| Away from beam         | 2 beads pushed    | 2         |
| Away from beam         | 3 beads pushed    | 3         |
| Away from beam         | 4 beads pushed    | 4         |
| Pushed toward beam     | 0 beads pushed    | 5         |
| Pushed toward beam     | 1 bead pushed     | 6         |
| Pushed toward beam     | 2 beads pushed    | 7         |
| Pushed toward beam     | 3 beads pushed    | 8         |
| Pushed toward beam     | 4 beads pushed    | 9         |

## 3.2 Controls

### Tap Operation (Primary) — "Tap between beads to split" method

Tapping between two beads causes the beads above the gap to move up and the beads below the gap to move down. The result is that the beads are split at the tapped position, and the corresponding value is set on the abacus.

**Lower bead area example (rod value = 0):**

Lower beads: 4 beads below the beam, initially all pushed down.

```
Initial state (value = 0):
  [Beam]
   ○  ← Lower bead 1 (closest to beam)
   ○  ← Lower bead 2
   ○  ← Lower bead 3
   ○  ← Lower bead 4 (bottom)

Tap between 2nd and 3rd bead:
  [Beam]
   ○  ← Lower bead 1 (pushed to beam)
   ○  ← Lower bead 2 (pushed to beam)
   ─  ← Tap here
   ○  ← Lower bead 3 (stays down)
   ○  ← Lower bead 4 (stays down)
Result: value = 2
```

### General Rules

- In the lower bead area, all beads **above** the tapped gap are pushed toward the beam
- All beads **below** the tapped gap are pushed away from the beam
- In the upper bead (heaven bead) area: tap between beam and bead → bead moves to beam (+5); tap above the bead → bead moves away (-5)

### Bead Combination Examples (lower beads only)

| Tap Position                        | Beads Pushed to Beam | Value |
|-------------------------------------|---------------------|-------|
| Above bead 1 (gap with beam)       | 1                   | 1     |
| Between bead 1 and bead 2          | 2                   | 2     |
| Between bead 2 and bead 3          | 3                   | 3     |
| Between bead 3 and bead 4          | 3                   | 3     |
| Below bead 4                        | 4                   | 4     |

### Upper and Lower Bead Combinations (values 5–9)

Push the upper bead toward the beam, then operate the lower bead area to represent values 6–9.

### Flick Operation (Secondary)

- Individual beads can be moved up or down by flicking

### Reset Button

- The "Clear" button in the footer resets all rods to 0

## 3.3 Initial Abacus State

- At game start and after clearing a problem: all rods = 0
