'use client'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import { useApp } from '@/contexts/AppContext'

const EXERCISES = [
  { name: 'Jumping Jacks', correct: 'fat-burning', emoji: '⭐' },
  { name: 'Squats', correct: 'muscle-building', emoji: '🏋️' },
  { name: 'Burpees', correct: 'fat-burning', emoji: '🔥' },
  { name: 'Push-ups', correct: 'muscle-building', emoji: '💪' },
  { name: 'Hamstring Stretch', correct: 'stretching', emoji: '🧘' },
  { name: 'Running (30 min)', correct: 'fat-burning', emoji: '🏃' },
  { name: 'Bicep Curls', correct: 'muscle-building', emoji: '🦾' },
  { name: 'Shoulder Stretch', correct: 'stretching', emoji: '🤸' },
  { name: 'Cycling (steady)', correct: 'fat-burning', emoji: '🚴' },
  { name: 'Lunges', correct: 'muscle-building', emoji: '🦵' },
  { name: 'Neck Rolls', correct: 'stretching', emoji: '🔄' },
  { name: 'Plank', correct: 'muscle-building', emoji: '🧱' },
]

const CATEGORIES = [
  { key: 'fat-burning', label: 'Fat Burning', color: 'bg-orange-100 border-orange-400 text-orange-800', icon: '🔥' },
  { key: 'muscle-building', label: 'Muscle Building', color: 'bg-blue-100 border-blue-400 text-blue-800', icon: '💪' },
  { key: 'stretching', label: 'Stretching', color: 'bg-green-100 border-green-400 text-green-800', icon: '🧘' },
]

export default function ExercisePage() {
  const { lang } = useApp()
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const MAX = EXERCISES.length * 10

  function setAnswer(name, cat) {
    if (submitted) return
    setAnswers(a => ({ ...a, [name]: cat }))
  }

  function checkAnswers() {
    let pts = 0
    EXERCISES.forEach(ex => { if (answers[ex.name] === ex.correct) pts += 10 })
    setScore(pts)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen pb-10">
      <NavBar />
      <div className="pt-24 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-nestle-red mb-4">Exercise</h1>
        <div className="card mb-4">
          <h3 className="font-bold mb-3">Exercise Category Guide</h3>
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.map(c => (
              <div key={c.key} className={`${c.color} border rounded-xl p-3 text-center`}>
                <p className="text-2xl mb-1">{c.icon}</p>
                <p className="font-bold text-sm">{c.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="font-bold mb-1">Sort the Exercises</h3>
          <p className="text-sm text-gray-500 mb-4">Select the correct category for each exercise. ({EXERCISES.length} × 10 pts)</p>
          <div className="space-y-3">
            {EXERCISES.map(ex => (
              <div key={ex.name} className={`p-3 rounded-lg border ${
                submitted
                  ? answers[ex.name] === ex.correct ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
                  : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{ex.emoji}</span>
                  <span className="font-semibold text-sm">{ex.name}</span>
                  {submitted && (
                    <span className="ml-auto text-sm">
                      {answers[ex.name] === ex.correct ? '✅' : `❌ (${CATEGORIES.find(c=>c.key===ex.correct)?.label})`}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map(cat => (
                    <button key={cat.key} onClick={() => setAnswer(ex.name, cat.key)} disabled={submitted}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                        answers[ex.name] === cat.key
                          ? 'bg-nestle-red text-white border-nestle-red'
                          : 'border-gray-300 text-gray-600 hover:border-nestle-red'
                      }`}>
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {!submitted ? (
            <button onClick={checkAnswers} disabled={!EXERCISES.every(ex => answers[ex.name])} className="btn-primary w-full mt-4">
              Check Answers
            </button>
          ) : (
            <div className="text-center mt-4">
              <p className="text-2xl font-bold text-nestle-green">Score: {score} / {MAX}</p>
              <ScoreSubmit moduleSlug="exercise" score={score} maxScore={MAX} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}