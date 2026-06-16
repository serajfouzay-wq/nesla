'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/i18n'

const QUIZZES = [
  {
    title: { en: 'Heart Disease Risk Factors', bm: 'Faktor Risiko Penyakit Jantung' },
    questions: [
      { q: { en: 'Which of these is a major risk factor for heart disease?', bm: 'Yang manakah merupakan faktor risiko utama penyakit jantung?' }, opts: { en: ['Regular exercise', 'High blood pressure', 'Eating vegetables', 'Getting enough sleep'], bm: ['Senaman tetap', 'Tekanan darah tinggi', 'Makan sayur', 'Tidur cukup'] }, ans: 1 },
      { q: { en: 'What is a healthy blood pressure reading?', bm: 'Apakah bacaan tekanan darah yang sihat?' }, opts: { en: ['160/100 mmHg', '140/90 mmHg', '120/80 mmHg', '180/110 mmHg'], bm: ['160/100 mmHg', '140/90 mmHg', '120/80 mmHg', '180/110 mmHg'] }, ans: 2 },
      { q: { en: 'How many minutes of moderate exercise per week does WHO recommend for heart health?', bm: 'Berapa minit senaman sederhana seminggu yang disyorkan WHO untuk kesihatan jantung?' }, opts: { en: ['60 minutes', '100 minutes', '150 minutes', '300 minutes'], bm: ['60 minit', '100 minit', '150 minit', '300 minit'] }, ans: 2 },
    ],
  },
  {
    title: { en: 'Cholesterol & Diet', bm: 'Kolesterol & Diet' },
    questions: [
      { q: { en: 'Which type of fat INCREASES bad cholesterol (LDL)?', bm: 'Jenis lemak manakah yang MENINGKATKAN kolesterol buruk (LDL)?' }, opts: { en: ['Unsaturated fat', 'Omega-3', 'Trans fat & saturated fat', 'Monounsaturated fat'], bm: ['Lemak tak tepu', 'Omega-3', 'Lemak trans & tepu', 'Lemak tak tepu tunggal'] }, ans: 2 },
      { q: { en: 'Which food is BEST for heart health?', bm: 'Makanan manakah yang TERBAIK untuk kesihatan jantung?' }, opts: { en: ['Deep-fried chicken', 'Oily fish (salmon, sardine)', 'White bread', 'Sugary drinks'], bm: ['Ayam goreng', 'Ikan berminyak (salmon, sardin)', 'Roti putih', 'Minuman berkanji'] }, ans: 1 },
      { q: { en: 'A healthy waist circumference for men is below:', bm: 'Ukur lilit pinggang yang sihat untuk lelaki ialah di bawah:' }, opts: { en: ['80 cm', '90 cm', '102 cm', '120 cm'], bm: ['80 cm', '90 cm', '102 cm', '120 cm'] }, ans: 2 },
    ],
  },
  {
    title: { en: 'Heart Attack Warning Signs', bm: 'Tanda Amaran Serangan Jantung' },
    questions: [
      { q: { en: 'Which is the MOST classic symptom of a heart attack?', bm: 'Apakah gejala yang PALING klasik untuk serangan jantung?' }, opts: { en: ['Headache', 'Chest pain/pressure spreading to the arm', 'Itchy skin', 'Blurred vision'], bm: ['Sakit kepala', 'Sakit/tekanan dada yang merebak ke lengan', 'Gatal kulit', 'Penglihatan kabur'] }, ans: 1 },
      { q: { en: 'When a heart attack is suspected, you should first:', bm: 'Apabila serangan jantung disyaki, anda perlu dahulu:' }, opts: { en: ['Give water', 'Call 999 immediately', 'Ask them to rest and wait', 'Drive them to hospital yourself'], bm: ['Beri air', 'Hubungi 999 segera', 'Minta mereka berehat dan tunggu', 'Bawa sendiri ke hospital'] }, ans: 1 },
      { q: { en: 'Which lifestyle change has the BIGGEST impact on reducing heart disease risk?', bm: 'Perubahan gaya hidup manakah yang mempunyai KESAN TERBESAR dalam mengurangkan risiko penyakit jantung?' }, opts: { en: ['Taking vitamins', 'Quitting smoking', 'Reducing salt slightly', 'Drinking more water'], bm: ['Ambil vitamin', 'Berhenti merokok', 'Kurangkan sedikit garam', 'Minum lebih air'] }, ans: 1 },
    ],
  },
]

function HeartRateCalc({ lang, onComplete }) {
  const [age, setAge] = useState('')
  const [result, setResult] = useState(null)

  function calculate() {
    const a = parseInt(age)
    if (!a || a < 1 || a > 120) return
    const maxHr = 220 - a
    const zones = {
      warmup: [Math.round(maxHr * 0.5), Math.round(maxHr * 0.6)],
      fatBurn: [Math.round(maxHr * 0.6), Math.round(maxHr * 0.7)],
      cardio: [Math.round(maxHr * 0.7), Math.round(maxHr * 0.85)],
      peak: [Math.round(maxHr * 0.85), maxHr],
    }
    setResult({ maxHr, zones }); onComplete(15)
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{lang === 'en' ? 'Formula: Max HR = 220 − Age' : 'Formula: HR Maks = 220 − Umur'}</p>
      <div className="flex gap-3 mb-4">
        <input className="input flex-1" type="number" placeholder={t(lang, 'heartHealth.age')} value={age} onChange={e => setAge(e.target.value)} />
        <button onClick={calculate} className="btn-primary px-6">{lang === 'en' ? 'Calculate' : 'Kira'}</button>
      </div>
      {result && (
        <div className="space-y-3">
          <div className="p-4 bg-red-900/30 border border-red-700 rounded-xl text-center">
            <p className="text-sm text-gray-500">{t(lang, 'heartHealth.maxHrResult')}</p>
            <p className="text-4xl font-black text-red-400">{result.maxHr} <span className="text-lg font-normal">{t(lang, 'heartHealth.bpm')}</span></p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { label: lang === 'en' ? '🔵 Warm-up (50–60%)' : '🔵 Pemanasan (50–60%)', range: result.zones.warmup },
              { label: lang === 'en' ? '🟢 Fat Burn (60–70%)' : '🟢 Bakar Lemak (60–70%)', range: result.zones.fatBurn },
              { label: lang === 'en' ? '🟡 Cardio (70–85%)' : '🟡 Kardio (70–85%)', range: result.zones.cardio },
              { label: lang === 'en' ? '🔴 Peak (85–100%)' : '🔴 Puncak (85–100%)', range: result.zones.peak },
            ].map(z => (
              <div key={z.label} className="bg-gray-800 border border-gray-700 rounded-xl p-3">
                <p className="font-semibold mb-1">{z.label}</p>
                <p className="text-gray-700 font-bold">{z.range[0]}–{z.range[1]} bpm</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function QuizSet({ lang, quiz, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const q = quiz.questions[idx]

  function choose(i) { if (selected !== null) return; setSelected(i); if (i === q.ans) setScore(s => s + 10) }
  function next() { if (idx + 1 >= quiz.questions.length) { setDone(true); onComplete(score); return } setIdx(i => i + 1); setSelected(null) }

  if (done) return <div className="text-center py-6 text-green-400 font-black text-2xl">✅ {score} pts</div>
  return (
    <div>
      <div className="flex justify-between mb-3"><span className="text-sm text-gray-500">{idx + 1}/{quiz.questions.length}</span><span className="text-sm font-bold text-nestle-gold">{score} pts</span></div>
      <p className="font-semibold mb-4">{q.q[lang]}</p>
      <div className="flex flex-col gap-3">
        {q.opts[lang].map((opt, i) => {
          let cls = 'p-3 rounded-xl border text-left text-sm transition-all '
          if (selected === null) cls += 'border-gray-700 bg-gray-800 hover:border-pink-500 cursor-pointer'
          else if (i === q.ans) cls += 'border-green-500 bg-green-900/40'
          else if (i === selected) cls += 'border-red-500 bg-red-900/40'
          else cls += 'border-gray-700 bg-gray-800 opacity-50'
          return <button key={i} className={cls} onClick={() => choose(i)}>{opt}</button>
        })}
      </div>
      {selected !== null && <button onClick={next} className="btn-primary w-full mt-4">{idx + 1 < quiz.questions.length ? t(lang, 'next') : (lang === 'en' ? 'Finish' : 'Tamat')} →</button>}
    </div>
  )
}

export default function HeartHealthPage() {
  const { lang } = useApp()
  const [tab, setTab] = useState('q0')
  const [scores, setScores] = useState({})
  function setScore(key, val) { setScores(s => ({ ...s, [key]: val })) }
  const total = Object.values(scores).reduce((a, b) => a + b, 0)
  const max = QUIZZES.reduce((a, q) => a + q.questions.length * 10, 0) + 15
  const tabs = [...QUIZZES.map((q, i) => ({ key: `q${i}`, label: q.title[lang] })), { key: 'hr', label: lang === 'en' ? '❤️ Max Heart Rate' : '❤️ HR Maks' }]

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-20 pb-12 px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6"><span className="text-3xl">❤️</span><div><h1 className="text-2xl font-black">{t(lang, 'modules.heartHealth')}</h1><p className="text-sm text-gray-500">{t(lang, 'appTitle')} · Priority 2</p></div></div>
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(tb => <button key={tb.key} onClick={() => setTab(tb.key)} className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${tab === tb.key ? 'bg-pink-700 text-gray-900' : 'bg-gray-800 text-gray-500 hover:text-gray-900'}`}>{tb.label}</button>)}
        </div>
        <div className="card">
          {QUIZZES.map((quiz, i) => tab === `q${i}` && (
            scores[`q${i}`] !== undefined
              ? <div key={i} className="text-center py-6 text-green-400 font-black text-2xl">✅ {scores[`q${i}`]} pts</div>
              : <QuizSet key={i} lang={lang} quiz={quiz} onComplete={v => setScore(`q${i}`, v)} />
          ))}
          {tab === 'hr' && (scores.hr !== undefined ? <div className="text-center py-6 text-green-400 font-black text-2xl">✅ {scores.hr} pts</div> : <HeartRateCalc lang={lang} onComplete={v => setScore('hr', v)} />)}
        </div>
        {total > 0 && <div className="card mt-4"><p className="text-sm text-gray-500">{lang === 'en' ? 'Module total' : 'Jumlah modul'}</p><p className="text-2xl font-black text-nestle-gold">{total} / {max}</p><ScoreSubmit moduleSlug="heart-health" score={total} maxScore={max} /></div>}
      </main>
    </div>
  )
}