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
    <div class="abacus-area">
      <div class="abacus-frame">
        <!-- Upper beads (heaven beads) -->
        <div class="abacus-upper">
          ${Array.from({ length: numDigits }, (_, i) => `
            <div class="rod">
              <div class="bead${i === 1 ? ' active' : ''}"></div>
            </div>
          `).join('')}
        </div>

        <!-- Beam -->
        <div class="abacus-beam"></div>

        <!-- Lower beads (earth beads) -->
        <div class="abacus-lower">
          ${Array.from({ length: numDigits }, (_, rodIdx) => `
            <div class="rod">
              ${Array.from({ length: 4 }, (_, beadIdx) => `
                <div class="bead${(rodIdx === 1 && beadIdx < 2) ? ' active' : ''}"></div>
              `).join('')}
            </div>
          `).join('')}
        </div>
      </div>
    </div>

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

  // Mock: dismiss countdown after 1s, then simulate game end after 3s
  const overlay = screen.querySelector('#countdown-overlay')
  setTimeout(() => {
    overlay.remove()
  }, 1500)

  // Mock: navigate to result after a short demo period
  setTimeout(() => {
    navigate('result', { score: 120, difficulty })
  }, 6000)
}
