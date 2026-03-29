/**
 * Abacus component — rendering & interaction logic
 * @see docs/spec/03-abacus-specification.md
 */

/**
 * Create an interactive abacus component.
 * @param {number} numDigits - Number of rods (digits)
 * @param {(value: number) => void} onChange - Called when abacus value changes
 * @returns {{ element: HTMLElement, getValue: () => number, reset: () => void }}
 */
export function createAbacus(numDigits, onChange) {
  const rods = Array.from({ length: numDigits }, () => ({
    upper: 0, // 0 = away from beam, 1 = pushed to beam
    lower: 0, // 0-4 beads pushed to beam
  }))

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
      const rect = upperRod.getBoundingClientRect()
      const y = e.clientY - rect.top
      const beadH = rect.height / 2 // upper area = 2 * bead_h

      // Bead top: inactive=0, active=beadH
      const beadTop = rods[r].upper === 0 ? 0 : beadH
      const beadMid = beadTop + beadH / 2

      if (y < beadMid) {
        rods[r].upper = 1 // tapped above bead (frame–bead gap) → push to beam
      } else {
        rods[r].upper = 0 // tapped below bead (bead–beam gap) → move to frame
      }
      updateRod(r)
      onChange(getValue())
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
    }

    lowerRod.addEventListener('click', (e) => {
      const rect = lowerRod.getBoundingClientRect()
      const y = e.clientY - rect.top
      const beadH = rect.height / 5 // lower area = 5 * bead_h

      const N = rods[r].lower

      // Compute midpoints of each bead based on current positions
      // Bead j position: if j < N → top = j * beadH, else → top = (j+1) * beadH
      const midpoints = []
      for (let b = 0; b < 4; b++) {
        const top = b < N ? b * beadH : (b + 1) * beadH
        midpoints.push(top + beadH / 2)
      }

      // Find which gap was tapped
      let newN = 4 // below all beads → all pushed to beam
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

    rodElements.push({ upperBead, lowerBeads })
  }

  element.appendChild(upperSection)
  element.appendChild(beam)
  element.appendChild(lowerSection)

  function updateRod(r) {
    const { upper, lower } = rods[r]
    const { upperBead, lowerBeads } = rodElements[r]

    // Upper bead: inactive → top:0%, active → top:50%
    upperBead.style.top = upper ? '50%' : '0'
    upperBead.classList.toggle('active', upper === 1)

    // Lower beads: active beads stack from top, inactive from bottom
    // Bead j: if j < lower → top = j*20%, else → top = (j+1)*20%
    for (let b = 0; b < 4; b++) {
      const bead = lowerBeads[b]
      const pct = b < lower ? b * 20 : (b + 1) * 20
      bead.style.top = pct + '%'
      bead.classList.toggle('active', b < lower)
    }
  }

  function getValue() {
    let total = 0
    for (let r = 0; r < numDigits; r++) {
      const rodValue = rods[r].upper * 5 + rods[r].lower
      const placeValue = Math.pow(10, numDigits - 1 - r)
      total += rodValue * placeValue
    }
    return total
  }

  function reset() {
    for (let r = 0; r < numDigits; r++) {
      rods[r].upper = 0
      rods[r].lower = 0
      updateRod(r)
    }
    onChange(getValue())
  }

  // Initial render — all rods at 0
  for (let r = 0; r < numDigits; r++) {
    updateRod(r)
  }

  return { element, getValue, reset }
}
