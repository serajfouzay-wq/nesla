'use client'
import NavBar from '@/components/NavBar'
import { useApp } from '@/contexts/AppContext'

export default function PlaceholderModule({ icon, nameKey, priority }) {
  const { lang } = useApp()
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-20 pb-12 px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <span className="text-3xl">{icon}</span>
          <div>
            <h1 className="text-2xl font-black">{nameKey}</h1>
            <span className="badge-yellow">Priority {priority}</span>
          </div>
        </div>
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-xl font-bold mb-2">{lang === 'en' ? 'Module Coming Soon' : 'Modul Akan Datang'}</h2>
          <p className="text-gray-400 max-w-sm mx-auto">
            {lang === 'en'
              ? 'This module requires video/photo assets currently being produced.'
              : 'Modul ini memerlukan aset video/foto yang sedang dihasilkan.'}
          </p>
          <div className="mt-6 inline-block bg-yellow-900/30 border border-yellow-700 rounded-xl px-4 py-2">
            <p className="text-yellow-400 text-sm font-semibold">
              {lang === 'en' ? '⏳ Pending media production' : '⏳ Menunggu penghasilan media'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}