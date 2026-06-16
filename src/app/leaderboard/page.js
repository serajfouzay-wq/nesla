'use client'
import Link from 'next/link'
import NavBar from '@/components/NavBar'
import BirdMascot from '@/components/BirdMascot'
import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/i18n'
import { useState } from 'react'

const MODULES = [
  { slug: 'safe-driving',      icon: '🚗', status: 'ready',   priority: 1, accent: '#3B82F6', glow: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.35)' },
  { slug: 'slip-trip-fall',    icon: '⚠️', status: 'ready',   priority: 1, accent: '#F97316', glow: 'rgba(249,115,22,0.15)', border: 'rgba(249,115,22,0.35)' },
  { slug: 'fire-emergency',    icon: '🔥', status: 'ready',   priority: 2, accent: '#E2001A', glow: 'rgba(226,0,26,0.15)',   border: 'rgba(226,0,26,0.35)'   },
  { slug: 'plastic-recycling', icon: '♻️', status: 'ready',   priority: 2, accent: '#00703C', glow: 'rgba(0,112,60,0.15)',   border: 'rgba(0,112,60,0.35)'   },
  { slug: 'balanced-diet',     icon: '🥗', status: 'ready',   priority: 2, accent: '#84CC16', glow: 'rgba(132,204,22,0.15)', border: 'rgba(132,204,22,0.35)' },
  { slug: 'heart-health',      icon: '❤️', status: 'ready',   priority: 2, accent: '#EC4899', glow: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.35)' },
  { slug: 'mental-health',     icon: '🧠', status: 'ready',   priority: 2, accent: '#A855F7', glow: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.35)' },
  { slug: 'ergonomic',         icon: '🪑', status: 'pending', priority: 3, accent: '#64748B', glow: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.25)' },
  { slug: 'exercise',          icon: '🏃', status: 'pending', priority: 3, accent: '#64748B', glow: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.25)' },
  { slug: 'medical-cpr',       icon: '🫀', status: 'pending', priority: 3, accent: '#64748B', glow: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.25)' },
]

const MODULE_KEYS = {
  'safe-driving': 'safeDriving', 'slip-trip-fall': 'slipTripFall', 'fire-emergency': 'fireEmergency',
  'plastic-recycling': 'plasticRecycling', 'balanced-diet': 'balancedDiet', 'heart-health': 'heartHealth',
  'mental-health': 'mentalHealth', 'ergonomic': 'ergonomic', 'exercise': 'exercise', 'medical-cpr': 'medicalCpr',
}

const PRIORITY_LABELS = { 1: { label: 'P1', color: '#FFD700', bg: 'rgba(255, 201, 99, 0.12)', border: 'rgba(251, 192, 15, 0.35)' }, 2: { label: 'P2', color: '#00D4FF', bg: 'rgba(7, 200, 238, 0.12)', border: 'rgba(0,212,255,0.35)' }, 3: { label: 'P3', color: '#94A3B8', bg: 'rgba(107, 114, 128, 0.08)', border: 'rgba(107,114,128,0.25)' } }

export default function HomePage() {
  const { lang, team } = useApp()
  const [birdDismissed, setBirdDismissed] = useState(false)

  const readyCount = MODULES.filter(m => m.status === 'ready').length

  return (
    <div className="min-h-screen">
      <NavBar />

      <main className="pt-16 pb-16 px-4 max-w-5xl mx-auto">

        {/* Hero */}
        <div className="text-center py-10 sm:py-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-5"
            style={{ background:'rgba(226,0,26,0.12)', border:'1px solid rgba(226,0,26,0.35)', color:'#FF6080' }}>
            🇲🇾 Nestlé Malaysia · 29 April 2026
          </div>
          <h1 className="text-4xl sm:text-6xl font-black mb-3 leading-none tracking-tight">
            <span className="text-gray-900">SHE Day</span>{' '}
            <span style={{ color:'#E2001A', textShadow:'0 0 30px rgba(226,0,26,0.4)' }}>2026</span>
          </h1>
          <p className="text-gray-500 text-lg sm:text-xl font-medium mb-2">
            {t(lang, 'appSubtitle')}
          </p>
          <p className="text-xs text-gray-600 font-semibold uppercase tracking-widest">
            Sales Region Tournament · {readyCount} modules active
          </p>
        </div>

        {/* Team status */}
        {!team ? (
          <div className="card-hud mb-8 animate-slide-up text-center">
            <div className="text-3xl mb-3">🎮</div>
            <p className="text-gray-900 font-bold text-lg mb-1">{lang === 'en' ? 'Register Your Team' : 'Daftarkan Pasukan Anda'}</p>
            <p className="text-gray-500 text-sm mb-5">{lang === 'en' ? 'Create a team of 3 to compete and track scores' : 'Buat pasukan 3 orang untuk bersaing dan jejak markah'}</p>
            <Link href="/register" className="btn-primary">{t(lang, 'register')} 🚀</Link>
          </div>
        ) : (
          <div className="mb-8 animate-slide-up rounded-2xl p-5 flex items-center gap-4"
            style={{ background:'rgba(13, 176, 100, 0.1)', border:'1px solid rgba(0,163,94,0.12)', boxShadow:'0 0 24px rgba(0,163,94,0.12)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background:'rgba(12, 211, 82, 0.1)', border:'1px solid rgba(0,163,94,0.12)' }}>👥</div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-lg" style={{ color:'#00A35E' }}>{team.groupName}</p>
              <p className="text-sm text-gray-500 truncate">{team.player1} · {team.player2} · {team.player3}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color:'#00A35E' }}>
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              {lang === 'en' ? 'Active' : 'Aktif'}
            </div>
          </div>
        )}

        {/* Bird mascot intro */}
        {!birdDismissed && (
          <div className="mb-8 animate-slide-up">
            <BirdMascot state="start" onDismiss={() => setBirdDismissed(true)} />
          </div>
        )}

        {/* HUD divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="hud-label">{t(lang, 'selectModule')}</div>
          <div className="flex-1 hud-divider my-0" />
          <span className="text-xs text-gray-600">{readyCount}/{MODULES.length} {lang === 'en' ? 'ready' : 'sedia'}</span>
        </div>

        {/* Module grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {MODULES.map((mod, i) => {
            const name = t(lang, `modules.${MODULE_KEYS[mod.slug]}`)
            const isReady = mod.status === 'ready'
            const p = PRIORITY_LABELS[mod.priority]
            return (
              <Link key={mod.slug} href={`/modules/${mod.slug}`}
                className="module-card group"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.95) 0%, ${mod.glow} 100%)`,
                  border: `1px solid ${mod.border}`,
                  boxShadow: isReady ? `0 0 20px ${mod.glow}` : 'none',
                  animationDelay: `${i * 40}ms`,
                }}>
                {/* Priority badge */}
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{mod.icon}</span>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-xs font-black px-2 py-0.5 rounded-full"
                      style={{ background: p.bg, border:`1px solid ${p.border}`, color: p.color }}>
                      {p.label}
                    </span>
                    <span className={isReady ? 'badge-green' : 'badge-yellow'} style={{ fontSize:'10px' }}>
                      {isReady ? (lang === 'en' ? '● LIVE' : '● AKTIF') : (lang === 'en' ? '⏳ SOON' : '⏳ SEGERA')}
                    </span>
                  </div>
                </div>

                <h3 className="font-black text-base text-gray-900 mb-1.5 leading-tight">{name}</h3>

                {/* Mini progress bar (decorative) */}
                <div className="progress-track mb-3">
                  <div className="progress-fill" style={{ width: isReady ? '100%' : '30%', background: isReady ? `linear-gradient(90deg, ${mod.accent}88, ${mod.accent})` : undefined }} />
                </div>

                <p className="text-xs font-semibold transition-colors"
                  style={{ color: isReady ? mod.accent : '#64748B' }}>
                  {isReady ? (lang === 'en' ? 'Tap to play →' : 'Ketik untuk main →') : (lang === 'en' ? 'Assets pending…' : 'Menunggu aset…')}
                </p>

                {/* Hover glow corner */}
                <div className="absolute bottom-0 right-0 w-16 h-16 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 100% 100%, ${mod.accent}20, transparent 70%)` }} />
              </Link>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="hud-divider mb-6" />
          <div className="flex items-center justify-center gap-6 text-xs text-gray-700">
            <Link href="/leaderboard" className="hover:text-gray-500 transition-colors">🏆 {lang === 'en' ? 'Leaderboard' : 'Papan Markah'}</Link>
            <Link href="/admin" className="hover:text-gray-500 transition-colors">🔒 {t(lang, 'admin')}</Link>
          </div>
        </div>
      </main>
    </div>
  )
}