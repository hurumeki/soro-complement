# 9. State Management

```
GameState {
  phase: 'title' | 'countdown' | 'playing' | 'result'
  difficulty: 'practice' | 'easy' | 'normal' | 'hard' | 'challenge'

  // Timer
  timeLeft: Number       // Remaining milliseconds

  // Problem
  problem: Number[]      // Digits ([most significant, ..., least significant])
  problemQueue: Number[][] // Next problem queue

  // Abacus
  abacusValues: Number[] // Current value per rod ([most significant, ..., least significant])
  lockedDigits: Boolean[] // Lock state per digit

  // Score
  score: Number
  combo: Number
  lastClearTime: Number  // Timestamp of last clear
}
```
