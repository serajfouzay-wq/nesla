'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import NavBar from '@/components/NavBar'
import { supabase } from '@/lib/supabase'
import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/i18n'

const MODULE_ICONS = {
  'safe-driving':'🚗','slip-trip-fall':'⚠️','fire-emergency':'🔥',
  'plastic-recycling':'♻️','balanced-diet':'🥗','heart-health':'❤️',
  'mental-health':'🧠','ergonomic':'🪑','exercise':'🏃','medical-cpr':'🫀',
}
const MEDALS = [
  { emoji:'🥇', color:'#FFD700', border:'rgba(255,215,0,0.4)', bg:'rgba(255,215,0,0.08)' },
  { emoji:'🥈', color:'#C0C0C0', border:'rgba(192,192,192,0.35)', bg:'rgba(192,192,192,0.06)' },
  { emoji:'🥉', color:'#CD7F32', border:'rgba(205,127,50,0.4)', bg:'rgba(205,127,50,0.08)' },
]

export default function LeaderboardPage() {
  const { lang, team } = useApp()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  async function fetchScores() {
    const { data } = await supabase.from('teams')
      .select('id, group_name, player1_name, player2_name, player3_name, scores(module_slug, score, max_score)')
      .order('group_name')
    if (!data) return
    const ranked = data.map(t => ({
      id: t.id, groupName: t.group_name,
      players: [t.player1_name, t.player2_name, t.player3_name],
      modules: t.scores || [],
      total: (t.scores || []).reduce((s, sc) => s + (sc.score || 0), 0),
    })).sort((a, b) => b.total - a.total)
    setRows(ranked); setLastUpdate(new Date()); setLoading(false)
  }

  useEffect(() => {
    fetchScores()
    const channel = supabase.channel('scores-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, fetchScores)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-16 pb-16 px-4 max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center pt-10 pb-8">
          <div className="text-5xl mb-4 animate-float">🏆</div>
          <h1 className="text-3xl font-black text-white mb-2">{t(lang, 'leaderboard')}</h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <p className="text-sm font-semibold" style={{ color:'#00FF88' }}>
              {lang === 'en' ? 'Live · Updates automatically' : 'Langsung · Dikemas kini secara automatik'}
            </p>
          </div>
          {lastUpdate && <p className="text-xs text-gray-600 mt-1">{lang === 'en' ? 'Last updated:' : 'Dikemas kini:'} {lastUpdate.toLocaleTimeString()}</p>}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-2 border-nestle-blue border-t-neon-cyan rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">{lang === 'en' ? 'Loading scores…' : 'Memuatkan markah…'}</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="card-hud text-center py-16">
            <div className="text-5xl mb-4">🎮</div>
            <p className="text-gray-400 font-semibold">{lang === 'en' ? 'No scores yet — be the first!' : 'Tiada markah lagi — jadilah yang pertama!'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {rows.map((row, i) => {
              const isMe = team?.id === row.id
              const medal = MEDALS[i]
              return (
                <div key={row.id} className="rounded-2xl p-4 transition-all animate-slide-up"
                  style={{
                    background: medal ? medal.bg : isMe ? 'rgba(0,212,255,0.05)' : 'rgba(10,22,40,0.8)',
                    border: `1px solid ${medal ? medal.border : isMe ? 'rgba(0,212,255,0.35)' : 'rgba(26,58,107,0.5)'}`,
                    animationDelay: `${i * 50}ms`,
                  }}>
                  <div className="flex items-center gap-3">
                    {/* Rank */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center font-black flex-shrink-0 text-xl"
                      style={{ background: medal ? `${medal.color}15` : 'rgba(26,58,107,0.4)', border:`1px solid ${medal ? medal.border : 'rgba(26,58,107,0.5)'}` }}>
                      {medal ? medal.emoji : <span className="text-sm text-gray-500">{i + 1}</span>}
                    </div>

                    {/* Team info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-black text-lg truncate text-white">{row.groupName}</p>
                        {isMe && <span className="badge-cyan flex-shrink-0" style={{ fontSize:'10px' }}>{lang === 'en' ? 'YOU' : 'ANDA'}</span>}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{row.players.join(' · ')}</p>
                    </div>

                    {/* Score */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-black score-counter" style={{ color: medal ? medal.color : 'white', textShadow: medal ? `0 0 12px ${medal.color}60` : 'none' }}>{row.total}</p>
                      <p className="text-xs text-gray-600">{lang === 'en' ? 'pts' : 'mata'}</p>
                    </div>
                  </div>

                  {/* Module badges */}
                  {row.modules.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3"
                      style={{ borderTop:'1px solid rgba(26,58,107,0.4)' }}>
                      {row.modules.map(m => (
                        <span key={m.module_slug} className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg"
                          style={{ background:'rgba(0,112,60,0.12)', border:'1px solid rgba(0,112,60,0.3)', color:'#00FF88' }}>
                          {MODULE_ICONS[m.module_slug] || '📋'} {m.score}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="text-center mt-8">
          <button onClick={fetchScores} className="btn-secondary">
            🔄 {lang === 'en' ? 'Refresh' : 'Muat Semula'}
          </button>
        </div>
      </main>
    </div>
  )
}