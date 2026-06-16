'use client'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import ErgonomicPostureGame from '@/components/games/ErgonomicPostureGame'
import { useApp } from '@/contexts/AppContext'

export default function ErgonomicPage() {
  const { lang } = useApp()
  const [score, setScore] = useState(null)
  const MAX = 45

  return (
    <div className="min-h-screen pb-10">
      <NavBar />
      <div className="pt-24 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-black text-gray-900 mb-4">🪑 Ergonomic</h1>
        <div className="card-hud">
          <h3 className="font-bold mb-1 text-gray-900">{lang === 'en' ? 'Spot the Correct Posture' : 'Kesan Postur Yang Betul'}</h3>
          <p className="text-sm text-gray-500 mb-4">{lang === 'en' ? 'Tap the image showing the correct ergonomic posture.' : 'Ketik imej yang menunjukkan postur ergonomik yang betul.'}</p>
          {score !== null ? (
            <div className="text-center py-8"><div className="text-6xl mb-3">✅</div><p className="text-2xl font-black" style={{ color:'#00FF88' }}>{score} / {MAX} pts</p></div>
          ) : (
            <ErgonomicPostureGame lang={lang === 'en' ? 'en' : 'bm'} onComplete={setScore} />
          )}
        </div>
        {score !== null && (
          <div className="mt-6">
            <ScoreSubmit moduleSlug="ergonomic" score={score} maxScore={MAX} />
          </div>
        )}
      </div>
    </div>
  )
}
