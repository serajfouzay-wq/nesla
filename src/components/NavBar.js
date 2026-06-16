'use client'
import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const { lang, toggleLang, team } = useApp()
  const pathname = usePathname()

  return (
    <nav className="nav-gaming px-4 py-0 h-14 flex items-center justify-between">
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="relative w-9 h-9 flex items-center justify-center">
          <div className="absolute inset-0 rounded-lg bg-nestle-red animate-pulse-glow" />
          <span className="relative z-10 text-white font-black text-xs tracking-tight leading-none text-center">SHE<br/>2026</span>
        </div>
        <div className="hidden sm:block">
          <p className="text-white font-black text-sm leading-none">SHE Day 2026</p>
          <p className="text-neon-cyan text-[10px] font-semibold tracking-widest uppercase leading-none mt-0.5 opacity-70">Safety · Health · Environment</p>
        </div>
      </Link>

      {/* Center: breadcrumb on module pages */}
      {pathname?.includes('/modules/') && (
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <span className="opacity-40">/</span>
          <span className="text-gray-300 capitalize">{pathname.split('/modules/')[1]?.replace(/-/g,' ')}</span>
        </div>
      )}

      {/* Right: team + controls */}
      <div className="flex items-center gap-2">
        {team && (
          <div className="hidden sm:flex items-center gap-2 bg-nestle-navy border border-nestle-blue/40 rounded-xl px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="text-xs font-semibold text-gray-300 max-w-[100px] truncate">{team.groupName}</span>
          </div>
        )}
        <Link href="/leaderboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
          style={{ background:'rgba(240,165,0,0.1)', border:'1px solid rgba(240,165,0,0.3)', color:'#F0A500' }}>
          🏆 <span className="hidden sm:inline">{lang === 'en' ? 'Board' : 'Papan'}</span>
        </Link>
        <button onClick={toggleLang}
          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
          style={{ background:'rgba(26,58,107,0.4)', border:'1px solid rgba(26,58,107,0.7)', color:'#CBD5E1' }}>
          {lang === 'en' ? '🇲🇾 BM' : '🇬🇧 EN'}
        </button>
      </div>
    </nav>
  )
}