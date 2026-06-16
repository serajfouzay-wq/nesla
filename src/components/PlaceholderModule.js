'use client'
import NavBar from '@/components/NavBar'
import BirdMascot from '@/components/BirdMascot'
import { useApp } from '@/contexts/AppContext'

export default function PlaceholderModule({ icon, nameKey, priority }) {
  const { lang } = useApp()
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-16 pb-16 px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8 pt-6">
          <span className="text-4xl">{icon}</span>
          <div>
            <h1 className="text-2xl font-black text-white">{nameKey}</h1>
            <span className="badge-yellow">Priority {priority}</span>
          </div>
        </div>
        <BirdMascot state="idle" message={lang === 'en' ? "This module's video assets are being produced. Check back soon!" : "Aset video modul ini sedang dihasilkan. Semak semula tidak lama lagi!"} className="mb-6" />
        <div className="card-hud text-center py-14">
          <div className="text-6xl mb-5 animate-float">🎬</div>
          <h2 className="text-xl font-black mb-3 text-white">{lang === 'en' ? 'Module Coming Soon' : 'Modul Akan Datang'}</h2>
          <p className="text-gray-400 max-w-sm mx-auto text-sm">
            {lang === 'en'
              ? 'This module requires video and photo assets that are currently in production.'
              : 'Modul ini memerlukan aset video dan foto yang sedang dalam penghasilan.'}
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl"
            style={{ background:'rgba(240,165,0,0.08)', border:'1px solid rgba(240,165,0,0.3)' }}>
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            <p className="text-yellow-400 text-sm font-bold">
              {lang === 'en' ? 'Pending media production' : 'Menunggu penghasilan media'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}