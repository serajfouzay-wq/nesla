'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import NavBar from '@/components/NavBar'
import { supabase } from '@/lib/supabase'
import { useApp } from '@/contexts/AppContext'

const MODULES = [
  { slug: 'safe-driving', icon: '🚗', en: 'Safe Driving', bm: 'Pemanduan Selamat' },
  { slug: 'slip-trip-fall', icon: '⚠️', en: 'Slip, Trip & Fall', bm: 'Gelincir & Jatuh' },
  { slug: 'fire-emergency', icon: '🔥', en: 'Fire Emergency', bm: 'Kecemasan Api' },
  { slug: 'plastic-recycling', icon: '♻️', en: 'Plastic Recycling', bm: 'Kitar Semula' },
  { slug: 'balanced-diet', icon: '🥗', en: 'Balanced Diet', bm: 'Diet Seimbang' },
  { slug: 'heart-health', icon: '❤️', en: 'Heart Health', bm: 'Kes. Jantung' },
  { slug: 'mental-health', icon: '🧠', en: 'Mental Health', bm: 'Kes. Mental' },
]
const MEDALS = ['🥇', '🥈', '🥉']

export default function AdminPage() {
  const { lang } = useApp()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [view, setView] = useState('board')

  async function fetchData() {
    const { data } = await supabase.from('teams')
      .select('id, group_name, player1_name, player2_name, player3_name, created_at, scores(module_slug, score, max_score, completed_at)')
      .order('group_name')
    if (!data) return
    const ranked = data.map(t => ({ id: t.id, groupName: t.group_name, players: [t.player1_name, t.player2_name, t.player3_name], modules: {}, total: 0 }))
    for (const row of ranked) {
      const teamData = data.find(t => t.id === row.id)
      for (const sc of teamData.scores || []) { row.modules[sc.module_slug] = { score: sc.score, max: sc.max_score }; row.total += sc.score }
    }
    ranked.sort((a, b) => b.total - a.total)
    setRows(ranked); setLastUpdate(new Date()); setLoading(false)
  }

  useEffect(() => {
    fetchData()
    const channel = supabase.channel('admin-scores')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, fetchData)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const leader = rows[0]
  const totalSubmissions = rows.reduce((s, r) => s + Object.keys(r.modules).length, 0)

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-20 pb-12 px-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black">{lang === 'en' ? '🔒 Admin Dashboard' : '🔒 Papan Pemuka Admin'}</h1>
            <p className="text-xs text-gray-500 mt-1">Live · Real-time via Supabase{lastUpdate && ` · Updated ${lastUpdate.toLocaleTimeString()}`}</p>
          </div>
          <button onClick={fetchData} className="btn-secondary text-sm">🔄</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="card text-center"><p className="text-3xl font-black text-blue-400">{rows.length}</p><p className="text-xs text-gray-400 mt-1">{lang === 'en' ? 'Teams registered' : 'Pasukan berdaftar'}</p></div>
          <div className="card text-center"><p className="text-3xl font-black text-green-400">{totalSubmissions}</p><p className="text-xs text-gray-400 mt-1">{lang === 'en' ? 'Module submissions' : 'Penyerahan modul'}</p></div>
          <div className="card text-center"><p className="text-3xl font-black text-yellow-400">{leader?.total ?? 0}</p><p className="text-xs text-gray-400 mt-1">{lang === 'en' ? 'Top score' : 'Markah teratas'}</p></div>
          <div className="card text-center"><p className="text-xl font-black text-orange-400 truncate">{leader?.groupName ?? '—'}</p><p className="text-xs text-gray-400 mt-1">{lang === 'en' ? 'Current leader' : 'Pemimpin semasa'}</p></div>
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setView('board')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${view === 'board' ? 'bg-nestle-red text-white' : 'bg-gray-800 text-gray-400'}`}>{lang === 'en' ? '🏆 Leaderboard' : '🏆 Papan Markah'}</button>
          <button onClick={() => setView('detail')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${view === 'detail' ? 'bg-nestle-red text-white' : 'bg-gray-800 text-gray-400'}`}>{lang === 'en' ? '📋 Module Breakdown' : '📋 Pecahan Modul'}</button>
        </div>
        {loading ? (
          <div className="text-center text-gray-400 py-12"><div className="text-4xl mb-3">⏳</div>{lang === 'en' ? 'Loading…' : 'Memuatkan…'}</div>
        ) : view === 'board' ? (
          <div className="space-y-2">
            {rows.map((row, i) => (
              <div key={row.id} className={`rounded-xl border p-4 flex items-center gap-4 ${i === 0 ? 'border-yellow-500 bg-yellow-900/20' : i === 1 ? 'border-gray-500 bg-gray-800/50' : i === 2 ? 'border-orange-600 bg-orange-900/20' : 'border-gray-800 bg-gray-900'}`}>
                <div className="w-10 text-center text-xl font-black">{i < 3 ? MEDALS[i] : i + 1}</div>
                <div className="flex-1 min-w-0"><p className="font-bold truncate">{row.groupName}</p><p className="text-xs text-gray-500 truncate">{row.players.join(' · ')}</p></div>
                <div className="flex items-center gap-1 flex-wrap justify-end">
                  {MODULES.map(m => (
                    <div key={m.slug} title={lang === 'en' ? m.en : m.bm} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${row.modules[m.slug] ? 'bg-green-900/60 border border-green-700' : 'bg-gray-800 border border-gray-700 opacity-30'}`}>{m.icon}</div>
                  ))}
                </div>
                <div className={`text-2xl font-black flex-shrink-0 ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-orange-400' : 'text-white'}`}>{row.total}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-800">
                <th className="text-left py-3 px-2 text-gray-400">{lang === 'en' ? 'Team' : 'Pasukan'}</th>
                {MODULES.map(m => <th key={m.slug} className="text-center py-3 px-2 text-gray-400">{m.icon}</th>)}
                <th className="text-right py-3 px-2 text-gray-400">{lang === 'en' ? 'Total' : 'Jumlah'}</th>
              </tr></thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="py-3 px-2"><div className="flex items-center gap-2"><span>{i < 3 ? MEDALS[i] : ''}</span><div><p className="font-semibold">{row.groupName}</p><p className="text-xs text-gray-500">{row.players.join(', ')}</p></div></div></td>
                    {MODULES.map(m => (
                      <td key={m.slug} className="text-center py-3 px-2">
                        {row.modules[m.slug] ? <div><p className="font-bold text-green-400">{row.modules[m.slug].score}</p><p className="text-xs text-gray-600">/{row.modules[m.slug].max}</p></div> : <span className="text-gray-700">—</span>}
                      </td>
                    ))}
                    <td className="text-right py-3 px-2"><span className="font-black text-lg">{row.total}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}