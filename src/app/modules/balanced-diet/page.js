'use client'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import SukuSukuSeparuhPlate from '@/components/games/SukuSukuSeparuhPlate'
import { useApp } from '@/contexts/AppContext'

export default function BalancedDietPage() {
  const { lang } = useApp()
  const [score, setScore] = useState(null)
  const MAX = 40

  return (
    <div className="min-h-screen pb-10">
      <NavBar />
      <div className="pt-24 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-black text-white mb-4">🥗 Balanced Diet</h1>
        <div className="card-hud">
          <h3 className="font-bold mb-1 text-white">{lang === 'en' ? 'Build Your Plate' : 'Bina Pinggan Anda'}</h3>
          {score !== null ? (
            <div className="text-center py-8"><div className="text-6xl mb-3">✅</div><p className="text-2xl font-black" style={{ color:'#00FF88' }}>{score} / {MAX} pts</p></div>
          ) : (
            <SukuSukuSeparuhPlate lang={lang === 'en' ? 'en' : 'bm'} onComplete={setScore} />
          )}
        </div>
        {score !== null && (
          <div className="mt-6">
            <ScoreSubmit moduleSlug="balanced-diet" score={score} maxScore={MAX} />
          </div>
        )}
      </div>
    </div>
  )
}
