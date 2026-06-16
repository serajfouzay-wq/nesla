'use client'
import { useState } from 'react'
import { sfx } from '@/lib/sounds'

const HAZARDS = [
  { id: 1, x: 22, y: 80, r: 9, label: { en: 'Wet floor, no warning sign', bm: 'Lantai basah, tiada tanda amaran' } },
  { id: 2, x: 58, y: 75, r: 8, label: { en: 'Cable trailing across walkway', bm: 'Kabel melintang laluan' } },
  { id: 3, x: 14, y: 58, r: 9, label: { en: 'Boxes blocking the doorway', bm: 'Kotak menghalang pintu' } },
  { id: 4, x: 78, y: 38, r: 8, label: { en: 'Overloaded power socket', bm: 'Plag elektrik terlebih beban' } },
  { id: 5, x: 90, y: 60, r: 8, label: { en: 'Boxes stacked unsafely', bm: 'Kotak disusun tidak selamat' } },
  { id: 6, x: 38, y: 25, r: 7, label: { en: 'Open desk drawer at head height', bm: 'Laci meja terbuka pada paras kepala' } },
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
      <p className="text-sm text-gray-500 mb-3">
        {lang === 'en' ? `Click directly on the hazards you spot in the office scene. Find all ${HAZARDS.length}!` : `Klik terus pada bahaya yang anda kesan dalam pejabat ini. Cari kesemua ${HAZARDS.length}!`}
      </p>

      <div className="relative rounded-xl overflow-hidden border" style={{ aspectRatio: '16/10', borderColor: '#E5E8EC' }}>
        <svg viewBox="0 0 120 75" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="ceilingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E8E5DD" />
              <stop offset="100%" stopColor="#D4CFC2" />
            </linearGradient>
            <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C9BFAE" />
              <stop offset="100%" stopColor="#A89A82" />
            </linearGradient>
          </defs>

          <rect width="120" height="40" fill="url(#ceilingGrad)" />
          <rect y="40" width="120" height="35" fill="url(#floorGrad)" />

          <path d="M60,40 L40,2 L80,2 Z" fill="#B8AC96" opacity="0.5" />
          {[10,25,40,55,70,85,100].map((x,i) => (
            <circle key={i} cx={60 + (x-60)*0.7} cy={6 + i*0.3} r="1.8" fill="#FFE9B8" opacity="0.9" />
          ))}

          <path d="M2,75 L60,40 L118,75 Z" fill="#9C8E76" opacity="0.4" />

          <path d="M8,55 L60,38 L60,40 L10,58 Z" fill="#2B2520" opacity="0.85" />
          <path d="M112,55 L60,38 L60,40 L110,58 Z" fill="#2B2520" opacity="0.85" />
          <path d="M8,55 L60,38 L60,33 L6,50 Z" fill="#6B7D8C" opacity="0.3" />
          <path d="M112,55 L60,38 L60,33 L114,50 Z" fill="#6B7D8C" opacity="0.3" />

          <rect x="44" y="32" width="32" height="3" fill="#5a3e2b" />
          <rect x={HAZARDS[2].x+2} y="36" width="3" height="22" fill="#5a3e2b" />
          <rect x="73" y="36" width="3" height="22" fill="#5a3e2b" />

          <rect x="48" y="20" width="14" height="11" rx="1" fill="#1A1F2B" stroke="#5A6B7D" strokeWidth="0.4" />
          <rect x="53" y="31" width="4" height="2" fill="#5A6B7D" />
          <rect x="50" y="44" width="10" height="3" fill="#3A2E22" />
          <rect x="53" y="47" width="1.5" height="7" fill="#2B2218" />
          <rect x={HAZARDS[5].x-4} y={HAZARDS[5].y-2} width="9" height="5" rx="0.5" fill="#3A2E22" stroke="#5a3e2b" strokeWidth="0.3" />

          <ellipse cx={HAZARDS[0].x} cy={HAZARDS[0].y} rx="11" ry="4.5" fill="#8FA8B8" opacity="0.45" />
          <ellipse cx={HAZARDS[0].x} cy={HAZARDS[0].y} rx="6.5" ry="2.6" fill="#C5DCE6" opacity="0.35" />

          <path d={`M ${HAZARDS[1].x-16} ${HAZARDS[1].y-5} Q ${HAZARDS[1].x-4} ${HAZARDS[1].y+5} ${HAZARDS[1].x+12} ${HAZARDS[1].y-3}`}
            stroke="#1A1F2B" strokeWidth="1.6" fill="none" />

          <rect x={HAZARDS[2].x-7} y={HAZARDS[2].y-3} width="10" height="9" fill="#8a6033" />
          <rect x={HAZARDS[2].x-2} y={HAZARDS[2].y-9} width="10" height="9" fill="#a9774a" />

          <rect x={HAZARDS[3].x-3} y={HAZARDS[3].y-2} width="6" height="4" rx="0.5" fill="#2B2520" />
          <circle cx={HAZARDS[3].x-1} cy={HAZARDS[3].y} r="0.6" fill="#888" />
          <circle cx={HAZARDS[3].x+1} cy={HAZARDS[3].y} r="0.6" fill="#888" />
          <path d={`M ${HAZARDS[3].x-3} ${HAZARDS[3].y+2} L ${HAZARDS[3].x-8} ${HAZARDS[3].y+6}`} stroke="#C0392B" strokeWidth="1" />
          <path d={`M ${HAZARDS[3].x-1} ${HAZARDS[3].y+2} L ${HAZARDS[3].x-3} ${HAZARDS[3].y+7}`} stroke="#27AE60" strokeWidth="1" />
          <path d={`M ${HAZARDS[3].x+2} ${HAZARDS[3].y+2} L ${HAZARDS[3].x+5} ${HAZARDS[3].y+7}`} stroke="#2980B9" strokeWidth="1" />

          <rect x={HAZARDS[4].x-6} y={HAZARDS[4].y-12} width="9" height="7" fill="#8a6033" transform={`rotate(8 ${HAZARDS[4].x} ${HAZARDS[4].y-8})`} />
          <rect x={HAZARDS[4].x-3} y={HAZARDS[4].y-18} width="9" height="7" fill="#a9774a" transform={`rotate(-10 ${HAZARDS[4].x} ${HAZARDS[4].y-14})`} />
        </svg>

        {HAZARDS.map(h => (
          <button key={h.id} onClick={() => click(h.id)}
            style={{ position:'absolute', left:`${h.x}%`, top:`${h.y}%`, width:`${h.r * 2}%`, height:`${h.r*2}%`, transform:'translate(-50%,-50%)' }}
            className="rounded-full flex items-center justify-center group">
            {found.includes(h.id) && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm animate-score-pop"
                style={{ background:'rgba(226,0,26,0.9)', border:'2px solid #FF6080', color:'white' }}>!</div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-1 min-h-[20px]">
        {found.map(id => {
          const h = HAZARDS.find(x => x.id === id)
          return <p key={id} className="text-sm animate-slide-in" style={{ color:'#00A35E' }}>✅ {h.label[lang]}</p>
        })}
      </div>

      <p className="text-sm font-bold mt-2 text-gray-700">
        {lang === 'en' ? 'Found' : 'Dijumpai'}: <span style={{ color:'#00A35E' }}>{found.length}</span> / {HAZARDS.length} ({found.length * pointsPerHazard} pts)
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
      {submitted && <p className="text-center font-bold mt-4" style={{ color:'#00A35E' }}>✅ {lang === 'en' ? 'Submitted!' : 'Dihantar!'}</p>}
    </div>
  )
}
