'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import NavBar from '@/components/NavBar'
import { supabase } from '@/lib/supabase'
import { useApp } from '@/contexts/AppContext'

const MODULES = [
  { slug: 'safe-driving', icon: '🚗', en: 'Safe Driving' },
  { slug: 'slip-trip-fall', icon: '⚠️', en: 'Slip, Trip & Fall' },
  { slug: 'fire-emergency', icon: '🔥', en: 'Fire Emergency' },
  { slug: 'plastic-recycling', icon: '♻️', en: 'Plastic Recycling' },
  { slug: 'balanced-diet', icon: '🥗', en: 'Balanced Diet' },
  { slug: 'heart-health', icon: '❤️', en: 'Heart Health' },
  { slug: 'mental-health', icon: '🧠', en: 'Mental Health' },
  { slug: 'ergonomic', icon: '🪑', en: 'Ergonomic' },
  { slug: 'exercise', icon: '🏃', en: 'Exercise' },
  { slug: 'medical-cpr', icon: '🫀', en: 'Medical/CPR' },
]
const MEDALS = ['🥇', '🥈', '🥉']

export default function AdminPage() {
  const { lang } = useApp()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [view, setView] = useState('board')
  const [error, setError] = useState(null)

  async function fetchData() {
    try {
      const { data, error: err } = await supabase.from('teams')
        .select('id, group_name, player1_name, player2_name, player3_name, created_at, scores(module_slug, score, max_score, completed_at)')
        .order('group_name')
      if (err) { setError(err.message); setLoading(false); return }
      if (!data) { setLoading(false); return }
      const ranked = data.map(team => {
        const modules = {}
        let total = 0
        for (const sc of team.scores || []) {
          modules[sc.module_slug] = { score: sc.score, max: sc.max_score }
          total += sc.score || 0
        }
        return {
          id: team.id, groupName: team.group_name,
          players: [team.player1_name, team.player2_name, team.player3_name],
          modules, total, createdAt: team.created_at,
        }
      })
      ranked.sort((a, b) => b.total - a.total)
      setRows(ranked); setLastUpdate(new Date()); setLoading(false); setError(null)
    } catch (e) {
      setError(e.message); setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    let channel
    try {
      channel = supabase.channel('admin-scores')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' }, fetchData)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, fetchData)
        .subscribe()
    } catch (e) { /* supabase not configured, ignore */ }
    return () => { if (channel) supabase.removeChannel(channel) }
  }, [])

  function downloadCSV() {
    const header = ['Team', 'Player 1', 'Player 2', 'Player 3', ...MODULES.map(m => m.en), 'Total']
    const lines = [header.join(',')]
    rows.forEach(r => {
      const cells = [
        r.groupName, ...r.players,
        ...MODULES.map(m => r.modules[m.slug] ? r.modules[m.slug].score : ''),
        r.total,
      ]
      lines.push(cells.map(c => `"${String(c ?? '').replace(/"/g, '""')}"`).join(','))
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `she-day-2026-scores-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.csv`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const leader = rows[0]
  const totalSubmissions = rows.reduce((s, r) => s + Object.keys(r.modules).length, 0)

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-20 pb-16 px-4 max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">🔒 {lang === 'en' ? 'Admin Dashboard' : 'Papan Pemuka Admin'}</h1>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse inline-block" />
              Live · Supabase{lastUpdate && ` · ${lang === 'en' ? 'Updated' : 'Dikemas kini'} ${lastUpdate.toLocaleTimeString()}`}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchData} className="btn-secondary text-sm py-2 px-4">🔄 {lang === 'en' ? 'Refresh' : 'Muat Semula'}</button>
            <button onClick={downloadCSV} disabled={rows.length === 0} className="btn-primary text-sm py-2 px-4" style={{ opacity: rows.length === 0 ? 0.5 : 1 }}>
              ⬇️ {lang === 'en' ? 'Download CSV' : 'Muat Turun CSV'}
            </button>
          </div>
        </div>

        {error && (
          <div className="card-red mb-6">
            <p className="font-bold mb-1" style={{ color:'#FF6080' }}>⚠️ {lang === 'en' ? 'Could not load data' : 'Gagal memuatkan data'}</p>
            <p className="text-sm text-gray-500">{error}</p>
            <p className="text-xs text-gray-500 mt-2">{lang === 'en' ? 'Check that NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in Vercel project settings, and that your teams/scores tables exist.' : 'Semak bahawa NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY ditetapkan dalam tetapan projek Vercel.'}</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="card-hud text-center"><p className="text-3xl font-black text-blue-400">{rows.length}</p><p className="text-xs text-gray-500 mt-1">{lang === 'en' ? 'Teams registered' : 'Pasukan berdaftar'}</p></div>
          <div className="card-hud text-center"><p className="text-3xl font-black" style={{ color:'#00A35E' }}>{totalSubmissions}</p><p className="text-xs text-gray-500 mt-1">{lang === 'en' ? 'Module submissions' : 'Penyerahan modul'}</p></div>
          <div className="card-hud text-center"><p className="text-3xl font-black text-yellow-400">{leader?.total ?? 0}</p><p className="text-xs text-gray-500 mt-1">{lang === 'en' ? 'Top score' : 'Markah teratas'}</p></div>
          <div className="card-hud text-center"><p className="text-xl font-black text-orange-400 truncate">{leader?.groupName ?? '—'}</p><p className="text-xs text-gray-500 mt-1">{lang === 'en' ? 'Current leader' : 'Pemimpin semasa'}</p></div>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setView('board')} className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            style={view === 'board' ? { background:'#E2001A', color:'white' } : { background:'rgba(0,0,0,0.05)', color:'#6B7280' }}>🏆 {lang === 'en' ? 'Leaderboard' : 'Papan Markah'}</button>
          <button onClick={() => setView('detail')} className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            style={view === 'detail' ? { background:'#E2001A', color:'white' } : { background:'rgba(0,0,0,0.05)', color:'#6B7280' }}>📋 {lang === 'en' ? 'Module Breakdown' : 'Pecahan Modul'}</button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-16">
            <div className="w-12 h-12 border-2 border-nestle-blue border-t-neon-cyan rounded-full animate-spin mx-auto mb-4" />
            {lang === 'en' ? 'Loading…' : 'Memuatkan…'}
          </div>
        ) : rows.length === 0 ? (
          <div className="card-hud text-center py-16 text-gray-500">{lang === 'en' ? 'No teams registered yet.' : 'Belum ada pasukan berdaftar.'}</div>
        ) : view === 'board' ? (
          <div className="space-y-2">
            {rows.map((row, i) => (
              <div key={row.id} className="rounded-xl p-4 flex items-center gap-4"
                style={{
                  background: i === 0 ? 'rgba(255,215,0,0.08)' : i === 1 ? 'rgba(192,192,192,0.05)' : i === 2 ? 'rgba(205,127,50,0.07)' : 'rgba(0,0,0,0.02)',
                  border: `1px solid ${i === 0 ? 'rgba(255,215,0,0.35)' : i === 1 ? 'rgba(192,192,192,0.3)' : i === 2 ? 'rgba(205,127,50,0.35)' : 'rgba(0,0,0,0.08)'}`,
                }}>
                <div className="w-10 text-center text-xl font-black">{i < 3 ? MEDALS[i] : <span className="text-gray-500 text-sm">{i+1}</span>}</div>
                <div className="flex-1 min-w-0"><p className="font-bold truncate text-gray-900">{row.groupName}</p><p className="text-xs text-gray-500 truncate">{row.players.join(' · ')}</p></div>
                <div className="flex items-center gap-1 flex-wrap justify-end">
                  {MODULES.map(m => (
                    <div key={m.slug} title={m.en} className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                      style={{ background: row.modules[m.slug] ? 'rgba(0,163,94,0.12)' : 'rgba(0,0,0,0.08)', border:`1px solid ${row.modules[m.slug] ? 'rgba(0,163,94,0.12)' : 'rgba(0,0,0,0.08)'}`, opacity: row.modules[m.slug] ? 1 : 0.3 }}>{m.icon}</div>
                  ))}
                </div>
                <div className="text-2xl font-black flex-shrink-0" style={{ color: i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : 'white' }}>{row.total}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto card-hud">
            <table className="w-full text-sm">
              <thead><tr style={{ borderBottom:'1px solid rgba(0,0,0,0.08)' }}>
                <th className="text-left py-3 px-2 text-gray-500">{lang === 'en' ? 'Team' : 'Pasukan'}</th>
                {MODULES.map(m => <th key={m.slug} className="text-center py-3 px-2 text-gray-500" title={m.en}>{m.icon}</th>)}
                <th className="text-right py-3 px-2 text-gray-500">{lang === 'en' ? 'Total' : 'Jumlah'}</th>
              </tr></thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id} style={{ borderBottom:'1px solid rgba(0,0,0,0.08)' }}>
                    <td className="py-3 px-2"><div className="flex items-center gap-2"><span>{i < 3 ? MEDALS[i] : ''}</span><div><p className="font-semibold text-gray-900">{row.groupName}</p><p className="text-xs text-gray-500">{row.players.join(', ')}</p></div></div></td>
                    {MODULES.map(m => (
                      <td key={m.slug} className="text-center py-3 px-2">
                        {row.modules[m.slug] ? <div><p className="font-bold" style={{ color:'#00A35E' }}>{row.modules[m.slug].score}</p><p className="text-xs text-gray-600">/{row.modules[m.slug].max}</p></div> : <span className="text-gray-700">—</span>}
                      </td>
                    ))}
                    <td className="text-right py-3 px-2"><span className="font-black text-lg text-gray-900">{row.total}</span></td>
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
