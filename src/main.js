import { renderTitle } from './screens/title.js'
import { renderGame } from './screens/game.js'
import { renderResult } from './screens/result.js'

const app = document.getElementById('app')

/** @type {'title'|'game'|'result'} */
let currentScreen = 'title'

const screenContext = {
  difficulty: 'normal',
  score: 0,
}

function navigate(screen, params = {}) {
  currentScreen = screen
  Object.assign(screenContext, params)
  render()
}

function render() {
  app.innerHTML = ''
  switch (currentScreen) {
    case 'title':
      renderTitle(app, { navigate })
      break
    case 'game':
      renderGame(app, { navigate, difficulty: screenContext.difficulty })
      break
    case 'result':
      renderResult(app, { navigate, score: screenContext.score, difficulty: screenContext.difficulty })
      break
  }
}

render()
