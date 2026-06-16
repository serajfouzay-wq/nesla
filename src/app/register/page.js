'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
import BirdMascot from '@/components/BirdMascot'
import { useApp } from '@/contexts/AppContext'
import { supabase } from '@/lib/supabase'
import { t } from '@/lib/i18n'

export default function RegisterPage() {
  const { lang, saveTeam } = useApp()
  const router = useRouter()
  const [form, setForm] = useState({ groupName: '', player1: '', player2: '', player3: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function update(key, val) { setForm(f => ({ ...f, [key]: val })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.groupName || !form.player1 || !form.player2 || !form.player3) {
      setError(lang === 'en' ? 'Please fill in all fields.' : 'Sila isi semua ruangan.')
      return
    }
    setLoading(true); setError('')
    const { data, error: dbErr } = await supabase.from('teams').insert({
      group_name: form.groupName, player1_name: form.player1,
      player2_name: form.player2, player3_name: form.player3,
    }).select().single()
    if (dbErr) { setError(lang === 'en' ? 'Failed to register. Try again.' : 'Gagal mendaftar. Cuba lagi.'); setLoading(false); return }
    saveTeam({ id: data.id, groupName: data.group_name, player1: data.player1_name, player2: data.player2_name, player3: data.player3_name })
    router.push('/')
  }

  const allFilled = form.groupName && form.player1 && form.player2 && form.player3

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-16 pb-16 px-4 max-w-md mx-auto">

        {/* Header */}
        <div className="text-center pt-10 pb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 text-3xl"
            style={{ background:'rgba(226,0,26,0.12)', border:'1px solid rgba(226,0,26,0.35)' }}>🎮</div>
          <h1 className="text-3xl font-black text-white mb-2">{t(lang, 'register')}</h1>
          <p className="text-gray-400">{lang === 'en' ? 'One team · 3 players · Unlimited glory' : 'Satu pasukan · 3 pemain · Kemuliaan tanpa had'}</p>
        </div>

        <BirdMascot state="start" message={lang === 'en' ? "Register your team to compete in today's SHE Day Tournament!" : "Daftar pasukan anda untuk bersaing dalam Pertandingan SHE Day hari ini!"} className="mb-6" />

        <form onSubmit={handleSubmit} className="card-hud space-y-4">
          {/* Team name */}
          <div>
            <label className="hud-label block mb-2">{t(lang, 'groupName')}</label>
            <input className="input" placeholder={lang === 'en' ? 'e.g. Team Alpha ⚡' : 'cth. Pasukan Alfa ⚡'}
              value={form.groupName} onChange={e => update('groupName', e.target.value)} />
          </div>

          <div className="hud-divider" />

          {/* Players */}
          {[1,2,3].map(n => (
            <div key={n}>
              <label className="hud-label block mb-2">
                {n === 1 ? '👑' : n === 2 ? '⚔️' : '🛡️'} {t(lang, `player${n}`)}
              </label>
              <input className="input"
                placeholder={lang === 'en' ? `Player ${n} full name` : `Nama penuh Pemain ${n}`}
                value={form[`player${n}`]} onChange={e => update(`player${n}`, e.target.value)} />
            </div>
          ))}

          {error && (
            <div className="p-3 rounded-xl text-sm font-semibold animate-slide-up"
              style={{ background:'rgba(255,34,68,0.08)', border:'1px solid rgba(255,34,68,0.35)', color:'#FF6080' }}>
              ⚠️ {error}
            </div>
          )}

          <button type="submit" className="btn-primary w-full mt-2" disabled={loading || !allFilled}
            style={{ opacity: (!allFilled && !loading) ? 0.5 : 1 }}>
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {lang === 'en' ? 'Registering…' : 'Mendaftar…'}
              </span>
            ) : `${t(lang, 'letsGo')} 🚀`}
          </button>
        </form>
      </main>
    </div>
  )
}