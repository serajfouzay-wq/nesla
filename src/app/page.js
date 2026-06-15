'use client'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/i18n'

const MODULES = [
  { slug: 'safe-driving', icon: '🚗', status: 'ready', priority: 1, color: 'from-blue-900 to-blue-800', border: 'border-blue-700' },
  { slug: 'slip-trip-fall', icon: '⚠️', status: 'ready', priority: 1, color: 'from-orange-900 to-orange-800', border: 'border-orange-700' },
  { slug: 'fire-emergency', icon: '🔥', status: 'ready', priority: 2, color: 'from-red-900 to-red-800', border: 'border-red-700' },
  { slug: 'plastic-recycling', icon: '♻️', status: 'ready', priority: 2, color: 'from-green-900 to-green-800', border: 'border-green-700' },
  { slug: 'balanced-diet', icon: '🥗', status: 'ready', priority: 2, color: 'from-lime-900 to-lime-800', border: 'border-lime-700' },
  { slug: 'heart-health', icon: '❤️', status: 'ready', priority: 2, color: 'from-pink-900 to-pink-800', border: 'border-pink-700' },
  { slug: 'mental-health', icon: '🧠', status: 'ready', priority: 2, color: 'from-purple-900 to-purple-800', border: 'border-purple-700' },
  { slug: 'ergonomic', icon: '🪑', status: 'pending', priority: 3, color: 'from-gray-800 to-gray-700', border: 'border-gray-600' },
  { slug: 'exercise', icon: '🏃', status: 'pending', priority: 3, color: 'from-gray-800 to-gray-700', border: 'border-gray-600' },
  { slug: 'medical-cpr', icon: '🫀', status: 'pending', priority: 3, color: 'from-gray-800 to-gray-700', border: 'border-gray-600' },
]

const MODULE_KEYS = {
  'safe-driving': 'safeDriving', 'slip-trip-fall': 'slipTripFall', 'fire-emergency': 'fireEmergency',
  'plastic-recycling': 'plasticRecycling', 'balanced-diet': 'balancedDiet', 'heart-health': 'heartHealth',
  'mental-health': 'mentalHealth', 'ergonomic': 'ergonomic', 'exercise': 'exercise', 'medical-cpr': 'medicalCpr',
}

export default function HomePage() {
  const { lang, team } = useApp()
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-20 pb-12 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block bg-nestle-red text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">Nestlé Malaysia</div>
          <h1 className="text-4xl sm:text-5xl font-black mb-2">{t(lang, 'appTitle')}</h1>
          <p className="text-gray-400 text-lg">{t(lang, 'appSubtitle')}</p>
        </div>
        {!team ? (
          <div className="card text-center mb-8 border-nestle-red/40">
            <p className="text-gray-300 mb-3">{lang === 'en' ? 'Register your team to track scores' : 'Daftarkan pasukan anda untuk jejaki markah'}</p>
            <Link href="/register" className="btn-primary inline-block">{t(lang, 'register')} →</Link>
          </div>
        ) : (
          <div className="card text-center mb-8 border-green-700/40 bg-green-900/20">
            <p className="text-green-400 font-bold text-lg">👥 {team.groupName}</p>
            <p className="text-gray-400 text-sm mt-1">{team.player1} · {team.player2} · {team.player3}</p>
          </div>
        )}
        <h2 className="text-xl font-bold mb-4 text-gray-300">{t(lang, 'selectModule')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((mod) => {
            const name = t(lang, `modules.${MODULE_KEYS[mod.slug]}`)
            const isReady = mod.status === 'ready'
            return (
              <Link key={mod.slug} href={`/modules/${mod.slug}`}
                className={`group block bg-gradient-to-br ${mod.color} border ${mod.border} rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/40`}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{mod.icon}</span>
                  <div className="flex gap-1 flex-col items-end">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${mod.priority === 1 ? 'bg-yellow-500 text-yellow-950' : mod.priority === 2 ? 'bg-blue-500 text-blue-950' : 'bg-gray-500 text-gray-950'}`}>P{mod.priority}</span>
                    <span className={isReady ? 'badge-green' : 'badge-yellow'}>{isReady ? t(lang, 'priority.ready') : t(lang, 'priority.pending')}</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-white">{name}</h3>
                <p className="text-gray-400 text-sm mt-1 group-hover:text-gray-300 transition-colors">
                  {isReady ? (lang === 'en' ? 'Tap to play →' : 'Ketik untuk main →') : (lang === 'en' ? 'Assets pending…' : 'Menunggu aset…')}
                </p>
              </Link>
            )
          })}
        </div>
        <div className="text-center mt-10">
          <Link href="/admin" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">🔒 {t(lang, 'admin')}</Link>
        </div>
      </main>
    </div>
  )
}