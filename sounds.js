'use client'
// Tiny dependency-free sound effects using the Web Audio API (no files needed,
// works instantly, no licensing concerns). Import and call from any component.

let ctx = null
function getCtx() {
  if (typeof window === 'undefined') return null
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

function tone(freq, duration, type = 'sine', gainStart = 0.15, delay = 0) {
  const c = getCtx()
  if (!c) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.value = gainStart
  osc.connect(gain); gain.connect(c.destination)
  const t0 = c.currentTime + delay
  osc.start(t0)
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration)
  osc.stop(t0 + duration)
}

export const sfx = {
  correct() {
    tone(523.25, 0.12, 'triangle', 0.18)       // C5
    tone(659.25, 0.16, 'triangle', 0.16, 0.08) // E5
    tone(783.99, 0.2, 'triangle', 0.14, 0.16)  // G5
  },
  wrong() {
    tone(220, 0.18, 'sawtooth', 0.12)
    tone(180, 0.22, 'sawtooth', 0.1, 0.05)
  },
  tap() {
    tone(880, 0.06, 'square', 0.08)
  },
  complete() {
    tone(523.25, 0.14, 'triangle', 0.18)
    tone(659.25, 0.14, 'triangle', 0.16, 0.1)
    tone(783.99, 0.14, 'triangle', 0.16, 0.2)
    tone(1046.5, 0.3, 'triangle', 0.18, 0.3)
  },
  click() {
    tone(440, 0.05, 'sine', 0.06)
  },
}
