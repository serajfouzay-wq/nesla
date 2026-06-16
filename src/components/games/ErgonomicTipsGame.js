'use client'
import { useState } from 'react'

const TIPS = [
  { id: 1, icon: '🖥️', title: { en: 'Monitor Height', bm: 'Ketinggian Monitor' }, tip: { en: 'Top of screen at or just below eye level, arm\'s length away.', bm: 'Bahagian atas skrin pada atau bawah sedikit paras mata, sejauh lengan.' } },
  { id: 2, icon: '🪑', title: { en: 'Chair Support', bm: 'Sokongan Kerusi' }, tip: { en: 'Lower back should be supported; feet flat on floor or footrest.', bm: 'Belakang bawah disokong; kaki rata di lantai atau penyokong kaki.' } },
  { id: 3, icon: '⌨️', title: { en: 'Keyboard Position', bm: 'Kedudukan Papan Kekunci' }, tip: { en: 'Elbows at ~90°, wrists straight (not bent up or down) while typing.', bm: 'Siku ~90°, pergelangan tangan lurus semasa menaip.' } },
  { id: 4, icon: '⏰', title: { en: 'Take Breaks', bm: 'Berehat' }, tip: { en: 'Stand and stretch every 30-60 minutes to reduce strain.', bm: 'Berdiri dan regangkan setiap 30-60 minit untuk kurangkan tegangan.' } },
  { id: 5, icon: '📦', title: { en: 'Lifting Heavy Items', bm: 'Mengangkat Barang Berat' }, tip: { en: 'Bend knees, keep back straight, hold load close to body.', bm: 'Tekuk lutut, kekalkan belakang lurus, pegang muatan rapat badan.' } },
  { id: 6, icon: '👀', title: { en: 'Eye Strain', bm: 'Tegangan Mata' }, tip: { en: 'Follow 20-20-20: every 20 min, look 20 feet away for 20 seconds.', bm: 'Ikut 20-20-20: setiap 20 minit, lihat 20 kaki jauh selama 20 saat.' } },
]

export default function ErgonomicTipsGame({ lang, onComplete }) {
  const [flipped, setFlipped] = useState([])
  const [submitted, setSubmitted] = useState(false)

  function flip(id) {
    if (submitted) return
    setFlipped(f => f.includes(id) ? f : [...f, id])
  }

  function submit() {
    setSubmitted(true)
    onComplete?.(TIPS.length * 5)
  }

  const allFlipped = flipped.length === TIPS.length

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{lang === 'en' ? `Tap each card to reveal an ergonomic tip. Flip all ${TIPS.length}!` : `Ketik setiap kad untuk dedah tip ergonomik. Buka kesemua ${TIPS.length}!`}</p>
      <div className="grid grid-cols-2 gap-3">
        {TIPS.map(tip => {
          const isFlipped = flipped.includes(tip.id)
          return (
            <button key={tip.id} onClick={() => flip(tip.id)}
              className="p-4 rounded-xl border text-left transition-all min-h-[120px]"
              style={{
                background: isFlipped ? 'rgba(0,163,94,0.06)' : '#FFFCF6',
                borderColor: isFlipped ? 'rgba(0,163,94,0.4)' : '#E5E8EC',
              }}>
              {!isFlipped ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <span className="text-3xl mb-1">{tip.icon}</span>
                  <p className="text-xs font-bold text-gray-700">{tip.title[lang]}</p>
                </div>
              ) : (
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color:'#00A35E' }}>{tip.icon} {tip.title[lang]}</p>
                  <p className="text-xs text-gray-600">{tip.tip[lang]}</p>
                </div>
              )}
            </button>
          )
        })}
      </div>
      {!submitted ? (
        <button onClick={submit} disabled={!allFlipped} className="btn-primary w-full mt-4" style={{ opacity: allFlipped ? 1 : 0.5 }}>
          {allFlipped ? (lang === 'en' ? 'Claim Points →' : 'Ambil Mata →') : (lang === 'en' ? `Flip all ${TIPS.length} cards first` : `Buka kesemua ${TIPS.length} kad dahulu`)}
        </button>
      ) : (
        <p className="text-center font-bold mt-4" style={{ color:'#00A35E' }}>{TIPS.length * 5} pts</p>
      )}
    </div>
  )
}
