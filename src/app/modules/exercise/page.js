'use client'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import ExerciseDragSort from '@/components/games/ExerciseDragSort'
import CameraCapture from '@/components/CameraCapture'
import { useApp } from '@/contexts/AppContext'

export default function ExercisePage() {
  const { lang } = useApp()
  const [tab, setTab] = useState('sort')
  const [sortScore, setSortScore] = useState(null)
  const [photoScore, setPhotoScore] = useState(null)
  const total = (sortScore ?? 0) + (photoScore ?? 0)
  const MAX = 80 + 30

  return (
    <div className="min-h-screen pb-10">
      <NavBar />
      <div className="pt-24 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-black text-gray-900 mb-4">🏃 Exercise</h1>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('sort')}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            style={tab === 'sort' ? { background:'#E2001A', color:'white' } : { background:'rgba(0,0,0,0.05)', color:'#6B7280' }}>
            🏷️ Drag &amp; Sort
          </button>
          <button onClick={() => setTab('photo')}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            style={tab === 'photo' ? { background:'#E2001A', color:'white' } : { background:'rgba(0,0,0,0.05)', color:'#6B7280' }}>
            📷 Show Me!
          </button>
        </div>

        {tab === 'sort' && (
          <div className="card-hud">
            <h3 className="font-bold mb-1 text-gray-900">{lang === 'en' ? 'Drag & Sort' : 'Seret & Susun'}</h3>
            {sortScore !== null ? (
              <div className="text-center py-8"><div className="text-6xl mb-3">✅</div><p className="text-2xl font-black" style={{ color:'#00A35E' }}>{sortScore} / 80 pts</p></div>
            ) : (
              <ExerciseDragSort lang={lang === 'en' ? 'en' : 'bm'} onComplete={setSortScore} pointsEach={10} />
            )}
          </div>
        )}

        {tab === 'photo' && (
          <div className="card-hud">
            <h3 className="font-bold mb-1 text-gray-900">{lang === 'en' ? 'Show Me Your Exercise!' : 'Tunjukkan Senaman Anda!'}</h3>
            <p className="text-sm text-gray-500 mb-3">{lang === 'en' ? 'Take a photo of yourself doing one of the exercises (squat, push-up, stretch, etc.)' : 'Ambil gambar diri anda melakukan senaman (squat, tekan tubi, regangan, dll.)'}</p>
            {photoScore !== null ? (
              <div className="text-center py-8"><div className="text-6xl mb-3">✅</div><p className="text-2xl font-black" style={{ color:'#00A35E' }}>{photoScore} / 30 pts</p></div>
            ) : (
              <CameraCapture label={lang === 'en' ? 'Capture your exercise pose' : 'Tangkap pose senaman anda'} maxPhotos={3} points={10}
                onSubmit={(photos) => setPhotoScore(photos.length * 10)} />
            )}
          </div>
        )}

        {(sortScore !== null || photoScore !== null) && (
          <div className="mt-6">
            <ScoreSubmit moduleSlug="exercise" score={total} maxScore={MAX} />
          </div>
        )}
      </div>
    </div>
  )
}
