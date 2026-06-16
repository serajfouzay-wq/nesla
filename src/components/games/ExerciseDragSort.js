'use client'
import { useState } from 'react'
import { sfx } from '@/lib/sounds'

const EXERCISES = [
  { id: 1, name: { en: 'Jumping Jacks', bm: 'Lompat Bintang' }, correct: 'fat-burning', icon: '⭐' },
  { id: 2, name: { en: 'Squats', bm: 'Squat' }, correct: 'muscle-building', icon: '🏋️' },
  { id: 3, name: { en: 'Burpees', bm: 'Burpee' }, correct: 'fat-burning', icon: '🔥' },
  { id: 4, name: { en: 'Push-ups', bm: 'Tekan Tubi' }, correct: 'muscle-building', icon: '💪' },
  { id: 5, name: { en: 'Hamstring Stretch', bm: 'Regangan Hamstring' }, correct: 'stretching', icon: '🧘' },
  { id: 6, name: { en: 'Running (30 min)', bm: 'Berlari (30 min)' }, correct: 'fat-burning', icon: '🏃' },
  { id: 7, name: { en: 'Bicep Curls', bm: 'Bicep Curl' }, correct: 'muscle-building', icon: '🦾' },
  { id: 8, name: { en: 'Shoulder Stretch', bm: 'Regangan Bahu' }, correct: 'stretching', icon: '🤸' },
]

const CATEGORIES = [
  { key: 'fat-burning',     en: 'Fat Burning',      bm: 'Bakar Lemak',   icon: '🔥', color: '#F97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.35)' },
  { key: 'muscle-building', en: 'Muscle Building',  bm: 'Bina Otot',     icon: '💪', color: '#3B82F6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.35)' },
  { key: 'stretching',      en: 'Stretching',       bm: 'Regangan',      icon: '🧘', color: '#00FF88', bg: 'rgba(0,255,136,0.08)',  border: 'rgba(0,255,136,0.35)' },
]

export default function ExerciseDragSort({ lang, onComplete, pointsEach = 10 }) {
  const [placements, setPlacements] = useState({})
  const [dragId, setDragId] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const pool = EXERCISES.filter(e => !placements[e.id])

  function dropOn(catKey) {
    if (dragId == null || submitted) return
    setPlacements(p => ({ ...p, [dragId]: catKey }))
    setDragId(null)
    sfx.tap()
  }
  function removeFromCat(exId) {
    if (submitted) return
    setPlacements(p => { const n = { ...p }; delete n[exId]; return n })
  }

  function submit() {
    let pts = 0
    EXERCISES.forEach(e => { if (placements[e.id] === e.correct) pts += pointsEach })
    setScore(pts); setSubmitted(true); onComplete?.(pts)
  }

  const allPlaced = Object.keys(placements).length === EXERCISES.length

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        {lang === 'en' ? 'Drag each exercise card into the correct category box below.' : 'Seret setiap kad senaman ke kotak kategori yang betul di bawah.'}
      </p>

      <div className="flex flex-wrap gap-2 mb-5 p-3 rounded-xl min-h-[60px]" style={{ background:'rgba(7,16,32,0.6)', border:'1px dashed rgba(26,58,107,0.6)' }}>
        {pool.length === 0 && <p className="text-xs text-gray-600 m-auto">{lang === 'en' ? 'All cards placed ↓' : 'Semua kad diletakkan ↓'}</p>}
        {pool.map(ex => (
          <div key={ex.id} draggable={!submitted}
            onDragStart={() => setDragId(ex.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl cursor-grab select-none text-sm font-semibold"
            style={{ background:'rgba(10,22,40,0.9)', border:'1px solid rgba(26,58,107,0.7)' }}>
            <span className="text-lg">{ex.icon}</span> {ex.name[lang]}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CATEGORIES.map(cat => {
          const items = EXERCISES.filter(e => placements[e.id] === cat.key)
          return (
            <div key={cat.key}
              onDragOver={e => e.preventDefault()}
              onDrop={() => dropOn(cat.key)}
              className="rounded-xl p-3 min-h-[140px]"
              style={{ background: cat.bg, border: `1.5px dashed ${cat.border}` }}>
              <p className="text-xs font-black uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: cat.color }}>
                {cat.icon} {cat[lang]}
              </p>
              <div className="flex flex-col gap-1.5">
                {items.map(ex => {
                  const isCorrect = submitted ? ex.correct === cat.key : null
                  return (
                    <div key={ex.id} onClick={() => removeFromCat(ex.id)}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                      style={{
                        background: submitted ? (isCorrect ? 'rgba(0,255,136,0.12)' : 'rgba(255,34,68,0.12)') : 'rgba(10,22,40,0.7)',
                        border: `1px solid ${submitted ? (isCorrect ? 'rgba(0,255,136,0.4)' : 'rgba(255,34,68,0.4)') : 'rgba(26,58,107,0.5)'}`,
                      }}>
                      <span>{ex.icon}</span> {ex.name[lang]}
                      {submitted && <span className="ml-auto">{isCorrect ? '✅' : '❌'}</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {pool.length > 0 && (
        <p className="text-xs text-gray-600 mt-3 text-center">
          {lang === 'en' ? '📱 On mobile: tap-and-hold a card, then drag it to a box' : '📱 Di mudah alih: tekan & tahan kad, kemudian seret ke kotak'}
        </p>
      )}

      {!submitted ? (
        <button onClick={submit} disabled={!allPlaced} className="btn-primary w-full mt-4" style={{ opacity: allPlaced ? 1 : 0.5 }}>
          {allPlaced ? (lang === 'en' ? 'Check Answers' : 'Semak Jawapan') : (lang === 'en' ? `Place all ${EXERCISES.length} cards first` : `Letak kesemua ${EXERCISES.length} kad dahulu`)}
        </button>
      ) : (
        <div className="text-center mt-4">
          <p className="text-2xl font-black" style={{ color:'#00FF88' }}>{score} / {EXERCISES.length * pointsEach} pts</p>
        </div>
      )}
    </div>
  )
}
