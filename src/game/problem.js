/**
 * Problem generation & addition logic
 * @see docs/spec/04-game-system.md
 */

/**
 * Generate a single problem (array of digits, most-significant first).
 * @param {number} numDigits
 * @param {boolean} isPractice - If true, digits are 1-5
 * @returns {number[]}
 */
export function generateProblem(numDigits, isPractice) {
  const max = isPractice ? 5 : 9
  return Array.from({ length: numDigits }, () =>
    Math.floor(Math.random() * max) + 1
  )
}

/**
 * Generate a queue of problems.
 * @param {number} numDigits
 * @param {boolean} isPractice
 * @param {number} count
 * @returns {number[][]}
 */
export function generateQueue(numDigits, isPractice, count = 5) {
  return Array.from({ length: count }, () => generateProblem(numDigits, isPractice))
}

/**
 * Compute the complement digit needed: (10 - problemDigit) % 10
 * For problemDigit 1-9, this yields 9-1.
 * @param {number} problemDigit
 * @returns {number}
 */
export function complementOf(problemDigit) {
  return (10 - problemDigit) % 10
}

/**
 * Evaluate the addition logic: check from least-significant to most-significant digit.
 *
 * Rules:
 * - Only the lowest unlocked digit is evaluated at a time.
 * - If abacusDigit + problemDigit === 10 for that digit, it carries and locks.
 * - Carry propagates: +1 to the next (more significant) problem digit.
 * - If all digits lock in one call, it's a full clear.
 *
 * "Simultaneous clear" means multiple digits complete in the same evaluation frame.
 *
 * @param {number[]} problem - Current problem digits [most-sig, ..., least-sig]
 * @param {number[]} abacusValues - Current abacus rod values [most-sig, ..., least-sig]
 * @param {boolean[]} lockedDigits - Lock state per digit [most-sig, ..., least-sig]
 * @returns {{ newProblem: number[], newLocked: boolean[], carries: number[], cleared: boolean, simultaneousCount: number }}
 */
export function evaluateAddition(problem, abacusValues, lockedDigits) {
  const newProblem = [...problem]
  const newLocked = [...lockedDigits]
  const carries = [] // indices that carried
  let simultaneousCount = 0

  // Evaluate from least significant (end of array) to most significant (start)
  for (let i = newProblem.length - 1; i >= 0; i--) {
    if (newLocked[i]) continue // already locked

    if (abacusValues[i] + newProblem[i] === 10) {
      // This digit completes
      newLocked[i] = true
      carries.push(i)
      simultaneousCount++

      // Carry: +1 to the next more significant digit
      if (i > 0) {
        newProblem[i - 1] += 1
      }
    } else {
      // Out-of-order rule: can't skip a lower unlocked digit
      break
    }
  }

  const cleared = newLocked.every(Boolean)

  return { newProblem, newLocked, carries, cleared, simultaneousCount }
}

/**
 * Calculate score for a problem clear.
 * @param {number} numDigits - Total digits in the problem
 * @param {number} simultaneousCount - How many digits cleared simultaneously
 * @param {number} elapsedMs - Time since problem was displayed
 * @param {number} combo - Current consecutive clear count (before this clear)
 * @returns {number}
 */
export function calculateScore(numDigits, simultaneousCount, elapsedMs, combo) {
  let base
  if (simultaneousCount <= 1) {
    // Sequential clear: digits × 10
    base = numDigits * 10
  } else {
    // Simultaneous clear: N × (10 + N×5)
    base = simultaneousCount * (10 + simultaneousCount * 5)
  }

  // Speed bonus: up to +50%, linear decay over 10 seconds
  const speedFactor = Math.max(0, 1 - elapsedMs / 10000)
  const speedBonus = base * 0.5 * speedFactor

  // Combo multiplier: up to ×3
  const comboMultiplier = Math.min(combo + 1, 3)

  return Math.round((base + speedBonus) * comboMultiplier)
}
