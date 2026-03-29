import { createAbacus } from '../game/abacus.js'

const DIGIT_COUNT = {
  practice: 2,
  easy: 2,
  normal: 3,
  hard: 4,
  challenge: 5,
}

export function renderGame(container, { navigate, difficulty }) {
  const numDigits = DIGIT_COUNT[difficulty] || 3
  const screen = document.createElement('div')
  screen.className = 'screen game-screen'

  // Generate a mock problem
  const problemDigits = Array.from({ length: numDigits }, () =>
    Math.floor(Math.random() * 9) + 1
  )

  screen.innerHTML = `
    <!-- Header: timer + score -->
    <div class="game-header">
      <div class="timer-bar">
        <div class="timer-bar-fill" style="width: 70%"></div>
      </div>
      <span class="timer-text">0:42</span>
      <span class="score-display">120 点</span>
    </div>

    <!-- Problem display -->
    <div class="problem-area">
      <div class="problem-digits">
        ${problemDigits.map((d, i) =>
          `<span class="problem-digit${i === 0 ? ' locked' : ''}">${d}</span>`
        ).join('')}
      </div>
    </div>

    <!-- Abacus -->
    <div class="abacus-area"></div>

    <!-- Footer: current value + clear button -->
    <div class="game-footer">
      <span class="current-value">現在: ${'0'.repeat(numDigits)}</span>
      <button class="clear-btn">クリア</button>
    </div>

    <!-- Countdown overlay (mock) -->
    <div class="countdown-overlay" id="countdown-overlay">
      <span class="countdown-number">3</span>
    </div>
  `

  container.appendChild(screen)

  // Create interactive abacus
  const valueDisplay = screen.querySelector('.current-value')

  const abacus = createAbacus(numDigits, (value) => {
    valueDisplay.textContent = '現在: ' + String(value).padStart(numDigits, '0')
  })

  screen.querySelector('.abacus-area').appendChild(abacus.element)

  // Clear button
  screen.querySelector('.clear-btn').addEventListener('click', () => {
    abacus.reset()
  })

  // Dismiss countdown after 1.5s
  const overlay = screen.querySelector('#countdown-overlay')
  setTimeout(() => {
    overlay.remove()
  }, 1500)
}
