'use client'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import ErgonomicPostureGame from '@/components/games/ErgonomicPostureGame'
import ErgonomicTipsGame from '@/components/games/ErgonomicTipsGame'
import { useApp } from '@/contexts/AppContext'

export default function ErgonomicPage() {
  const { lang } = useApp()
  const [tab, setTab] = useState('posture')
  const [postureScore, setPostureScore] = useState(null)
  const [tipsScore, setTipsScore] = useState(null)
  const total = (postureScore ?? 0) + (tipsScore ?? 0)
  const MAX = 45 + 30

  return (
    <div className="min-h-screen pb-10">
      <NavBar />
      <div className="pt-24 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-black text-gray-900 mb-4">🪑 Ergonomic</h1>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('posture')}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            style={tab === 'posture' ? { background:'#E2001A', color:'white' } : { background:'rgba(0,0,0,0.05)', color:'#6B7280' }}>
            🧍 Spot the Posture
          </button>
          <button onClick={() => setTab('tips')}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            style={tab === 'tips' ? { background:'#E2001A', color:'white' } : { background:'rgba(0,0,0,0.05)', color:'#6B7280' }}>
            🗂️ Tip Flashcards
          </button>
        </div>

        {tab === 'posture' && (
          <div className="card-hud">
            <h3 className="font-bold mb-1 text-gray-900">{lang === 'en' ? 'Spot the Correct Posture' : 'Kesan Postur Yang Betul'}</h3>
            <p className="text-sm text-gray-500 mb-4">{lang === 'en' ? 'Tap the image showing the correct ergonomic posture.' : 'Ketik imej yang menunjukkan postur ergonomik yang betul.'}</p>
            {postureScore !== null ? (
              <div className="text-center py-8"><div className="text-6xl mb-3">✅</div><p className="text-2xl font-black" style={{ color:'#00A35E' }}>{postureScore} / 45 pts</p></div>
            ) : (
              <ErgonomicPostureGame lang={lang === 'en' ? 'en' : 'bm'} onComplete={setPostureScore} />
            )}
          </div>
        )}

        {tab === 'tips' && (
          <div className="card-hud">
            <h3 className="font-bold mb-1 text-gray-900">{lang === 'en' ? 'Ergonomic Tip Flashcards' : 'Kad Tip Ergonomik'}</h3>
            {tipsScore !== null ? (
              <div className="text-center py-8"><div className="text-6xl mb-3">✅</div><p className="text-2xl font-black" style={{ color:'#00A35E' }}>{tipsScore} / 30 pts</p></div>
            ) : (
              <ErgonomicTipsGame lang={lang === 'en' ? 'en' : 'bm'} onComplete={setTipsScore} />
            )}
          </div>
        )}

        {(postureScore !== null || tipsScore !== null) && (
          <div className="mt-6">
            <ScoreSubmit moduleSlug="ergonomic" score={total} maxScore={MAX} />
          </div>
        )}
      </div>
    </div>
  )
}
