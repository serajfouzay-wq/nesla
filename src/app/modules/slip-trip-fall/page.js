'use client'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import OfficeHazardScene from '@/components/games/OfficeHazardScene'
import { useApp } from '@/contexts/AppContext'

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

  const [hazardScore, setHazardScore] = useState(null)

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

  const totalScore = (hazardScore ?? 0) + seqScore + quizScore + cardScore
  const MAX = 5 * 8 + 10 + OUTLET_STEPS.length * 10 + QUIZ.length * 10 + CARDS.length * 5

  return (
    <div className="min-h-screen pb-10">
      <NavBar />
      <div className="pt-24 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-black text-white mb-4">⚠️ Slip, Trip &amp; Fall</h1>
        <div className="flex gap-2 mb-6 flex-wrap">
          {['hazard','sequence','quiz','cards'].map(tb => (
            <button key={tb} onClick={() => setTab(tb)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
              style={tab === tb
                ? { background:'#E2001A', color:'white' }
                : { background:'rgba(26,58,107,0.4)', color:'#94A3B8' }}>
              {tb === 'hazard' ? 'Spot Hazard' : tb === 'sequence' ? 'Outlet Sequence' : tb === 'quiz' ? 'Quiz' : 'Card Sort'}
            </button>
          ))}
        </div>

        {tab === 'hazard' && (
          <div className="card-hud">
            {hazardScore !== null
              ? <div className="text-center py-8"><div className="text-6xl mb-3">✅</div><p className="text-2xl font-black" style={{ color:'#00FF88' }}>{hazardScore} pts</p></div>
              : <OfficeHazardScene lang={lang === 'en' ? 'en' : 'bm'} onComplete={setHazardScore} pointsPerHazard={8} />}
          </div>
        )}

        {tab === 'sequence' && (
          <div className="card-hud">
            <h3 className="font-bold mb-2 text-white">Falling in the Outlet — What do you do?</h3>
            <p className="text-sm text-gray-400 mb-4">Someone has slipped and fallen at the outlet. Arrange the 4 steps in the correct order by dragging.</p>
            <div className="space-y-2">
              {seqItems.map((item, idx) => (
                <div key={item.id}
                  draggable={!seqSubmitted}
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(idx)}
                  className={`drag-item ${seqSubmitted ? (item.id === CORRECT_ORDER[idx] ? 'correct' : 'wrong') : ''}`}>
                  <span className="w-7 h-7 bg-nestle-red text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{idx+1}</span>
                  <span className="text-sm text-gray-200">{item.text}</span>
                  {seqSubmitted && <span className="ml-auto">{item.id === CORRECT_ORDER[idx] ? '✅' : '❌'}</span>}
                </div>
              ))}
            </div>
            {!seqSubmitted ? (
              <button onClick={checkSeq} className="btn-primary mt-4 w-full">Check Order</button>
            ) : (
              <p className="text-center font-bold mt-4" style={{ color:'#00FF88' }}>Sequence Score: {seqScore} / {OUTLET_STEPS.length * 10}</p>
            )}
          </div>
        )}

        {tab === 'quiz' && (
          <div className="card-hud">
            {!quizDone ? (
              <>
                <p className="text-sm text-gray-400 mb-2">Question {qi+1} / {QUIZ.length}</p>
                <p className="font-semibold text-lg mb-4 text-white">{QUIZ[qi].q}</p>
                <div className="space-y-2">
                  {QUIZ[qi].options.map((o,i) => {
                    let cls = 'quiz-option '
                    if (selected !== null) {
                      if (i === QUIZ[qi].answer) cls += 'correct'
                      else if (i === selected) cls += 'wrong'
                      else cls += 'dim'
                    }
                    return <button key={i} onClick={() => selected===null && pickQuiz(i)} className={cls}>{o}</button>
                  })}
                </div>
              </>
            ) : (
              <p className="text-center text-xl font-bold" style={{ color:'#00FF88' }}>Quiz Done! Score: {quizScore} / {QUIZ.length*10}</p>
            )}
          </div>
        )}

        {tab === 'cards' && (
          <div className="card-hud">
            <h3 className="font-bold mb-2 text-white">Hazard / Risk / Control Card Sort</h3>
            <p className="text-sm text-gray-400 mb-4">Sort each card into the correct category.</p>
            <div className="space-y-2">
              {CARDS.map(c => (
                <div key={c.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 rounded-lg"
                  style={{
                    background: cardSubmitted ? (c.category === cardAnswers[c.id] ? 'rgba(0,255,136,0.08)' : 'rgba(255,34,68,0.08)') : 'rgba(10,22,40,0.7)',
                    border: `1px solid ${cardSubmitted ? (c.category === cardAnswers[c.id] ? 'rgba(0,255,136,0.4)' : 'rgba(255,34,68,0.4)') : 'rgba(26,58,107,0.5)'}`,
                  }}>
                  <span className="text-sm font-medium flex-1 text-gray-200">{c.text}</span>
                  <div className="flex gap-1 flex-wrap">
                    {['hazard','risk','control'].map(cat => (
                      <button key={cat} onClick={() => setCardAns(c.id, cat)} disabled={cardSubmitted}
                        className="px-2 py-1 rounded text-xs font-semibold border transition-colors"
                        style={cardAnswers[c.id]===cat
                          ? { background:'#E2001A', borderColor:'#E2001A', color:'white' }
                          : { borderColor:'rgba(26,58,107,0.6)', color:'#94A3B8' }}>{cat}</button>
                    ))}
                    {cardSubmitted && <span className="ml-1 text-xs text-gray-400">{cardAnswers[c.id]===c.category ? '✅' : `❌(${c.category})`}</span>}
                  </div>
                </div>
              ))}
            </div>
            {!cardSubmitted ? (
              <button onClick={checkCards} disabled={Object.keys(cardAnswers).length < CARDS.length} className="btn-primary w-full mt-4">Check Answers</button>
            ) : (
              <p className="text-center font-bold mt-4" style={{ color:'#00FF88' }}>Card Sort Score: {cardScore} / {CARDS.length*5}</p>
            )}
          </div>
        )}

        {(hazardScore !== null || seqSubmitted || quizDone || cardSubmitted) && (
          <div className="mt-6">
            <ScoreSubmit moduleSlug="slip-trip-fall" score={totalScore} maxScore={MAX} />
          </div>
        )}
      </div>
    </div>
  )
}
