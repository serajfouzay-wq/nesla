'use client'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import { useApp } from '@/contexts/AppContext'

const DRBAC_STEPS = [
  { id: 1, letter: 'D', word: 'Danger', desc: 'Check for danger — ensure scene is safe for you, others, and the casualty' },
  { id: 2, letter: 'R', word: 'Response', desc: 'Check for response — tap shoulders, shout "Are you OK?"' },
  { id: 3, letter: 'B', word: 'Breathing', desc: 'Check for breathing — look, listen, feel for 10 seconds' },
  { id: 4, letter: 'A', word: 'Alert', desc: 'Alert — call 999 or get someone to call' },
  { id: 5, letter: 'C', word: 'CPR', desc: 'Start CPR — 30 chest compressions + 2 rescue breaths' },
]

const CPR_QUIZ = [
  { q: 'What does DRBAC stand for?', options: ['Danger, Response, Breathing, Alert, CPR','Danger, React, Breathe, Assess, Call','Detect, Respond, Breathe, Alert, Compress','Danger, Rescue, Breathe, Aid, CPR'], answer: 0 },
  { q: 'During CPR, what is the correct compression-to-breath ratio for adults?', options: ['15:2','30:2','10:1','5:1'], answer: 1 },
  { q: 'How deep should chest compressions be for an adult?', options: ['1–2 cm','5–6 cm','8–10 cm','2–3 cm'], answer: 1 },
  { q: 'What is the correct compression rate per minute?', options: ['60–80 per minute','100–120 per minute','40–60 per minute','140–160 per minute'], answer: 1 },
  { q: 'The recovery position is used when a person is:', options: ['In cardiac arrest','Breathing but unconscious','Having a seizure','Choking'], answer: 1 },
]

const CORRECT_ORDER = [1, 2, 3, 4, 5]

export default function MedicalCprPage() {
  const { lang } = useApp()
  const [tab, setTab] = useState('drbac')
  const [seqItems, setSeqItems] = useState([...DRBAC_STEPS].sort(() => Math.random() - 0.5))
  const [seqSubmitted, setSeqSubmitted] = useState(false)
  const [seqScore, setSeqScore] = useState(0)
  const [dragging, setDragging] = useState(null)
  const [qi, setQi] = useState(0)
  const [quizScore, setQuizScore] = useState(0)
  const [quizDone, setQuizDone] = useState(false)
  const [selected, setSelected] = useState(null)

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
    if (selected !== null) return
    setSelected(i)
    if (i === CPR_QUIZ[qi].answer) setQuizScore(s => s + 10)
    setTimeout(() => {
      setSelected(null)
      if (qi + 1 >= CPR_QUIZ.length) setQuizDone(true)
      else setQi(q => q + 1)
    }, 700)
  }

  const totalScore = seqScore + quizScore
  const MAX = DRBAC_STEPS.length * 10 + CPR_QUIZ.length * 10

  return (
    <div className="min-h-screen pb-10">
      <NavBar />
      <div className="pt-24 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-nestle-red mb-4">Medical Emergency &amp; CPR</h1>
        <div className="flex gap-2 mb-6">
          {['drbac','quiz'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${tab===t ? 'bg-nestle-red text-white' : 'bg-gray-200 text-gray-700'}`}>
              {t === 'drbac' ? 'DRBAC Sequence' : 'CPR Quiz'}
            </button>
          ))}
        </div>

        {tab === 'drbac' && (
          <div className="card">
            <h3 className="font-bold mb-2">DRBAC — Build the Sequence</h3>
            <p className="text-sm text-gray-500 mb-4">Arrange the 5 DRBAC steps in the correct order by dragging.</p>
            <div className="flex justify-center gap-2 mb-6">
              {DRBAC_STEPS.map(s => (
                <div key={s.id} className="w-10 h-10 bg-nestle-red text-white rounded-lg flex items-center justify-center font-bold text-lg">
                  {s.letter}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {seqItems.map((item, idx) => (
                <div key={item.id}
                  draggable={!seqSubmitted}
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => handleDrop(idx)}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-grab select-none ${
                    seqSubmitted
                      ? item.id === CORRECT_ORDER[idx] ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
                      : 'bg-white border-gray-200 hover:border-nestle-red'
                  }`}>
                  <span className="w-8 h-8 bg-nestle-red text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">{idx+1}</span>
                  <div>
                    <p className="font-bold text-sm">{item.letter} — {item.word}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  {seqSubmitted && <span className="ml-auto">{item.id === CORRECT_ORDER[idx] ? '✅' : '❌'}</span>}
                </div>
              ))}
            </div>
            {!seqSubmitted ? (
              <button onClick={checkSeq} className="btn-primary w-full mt-4">Check Sequence</button>
            ) : (
              <p className="text-center font-bold mt-4 text-nestle-green">Sequence Score: {seqScore} / {DRBAC_STEPS.length*10}</p>
            )}
          </div>
        )}

        {tab === 'quiz' && (
          <div className="card">
            {!quizDone ? (
              <>
                <p className="text-sm text-gray-400 mb-2">Question {qi+1} / {CPR_QUIZ.length}</p>
                <p className="font-semibold text-lg mb-4">{CPR_QUIZ[qi].q}</p>
                <div className="space-y-2">
                  {CPR_QUIZ[qi].options.map((o, i) => (
                    <button key={i} onClick={() => selected===null && pickQuiz(i)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                        selected===null ? 'hover:bg-red-50 border-gray-200' :
                        i===CPR_QUIZ[qi].answer ? 'bg-green-100 border-green-400' :
                        i===selected ? 'bg-red-100 border-red-400' : 'border-gray-200'
                      }`}>{o}</button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-center text-xl font-bold text-nestle-green">Quiz Done! Score: {quizScore} / {CPR_QUIZ.length*10}</p>
            )}
          </div>
        )}

        {(seqSubmitted || quizDone) && (
          <div className="mt-6">
            <ScoreSubmit moduleSlug="medical-cpr" score={totalScore} maxScore={MAX} />
          </div>
        )}
      </div>
    </div>
  )
}