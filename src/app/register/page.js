'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import NavBar from '@/components/NavBar'
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

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-24 pb-12 px-4 max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black">{t(lang, 'register')}</h1>
          <p className="text-gray-400 mt-2">{lang === 'en' ? 'One team = 3 players' : 'Satu pasukan = 3 pemain'}</p>
        </div>
        <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">{t(lang, 'groupName')}</label>
            <input className="input" placeholder={lang === 'en' ? 'e.g. Team Alpha' : 'cth. Pasukan Alfa'} value={form.groupName} onChange={e => update('groupName', e.target.value)} />
          </div>
          {[1, 2, 3].map(n => (
            <div key={n}>
              <label className="text-sm text-gray-400 mb-1 block">{t(lang, `player${n}`)}</label>
              <input className="input" placeholder={lang === 'en' ? `Player ${n} full name` : `Nama penuh Pemain ${n}`} value={form[`player${n}`]} onChange={e => update(`player${n}`, e.target.value)} />
            </div>
          ))}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="btn-primary mt-2" disabled={loading}>{loading ? '…' : t(lang, 'letsGo')} 🚀</button>
        </form>
      </main>
    </div>
  )
}