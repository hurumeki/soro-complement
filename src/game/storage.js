/**
 * Local Storage manager
 * @see docs/spec/08-data-management.md
 */

const STORAGE_KEY = 'soro-complement'

const DEFAULT_DATA = {
  highScores: {
    practice: 0,
    easy: 0,
    normal: 0,
    hard: 0,
    challenge: 0,
  },
  settings: {
    soundEnabled: true,
    vibrationEnabled: true,
  },
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(DEFAULT_DATA)
    const data = JSON.parse(raw)
    return {
      highScores: { ...DEFAULT_DATA.highScores, ...data.highScores },
      settings: { ...DEFAULT_DATA.settings, ...data.settings },
    }
  } catch {
    return structuredClone(DEFAULT_DATA)
  }
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function getHighScore(difficulty) {
  return loadData().highScores[difficulty] || 0
}

export function setHighScore(difficulty, score) {
  const data = loadData()
  if (score > (data.highScores[difficulty] || 0)) {
    data.highScores[difficulty] = score
    saveData(data)
    return true // new record
  }
  return false
}

export function getSettings() {
  return loadData().settings
}

export function updateSettings(patch) {
  const data = loadData()
  Object.assign(data.settings, patch)
  saveData(data)
}
