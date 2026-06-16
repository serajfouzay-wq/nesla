'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/i18n'

const PASS = [
  { letter: 'P', en: 'Pull the pin', bm: 'Tarik pin' },
  { letter: 'A', en: 'Aim at the base of the fire', bm: 'Halakan ke pangkal api' },
  { letter: 'S', en: 'Squeeze the handle', bm: 'Picit pemegang' },
  { letter: 'S', en: 'Sweep side to side', bm: 'Sapu dari sisi ke sisi' },
]

const SEQUENCE_STEPS = [
  { id: 1, en: 'Attempt to extinguish (only if safe)', bm: 'Cuba padamkan api (hanya jika selamat)' },
  { id: 2, en: 'Press the fire alarm', bm: 'Tekan penggera kebakaran' },
  { id: 3, en: 'Evacuate to assembly point', bm: 'Berpindah ke titik perhimpunan' },
  { id: 4, en: 'Call 999', bm: 'Hubungi 999' },
  { id: 5, en: 'Conduct roll call', bm: 'Jalankan panggilan gilir' },
]

const QUIZ_FIRE = [
  { q: { en: "What does the 'P' in PASS stand for?", bm: "Apakah maksud 'P' dalam PASS?" }, opts: { en: ['Press the nozzle', 'Pull the pin', 'Point at flames', 'Push forward'], bm: ['Tekan muncung', 'Tarik pin', 'Halakan ke nyalaan', 'Tolak ke hadapan'] }, ans: 1 },
  { q: { en: 'Where should you aim the extinguisher?', bm: 'Ke mana anda patut menghalaukan pemadam?' }, opts: { en: ['At the flames', 'At the base of the fire', 'At the smoke', 'Anywhere'], bm: ['Ke arah nyalaan', 'Ke pangkal api', 'Ke arah asap', 'Di mana-mana'] }, ans: 1 },
  { q: { en: 'After pressing the fire alarm, your next step is:', bm: 'Selepas menekan penggera kebakaran, langkah seterusnya anda ialah:' }, opts: { en: ['Call 999 immediately', 'Evacuate to the assembly point', 'Look for the fire', 'Wait for instructions'], bm: ['Hubungi 999 segera', 'Berpindah ke titik perhimpunan', 'Cari sumber kebakaran', 'Tunggu arahan'] }, ans: 1 },
  { q: { en: 'When should you NOT try to fight a fire?', bm: 'Bilakah anda TIDAK patut cuba memadam api?' }, opts: { en: ['When you have an extinguisher', 'When fire is small', 'When fire is large or spreading, or you lack training', 'When there are sprinklers'], bm: ['Apabila anda ada pemadam', 'Apabila api kecil', 'Apabila api besar atau merebak, atau anda tiada latihan', 'Apabila ada sprinkler'] }, ans: 2 },
]

function PASSQuiz({ lang, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const q = QUIZ_FIRE[idx]

  function choose(i) { if (selected !== null) return; setSelected(i); if (i === q.ans) setScore(s => s + 10) }
  function next() {
    if (idx + 1 >= QUIZ_FIRE.length) { setDone(true); onComplete(score); return }
    setIdx(i => i + 1); setSelected(null)
  }

  if (done) return <div className="text-center py-6"><p className="text-3xl font-black text-nestle-gold">{score} / {QUIZ_FIRE.length * 10}</p></div>

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 mb-6">
        {PASS.map((p, i) => (
          <div key={i} className="bg-red-50 border border-red-700 rounded-xl p-3 text-center">
            <div className="text-3xl font-black text-nestle-red">{p.letter}</div>
            <div className="text-xs mt-1 text-gray-700">{lang === 'en' ? p.en : p.bm}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mb-3"><span className="text-sm text-gray-500">{idx + 1}/{QUIZ_FIRE.length}</span><span className="text-sm font-bold text-nestle-gold">{score} pts</span></div>
      <p className="font-semibold mb-4">{q.q[lang]}</p>
      <div className="flex flex-col gap-3">
        {q.opts[lang].map((opt, i) => {
          let cls = 'p-3 rounded-xl border text-left text-sm transition-all '
          if (selected === null) cls += 'border-gray-200 bg-white hover:border-red-500 cursor-pointer text-gray-900'
          else if (i === q.ans) cls += 'border-green-500 bg-green-50'
          else if (i === selected) cls += 'border-red-500 bg-red-50'
          else cls += 'border-gray-200 bg-white opacity-50 text-gray-900'
          return <button key={i} className={cls} onClick={() => choose(i)}>{opt}</button>
        })}
      </div>
      {selected !== null && <button onClick={next} className="btn-primary w-full mt-4">{idx + 1 < QUIZ_FIRE.length ? t(lang, 'next') : (lang === 'en' ? 'Finish' : 'Tamat')} →</button>}
    </div>
  )
}

function SequenceGame({ lang, onComplete }) {
  const [items, setItems] = useState(() => [...SEQUENCE_STEPS].sort(() => Math.random() - 0.5))
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
    items.forEach((item, i) => { if (item.id === SEQUENCE_STEPS[i].id) correct++ })
    const pts = correct * 10; setScore(pts); setSubmitted(true); onComplete(pts)
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{t(lang, 'fireEmergency.sequenceInstruction')}</p>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={item.id} draggable onDragStart={() => setDragging(i)} onDragOver={e => e.preventDefault()} onDrop={() => onDrop(i)}
            className={`flex items-center gap-3 p-4 rounded-xl border cursor-grab transition-colors ${submitted ? item.id === SEQUENCE_STEPS[i].id ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20' : 'border-gray-200 bg-white hover:border-orange-500'}`}>
            <span className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span>
            <span className="text-sm">{lang === 'en' ? item.en : item.bm}</span>
            {submitted && item.id !== SEQUENCE_STEPS[i].id && <span className="ml-auto text-xs text-gray-500">({lang === 'en' ? `Should be #${SEQUENCE_STEPS.findIndex(s => s.id === item.id) + 1}` : `Patut #${SEQUENCE_STEPS.findIndex(s => s.id === item.id) + 1}`})</span>}
          </div>
        ))}
      </div>
      {!submitted && <button onClick={submit} className="btn-primary w-full mt-4">{t(lang, 'submit')}</button>}
      {submitted && <div className="mt-4 p-4 bg-white rounded-xl text-center"><p className="font-bold text-nestle-gold">{score} / {SEQUENCE_STEPS.length * 10} pts</p></div>}
    </div>
  )
}

const TABS = [{ key: 'pass', en: '🧯 PASS Quiz', bm: '🧯 Kuiz PASS' }, { key: 'seq', en: '📋 Response Sequence', bm: '📋 Urutan Tindak Balas' }]

export default function FireEmergencyPage() {
  const { lang } = useApp()
  const [tab, setTab] = useState('pass')
  const [passScore, setPassScore] = useState(null)
  const [seqScore, setSeqScore] = useState(null)
  const total = (passScore ?? 0) + (seqScore ?? 0)
  const max = QUIZ_FIRE.length * 10 + SEQUENCE_STEPS.length * 10

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-20 pb-12 px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6"><span className="text-3xl">🔥</span><div><h1 className="text-2xl font-black text-gray-900">{t(lang, 'modules.fireEmergency')}</h1><p className="text-sm text-gray-500">{t(lang, 'appTitle')} · Priority 2</p></div></div>
        <div className="flex gap-2 mb-6">
          {TABS.map(tb => <button key={tb.key} onClick={() => setTab(tb.key)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === tb.key ? 'bg-red-700 text-white' : 'bg-white text-gray-500 hover:text-gray-900'}`}>{tb[lang]}</button>)}
        </div>
        <div className="card">
          {tab === 'pass' && (passScore !== null ? <div className="text-center py-6 text-green-700 font-black text-2xl">✅ {passScore} pts</div> : <PASSQuiz lang={lang} onComplete={setPassScore} />)}
          {tab === 'seq' && (seqScore !== null ? <div className="text-center py-6 text-green-700 font-black text-2xl">✅ {seqScore} pts</div> : <SequenceGame lang={lang} onComplete={setSeqScore} />)}
        </div>
        {total > 0 && <div className="card mt-4"><p className="text-sm text-gray-500">{lang === 'en' ? 'Module total' : 'Jumlah modul'}</p><p className="text-2xl font-black text-nestle-gold">{total} / {max}</p><ScoreSubmit moduleSlug="fire-emergency" score={total} maxScore={max} /></div>}
      </main>
    </div>
  )
}