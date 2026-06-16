'use client'
import { useState } from 'react'
import Image from 'next/image'
import { sfx } from '@/lib/sounds'

const HAZARDS = [
  { id: 1, x: 7.3, y: 29.3, r: 6, label: { en: 'Door left wide open, blocking a clear exit path', bm: 'Pintu terbuka luas, menghalang laluan keluar' } },
  { id: 2, x: 19.0, y: 58.6, r: 7, label: { en: 'Boxes stacked in the walkway', bm: 'Kotak disusun di laluan jalan' } },
  { id: 3, x: 59.6, y: 71.7, r: 8, label: { en: 'Wet floor spill, warning cone knocked over', bm: 'Tumpahan lantai basah, kon amaran tertumbang' } },
  { id: 4, x: 81.0, y: 67.3, r: 7, label: { en: 'Cable trailing across the floor', bm: 'Kabel melintang di lantai' } },
  { id: 5, x: 68.0, y: 21.5, r: 6, label: { en: 'Exposed wiring/sensor near ceiling', bm: 'Wayar/sensor terdedah berhampiran siling' } },
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

      <div className="relative rounded-xl overflow-hidden border" style={{ aspectRatio: '1024/683', borderColor: '#E5E8EC' }}>
        <Image src="/images/office_hallway.png" alt="Office hazard scene" fill style={{ objectFit: 'cover' }} priority />

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
