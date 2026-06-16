'use client'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import CPRSequenceGame from '@/components/games/CPRSequenceGame'
import CameraCapture from '@/components/CameraCapture'
import { useApp } from '@/contexts/AppContext'

export default function MedicalCprPage() {
  const { lang } = useApp()
  const [tab, setTab] = useState('sequence')
  const [seqScore, setSeqScore] = useState(null)
  const [photoScore, setPhotoScore] = useState(null)
  const total = (seqScore ?? 0) + (photoScore ?? 0)
  const MAX = 60 + 20

  return (
    <div className="min-h-screen pb-10">
      <NavBar />
      <div className="pt-24 max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-black text-gray-900 mb-4">🫀 Medical Emergency &amp; CPR</h1>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('sequence')}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            style={tab === 'sequence' ? { background:'#E2001A', color:'white' } : { background:'rgba(0,0,0,0.05)', color:'#6B7280' }}>
            🔢 DRBAC Sequence
          </button>
          <button onClick={() => setTab('photo')}
            className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            style={tab === 'photo' ? { background:'#E2001A', color:'white' } : { background:'rgba(0,0,0,0.05)', color:'#6B7280' }}>
            📷 Hand Position
          </button>
        </div>

        {tab === 'sequence' && (
          <div className="card-hud">
            <h3 className="font-bold mb-1 text-gray-900">{lang === 'en' ? 'DRBAC Sequence' : 'Urutan DRBAC'}</h3>
            {seqScore !== null ? (
              <div className="text-center py-8"><div className="text-6xl mb-3">✅</div><p className="text-2xl font-black" style={{ color:'#00A35E' }}>{seqScore} / 60 pts</p></div>
            ) : (
              <CPRSequenceGame lang={lang === 'en' ? 'en' : 'bm'} onComplete={setSeqScore} />
            )}
          </div>
        )}

        {tab === 'photo' && (
          <div className="card-hud">
            <h3 className="font-bold mb-1 text-gray-900">{lang === 'en' ? 'Show Your CPR Hand Position' : 'Tunjukkan Kedudukan Tangan CPR'}</h3>
            <p className="text-sm text-gray-500 mb-3">{lang === 'en' ? 'Demonstrate the correct hand position for chest compressions (interlocked fingers, heel of palm on chest center).' : 'Tunjukkan kedudukan tangan yang betul untuk tekanan dada (jari berkunci, tapak tangan di tengah dada).'}</p>
            {photoScore !== null ? (
              <div className="text-center py-8"><div className="text-6xl mb-3">✅</div><p className="text-2xl font-black" style={{ color:'#00A35E' }}>{photoScore} / 20 pts</p></div>
            ) : (
              <CameraCapture label={lang === 'en' ? 'Capture your CPR hand position' : 'Tangkap kedudukan tangan CPR anda'} maxPhotos={2} points={10}
                onSubmit={(photos) => setPhotoScore(photos.length * 10)} />
            )}
          </div>
        )}

        {(seqScore !== null || photoScore !== null) && (
          <div className="mt-6">
            <ScoreSubmit moduleSlug="medical-cpr" score={total} maxScore={MAX} />
          </div>
        )}
      </div>
    </div>
  )
}
