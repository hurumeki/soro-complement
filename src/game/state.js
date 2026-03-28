/**
 * Game state management
 * @see docs/spec/09-state-management.md
 */

export function createInitialState(difficulty) {
  return {
    phase: 'title',     // 'title' | 'countdown' | 'playing' | 'result'
    difficulty,
    timeLeft: 60000,
    problem: [],
    problemQueue: [],
    abacusValues: [],
    lockedDigits: [],
    score: 0,
    combo: 0,
    lastClearTime: 0,
  }
}
