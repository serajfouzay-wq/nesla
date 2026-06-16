'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/i18n'

const ASSESSMENT_Q = [
  { q: { en: 'Over the last 2 weeks, how often have you felt little interest or pleasure in doing things?', bm: 'Dalam 2 minggu lepas, berapa kerap anda berasa kurang minat atau keseronokan dalam melakukan sesuatu?' } },
  { q: { en: 'How often have you felt down, depressed, or hopeless?', bm: 'Berapa kerap anda berasa murung, tertekan, atau tiada harapan?' } },
  { q: { en: 'How often have you had trouble sleeping or sleeping too much?', bm: 'Berapa kerap anda menghadapi masalah tidur atau tidur terlalu banyak?' } },
  { q: { en: 'How often have you felt tired or had little energy?', bm: 'Berapa kerap anda berasa penat atau kurang tenaga?' } },
  { q: { en: 'How often have you felt nervous, anxious, or on edge?', bm: 'Berapa kerap anda berasa resah, cemas, atau tertekan?' } },
]

const SCALE = [
  { val: 0, en: 'Not at all', bm: 'Langsung tidak' },
  { val: 1, en: 'Several days', bm: 'Beberapa hari' },
  { val: 2, en: 'More than half the days', bm: 'Lebih separuh hari' },
  { val: 3, en: 'Nearly every day', bm: 'Hampir setiap hari' },
]

const WORK_QUIZ = [
  { q: { en: 'Poor mental health at work most commonly leads to:', bm: 'Kesihatan mental yang buruk di tempat kerja paling kerap membawa kepada:' }, opts: { en: ['Higher productivity', 'Presenteeism and reduced concentration', 'Better teamwork', 'Faster decision making'], bm: ['Produktiviti lebih tinggi', 'Presenteeisme dan konsentrasi berkurangan', 'Kerja berpasukan lebih baik', 'Membuat keputusan lebih pantas'] }, ans: 1 },
  { q: { en: 'Which of these is a sign of burnout?', bm: 'Yang manakah merupakan tanda keletihan (burnout)?' }, opts: { en: ['High energy levels', 'Enthusiasm for work', 'Emotional exhaustion and detachment', 'Increased creativity'], bm: ['Tahap tenaga tinggi', 'Semangat terhadap kerja', 'Kelelahan emosi dan penarikan diri', 'Kreativiti meningkat'] }, ans: 2 },
  { q: { en: 'Talking to a colleague about workplace stress is:', bm: 'Berbicara dengan rakan sekerja tentang tekanan kerja adalah:' }, opts: { en: ['A sign of weakness', 'Unprofessional', 'A healthy coping strategy', 'Against company rules'], bm: ['Tanda kelemahan', 'Tidak profesional', 'Strategi mengatasi yang sihat', 'Melanggar peraturan syarikat'] }, ans: 2 },
]

const REFLECTIONS = [
  { key: 'stress_signs', q: { en: 'List 3 signs that tell YOU personally that you are overstressed:', bm: 'Senaraikan 3 tanda yang menunjukkan ANDA SENDIRI sedang terlalu tertekan:' } },
  { key: 'resilience', q: { en: 'Name 2 things you do to build personal resilience:', bm: 'Namakan 2 perkara yang anda lakukan untuk membina ketahanan diri:' } },
  { key: 'coping', q: { en: 'What is your go-to stress coping strategy? Does it work?', bm: 'Apakah strategi mengatasi tekanan utama anda? Adakah ia berkesan?' } },
]

function Assessment({ lang, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)

  function submit() {
    const total = Object.values(answers).reduce((a, b) => a + b, 0)
    let level
    if (total <= 4) level = { en: '🟢 Minimal — you seem to be coping well', bm: '🟢 Minima — anda nampaknya menangani dengan baik' }
    else if (total <= 9) level = { en: '🟡 Mild — consider talking to someone you trust', bm: '🟡 Ringan — pertimbangkan untuk bercakap dengan seseorang yang anda percaya' }
    else if (total <= 14) level = { en: '🟠 Moderate — please speak to HR or a counsellor', bm: '🟠 Sederhana — sila bercakap dengan HR atau kaunselor' }
    else level = { en: '🔴 Severe — please seek professional support urgently', bm: '🔴 Teruk — sila dapatkan sokongan profesional dengan segera' }
    setResult({ total, level }); onComplete(10)
  }

  if (result) return (
    <div className="p-5 bg-white rounded-xl text-center space-y-3">
      <p className="font-bold text-lg">{result.level[lang]}</p>
      <p className="text-sm text-gray-500">{lang === 'en' ? `Total score: ${result.total}/15` : `Jumlah markah: ${result.total}/15`}</p>
      <p className="text-xs text-gray-500">{lang === 'en' ? '* Self-screening tool only, not a clinical diagnosis.' : '* Alat saringan diri sahaja, bukan diagnosis klinikal.'}</p>
    </div>
  )

  return (
    <div className="space-y-5">
      {ASSESSMENT_Q.map((q, i) => (
        <div key={i}>
          <p className="text-sm font-medium mb-3">{i + 1}. {q.q[lang]}</p>
          <div className="grid grid-cols-2 gap-2">
            {SCALE.map(s => (
              <button key={s.val} onClick={() => setAnswers(a => ({ ...a, [i]: s.val }))}
                className={`p-2 rounded-xl border text-xs transition-colors ${answers[i] === s.val ? 'bg-purple-700 border-purple-400 text-white' : 'bg-white border-gray-200 hover:border-purple-500'}`}>
                {s.val} — {lang === 'en' ? s.en : s.bm}
              </button>
            ))}
          </div>
        </div>
      ))}
      {Object.keys(answers).length === ASSESSMENT_Q.length && <button onClick={submit} className="btn-primary w-full">{t(lang, 'submit')}</button>}
    </div>
  )
}

function WorkQuiz({ lang, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const q = WORK_QUIZ[idx]

  function choose(i) { if (selected !== null) return; setSelected(i); if (i === q.ans) setScore(s => s + 10) }
  function next() { if (idx + 1 >= WORK_QUIZ.length) { setDone(true); onComplete(score); return } setIdx(i => i + 1); setSelected(null) }

  if (done) return <div className="text-center py-6 text-green-700 font-black text-2xl">✅ {score} pts</div>

  return (
    <div>
      <div className="flex justify-between mb-3"><span className="text-sm text-gray-500">{idx + 1}/{WORK_QUIZ.length}</span><span className="text-sm font-bold text-nestle-gold">{score} pts</span></div>
      <p className="font-semibold mb-4">{q.q[lang]}</p>
      <div className="flex flex-col gap-3">
        {q.opts[lang].map((opt, i) => {
          let cls = 'p-3 rounded-xl border text-left text-sm transition-all '
          if (selected === null) cls += 'border-gray-200 bg-white hover:border-purple-500 cursor-pointer text-gray-900'
          else if (i === q.ans) cls += 'border-green-500 bg-green-50'
          else if (i === selected) cls += 'border-red-500 bg-red-50'
          else cls += 'border-gray-200 bg-white opacity-50 text-gray-900'
          return <button key={i} className={cls} onClick={() => choose(i)}>{opt}</button>
        })}
      </div>
      {selected !== null && <button onClick={next} className="btn-primary w-full mt-4">{idx + 1 < WORK_QUIZ.length ? t(lang, 'next') : (lang === 'en' ? 'Finish' : 'Tamat')} →</button>}
    </div>
  )
}

function Reflections({ lang, onComplete }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">{lang === 'en' ? 'These are personal reflections — there are no wrong answers.' : 'Ini adalah refleksi peribadi — tiada jawapan salah.'}</p>
      {REFLECTIONS.map(r => (
        <div key={r.key}>
          <p className="text-sm font-medium mb-2">{r.q[lang]}</p>
          <textarea disabled={submitted} className="input resize-none h-20" placeholder={lang === 'en' ? 'Type your reflection…' : 'Taip refleksi anda…'} value={answers[r.key] || ''} onChange={e => setAnswers(a => ({ ...a, [r.key]: e.target.value }))} />
        </div>
      ))}
      {!submitted && Object.keys(answers).length === REFLECTIONS.length && Object.values(answers).every(v => v.trim()) && (
        <button onClick={() => { setSubmitted(true); onComplete(15) }} className="btn-primary w-full">{t(lang, 'submit')}</button>
      )}
      {submitted && <p className="text-green-700 font-bold text-center">{lang === 'en' ? '🧠 Reflections saved. Thank you!' : '🧠 Refleksi disimpan. Terima kasih!'}</p>}
    </div>
  )
}

const TABS = [
  { key: 'assess', en: '📊 Assessment', bm: '📊 Penilaian' },
  { key: 'work', en: '💼 Work Impact Quiz', bm: '💼 Kuiz Impak Kerja' },
  { key: 'reflect', en: '💭 Reflections', bm: '💭 Refleksi' },
]

export default function MentalHealthPage() {
  const { lang } = useApp()
  const [tab, setTab] = useState('assess')
  const [scores, setScores] = useState({})
  function setScore(key, val) { setScores(s => ({ ...s, [key]: val })) }
  const total = Object.values(scores).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-20 pb-12 px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6"><span className="text-3xl">🧠</span><div><h1 className="text-2xl font-black text-gray-900">{t(lang, 'modules.mentalHealth')}</h1><p className="text-sm text-gray-500">{t(lang, 'appTitle')} · Priority 2</p></div></div>
        <div className="flex gap-2 mb-6">
          {TABS.map(tb => <button key={tb.key} onClick={() => setTab(tb.key)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${tab === tb.key ? 'bg-purple-700 text-white' : 'bg-white text-gray-500 hover:text-gray-900'}`}>{tb[lang]}</button>)}
        </div>
        <div className="card">
          {tab === 'assess' && (scores.assess !== undefined ? <div className="text-center py-6 text-green-700 font-black text-2xl">✅ {scores.assess} pts</div> : <Assessment lang={lang} onComplete={v => setScore('assess', v)} />)}
          {tab === 'work' && (scores.work !== undefined ? <div className="text-center py-6 text-green-700 font-black text-2xl">✅ {scores.work} pts</div> : <WorkQuiz lang={lang} onComplete={v => setScore('work', v)} />)}
          {tab === 'reflect' && (scores.reflect !== undefined ? <div className="text-center py-6 text-green-700 font-black text-2xl">✅ {scores.reflect} pts</div> : <Reflections lang={lang} onComplete={v => setScore('reflect', v)} />)}
        </div>
        {total > 0 && <div className="card mt-4"><p className="text-sm text-gray-500">{lang === 'en' ? 'Module total' : 'Jumlah modul'}</p><p className="text-2xl font-black text-nestle-gold">{total} / 65</p><ScoreSubmit moduleSlug="mental-health" score={total} maxScore={65} /></div>}
      </main>
    </div>
  )
}