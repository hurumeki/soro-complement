import { createAbacus } from '../game/abacus.js'
import { generateProblem, generateQueue, evaluateAddition, calculateScore, complementOf } from '../game/problem.js'
import { playBeadClick, playCarry, playClear, playComboClear, playTimeUp, playBlocked } from '../game/audio.js'
import { getSettings } from '../game/storage.js'

const DIGIT_COUNT = {
  practice: 2,
  easy: 2,
  normal: 3,
  hard: 4,
  challenge: 5,
}

const GAME_DURATION = 60000 // 60 seconds
const TEST_DURATION = 3000 // 3 seconds for E2E tests

function isTestMode() {
  return window.__testMode === true ||
    new URLSearchParams(window.location.search).get('testMode') === '1'
}

function getGameDuration() {
  return isTestMode() ? TEST_DURATION : GAME_DURATION
}

export function renderGame(container, { navigate, difficulty }) {
  const numDigits = DIGIT_COUNT[difficulty] || 3
  const isPractice = difficulty === 'practice'
  const settings = getSettings()

  // --- State ---
  let problem = generateProblem(numDigits, isPractice)
  let problemQueue = generateQueue(numDigits, isPractice, 5)
  let lockedDigits = new Array(numDigits).fill(false)
  let score = 0
  let combo = 0
  let problemStartTime = 0
  const gameDuration = getGameDuration()
  let timeLeft = gameDuration
  let phase = 'countdown' // 'countdown' | 'playing' | 'finished'
  let rafId = null

  // --- DOM ---
  const screen = document.createElement('div')
  screen.className = 'screen game-screen'

  screen.innerHTML = `
    <div class="game-header">
      <div class="timer-bar">
        <div class="timer-bar-fill" style="width: 100%"></div>
      </div>
      <span class="timer-text">${gameDuration >= 60000 ? '1:00' : '0:0' + Math.ceil(gameDuration / 1000)}</span>
      <span class="score-display">0 点</span>
    </div>

    <div class="problem-area">
      <div class="problem-digits"></div>
      ${isPractice ? '<div class="practice-hints"></div>' : ''}
    </div>

    <div class="abacus-area"></div>

    <div class="game-footer">
      <span class="current-value">現在: ${'0'.repeat(numDigits)}</span>
      <button class="clear-btn">クリア</button>
    </div>

    <div class="countdown-overlay" id="countdown-overlay">
      <span class="countdown-number">3</span>
    </div>
  `

  container.appendChild(screen)

  const timerBarFill = screen.querySelector('.timer-bar-fill')
  const timerText = screen.querySelector('.timer-text')
  const scoreDisplay = screen.querySelector('.score-display')
  const problemDigitsEl = screen.querySelector('.problem-digits')
  const practiceHintsEl = screen.querySelector('.practice-hints')
  const valueDisplay = screen.querySelector('.current-value')
  const countdownOverlay = screen.querySelector('#countdown-overlay')
  const countdownNumber = screen.querySelector('.countdown-number')

  // --- Abacus ---
  const abacus = createAbacus(numDigits, onAbacusChange)
  screen.querySelector('.abacus-area').appendChild(abacus.element)

  // --- Clear button ---
  screen.querySelector('.clear-btn').addEventListener('click', () => {
    if (phase !== 'playing') return
    abacus.reset()
  })

  // --- Render helpers ---
  function renderProblem() {
    problemDigitsEl.innerHTML = problem
      .map((d, i) => `<span class="problem-digit${lockedDigits[i] ? ' locked' : ''}">${d}</span>`)
      .join('')
  }

  function renderPracticeHints() {
    if (!practiceHintsEl) return
    const rodValues = abacus.getRodValues()
    practiceHintsEl.innerHTML = problem
      .map((d, i) => {
        if (lockedDigits[i]) return '<span class="hint hint-ok">✓</span>'
        const needed = complementOf(d)
        const current = rodValues[i]
        if (current === needed) return '<span class="hint hint-ok">✓</span>'
        if (current < needed) return '<span class="hint hint-low">▼</span>'
        return '<span class="hint hint-high">▲</span>'
      })
      .join('')
  }

  function updateTimer() {
    const seconds = Math.max(0, Math.ceil(timeLeft / 1000))
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    timerText.textContent = `${min}:${String(sec).padStart(2, '0')}`

    const pct = Math.max(0, (timeLeft / gameDuration) * 100)
    timerBarFill.style.width = pct + '%'

    if (timeLeft <= 10000) {
      timerBarFill.classList.add('warning')
    } else {
      timerBarFill.classList.remove('warning')
    }
  }

  function updateScore() {
    scoreDisplay.textContent = score + ' 点'
  }

  function updateValueDisplay() {
    valueDisplay.textContent = '現在: ' + String(abacus.getValue()).padStart(numDigits, '0')
  }

  // --- Addition logic on abacus change ---
  function onAbacusChange() {
    if (phase !== 'playing') return

    playBeadClick()
    if (settings.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(10)
    }

    updateValueDisplay()
    renderPracticeHints()

    const rodValues = abacus.getRodValues()
    const result = evaluateAddition(problem, rodValues, lockedDigits)

    if (result.carries.length > 0) {
      // Digits carried
      problem = result.newProblem
      lockedDigits = result.newLocked

      result.carries.forEach(i => abacus.lockRod(i))

      if (result.cleared) {
        // Full clear!
        const elapsed = Date.now() - problemStartTime
        const points = calculateScore(numDigits, result.simultaneousCount, elapsed, combo)
        score += points
        combo++

        if (result.simultaneousCount > 1) {
          playComboClear()
          showClearEffect(true)
        } else {
          playClear()
          showClearEffect(false)
        }

        if (settings.vibrationEnabled && navigator.vibrate) {
          navigator.vibrate([20, 30, 50])
        }

        updateScore()

        // Next problem after short delay
        setTimeout(() => {
          if (phase !== 'playing') return
          loadNextProblem()
        }, 400)
      } else {
        // Partial carry
        playCarry()
        renderProblem()
        renderPracticeHints()
      }
    }
  }

  function loadNextProblem() {
    if (problemQueue.length < 3) {
      problemQueue.push(...generateQueue(numDigits, isPractice, 5))
    }
    problem = problemQueue.shift()
    lockedDigits = new Array(numDigits).fill(false)
    abacus.reset()
    problemStartTime = Date.now()
    renderProblem()
    renderPracticeHints()
    updateValueDisplay()
  }

  function showClearEffect(isCombo) {
    const effect = document.createElement('div')
    effect.className = 'clear-effect'
    effect.innerHTML = isCombo
      ? '<span class="clear-text combo-text">COMBO!</span>'
      : '<span class="clear-text">✓</span>'
    screen.appendChild(effect)
    setTimeout(() => effect.remove(), 800)
  }

  // --- Countdown ---
  function startCountdown() {
    const countdownInterval = isTestMode() ? 200 : 1000

    let count = 3
    countdownNumber.textContent = count

    const interval = setInterval(() => {
      count--
      if (count > 0) {
        countdownNumber.textContent = count
        // Re-trigger animation
        countdownNumber.style.animation = 'none'
        countdownNumber.offsetHeight // force reflow
        countdownNumber.style.animation = ''
      } else {
        clearInterval(interval)
        countdownOverlay.remove()
        startGame()
      }
    }, countdownInterval)
  }

  // --- Game loop ---
  function startGame() {
    phase = 'playing'
    problemStartTime = Date.now()
    const startTime = Date.now()

    renderProblem()
    renderPracticeHints()
    updateTimer()
    updateScore()
    updateValueDisplay()

    function tick() {
      if (phase !== 'playing') return

      const elapsed = Date.now() - startTime
      timeLeft = Math.max(0, gameDuration - elapsed)
      updateTimer()

      if (timeLeft <= 0) {
        endGame()
        return
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
  }

  function endGame() {
    phase = 'finished'
    if (rafId) cancelAnimationFrame(rafId)

    playTimeUp()
    if (settings.vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(100)
    }

    // Freeze screen briefly then navigate to result
    screen.classList.add('game-over')

    setTimeout(() => {
      navigate('result', { score, difficulty })
    }, 1500)
  }

  // --- Cleanup on navigation away ---
  function cleanup() {
    if (rafId) cancelAnimationFrame(rafId)
    phase = 'finished'
  }

  // Store cleanup reference
  screen._cleanup = cleanup

  // Start!
  startCountdown()
}
