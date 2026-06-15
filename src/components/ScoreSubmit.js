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

  if (!team) return null
  return (
    <div className="mt-4">
      {status === 'idle' && <button onClick={submitScore} className="btn-primary w-full">{lang === 'en' ? '✅ Save Score' : '✅ Simpan Markah'}</button>}
      {status === 'saving' && <p className="text-center text-gray-400">Saving…</p>}
      {status === 'done' && <p className="text-center text-green-400 font-bold">Score saved!</p>}
      {status === 'error' && <p className="text-center text-red-400">Error saving. Try again.</p>}
    </div>
  )
}