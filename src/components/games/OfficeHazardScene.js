'use client'
import { useState } from 'react'
import { sfx } from '@/lib/sounds'

const HAZARDS = [
  { id: 1, x: 18, y: 78, r: 9, label: { en: 'Wet floor, no warning sign', bm: 'Lantai basah, tiada tanda amaran' } },
  { id: 2, x: 52, y: 72, r: 8, label: { en: 'Cable trailing across walkway', bm: 'Kabel melintang laluan' } },
  { id: 3, x: 84, y: 55, r: 9, label: { en: 'Boxes blocking the fire exit', bm: 'Kotak menghalang pintu keluar kebakaran' } },
  { id: 4, x: 30, y: 28, r: 8, label: { en: 'Overloaded power socket', bm: 'Plag elektrik terlebih beban' } },
  { id: 5, x: 68, y: 30, r: 8, label: { en: 'Boxes stacked unsafely on shelf', bm: 'Kotak disusun tidak selamat di rak' } },
]

export default function OfficeHazardScene({ lang, onComplete, pointsPerHazard = 8 }) {
  const [found, setFound] = useState([])
  const [explain, setExplain] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function click(id) {
    if (found.includes(id)) return
    setFound(f => [...f, id])
    sfx.correct()
  }

  function submit() {
    setSubmitted(true)
    const score = found.length * pointsPerHazard + (explain.trim().length > 10 ? 10 : 0)
    onComplete?.(score)
  }

  const allFound = found.length === HAZARDS.length

  return (
    <div>
      <p className="text-sm text-gray-400 mb-3">
        {lang === 'en' ? `Click directly on the hazards you spot in the office scene. Find all ${HAZARDS.length}!` : `Klik terus pada bahaya yang anda kesan dalam pejabat ini. Cari kesemua ${HAZARDS.length}!`}
      </p>

      <div className="relative rounded-xl overflow-hidden border border-nestle-blue/40" style={{ aspectRatio: '16/10' }}>
        <svg viewBox="0 0 100 62" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <rect width="100" height="62" fill="#1c2b42" />
          <rect width="100" height="40" fill="#26395a" />
          <rect x="6" y="6" width="20" height="14" fill="#7cc8e8" opacity="0.4" stroke="#9fd8f0" strokeWidth="0.5" />
          <rect x="38" y="34" width="34" height="4" fill="#5a3e2b" />
          <rect x="40" y="38" width="3" height="14" fill="#5a3e2b" />
          <rect x="67" y="38" width="3" height="14" fill="#5a3e2b" />
          <rect x="48" y="24" width="14" height="10" rx="1" fill="#0d1620" stroke="#445" strokeWidth="0.5" />
          <rect x="53" y="34" width="4" height="2" fill="#445" />
          <rect x="50" y="46" width="10" height="3" fill="#333" />
          <rect x="53" y="49" width="1.5" height="6" fill="#222" />

          <ellipse cx={HAZARDS[0].x} cy={HAZARDS[0].y} rx="10" ry="4" fill="#9fd8f0" opacity="0.35" />
          <ellipse cx={HAZARDS[0].x} cy={HAZARDS[0].y} rx="6" ry="2.4" fill="#cdeefb" opacity="0.3" />

          <path d={`M ${HAZARDS[1].x-14} ${HAZARDS[1].y-6} Q ${HAZARDS[1].x-4} ${HAZARDS[1].y+4} ${HAZARDS[1].x+10} ${HAZARDS[1].y-2}`}
            stroke="#222" strokeWidth="1.4" fill="none" />

          <rect x="86" y="30" width="10" height="26" fill="#0d1620" stroke="#3a4f6e" strokeWidth="0.6" />
          <text x="91" y="20" textAnchor="middle" fontSize="3" fill="#9fb8d8">EXIT</text>
          <rect x={HAZARDS[2].x-7} y={HAZARDS[2].y-2} width="9" height="8" fill="#8a6033" />
          <rect x={HAZARDS[2].x-3} y={HAZARDS[2].y-7} width="9" height="8" fill="#a9774a" />

          <rect x={HAZARDS[3].x-3} y={HAZARDS[3].y-2} width="6" height="4" rx="0.5" fill="#222" />
          <circle cx={HAZARDS[3].x-1} cy={HAZARDS[3].y} r="0.6" fill="#555" />
          <circle cx={HAZARDS[3].x+1} cy={HAZARDS[3].y} r="0.6" fill="#555" />
          <path d={`M ${HAZARDS[3].x-3} ${HAZARDS[3].y+2} L ${HAZARDS[3].x-8} ${HAZARDS[3].y+6}`} stroke="#c0392b" strokeWidth="1" />
          <path d={`M ${HAZARDS[3].x-1} ${HAZARDS[3].y+2} L ${HAZARDS[3].x-3} ${HAZARDS[3].y+7}`} stroke="#27ae60" strokeWidth="1" />
          <path d={`M ${HAZARDS[3].x+2} ${HAZARDS[3].y+2} L ${HAZARDS[3].x+5} ${HAZARDS[3].y+7}`} stroke="#2980b9" strokeWidth="1" />

          <rect x="60" y="14" width="22" height="2" fill="#445" />
          <rect x={HAZARDS[4].x-5} y={HAZARDS[4].y-10} width="8" height="6" fill="#8a6033" transform={`rotate(8 ${HAZARDS[4].x} ${HAZARDS[4].y-7})`} />
          <rect x={HAZARDS[4].x-2} y={HAZARDS[4].y-15} width="8" height="6" fill="#a9774a" transform={`rotate(-10 ${HAZARDS[4].x} ${HAZARDS[4].y-12})`} />
        </svg>

        {HAZARDS.map(h => (
          <button key={h.id} onClick={() => click(h.id)}
            style={{ position:'absolute', left:`${h.x}%`, top:`${h.y}%`, width:`${h.r * 2}%`, height:`${h.r*2}%`, transform:'translate(-50%,-50%)' }}
            className="rounded-full flex items-center justify-center group">
            {found.includes(h.id) && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm animate-score-pop"
                style={{ background:'rgba(255,34,68,0.85)', border:'2px solid #FF6080', color:'white' }}>!</div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-1 min-h-[20px]">
        {found.map(id => {
          const h = HAZARDS.find(x => x.id === id)
          return <p key={id} className="text-sm animate-slide-in" style={{ color:'#00FF88' }}>✅ {h.label[lang]}</p>
        })}
      </div>

      <p className="text-sm font-bold mt-2 text-gray-300">
        {lang === 'en' ? 'Found' : 'Dijumpai'}: <span style={{ color:'#00FF88' }}>{found.length}</span> / {HAZARDS.length} ({found.length * pointsPerHazard} pts)
      </p>

      <div className="mt-4">
        <label className="hud-label block mb-2">{lang === 'en' ? 'Explain the main hazard and how to fix it (+10 pts)' : 'Terangkan bahaya utama dan cara membaikinya (+10 mata)'}</label>
        <textarea value={explain} onChange={e => !submitted && setExplain(e.target.value)} disabled={submitted}
          className="input min-h-[80px]" placeholder={lang === 'en' ? 'Describe the hazard and control measure…' : 'Terangkan bahaya dan langkah kawalan…'} />
      </div>

      {!submitted && (
        <button onClick={submit} disabled={!allFound || explain.trim().length < 10} className="btn-primary w-full mt-4"
          style={{ opacity: (!allFound || explain.trim().length < 10) ? 0.5 : 1 }}>
          {allFound ? (lang === 'en' ? 'Submit' : 'Hantar') : (lang === 'en' ? `Find all ${HAZARDS.length} hazards first` : `Cari kesemua ${HAZARDS.length} bahaya dahulu`)}
        </button>
      )}
      {submitted && <p className="text-center font-bold mt-4" style={{ color:'#00FF88' }}>✅ {lang === 'en' ? 'Submitted!' : 'Dihantar!'}</p>}
    </div>
  )
}
