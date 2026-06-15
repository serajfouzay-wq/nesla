'use client'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import { useApp } from '@/contexts/AppContext'

const POSTURE_QUESTIONS = [
  {
    q: 'When lifting a heavy box from the floor, which technique is correct?',
    options: ['Bend your back and keep legs straight','Squat down, keep back straight, lift with legs','Twist your body while lifting','Lift quickly using your back'],
    answer: 1,
    tip: 'Always squat with your legs and keep your back straight. Use your leg muscles, not your back, to lift.',
  },
  {
    q: 'What is the correct sitting posture at a desk?',
    options: ['Lean forward with head close to screen','Sit at the edge of the chair, back unsupported','Sit back fully, feet flat on floor, screen at eye level','Cross legs and slouch for comfort'],
    answer: 2,
    tip: 'Sit fully back in your chair, feet flat on floor, monitor at eye level, elbows at 90 degrees.',
  },
  {
    q: 'How far should your monitor be from your eyes?',
    options: ['15–20 cm','30–40 cm','50–70 cm','Over 1 meter'],
    answer: 2,
    tip: "Monitor should be 50–70 cm (arm's length) away from your eyes to reduce eye strain.",
  },
  {
    q: 'What is the correct elbow angle when typing?',
    options: ['45 degrees','90 degrees','135 degrees','Fully extended'],
    answer: 1,
    tip: 'Keep elbows at 90 degrees when typing to avoid wrist and shoulder strain.',
  },
  {
    q: 'How often should you take a break when working at a computer?',
    options: ['Once a day','Every 4 hours','Every 30–60 minutes','Only when in pain'],
    answer: 2,
    tip: 'Take a 5–10 minute break every 30–60 minutes. Stand, stretch, and rest your eyes.',
  },
  {
    q: 'When carrying a heavy load, you should:',
    options: ['Hold it far from your body','Hold it close to your body','Twist while walking','Only use one hand'],
    answer: 1,
    tip: 'Always hold loads close to your body to reduce strain on your back and arms.',
  },
]

export default function ErgonomicPage() {
  const { lang } = useApp()
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [done, setDone] = useState(false)
  const [showTip, setShowTip] = useState(false)

  const MAX = POSTURE_QUESTIONS.length * 10

  function pick(i) {
    if (selected !== null) return
    setSelected(i)
    if (i === POSTURE_QUESTIONS[qi].answer) setScore(s => s + 10)
    setShowTip(true)
  }

  function next() {
    setSelected(null)
    setShowTip(false)
    if (qi + 1 >= POSTURE_QUESTIONS.length) setDone(true)
    else setQi(q => q + 1)
  }

  return (
    <div className="min-h-screen pb-10">
      <NavBar />
      <div className="pt-24 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-nestle-red mb-6">Ergonomic</h1>
        <div className="card">
          {!done ? (
            <>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-400">Question {qi+1} / {POSTURE_QUESTIONS.length}</p>
                <p className="text-sm font-semibold text-nestle-red">Score: {score}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-nestle-red h-2 rounded-full transition-all" style={{width:`${(qi/POSTURE_QUESTIONS.length)*100}%`}} />
              </div>
              <div className="bg-blue-50 rounded-xl p-4 mb-4 text-center">
                <p className="text-4xl mb-1">🪑</p>
                <p className="text-sm text-gray-500">Ergonomic Posture Quiz</p>
              </div>
              <p className="font-semibold text-lg mb-4">{POSTURE_QUESTIONS[qi].q}</p>
              <div className="space-y-2">
                {POSTURE_QUESTIONS[qi].options.map((o, i) => (
                  <button key={i} onClick={() => pick(i)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                      selected === null ? 'hover:bg-blue-50 border-gray-200' :
                      i === POSTURE_QUESTIONS[qi].answer ? 'bg-green-100 border-green-400' :
                      i === selected ? 'bg-red-100 border-red-400' : 'border-gray-200 opacity-60'
                    }`}>{o}</button>
                ))}
              </div>
              {showTip && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-semibold text-yellow-800 mb-1">
                    {selected === POSTURE_QUESTIONS[qi].answer ? '✅ Correct!' : '❌ Not quite.'}
                  </p>
                  <p className="text-sm text-yellow-700">{POSTURE_QUESTIONS[qi].tip}</p>
                  <button onClick={next} className="btn-primary mt-3 text-sm py-2">
                    {qi + 1 < POSTURE_QUESTIONS.length ? 'Next Question' : 'See Results'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-4xl mb-3">🏆</p>
              <p className="text-2xl font-bold text-nestle-green">Ergonomic Quiz Complete!</p>
              <p className="text-gray-500 mt-2">Score: {score} / {MAX}</p>
              <ScoreSubmit moduleSlug="ergonomic" score={score} maxScore={MAX} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}