'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useApp } from '@/contexts/AppContext'

export default function ScoreSubmit({ moduleSlug, score, maxScore, onDone }) {
  const { team, lang } = useApp()
  const [status, setStatus] = useState('idle')

  async function submitScore() {
    if (!team?.id) return
    setStatus('saving')
    const { error } = await supabase.from('scores').upsert({
      team_id: team.id, module_slug: moduleSlug, score, max_score: maxScore,
    }, { onConflict: 'team_id,module_slug' })
    if (error) { setStatus('error'); return }
    setStatus('done')
    onDone?.()
  }

  if (!team) return (
    <div className="mt-4 p-3 rounded-xl text-center text-sm"
      style={{ background:'rgba(240,165,0,0.08)', border:'1px solid rgba(240,165,0,0.25)', color:'#F0A500' }}>
      {lang === 'en' ? '⚠️ Register a team to save your score' : '⚠️ Daftar pasukan untuk simpan markah'}
    </div>
  )

  return (
    <div className="mt-4">
      {status === 'idle' && (
        <button onClick={submitScore} className="btn-primary w-full">
          {lang === 'en' ? '💾 Save Score to Leaderboard' : '💾 Simpan Markah ke Papan'}
        </button>
      )}
      {status === 'saving' && (
        <div className="flex items-center justify-center gap-3 py-3 text-gray-400">
          <div className="w-4 h-4 border-2 border-gray-600 border-t-neon-cyan rounded-full animate-spin" />
          {lang === 'en' ? 'Saving…' : 'Menyimpan…'}
        </div>
      )}
      {status === 'done' && (
        <div className="py-3 rounded-xl text-center font-bold"
          style={{ background:'rgba(0,255,136,0.08)', border:'1px solid rgba(0,255,136,0.3)', color:'#00FF88' }}>
          ✅ {lang === 'en' ? 'Score saved!' : 'Markah disimpan!'}
        </div>
      )}
      {status === 'error' && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-red-400 text-sm">{lang === 'en' ? '❌ Error saving. Try again.' : '❌ Ralat. Cuba lagi.'}</p>
          <button onClick={() => setStatus('idle')} className="btn-secondary text-sm py-2">{lang === 'en' ? 'Retry' : 'Cuba lagi'}</button>
        </div>
      )}
    </div>
  )
}