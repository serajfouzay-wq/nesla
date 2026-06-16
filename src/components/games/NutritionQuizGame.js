'use client'
import { useState } from 'react'

const QUIZ = [
  { q: { en: 'How many cups of water should you drink daily?', bm: 'Berapa cawan air patut diminum setiap hari?' }, opts: { en: ['2-3 cups', '6-8 cups', '15 cups', '1 cup'], bm: ['2-3 cawan', '6-8 cawan', '15 cawan', '1 cawan'] }, ans: 1 },
  { q: { en: 'Which has more fiber?', bm: 'Mana lebih berfiber?' }, opts: { en: ['White rice', 'Brown rice', 'Instant noodles', 'White bread'], bm: ['Nasi putih', 'Nasi perang', 'Mee segera', 'Roti putih'] }, ans: 1 },
  { q: { en: 'What does "Suku Suku Separuh" recommend for half the plate?', bm: 'Apa cadangan "Suku Suku Separuh" untuk separuh pinggan?' }, opts: { en: ['Rice', 'Meat', 'Vegetables & fruit', 'Sugar'], bm: ['Nasi', 'Daging', 'Sayur & buah', 'Gula'] }, ans: 2 },
  { q: { en: 'How much added sugar is recommended per day (WHO)?', bm: 'Berapa gula tambahan disyorkan sehari (WHO)?' }, opts: { en: ['Under 25g', 'Under 100g', 'No limit', '200g'], bm: ['Bawah 25g', 'Bawah 100g', 'Tiada had', '200g'] }, ans: 0 },
  { q: { en: 'Which cooking method is healthiest?', bm: 'Kaedah memasak mana paling sihat?' }, opts: { en: ['Deep frying', 'Steaming', 'Char-grilling till black', 'Double frying'], bm: ['Goreng celup', 'Kukus', 'Bakar sampai hitam', 'Goreng dua kali'] }, ans: 1 },
]

export default function NutritionQuizGame({ lang, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const q = QUIZ[idx]

  function choose(i) {
    if (selected !== null) return
    setSelected(i)
    if (i === q.ans) setScore(s => s + 8)
  }
  function next() {
    if (idx + 1 >= QUIZ.length) { setDone(true); onComplete?.(score); return }
    setIdx(i => i + 1); setSelected(null)
  }

  if (done) return <div className="text-center py-8"><div className="text-6xl mb-4">🏆</div><p className="text-3xl font-black text-nestle-gold">{score} / {QUIZ.length * 8}</p></div>

  return (
    <div>
      <div className="flex justify-between mb-4"><span className="text-sm text-gray-500">{idx+1}/{QUIZ.length}</span><span className="text-sm font-bold text-nestle-gold">{score} pts</span></div>
      <p className="font-semibold mb-4 text-gray-900">{q.q[lang]}</p>
      <div className="flex flex-col gap-2">
        {q.opts[lang].map((opt, i) => {
          let cls = 'quiz-option '
          if (selected !== null) {
            if (i === q.ans) cls += 'correct'
            else if (i === selected) cls += 'wrong'
            else cls += 'dim'
          }
          return <button key={i} className={cls} onClick={() => choose(i)}>{opt}</button>
        })}
      </div>
      {selected !== null && (
        <button onClick={next} className="btn-primary mt-4 w-full">{idx+1 < QUIZ.length ? (lang==='en'?'Next':'Seterusnya') : (lang==='en'?'See Results':'Lihat Keputusan')} →</button>
      )}
    </div>
  )
}
