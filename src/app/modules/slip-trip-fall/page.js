'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/i18n'

const HAZARDS = [
  { id: 1, x: 15, y: 60, label: { en: 'Wet floor — no warning sign', bm: 'Lantai basah — tiada tanda amaran' } },
  { id: 2, x: 40, y: 45, label: { en: 'Cable crossing walkway', bm: 'Kabel merentasi laluan jalan' } },
  { id: 3, x: 65, y: 30, label: { en: 'Box left on stairs', bm: 'Kotak ditinggal di tangga' } },
  { id: 4, x: 80, y: 70, label: { en: 'Broken floor tile', bm: 'Jubin lantai rosak' } },
  { id: 5, x: 30, y: 20, label: { en: 'Unsecured ladder', bm: 'Tangga tidak selamat' } },
]

const CARD_ITEMS = [
  { id: 1, text: { en: 'Wet floor', bm: 'Lantai basah' }, category: 'hazard' },
  { id: 2, text: { en: 'Slip and fall injury', bm: 'Kecederaan gelincir dan jatuh' }, category: 'risk' },
  { id: 3, text: { en: 'Place wet floor sign', bm: 'Letak tanda lantai basah' }, category: 'control' },
  { id: 4, text: { en: 'Loose cable on floor', bm: 'Kabel longgar di lantai' }, category: 'hazard' },
  { id: 5, text: { en: 'Tripping and breaking a limb', bm: 'Tersandung dan patah anggota' }, category: 'risk' },
  { id: 6, text: { en: 'Use cable tray or tape down cables', bm: 'Gunakan dulang kabel atau rekatlah kabel' }, category: 'control' },
  { id: 7, text: { en: 'Broken step on staircase', bm: 'Anak tangga rosak' }, category: 'hazard' },
  { id: 8, text: { en: 'Fall from height', bm: 'Jatuh dari ketinggian' }, category: 'risk' },
  { id: 9, text: { en: 'Report and barricade the area immediately', bm: 'Laporkan dan sekatlah kawasan itu segera' }, category: 'control' },
]

const QUIZ_STF = [
  { q: { en: 'What is the FIRST thing to do when you notice a spill on the floor?', bm: 'Apakah PERKARA PERTAMA yang perlu dilakukan apabila anda nampak tumpahan di lantai?' }, opts: { en: ['Walk around it', 'Report it to supervisor only', 'Place a warning sign and clean it up', 'Ignore it'], bm: ['Pusing sekeliling', 'Laporkan kepada penyelia sahaja', 'Letak tanda amaran dan bersihkan', 'Abaikan'] }, ans: 2 },
  { q: { en: 'Which footwear is BEST for preventing slips in a warehouse environment?', bm: 'Kasut manakah yang TERBAIK untuk mencegah gelinciran dalam persekitaran gudang?' }, opts: { en: ['Sandals', 'Non-slip safety shoes', 'Running shoes', 'Bare feet'], bm: ['Sandal', 'Kasut keselamatan anti-gelincir', 'Kasut larian', 'Berkaki ayam'] }, ans: 1 },
  { q: { en: 'Good housekeeping reduces slip/trip/fall incidents because:', bm: 'Kebersihan yang baik mengurangkan insiden gelincir/tersandung/jatuh kerana:' }, opts: { en: ['It makes the area look nice', 'It removes hazards such as clutter and spills from walkways', 'It impresses visitors', 'It has nothing to do with safety'], bm: ['Ia menjadikan kawasan kelihatan cantik', 'Ia menghapuskan bahaya seperti kekusutan dan tumpahan dari laluan', 'Ia mengesankan pelawat', 'Ia tiada kaitan dengan keselamatan'] }, ans: 1 },
  { q: { en: 'When carrying a heavy box, which action reduces fall risk most?', bm: 'Semasa membawa kotak berat, tindakan manakah yang paling mengurangkan risiko jatuh?' }, opts: { en: ['Hold it above your head', 'Ensure you can see where you are walking', 'Walk as fast as possible', 'Use only one hand'], bm: ['Pegang di atas kepala', 'Pastikan anda boleh melihat ke mana anda berjalan', 'Berjalan sepatutnya pantas', 'Gunakan satu tangan sahaja'] }, ans: 1 },
]

function SpotHazard({ lang, onComplete }) {
  const [found, setFound] = useState([])
  const [clicks, setClicks] = useState([])
  const [done, setDone] = useState(false)

  function handleClick(e) {
    if (done) return
    const rect = e.currentTarget.getBoundingClientRect()
    const px = ((e.clientX - rect.left) / rect.width) * 100
    const py = ((e.clientY - rect.top) / rect.height) * 100
    const hit = HAZARDS.find(h => !found.includes(h.id) && Math.abs(h.x - px) < 8 && Math.abs(h.y - py) < 8)
    if (hit) {
      const newFound = [...found, hit.id]
      setFound(newFound)
      if (newFound.length === HAZARDS.length) { setDone(true); onComplete(newFound.length * 5) }
    } else {
      const id = Date.now()
      setClicks(c => [...c, { x: px, y: py, id }])
      setTimeout(() => setClicks(c => c.filter(cl => cl.id !== id)), 1000)
    }
  }

  return (
    <div>
      <p className="text-sm text-gray-400 mb-3">{t(lang, 'slipTripFall.spotInstruction')}</p>
      <div className="relative bg-gray-700 rounded-xl overflow-hidden cursor-crosshair" style={{ aspectRatio: '16/9' }} onClick={handleClick}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center"><p className="text-4xl mb-2">🏢</p><p className="text-gray-400 text-sm">{lang === 'en' ? 'Office / Outlet Image' : 'Gambar Pejabat / Outlet'}</p><p className="text-xs text-yellow-400 mt-1">{lang === 'en' ? 'Upload office photo here' : 'Muat naik gambar pejabat di sini'}</p></div>
        </div>
        {HAZARDS.map(h => (
          <div key={h.id} className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${found.includes(h.id) ? 'bg-green-500 border-green-300 text-white opacity-100' : 'bg-red-500/20 border-red-400 text-red-400 opacity-30 hover:opacity-80'}`} style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translate(-50%,-50%)' }}>
            {found.includes(h.id) ? '✓' : '?'}
          </div>
        ))}
        {clicks.map(cl => <div key={cl.id} className="absolute w-6 h-6 rounded-full bg-gray-500/50 border border-gray-400 animate-ping" style={{ left: `${cl.x}%`, top: `${cl.y}%`, transform: 'translate(-50%,-50%)' }} />)}
      </div>
      <p className="text-sm mt-3 text-gray-400">{t(lang, 'slipTripFall.hazardsFound')}: <span className="text-green-400 font-bold">{found.length}</span> / {HAZARDS.length}</p>
      {found.length > 0 && <div className="mt-3 flex flex-col gap-2">{HAZARDS.filter(h => found.includes(h.id)).map(h => <div key={h.id} className="flex items-center gap-2 text-sm text-green-400"><span>✅</span> {h.label[lang]}</div>)}</div>}
      {done && <div className="mt-4 p-4 bg-green-900/30 border border-green-700 rounded-xl text-center"><p className="text-green-400 font-bold">{lang === 'en' ? '🎉 All hazards found!' : '🎉 Semua bahaya dijumpai!'}</p></div>}
    </div>
  )
}

function CardSort({ lang, onComplete }) {
  const [assignments, setAssignments] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const catLabels = { hazard: { en: 'Hazard', bm: 'Bahaya' }, risk: { en: 'Risk', bm: 'Risiko' }, control: { en: 'Control', bm: 'Kawalan' } }

  function submit() {
    let correct = 0
    CARD_ITEMS.forEach(c => { if (assignments[c.id] === c.category) correct++ })
    setSubmitted(true); onComplete(correct * 5)
  }

  return (
    <div>
      <p className="text-sm text-gray-400 mb-4">{t(lang, 'slipTripFall.cardInstruction')}</p>
      <div className="flex flex-col gap-3">
        {CARD_ITEMS.map(card => (
          <div key={card.id} className={`p-3 rounded-xl border ${submitted ? assignments[card.id] === card.category ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20' : 'border-gray-700 bg-gray-800'}`}>
            <p className="text-sm font-medium mb-2">{card.text[lang]}</p>
            <div className="flex gap-2 flex-wrap">
              {['hazard', 'risk', 'control'].map(cat => (
                <button key={cat} disabled={submitted} onClick={() => setAssignments(a => ({ ...a, [card.id]: cat }))}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${assignments[card.id] === cat ? 'bg-blue-600 border-blue-400 text-white' : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-blue-500'}`}>
                  {catLabels[cat][lang]}
                </button>
              ))}
            </div>
            {submitted && assignments[card.id] !== card.category && <p className="text-xs text-red-400 mt-1">✗ {lang === 'en' ? `Correct: ${catLabels[card.category].en}` : `Betul: ${catLabels[card.category].bm}`}</p>}
          </div>
        ))}
      </div>
      {!submitted && Object.keys(assignments).length === CARD_ITEMS.length && <button onClick={submit} className="btn-primary w-full mt-4">{t(lang, 'submit')}</button>}
    </div>
  )
}

function QuizSTF({ lang, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const q = QUIZ_STF[idx]

  function choose(i) { if (selected !== null) return; setSelected(i); if (i === q.ans) setScore(s => s + 10) }
  function next() { if (idx + 1 >= QUIZ_STF.length) { setDone(true); onComplete(score); return } setIdx(i => i + 1); setSelected(null) }

  if (done) return <div className="text-center py-6"><p className="text-3xl font-black text-nestle-gold">{score} / {QUIZ_STF.length * 10}</p></div>

  return (
    <div>
      <div className="flex justify-between mb-4"><span className="text-sm text-gray-400">{idx + 1}/{QUIZ_STF.length}</span><span className="text-sm font-bold text-nestle-gold">{score} pts</span></div>
      <p className="font-semibold mb-4">{q.q[lang]}</p>
      <div className="flex flex-col gap-3">
        {q.opts[lang].map((opt, i) => {
          let cls = 'p-3 rounded-xl border text-left text-sm transition-all '
          if (selected === null) cls += 'border-gray-700 bg-gray-800 hover:border-blue-500 cursor-pointer'
          else if (i === q.ans) cls += 'border-green-500 bg-green-900/40'
          else if (i === selected) cls += 'border-red-500 bg-red-900/40'
          else cls += 'border-gray-700 bg-gray-800 opacity-50'
          return <button key={i} className={cls} onClick={() => choose(i)}>{opt}</button>
        })}
      </div>
      {selected !== null && <button onClick={next} className="btn-primary w-full mt-4">{idx + 1 < QUIZ_STF.length ? t(lang, 'next') : (lang === 'en' ? 'Finish' : 'Tamat')} →</button>}
    </div>
  )
}

const TABS = [{ key: 'spot', en: '🔍 Spot Hazard', bm: '🔍 Kesan Bahaya' }, { key: 'quiz', en: '📋 Quiz', bm: '📋 Kuiz' }, { key: 'cards', en: '🃏 Card Sort', bm: '🃏 Susun Kad' }]

export default function SlipTripFallPage() {
  const { lang } = useApp()
  const [tab, setTab] = useState('spot')
  const [spotScore, setSpotScore] = useState(null)
  const [quizScore, setQuizScore] = useState(null)
  const [cardScore, setCardScore] = useState(null)
  const total = (spotScore ?? 0) + (quizScore ?? 0) + (cardScore ?? 0)
  const max = HAZARDS.length * 5 + QUIZ_STF.length * 10 + CARD_ITEMS.length * 5

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-20 pb-12 px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6"><span className="text-3xl">⚠️</span><div><h1 className="text-2xl font-black">{t(lang, 'modules.slipTripFall')}</h1><p className="text-sm text-gray-400">{t(lang, 'appTitle')} · Priority 1</p></div></div>
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {TABS.map(tb => <button key={tb.key} onClick={() => setTab(tb.key)} className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === tb.key ? 'bg-orange-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>{tb[lang]}</button>)}
        </div>
        <div className="card">
          {tab === 'spot' && (spotScore !== null ? <div className="text-center py-6"><p className="text-2xl font-black text-green-400">✅ {spotScore} pts</p></div> : <SpotHazard lang={lang} onComplete={setSpotScore} />)}
          {tab === 'quiz' && (quizScore !== null ? <div className="text-center py-6"><p className="text-2xl font-black text-green-400">✅ {quizScore} pts</p></div> : <QuizSTF lang={lang} onComplete={setQuizScore} />)}
          {tab === 'cards' && (cardScore !== null ? <div className="text-center py-6"><p className="text-2xl font-black text-green-400">✅ {cardScore} pts</p></div> : <CardSort lang={lang} onComplete={setCardScore} />)}
        </div>
        {total > 0 && <div className="card mt-4"><p className="text-sm text-gray-400">{lang === 'en' ? 'Module total' : 'Jumlah modul'}</p><p className="text-2xl font-black text-nestle-gold">{total} / {max}</p><ScoreSubmit moduleSlug="slip-trip-fall" score={total} maxScore={max} /></div>}
      </main>
    </div>
  )
}