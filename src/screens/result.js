import { getHighScore, setHighScore } from '../game/storage.js'

export function renderResult(container, { navigate, score, difficulty }) {
  const prevHigh = getHighScore(difficulty)
  const isNewRecord = setHighScore(difficulty, score)
  const highScore = Math.max(prevHigh, score)

  const screen = document.createElement('div')
  screen.className = 'screen result-screen'

  screen.innerHTML = `
    <h2>タイムアップ！</h2>
    <div class="result-score">
      <div class="label">スコア</div>
      <div class="value">${score}</div>
      <div class="high-score${isNewRecord ? ' new-record' : ''}">
        ${isNewRecord ? '🎉 ハイスコア更新！' : '🏆 ハイスコア:'} ${highScore}
      </div>
    </div>
    <div class="result-actions">
      <button class="result-btn primary" id="retry-btn">もういちど</button>
      <button class="result-btn secondary" id="title-btn">タイトルへ</button>
    </div>
  `

  screen.querySelector('#retry-btn').addEventListener('click', () => {
    navigate('game', { difficulty })
  })

  screen.querySelector('#title-btn').addEventListener('click', () => {
    navigate('title')
  })

  container.appendChild(screen)
}
