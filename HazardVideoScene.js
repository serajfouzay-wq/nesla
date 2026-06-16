'use client'
import { useState, useRef, useEffect } from 'react'
import { sfx } from '@/lib/sounds'

// A self-contained animated "road scene" built in SVG/CSS that plays like a
// short looping clip with hazards appearing at timed intervals. No external
// video file is required, so it always works, while still functioning as a
// genuine tap-the-hazard-the-moment-it-appears game.
const HAZARD_EVENTS = [
  { id: 1, t: 1500, x: 70, y: 55, label: { en: 'Pedestrian crossing suddenly', bm: 'Pejalan kaki melintas tiba-tiba' }, duration: 2200 },
  { id: 2, t: 5000, x: 25, y: 40, label: { en: 'Car braking hard ahead', bm: 'Kereta brek mengejut di hadapan' }, duration: 2200 },
  { id: 3, t: 9000, x: 55, y: 65, label: { en: 'Motorcycle weaving lanes', bm: 'Motosikal memotong selekoh' }, duration: 2200 },
  { id: 4, t: 13000, x: 35, y: 30, label: { en: 'Pothole on the road', bm: 'Lubang jalan' }, duration: 2200 },
]
const TOTAL_DURATION = 16000

export default function HazardVideoScene({ lang, onComplete, pointsPerTap = 15 }) {
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [activeHazards, setActiveHazards] = useState([])
  const [taps, setTaps] = useState([])
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const startRef = useRef(null)
  const rafRef = useRef(null)
  const triggeredRef = useRef(new Set())

  useEffect(() => {
    if (!playing) return
    startRef.current = performance.now() - elapsed

    function tick(now) {
      const e = now - startRef.current
      setElapsed(e)

      HAZARD_EVENTS.forEach(h => {
        if (e >= h.t && e < h.t + h.duration && !triggeredRef.current.has(h.id)) {
          setActiveHazards(prev => [...prev, h])
        }
        if (e >= h.t + h.duration) {
          setActiveHazards(prev => prev.filter(a => a.id !== h.id))
        }
      })

      if (e >= TOTAL_DURATION) {
        setPlaying(false)
        setDone(true)
        sfx.complete()
        onComplete?.(score)
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playing])

  function tapHazard(h) {
    if (triggeredRef.current.has(h.id)) return
    triggeredRef.current.add(h.id)
    setTaps(prev => [...prev, h.id])
    setScore(s => s + pointsPerTap)
    setActiveHazards(prev => prev.filter(a => a.id !== h.id))
    sfx.correct()
  }

  function start() {
    setElapsed(0); setTaps([]); setScore(0); setDone(false)
    triggeredRef.current = new Set()
    setActiveHazards([])
    setPlaying(true)
  }

  const progressPct = Math.min(100, (elapsed / TOTAL_DURATION) * 100)

  return (
    <div>
      <div className="relative rounded-xl overflow-hidden border border-nestle-blue/40 bg-gradient-to-b from-sky-900 to-gray-800 aspect-video">
        {/* Road scene */}
        <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <rect width="100" height="60" fill="#1e3a5f" />
          <rect y="38" width="100" height="22" fill="#2d2d2d" />
          {[10,30,50,70,90].map((x,i) => (
            <rect key={i} x={(x + elapsed/40) % 110 - 10} y="48" width="8" height="2" fill="#F0A500" opacity="0.8" />
          ))}
          <rect y="0" width="100" height="38" fill="#16243d" />
          <circle cx="80" cy="10" r="6" fill="#FFD700" opacity="0.7" />
          {/* simple car icon driving */}
          <g transform="translate(45,46)">
            <rect width="14" height="7" rx="2" fill="#E2001A" />
            <rect x="2" y="-3" width="8" height="5" rx="1" fill="#E2001A" />
            <circle cx="3" cy="7" r="2" fill="#111" />
            <circle cx="11" cy="7" r="2" fill="#111" />
          </g>
        </svg>

        {/* Hazard tap targets */}
        {activeHazards.map(h => (
          <button key={h.id} onClick={() => tapHazard(h)}
            style={{ position:'absolute', left:`${h.x}%`, top:`${h.y}%`, transform:'translate(-50%,-50%)' }}
            className="w-12 h-12 rounded-full flex items-center justify-center animate-pulse"
            >
            <div className="absolute inset-0 rounded-full border-2 animate-ping" style={{ borderColor:'#FF2244' }} />
            <div className="relative w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-lg"
              style={{ background:'rgba(255,34,68,0.85)', border:'2px solid #FF6080' }}>!</div>
          </button>
        ))}

        {/* Tap feedback */}
        {taps.map(id => {
          const h = HAZARD_EVENTS.find(x => x.id === id)
          return null
        })}

        {/* Start overlay */}
        {!playing && !done && (
          <button onClick={start} className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/50 hover:bg-black/40 transition-colors">
            <div className="w-16 h-16 rounded-full bg-nestle-red/90 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 ml-1"><polygon points="5,3 19,12 5,21"/></svg>
            </div>
            <p className="text-white font-bold text-sm">{lang === 'en' ? 'Tap to start hazard scene' : 'Ketik untuk mula senario bahaya'}</p>
          </button>
        )}

        {/* HUD overlay while playing */}
        {playing && (
          <div className="absolute top-2 left-2 right-2 flex justify-between pointer-events-none">
            <div className="bg-black/60 rounded-lg px-3 py-1 text-xs font-bold" style={{ color:'#00FF88' }}>{taps.length}/{HAZARD_EVENTS.length} {lang === 'en' ? 'spotted' : 'dikesan'} · {score} pts</div>
            <div className="bg-nestle-red/80 rounded-lg px-3 py-1 text-xs text-white font-bold animate-pulse">{lang === 'en' ? 'TAP HAZARDS' : 'KETIK BAHAYA'}</div>
          </div>
        )}
      </div>

      <div className="progress-track mt-3">
        <div className="progress-fill-cyan" style={{ width: `${progressPct}%` }} />
      </div>

      {done && (
        <div className="mt-4 p-4 rounded-xl text-center" style={{ background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.3)' }}>
          <p className="font-black text-2xl" style={{ color:'#00FF88' }}>{score} / {HAZARD_EVENTS.length * pointsPerTap} pts</p>
          <p className="text-sm text-gray-400 mt-1">{taps.length}/{HAZARD_EVENTS.length} {lang === 'en' ? 'hazards spotted' : 'bahaya dikesan'}</p>
          <button onClick={start} className="btn-secondary mt-3 text-sm py-2">{lang === 'en' ? '↻ Play Again' : '↻ Main Semula'}</button>
        </div>
      )}
    </div>
  )
}
