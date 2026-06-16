'use client'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import SukuSukuSeparuhPlate from '@/components/games/SukuSukuSeparuhPlate'
import NutritionQuizGame from '@/components/games/NutritionQuizGame'
import { useApp } from '@/contexts/AppContext'

export default function BalancedDietPage() {
  const { lang } = useApp()
  const [tab, setTab] = useState('plate')
  const [plateScore, setPlateScore] = useState(null)
  const [quizScore, setQuizScore] = useState(null)
  const total = (plateScore ?? 0) + (quizScore ?? 0)
  const MAX = 40 + 40

  return (
    <div className="min-h-screen pb-10">
      <NavBar />
      <div className="pt-24 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-black text-gray-900 mb-4">🥗 Balanced Diet</h1>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('plate')}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            style={tab === 'plate' ? { background:'#E2001A', color:'white' } : { background:'rgba(0,0,0,0.05)', color:'#6B7280' }}>
            🍽️ Build Your Plate
          </button>
          <button onClick={() => setTab('quiz')}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            style={tab === 'quiz' ? { background:'#E2001A', color:'white' } : { background:'rgba(0,0,0,0.05)', color:'#6B7280' }}>
            📋 Nutrition Quiz
          </button>
        </div>

        {tab === 'plate' && (
          <div className="card-hud">
            <h3 className="font-bold mb-1 text-gray-900">{lang === 'en' ? 'Build Your Plate' : 'Bina Pinggan Anda'}</h3>
            {plateScore !== null ? (
              <div className="text-center py-8"><div className="text-6xl mb-3">✅</div><p className="text-2xl font-black" style={{ color:'#00A35E' }}>{plateScore} / 40 pts</p></div>
            ) : (
              <SukuSukuSeparuhPlate lang={lang === 'en' ? 'en' : 'bm'} onComplete={setPlateScore} />
            )}
          </div>
        )}

        {tab === 'quiz' && (
          <div className="card-hud">
            <h3 className="font-bold mb-1 text-gray-900">{lang === 'en' ? 'Nutrition Quiz' : 'Kuiz Pemakanan'}</h3>
            {quizScore !== null ? (
              <div className="text-center py-8"><div className="text-6xl mb-3">✅</div><p className="text-2xl font-black" style={{ color:'#00A35E' }}>{quizScore} / 40 pts</p></div>
            ) : (
              <NutritionQuizGame lang={lang === 'en' ? 'en' : 'bm'} onComplete={setQuizScore} />
            )}
          </div>
        )}

        {(plateScore !== null || quizScore !== null) && (
          <div className="mt-6">
            <ScoreSubmit moduleSlug="balanced-diet" score={total} maxScore={MAX} />
          </div>
        )}
      </div>
    </div>
  )
}
