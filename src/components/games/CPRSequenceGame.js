'use client'
import { useState } from 'react'
import { sfx } from '@/lib/sounds'

const DRBAC_STEPS = [
  { id: 1, letter: 'D', word: { en: 'Danger', bm: 'Bahaya' }, desc: { en: 'Check the scene is safe for you, others, and the casualty', bm: 'Pastikan tempat itu selamat untuk anda, orang lain, dan mangsa' } },
  { id: 2, letter: 'R', word: { en: 'Response', bm: 'Respons' }, desc: { en: 'Tap shoulders, shout "Are you OK?"', bm: 'Ketuk bahu, jerit "Awak okay?"' } },
  { id: 3, letter: 'B', word: { en: 'Breathing', bm: 'Pernafasan' }, desc: { en: 'Look, listen, feel for breathing — 10 seconds', bm: 'Lihat, dengar, rasa pernafasan — 10 saat' } },
  { id: 4, letter: 'A', word: { en: 'Alert', bm: 'Amaran' }, desc: { en: 'Call 999 or get someone to call', bm: 'Hubungi 999 atau minta orang lain hubungi' } },
  { id: 5, letter: 'C', word: { en: 'CPR', bm: 'CPR' }, desc: { en: '30 chest compressions + 2 rescue breaths', bm: '30 tekanan dada + 2 bantuan pernafasan' } },
]
const CORRECT_ORDER = [1, 2, 3, 4, 5]

export default function CPRSequenceGame({ lang, onComplete }) {
  const [items, setItems] = useState(() => [...DRBAC_STEPS].sort(() => Math.random() - 0.5))
  const [dragging, setDragging] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  function onDrop(idx) {
    if (dragging === null || dragging === idx) return
    const next = [...items]
    const temp = next[dragging]; next[dragging] = next[idx]; next[idx] = temp
    setItems(next); setDragging(null)
  }

  function submit() {
    let correct = 0
    items.forEach((item, i) => { if (item.id === CORRECT_ORDER[i]) correct++ })
    const pts = correct * 12
    setScore(pts); setSubmitted(true)
    if (correct === DRBAC_STEPS.length) sfx.complete(); else sfx.tap()
    onComplete?.(pts)
  }

  return (
    <div>
      <div className="flex justify-center gap-2 mb-5">
        {DRBAC_STEPS.map(s => (
          <div key={s.id} className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg text-white" style={{ background:'#E2001A' }}>{s.letter}</div>
        ))}
      </div>
      <p className="text-sm text-gray-400 mb-4">{lang === 'en' ? 'Drag the steps into the correct DRBAC order.' : 'Seret langkah-langkah mengikut urutan DRBAC yang betul.'}</p>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={item.id} draggable={!submitted} onDragStart={() => setDragging(i)} onDragOver={e => e.preventDefault()} onDrop={() => onDrop(i)}
            className={`drag-item ${submitted ? (item.id === CORRECT_ORDER[i] ? 'correct' : 'wrong') : ''}`}>
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0" style={{ background:'rgba(226,0,26,0.2)', color:'#FF6080' }}>{item.letter}</span>
            <div>
              <p className="font-bold text-sm text-white">{item.word[lang]}</p>
              <p className="text-xs text-gray-400">{item.desc[lang]}</p>
            </div>
            {submitted && <span className="ml-auto">{item.id === CORRECT_ORDER[i] ? '✅' : '❌'}</span>}
          </div>
        ))}
      </div>
      {!submitted ? (
        <button onClick={submit} className="btn-primary w-full mt-4">{lang === 'en' ? 'Check Order' : 'Semak Urutan'}</button>
      ) : (
        <p className="text-center font-bold mt-4" style={{ color:'#00FF88' }}>{score} / {DRBAC_STEPS.length * 12} pts</p>
      )}
    </div>
  )
}
