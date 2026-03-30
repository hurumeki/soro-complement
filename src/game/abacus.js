/**
 * Abacus component — rendering & interaction logic
 * @see docs/spec/03-abacus-specification.md
 */

/**
 * Create an interactive abacus component.
 * @param {number} numDigits - Number of rods (digits)
 * @param {(value: number) => void} onChange - Called when abacus value changes
 * @returns {{ element: HTMLElement, getValue: () => number, getRodValues: () => number[], getRodValue: (i: number) => number, reset: () => void, lockRod: (i: number) => void, unlockAllRods: () => void, isRodLocked: (i: number) => boolean }}
 */
function addFlickListener(beadEl, { onFlickUp, onFlickDown }) {
  let startY = 0
  let startX = 0

  beadEl.addEventListener('touchstart', (e) => {
    const t = e.touches[0]
    startY = t.clientY
    startX = t.clientX
  }, { passive: true })

  beadEl.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0]
    const dy = t.clientY - startY
    const dx = t.clientX - startX
    if (Math.abs(dy) > 15 && Math.abs(dy) > Math.abs(dx)) {
      e.preventDefault() // フリック確定 → click 抑制
      if (dy < 0) onFlickUp()
      else onFlickDown()
    }
  })
}

export function createAbacus(numDigits, onChange) {
  const rods = Array.from({ length: numDigits }, () => ({
    upper: 0, // 0 = away from beam, 1 = pushed to beam
    lower: 0, // 0-4 beads pushed to beam
  }))

  const locked = new Array(numDigits).fill(false)

  const element = document.createElement('div')
  element.className = 'abacus-frame'

  const upperSection = document.createElement('div')
  upperSection.className = 'abacus-upper'

  const beam = document.createElement('div')
  beam.className = 'abacus-beam'

  const lowerSection = document.createElement('div')
  lowerSection.className = 'abacus-lower'

  const rodElements = []

  for (let r = 0; r < numDigits; r++) {
    // --- Upper rod (1 heaven bead) ---
    const upperRod = document.createElement('div')
    upperRod.className = 'rod'

    const upperBead = document.createElement('div')
    upperBead.className = 'bead'
    upperRod.appendChild(upperBead)

    upperRod.addEventListener('click', (e) => {
      if (locked[r]) return
      const rect = upperRod.getBoundingClientRect()
      const y = e.clientY - rect.top
      const beadH = rect.height / 2

      const beadTop = rods[r].upper === 0 ? 0 : beadH
      const beadMid = beadTop + beadH / 2

      if (y < beadMid) {
        rods[r].upper = 1
      } else {
        rods[r].upper = 0
      }
      updateRod(r)
      onChange(getValue())
    })

    // Flick on upper bead
    addFlickListener(upperBead, {
      onFlickUp: () => { if (!locked[r]) { rods[r].upper = 0; updateRod(r); onChange(getValue()) } },
      onFlickDown: () => { if (!locked[r]) { rods[r].upper = 1; updateRod(r); onChange(getValue()) } },
    })

    upperSection.appendChild(upperRod)

    // --- Lower rod (4 earth beads) ---
    const lowerRod = document.createElement('div')
    lowerRod.className = 'rod'

    const lowerBeads = []
    for (let b = 0; b < 4; b++) {
      const bead = document.createElement('div')
      bead.className = 'bead'
      lowerRod.appendChild(bead)
      lowerBeads.push(bead)

      // Flick on each lower bead
      const beadIndex = b
      addFlickListener(bead, {
        onFlickUp: () => {
          if (!locked[r]) {
            rods[r].lower = Math.max(rods[r].lower, beadIndex + 1)
            updateRod(r); onChange(getValue())
          }
        },
        onFlickDown: () => {
          if (!locked[r]) {
            rods[r].lower = Math.min(rods[r].lower, beadIndex)
            updateRod(r); onChange(getValue())
          }
        },
      })
    }

    lowerRod.addEventListener('click', (e) => {
      if (locked[r]) return
      const rect = lowerRod.getBoundingClientRect()
      const y = e.clientY - rect.top
      const beadH = rect.height / 5

      const N = rods[r].lower

      const midpoints = []
      for (let b = 0; b < 4; b++) {
        const top = b < N ? b * beadH : (b + 1) * beadH
        midpoints.push(top + beadH / 2)
      }

      let newN = 4
      for (let i = 0; i < 4; i++) {
        if (y < midpoints[i]) {
          newN = i
          break
        }
      }

      rods[r].lower = newN
      updateRod(r)
      onChange(getValue())
    })

    lowerSection.appendChild(lowerRod)

    rodElements.push({ upperRod, upperBead, lowerRod, lowerBeads })
  }

  element.appendChild(upperSection)
  element.appendChild(beam)
  element.appendChild(lowerSection)

  function updateRod(r) {
    const { upper, lower } = rods[r]
    const { upperBead, lowerBeads, upperRod, lowerRod } = rodElements[r]

    upperBead.style.top = upper ? '50%' : '0'
    upperBead.classList.toggle('active', upper === 1)

    for (let b = 0; b < 4; b++) {
      const bead = lowerBeads[b]
      const pct = b < lower ? b * 20 : (b + 1) * 20
      bead.style.top = pct + '%'
      bead.classList.toggle('active', b < lower)
    }

    // Visual lock state
    const isLocked = locked[r]
    upperRod.classList.toggle('rod-locked', isLocked)
    lowerRod.classList.toggle('rod-locked', isLocked)
  }

  function getRodValue(r) {
    return rods[r].upper * 5 + rods[r].lower
  }

  function getValue() {
    let total = 0
    for (let r = 0; r < numDigits; r++) {
      total += getRodValue(r) * Math.pow(10, numDigits - 1 - r)
    }
    return total
  }

  function getRodValues() {
    return Array.from({ length: numDigits }, (_, r) => getRodValue(r))
  }

  function lockRod(index) {
    locked[index] = true
    updateRod(index)
  }

  function unlockAllRods() {
    for (let r = 0; r < numDigits; r++) {
      locked[r] = false
    }
  }

  function isRodLocked(index) {
    return locked[index]
  }

  function reset() {
    for (let r = 0; r < numDigits; r++) {
      rods[r].upper = 0
      rods[r].lower = 0
      locked[r] = false
      updateRod(r)
    }
    onChange(getValue())
  }

  // Initial render — all rods at 0
  for (let r = 0; r < numDigits; r++) {
    updateRod(r)
  }

  return { element, getValue, getRodValue, getRodValues, reset, lockRod, unlockAllRods, isRodLocked }
}
