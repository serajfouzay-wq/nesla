'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import HazardVideoScene from '@/components/games/HazardVideoScene'
import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/i18n'

const QUIZ = [
  { q: { en: 'What is the recommended following distance in normal conditions?', bm: 'Apakah jarak mengikut yang disyorkan dalam keadaan normal?' }, opts: { en: ['1 second', '2 seconds', '3 seconds', '5 seconds'], bm: ['1 saat', '2 saat', '3 saat', '5 saat'] }, ans: 2, ex: { en: 'The 3-second rule gives you time to react and brake safely.', bm: 'Kaedah 3 saat memberi anda masa untuk bertindak balas dan brek dengan selamat.' } },
  { q: { en: 'At what speed does stopping distance roughly double compared to 50 km/h?', bm: 'Pada kelajuan berapa jarak berhenti berganda berbanding 50 km/j?' }, opts: { en: ['60 km/h', '70 km/h', '80 km/h', '100 km/h'], bm: ['60 km/j', '70 km/j', '80 km/j', '100 km/j'] }, ans: 2, ex: { en: 'At 80 km/h, stopping distance is roughly double that at 50 km/h due to kinetic energy.', bm: 'Pada 80 km/j, jarak berhenti adalah kira-kira dua kali ganda berbanding 50 km/j akibat tenaga kinetik.' } },
  { q: { en: 'Which sign indicates that fatigue may be affecting your driving?', bm: 'Tanda mana yang menunjukkan keletihan mungkin mempengaruhi pemanduan anda?' }, opts: { en: ['Sweating heavily', 'Missing road signs or exits', 'Driving faster than usual', 'Increased focus'], bm: ['Berpeluh banyak', 'Terlepas tanda jalan atau keluar', 'Memandu lebih laju dari biasa', 'Tumpuan meningkat'] }, ans: 1, ex: { en: 'Missing exits or signs is a classic sign of driver fatigue.', bm: 'Terlepas keluar atau tanda jalan adalah tanda klasik keletihan pemandu.' } },
  { q: { en: 'What should you do if you feel drowsy while driving?', bm: 'Apa yang patut anda lakukan jika mengantuk semasa memandu?' }, opts: { en: ['Open the window', 'Turn up music', 'Pull over and rest', 'Drink coffee and continue'], bm: ['Buka tingkap', 'Naikkan muzik', 'Berhenti dan berehat', 'Minum kopi dan teruskan'] }, ans: 2, ex: { en: 'Only pulling over and resting is genuinely safe.', bm: 'Hanya berhenti dan berehat adalah selamat sepenuhnya.' } },
  { q: { en: 'Using a handheld phone while driving increases crash risk by approximately:', bm: 'Menggunakan telefon bimbit semasa memandu meningkatkan risiko kemalangan sebanyak kira-kira:' }, opts: { en: ['2×', '3×', '4×', '6×'], bm: ['2 kali', '3 kali', '4 kali', '6 kali'] }, ans: 2, ex: { en: 'Research shows handheld phone use multiplies crash risk approximately 4 times.', bm: 'Penyelidikan menunjukkan penggunaan telefon bimbit melipatgandakan risiko kemalangan kira-kira 4 kali.' } },
  { q: { en: 'What does defensive driving primarily mean?', bm: 'Apakah maksud utama pemanduan defensif?' }, opts: { en: ['Driving slowly at all times', 'Anticipating and reacting to other road users', 'Staying in the left lane only', 'Avoiding highways'], bm: ['Memandu perlahan setiap masa', 'Menjangka dan bertindak balas terhadap pengguna jalan lain', 'Kekal di lorong kiri sahaja', 'Elakkan lebuh raya'] }, ans: 1, ex: { en: 'Defensive driving is about awareness and proactive response to potential hazards.', bm: 'Pemanduan defensif adalah tentang kesedaran dan tindak balas proaktif terhadap bahaya berpotensi.' } },
  { q: { en: 'Heavy rain reduces visibility. You should:', bm: 'Hujan lebat mengurangkan penglihatan. Anda patut:' }, opts: { en: ['Speed up to get through faster', 'Turn on hazard lights and maintain speed', 'Reduce speed and increase following distance', 'Stop immediately in the middle lane'], bm: ['Percepatkan untuk habis lebih cepat', 'Hidupkan lampu amaran dan kekalkan kelajuan', 'Kurangkan kelajuan dan tambah jarak', 'Berhenti segera di lorong tengah'] }, ans: 2, ex: { en: 'Reduced speed + increased following distance is the correct response in heavy rain.', bm: 'Kurangkan kelajuan + tambah jarak adalah tindak balas yang betul dalam hujan lebat.' } },
  { q: { en: 'The legal blood-alcohol limit for driving in Malaysia is:', bm: 'Had alkohol dalam darah yang sah untuk memandu di Malaysia ialah:' }, opts: { en: ['0.05 g/100ml', '0.08 g/100ml', '0.10 g/100ml', '0.00 g/100ml'], bm: ['0.05 g/100ml', '0.08 g/100ml', '0.10 g/100ml', '0.00 g/100ml'] }, ans: 1, ex: { en: "Malaysia's legal limit is 0.08 g/100ml.", bm: 'Had undang-undang Malaysia ialah 0.08 g/100ml.' } },
  { q: { en: 'Which factor does NOT significantly affect stopping distance?', bm: 'Faktor mana yang TIDAK mempengaruhi jarak berhenti dengan ketara?' }, opts: { en: ['Road surface condition', 'Vehicle colour', 'Tyre condition', 'Driver reaction time'], bm: ['Keadaan permukaan jalan', 'Warna kenderaan', 'Keadaan tayar', 'Masa tindak balas pemandu'] }, ans: 1, ex: { en: 'Vehicle colour has no effect on stopping distance.', bm: 'Warna kenderaan tidak mempengaruhi jarak berhenti.' } },
  { q: { en: 'You receive an urgent delivery that requires exceeding the speed limit. You should:', bm: 'Anda menerima penghantaran mendesak yang memerlukan anda melebihi had laju. Anda patut:' }, opts: { en: ['Speed up — delivery is urgent', 'Inform supervisor and maintain speed limit', 'Drive as fast as feels safe', 'Skip rest breaks to save time'], bm: ['Laju — penghantaran mendesak', 'Maklumkan penyelia dan kekalkan had laju', 'Pandu sepantas yang rasa selamat', 'Langkau rehat untuk jimat masa'] }, ans: 1, ex: { en: 'No delivery is worth a human life. Inform your supervisor.', bm: 'Tiada penghantaran berbaloi dengan nyawa manusia. Maklumkan penyelia.' } },
]

const SCENARIOS = [
  { q: { en: 'You are driving to deliver goods on time. You are already 10 minutes late and the GPS says you can shorten the trip by driving 20 km/h above the limit. What do you do?', bm: 'Anda memandu untuk menghantar barangan tepat pada masanya. Anda sudah 10 minit lewat dan GPS mengatakan anda boleh memendekkan perjalanan dengan memandu 20 km/j melebihi had. Apa yang anda lakukan?' }, opts: { en: ['Speed up — the delivery is urgent', 'Call ahead to warn recipient of delay, maintain speed limit', 'Drive 10 km/h over — a small compromise'], bm: ['Laju — penghantaran mendesak', 'Hubungi penerima untuk beri tahu kelewatan, kekalkan had laju', 'Pandu 10 km/j melebihi — kompromi kecil'] }, correct: 1, feedback: { en: '✅ Correct! Always maintain the speed limit. Call ahead to manage expectations.', bm: '✅ Betul! Sentiasa kekalkan had laju. Hubungi lebih awal untuk mengurus jangkaan.' } },
  { q: { en: 'It is raining heavily and visibility is poor. You are on the highway. What do you do?', bm: 'Hujan lebat dan penglihatan lemah. Anda berada di lebuh raya. Apa yang anda lakukan?' }, opts: { en: ['Maintain speed — you need to keep up with traffic', 'Reduce speed, increase following distance, turn on headlights', 'Pull over immediately anywhere on the road'], bm: ['Kekalkan kelajuan — anda perlu mengikuti trafik', 'Kurangkan kelajuan, tambah jarak, hidupkan lampu hadapan', 'Berhenti segera di mana-mana di jalan'] }, correct: 1, feedback: { en: '✅ Correct! Slow down, increase distance, use headlights.', bm: '✅ Betul! Perlahan, tambah jarak, guna lampu hadapan.' } },
  { q: { en: 'You have been driving for 3 hours and feel tired. The destination is only 30 minutes away. What do you do?', bm: 'Anda telah memandu selama 3 jam dan rasa penat. Destinasi hanya 30 minit lagi. Apa yang anda lakukan?' }, opts: { en: ['Push through — only 30 minutes left', 'Pull over at the nearest rest area and take a 20-minute nap', 'Open the window and turn up the radio'], bm: ['Teruskan — tinggal 30 minit sahaja', 'Berhenti di kawasan rehat terdekat dan tidur 20 minit', 'Buka tingkap dan naikkan radio'] }, correct: 1, feedback: { en: '✅ Correct! A 20-minute power nap can save your life.', bm: '✅ Betul! Tidur sebentar 20 minit boleh menyelamatkan nyawa anda.' } },
]

function QuizGame({ lang, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [showEx, setShowEx] = useState(false)
  const [done, setDone] = useState(false)
  const q = QUIZ[idx]

  function choose(i) {
    if (selected !== null) return
    setSelected(i); setShowEx(true)
    if (i === q.ans) setScore(s => s + 10)
  }
  function next() {
    if (idx + 1 >= QUIZ.length) { setDone(true); onComplete(score); return }
    setIdx(i => i + 1); setSelected(null); setShowEx(false)
  }

  if (done) return <div className="text-center py-8"><div className="text-6xl mb-4">🏆</div><p className="text-3xl font-black text-nestle-gold">{score} / {QUIZ.length * 10}</p></div>

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-400">{lang === 'en' ? 'Question' : 'Soalan'} {idx + 1}/{QUIZ.length}</span>
        <span className="text-sm font-bold text-nestle-gold">{score} pts</span>
      </div>
      <div className="progress-track mb-6"><div className="progress-fill" style={{ width: `${(idx / QUIZ.length) * 100}%` }} /></div>
      <p className="text-lg font-semibold mb-5 text-white">{q.q[lang]}</p>
      <div className="flex flex-col gap-3">
        {q.opts[lang].map((opt, i) => {
          let cls = 'quiz-option '
          if (selected !== null) {
            if (i === q.ans) cls += 'correct'
            else if (i === selected) cls += 'wrong'
            else cls += 'dim'
          }
          return <button key={i} className={cls} onClick={() => choose(i)}><span className="font-semibold mr-2 opacity-60">{String.fromCharCode(65 + i)}.</span>{opt}</button>
        })}
      </div>
      {showEx && <div className="mt-4 p-4 rounded-xl" style={{ background:'rgba(10,22,40,0.8)', border:'1px solid rgba(26,58,107,0.6)' }}><p className="text-sm text-gray-300">{q.ex[lang]}</p><button onClick={next} className="btn-primary mt-3 w-full">{idx + 1 < QUIZ.length ? t(lang, 'next') : (lang === 'en' ? 'See Results' : 'Lihat Keputusan')} →</button></div>}
    </div>
  )
}

function ScenarioGame({ lang, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const s = SCENARIOS[idx]

  function choose(i) { if (selected !== null) return; setSelected(i); if (i === s.correct) setScore(sc => sc + 15) }
  function next() { if (idx + 1 >= SCENARIOS.length) { setDone(true); return } setIdx(i => i + 1); setSelected(null) }

  if (done) return <div className="text-center py-8"><div className="text-6xl mb-4">🎯</div><p className="text-3xl font-black text-nestle-gold">{score} / {SCENARIOS.length * 15}</p><button onClick={() => onComplete(score)} className="btn-primary mt-4">{lang === 'en' ? 'Save Score' : 'Simpan Markah'}</button></div>

  return (
    <div>
      <div className="flex justify-between mb-4"><span className="text-sm text-gray-400">{lang === 'en' ? 'Scenario' : 'Senario'} {idx + 1}/{SCENARIOS.length}</span><span className="text-sm font-bold text-nestle-gold">{score} pts</span></div>
      <p className="text-base font-medium mb-5 leading-relaxed text-white">{s.q[lang]}</p>
      <div className="flex flex-col gap-3">
        {s.opts[lang].map((opt, i) => {
          let cls = 'quiz-option '
          if (selected !== null) {
            if (i === s.correct) cls += 'correct'
            else if (i === selected) cls += 'wrong'
            else cls += 'dim'
          }
          return <button key={i} className={cls} onClick={() => choose(i)}>{opt}</button>
        })}
      </div>
      {selected !== null && <div className="mt-4 p-4 rounded-xl" style={{ background:'rgba(10,22,40,0.8)', border:'1px solid rgba(26,58,107,0.6)' }}><p className="text-sm text-gray-300">{s.feedback[lang]}</p><button onClick={next} className="btn-primary mt-3 w-full">{idx + 1 < SCENARIOS.length ? t(lang, 'next') : (lang === 'en' ? 'See Results' : 'Lihat Keputusan')} →</button></div>}
    </div>
  )
}

const TABS = [
  { key: 'quiz', en: '📋 Quiz', bm: '📋 Kuiz' },
  { key: 'scenario', en: '🎭 Scenarios', bm: '🎭 Senario' },
  { key: 'video', en: '🎬 Hazard Tap', bm: '🎬 Ketik Bahaya' },
]

export default function SafeDrivingPage() {
  const { lang } = useApp()
  const [tab, setTab] = useState('quiz')
  const [quizScore, setQuizScore] = useState(null)
  const [scenarioScore, setScenarioScore] = useState(null)
  const [videoScore, setVideoScore] = useState(null)
  const total = (quizScore ?? 0) + (scenarioScore ?? 0) + (videoScore ?? 0)
  const max = QUIZ.length * 10 + SCENARIOS.length * 15 + 4 * 15

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-20 pb-12 px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6"><span className="text-3xl">🚗</span><div><h1 className="text-2xl font-black text-white">{t(lang, 'modules.safeDriving')}</h1><p className="text-sm text-gray-400">{t(lang, 'appTitle')} · Priority 1</p></div></div>
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {TABS.map(tb => <button key={tb.key} onClick={() => setTab(tb.key)}
            className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            style={tab === tb.key ? { background:'#E2001A', color:'white' } : { background:'rgba(26,58,107,0.4)', color:'#94A3B8' }}>
            {tb[lang]}
          </button>)}
        </div>
        <div className="card-hud">
          {tab === 'quiz' && (quizScore !== null ? <div className="text-center py-8"><div className="text-6xl mb-4">✅</div><p className="text-2xl font-black" style={{ color:'#00FF88' }}>{quizScore} / {QUIZ.length * 10}</p></div> : <QuizGame lang={lang} onComplete={setQuizScore} />)}
          {tab === 'scenario' && (scenarioScore !== null ? <div className="text-center py-8"><div className="text-6xl mb-4">✅</div><p className="text-2xl font-black" style={{ color:'#00FF88' }}>{scenarioScore} / {SCENARIOS.length * 15}</p></div> : <ScenarioGame lang={lang} onComplete={setScenarioScore} />)}
          {tab === 'video' && (videoScore !== null
            ? <div className="text-center py-8"><div className="text-6xl mb-4">✅</div><p className="text-2xl font-black" style={{ color:'#00FF88' }}>{videoScore} pts</p></div>
            : <HazardVideoScene lang={lang === 'en' ? 'en' : 'bm'} onComplete={setVideoScore} pointsPerTap={15} />)}
        </div>
        {(quizScore !== null || scenarioScore !== null || videoScore !== null) && (
          <div className="card-hud mt-4">
            <p className="text-sm text-gray-400 mb-1">{lang === 'en' ? 'Module total' : 'Jumlah modul'}</p>
            <p className="text-2xl font-black text-nestle-gold">{total} / {max}</p>
            <ScoreSubmit moduleSlug="safe-driving" score={total} maxScore={max} />
          </div>
        )}
      </main>
    </div>
  )
}
