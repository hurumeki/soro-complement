/**
 * Web Audio API sound manager
 * @see docs/spec/07-sound-effects.md
 *
 * All sounds are generated programmatically — no external audio files.
 */

let ctx = null
let enabled = true

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (ctx.state === 'suspended') {
    ctx.resume()
  }
  return ctx
}

function playTone(freq, duration, type = 'sine', gainVal = 0.3) {
  if (!enabled) return
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(gainVal, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + duration)
}

function playNoise(duration, gainVal = 0.15) {
  if (!enabled) return
  const c = getCtx()
  const bufferSize = c.sampleRate * duration
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1
  }
  const source = c.createBufferSource()
  source.buffer = buffer
  const gain = c.createGain()
  gain.gain.setValueAtTime(gainVal, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
  const filter = c.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = 2000
  source.connect(filter)
  filter.connect(gain)
  gain.connect(c.destination)
  source.start()
}

/** Short wood-click sound for bead movement */
export function playBeadClick() {
  playNoise(0.05, 0.12)
  playTone(800, 0.04, 'square', 0.08)
}

/** Rising tone for carry-over */
export function playCarry() {
  if (!enabled) return
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(400, c.currentTime)
  osc.frequency.linearRampToValueAtTime(800, c.currentTime + 0.15)
  gain.gain.setValueAtTime(0.25, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + 0.2)
}

/** Achievement chime for problem clear */
export function playClear() {
  const notes = [523, 659, 784] // C5, E5, G5
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, 'sine', 0.2), i * 80)
  })
}

/** Elaborate chime for combo/simultaneous clear */
export function playComboClear() {
  const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.4, 'sine', 0.25), i * 70)
  })
}

/** Descending tone for time-up */
export function playTimeUp() {
  if (!enabled) return
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(600, c.currentTime)
  osc.frequency.linearRampToValueAtTime(200, c.currentTime + 0.6)
  gain.gain.setValueAtTime(0.3, c.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.7)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(c.currentTime)
  osc.stop(c.currentTime + 0.7)
}

/** Low buzzer for blocked operation */
export function playBlocked() {
  playTone(150, 0.15, 'sawtooth', 0.15)
}

export function setSoundEnabled(val) {
  enabled = val
}

export function isSoundEnabled() {
  return enabled
}
