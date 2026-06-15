'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import NavBar from '@/components/NavBar'
import { supabase } from '@/lib/supabase'
import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/i18n'

const MODULE_ICONS = {
  'safe-driving': '🚗', 'slip-trip-fall': '⚠️', 'fire-emergency': '🔥',
  'plastic-recycling': '♻️', 'balanced-diet': '🥗', 'heart-health': '❤️',
  'mental-health': '🧠', 'ergonomic': '🪑', 'exercise': '🏃', 'medical-cpr': '🫀',
}
const MEDALS = ['🥇', '🥈', '🥉']

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
      <main className="pt-20 pb-12 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black">🏆 {t(lang, 'leaderboard')}</h1>
          <p className="text-gray-400 mt-1 text-sm">{lang === 'en' ? 'Live · updates automatically' : 'Langsung · dikemas kini secara automatik'}</p>
          {lastUpdate && <p className="text-xs text-gray-600 mt-1">{lang === 'en' ? 'Last updated:' : 'Dikemas kini:'} {lastUpdate.toLocaleTimeString()}</p>}
        </div>
        {loading ? (
          <div className="text-center text-gray-400 py-12"><div className="text-4xl mb-3 animate-spin">⏳</div>{lang === 'en' ? 'Loading scores…' : 'Memuatkan markah…'}</div>
        ) : rows.length === 0 ? (
          <div className="card text-center py-12 text-gray-500">{lang === 'en' ? 'No scores yet — be the first!' : 'Tiada markah lagi — jadilah yang pertama!'}</div>
        ) : (
          <div className="space-y-3">
            {rows.map((row, i) => {
              const isMe = team?.id === row.id
              return (
                <div key={row.id} className={`rounded-2xl border p-4 ${i === 0 ? 'border-yellow-500 bg-yellow-900/20' : i === 1 ? 'border-gray-400 bg-gray-800/60' : i === 2 ? 'border-orange-600 bg-orange-900/20' : isMe ? 'border-blue-500 bg-blue-900/20' : 'border-gray-800 bg-gray-900'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-black flex-shrink-0 bg-gray-800">{i < 3 ? MEDALS[i] : i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-lg truncate">{row.groupName}</p>
                        {isMe && <span className="badge-green text-xs flex-shrink-0">{lang === 'en' ? 'You' : 'Anda'}</span>}
                      </div>
                      <p className="text-xs text-gray-500 truncate">{row.players.join(' · ')}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-2xl font-black ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-white'}`}>{row.total}</p>
                      <p className="text-xs text-gray-500">{lang === 'en' ? 'points' : 'mata'}</p>
                    </div>
                  </div>
                  {row.modules.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {row.modules.map(m => (
                        <span key={m.module_slug} className="inline-flex items-center gap-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-0.5 text-xs">
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
          <button onClick={fetchScores} className="btn-secondary">{lang === 'en' ? '🔄 Refresh' : '🔄 Muat Semula'}</button>
        </div>
      </main>
    </div>
  )
}