'use client'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import { useApp } from '@/contexts/AppContext'

const HAZARD_ZONES = [
  { id: 1, label: 'Wet floor (no sign)', x: 20, y: 30, desc: 'Wet floors without warning signs cause slips' },
  { id: 2, label: 'Cable across walkway', x: 55, y: 60, desc: 'Cables across walkways cause trips' },
  { id: 3, label: 'Boxes blocking exit', x: 75, y: 20, desc: 'Blocked exits are both a trip and fire hazard' },
  { id: 4, label: 'Poor lighting', x: 35, y: 75, desc: 'Poor lighting makes hazards invisible' },
  { id: 5, label: 'Loose mat', x: 65, y: 45, desc: 'Loose mats curl up and cause trips' },
]

const OUTLET_STEPS = [
  { id: 1, text: 'See hazard (e.g. wet/slippery floor at outlet)' },
  { id: 2, text: 'Warn others — place wet floor sign or barrier' },
  { id: 3, text: 'Report hazard to supervisor immediately' },
  { id: 4, text: 'Clean up or arrange for repair / fix' },
]

const CORRECT_ORDER = [1, 2, 3, 4]

const QUIZ = [
  { q: 'What is the FIRST action when you see a spill on the floor?', options: ['Ignore it','Clean it up immediately or place a warning sign','Report to manager only','Walk around it'], answer: 1 },
  { q: 'Which footwear best prevents slips in a wet environment?', options: ['High heels','Sandals','Anti-slip safety shoes','Socks only'], answer: 2 },
  { q: 'Good housekeeping means:', options: ['Cleaning only when told','Keeping walkways clear and areas tidy at all times','Cleaning only visible areas','Weekly general cleaning'], answer: 1 },
  { q: 'What is the difference between a hazard and a risk?', options: ['They are the same thing','Hazard is the source of danger; risk is the likelihood of harm','Risk is worse than hazard','Hazard only applies to chemicals'], answer: 1 },
]

const CARDS = [
  { id: 1, text: 'Wet floor', category: 'hazard' },
  { id: 2, text: 'Injury from fall', category: 'risk' },
  { id: 3, text: 'Wet floor sign', category: 'control' },
  { id: 4, text: 'Cable on walkway', category: 'hazard' },
  { id: 5, text: 'Someone trips and breaks wrist', category: 'risk' },
  { id: 6, text: 'Cable management tray', category: 'control' },
  { id: 7, text: 'Poor lighting', category: 'hazard' },
  { id: 8, text: 'Fall and head injury', category: 'risk' },
  { id: 9, text: 'Install proper lighting', category: 'control' },
]

export default function SlipTripFallPage() {
  const { lang } = useApp()
  const [tab, setTab] = useState('hazard')
  const [found, setFound] = useState([])
  const [hazardExplain, setHazardExplain] = useState('')
  const [hazardSubmitted, setHazardSubmitted] = useState(false)
  const [seqItems, setSeqItems] = useState([...OUTLET_STEPS].sort(() => Math.random() - 0.5))
  const [seqSubmitted, setSeqSubmitted] = useState(false)
  const [seqScore, setSeqScore] = useState(0)
  const [dragging, setDragging] = useState(null)
  const [qi, setQi] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [selected, setSelected] = useState(null)
  const [cardAnswers, setCardAnswers] = useState({})
  const [cardSubmitted, setCardSubmitted] = useState(false)
  const [cardScore, setCardScore] = useState(0)

  function clickZone(id) {
    if (found.includes(id)) return
    setFound(f => [...f, id])
  }

  function submitHazard() { setHazardSubmitted(true) }

  function handleDragStart(idx) { setDragging(idx) }
  function handleDrop(idx) {
    if (dragging === null || dragging === idx) return
    const items = [...seqItems]
    const [moved] = items.splice(dragging, 1)
    items.splice(idx, 0, moved)
    setSeqItems(items)
    setDragging(null)
  }
  function checkSeq() {
    let pts = 0
    seqItems.forEach((item, idx) => { if (item.id === CORRECT_ORDER[idx]) pts += 10 })
    setSeqScore(pts)
    setSeqSubmitted(true)
  }

  function pickQuiz(i) {
    setSelected(i)
    if (i === QUIZ[qi].answer) setQuizScore(s => s + 10)
    setTimeout(() => {
      setSelected(null)
      if (qi + 1 >= QUIZ.length) setQuizDone(true)
      else setQi(q => q + 1)
    }, 700)
  }

  function setCardAns(id, cat) {
    if (cardSubmitted) return
    setCardAnswers(a => ({ ...a, [id]: cat }))
  }
  function checkCards() {
    let pts = 0
    CARDS.forEach(c => { if (cardAnswers[c.id] === c.category) pts += 5 })
    setCardScore(pts)
    setCardSubmitted(true)
  }

  const hazardScore = found.length * 5 + (hazardSubmitted && hazardExplain.length > 10 ? 10 : 0)
  const totalScore = hazardScore + seqScore + quizScore + cardScore
  const MAX = HAZARD_ZONES.length * 5 + 10 + OUTLET_STEPS.length * 10 + QUIZ.length * 10 + CARDS.length * 5

  return (
    <div className="min-h-screen pb-10">
      <NavBar />
      <div className="pt-24 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-nestle-red mb-4">Slip, Trip &amp; Fall</h1>
        <div className="flex gap-2 mb-6 flex-wrap">
          {['hazard','sequence','quiz','cards'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${tab===t ? 'bg-nestle-red text-white' : 'bg-gray-200 text-gray-700'}`}>
              {t === 'hazard' ? 'Spot Hazard' : t === 'sequence' ? 'Outlet Sequence' : t === 'quiz' ? 'Quiz' : 'Card Sort'}
            </button>
          ))}
        </div>

        {tab === 'hazard' && (
          <div className="card">
            <h3 className="font-bold mb-2">Circle the Hazard</h3>
            <p className="text-sm text-gray-500 mb-4">Click on the hazard zones in the office image below. Find all {HAZARD_ZONES.length} hazards!</p>
            <div className="relative bg-gray-200 rounded-xl overflow-hidden mb-4" style={{paddingTop:'60%'}}>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400 text-sm text-center">🏢 Office Scene<br/>(Tap the ? buttons to find hazards)</p>
              </div>
              {HAZARD_ZONES.map(z => (
                <button key={z.id} onClick={() => clickZone(z.id)}
                  style={{ position:'absolute', left:`${z.x}%`, top:`${z.y}%`, transform:'translate(-50%,-50%)' }}
                  className={`w-10 h-10 rounded-full border-4 transition-all font-bold ${
                    found.includes(z.id) ? 'bg-red-500 border-red-600 text-white scale-110' : 'bg-white/70 border-red-400 text-red-500 hover:bg-red-100'
                  }`}>
                  {found.includes(z.id) ? '!' : '?'}
                </button>
              ))}
            </div>
            <div className="space-y-1 mb-4">
              {found.map(id => {
                const z = HAZARD_ZONES.find(h => h.id === id)
                return <p key={id} className="text-sm text-green-700">✅ {z.label} — {z.desc}</p>
              })}
            </div>
            <p className="text-sm font-semibold mb-3">Found: {found.length} / {HAZARD_ZONES.length} ({found.length * 5} pts)</p>
            <div>
              <label className="block text-sm font-semibold mb-1">Explain the main hazard you see and how to fix it: (+10 pts)</label>
              <textarea value={hazardExplain} onChange={e => !hazardSubmitted && setHazardExplain(e.target.value)}
                disabled={hazardSubmitted} className="input min-h-[80px] resize-none"
                placeholder="Describe the hazard and the control measure..." />
              {!hazardSubmitted && (
                <button onClick={submitHazard} disabled={hazardExplain.length < 10} className="btn-primary mt-2">Submit Explanation</button>
              )}
              {hazardSubmitted && <p className="text-green-600 font-semibold mt-2">✅ Explanation submitted! +10 pts</p>}
            </div>
          </div>
        )}

        {tab === 'sequence' && (
          <div className="card">
            <h3 className="font-bold mb-2">Falling in the Outlet — What do you do?</h3>
            <p className="text-sm text-gray-500 mb-4">Someone has slipped and fallen at the outlet. Arrange the 4 steps in the correct order by dragging.</p>
            <div className="space-y-2">
              {seqItems.map((item, idx) => (
                <div key={item.id}
                  draggable={!seqSubmitted}
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(idx)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-grab select-none ${
                    seqSubmitted
                      ? item.id === CORRECT_ORDER[idx] ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
                      : 'bg-white border-gray-200 hover:border-nestle-red'
                  }`}>
                  <span className="w-7 h-7 bg-nestle-red text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{idx+1}</span>
                  <span className="text-sm">{item.text}</span>
                  {seqSubmitted && <span className="ml-auto">{item.id === CORRECT_ORDER[idx] ? '✅' : '❌'}</span>}
                </div>
              ))}
            </div>
            {!seqSubmitted ? (
              <button onClick={checkSeq} className="btn-primary mt-4 w-full">Check Order</button>
            ) : (
              <p className="text-center font-bold mt-4 text-nestle-green">Sequence Score: {seqScore} / {OUTLET_STEPS.length * 10}</p>
            )}
          </div>
        )}

        {tab === 'quiz' && (
          <div className="card">
            {!quizDone ? (
              <>
                <p className="text-sm text-gray-400 mb-2">Question {qi+1} / {QUIZ.length}</p>
                <p className="font-semibold text-lg mb-4">{QUIZ[qi].q}</p>
                <div className="space-y-2">
                  {QUIZ[qi].options.map((o,i) => (
                    <button key={i} onClick={() => selected===null && pickQuiz(i)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                        selected===null ? 'hover:bg-red-50 border-gray-200' :
                        i===QUIZ[qi].answer ? 'bg-green-100 border-green-400' :
                        i===selected ? 'bg-red-100 border-red-400' : 'border-gray-200'
                      }`}>{o}</button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-xl font-bold text-nestle-green">Quiz Done! Score: {quizScore} / {QUIZ.length*10}</p>
            )}
          </div>
        )}

        {tab === 'cards' && (
          <div className="card">
            <h3 className="font-bold mb-2">Hazard / Risk / Control Card Sort</h3>
            <p className="text-sm text-gray-500 mb-4">Sort each card into the correct category.</p>
            <div className="space-y-2">
              {CARDS.map(c => (
                <div key={c.id} className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-lg border ${
                  cardSubmitted ? c.category === cardAnswers[c.id] ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400' : 'border-gray-200'
                }`}>
                  <span className="text-sm font-medium flex-1">{c.text}</span>
                  <div className="flex gap-1 flex-wrap">
                    {['hazard','risk','control'].map(cat => (
                      <button key={cat} onClick={() => setCardAns(c.id, cat)} disabled={cardSubmitted}
                        className={`px-2 py-1 rounded text-xs font-semibold border transition-colors ${
                          cardAnswers[c.id]===cat ? 'bg-nestle-red text-white border-nestle-red' : 'border-gray-300 text-gray-600 hover:border-nestle-red'
                        }`}>{cat}</button>
                    ))}
                    {cardSubmitted && <span className="ml-1 text-xs">{cardAnswers[c.id]===c.category ? '✅' : `❌(${c.category})`}</span>}
                  </div>
                </div>
              ))}
            </div>
            {!cardSubmitted ? (
              <button onClick={checkCards} disabled={Object.keys(cardAnswers).length < CARDS.length} className="btn-primary w-full mt-4">Check Answers</button>
            ) : (
              <p className="text-center font-bold mt-4 text-nestle-green">Card Sort Score: {cardScore} / {CARDS.length*5}</p>
            )}
          </div>
        )}

        {(hazardSubmitted || seqSubmitted || quizDone || cardSubmitted) && (
          <div className="mt-6">
            <ScoreSubmit moduleSlug="slip-trip-fall" score={totalScore} maxScore={MAX} />
          </div>
        )}
      </div>
    </div>
  )
}