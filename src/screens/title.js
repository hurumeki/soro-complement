const DIFFICULTIES = [
  { key: 'practice', label: '練習', digits: '2桁 (1-5)', },
  { key: 'easy',     label: 'かんたん', digits: '2桁', },
  { key: 'normal',   label: 'ふつう', digits: '3桁', },
  { key: 'hard',     label: 'むずかしい', digits: '4桁', },
  { key: 'challenge', label: 'チャレンジ', digits: '5桁', },
]

export function renderTitle(container, { navigate }) {
  const screen = document.createElement('div')
  screen.className = 'screen title-screen'

  screen.innerHTML = `
    <h1>そろばんチャレンジ</h1>
    <p class="subtitle">補数パズルゲーム</p>
    <div class="difficulty-list">
      ${DIFFICULTIES.map(d => `
        <button class="difficulty-btn" data-difficulty="${d.key}">
          <span>${d.label}</span>
          <span class="digits">${d.digits}</span>
        </button>
      `).join('')}
    </div>
  `

  screen.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      navigate('game', { difficulty: btn.dataset.difficulty })
    })
  })

  container.appendChild(screen)
}
