'use client'
import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const { lang, toggleLang, team } = useApp()
  const pathname = usePathname()

  return (
    <nav className="nav-gaming px-4 py-0 h-14 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5 group">
        {/* Stylized nest/bird mark in Nestlé brand colors (not the trademarked logo) */}
        <svg width="32" height="32" viewBox="0 0 32 32" className="flex-shrink-0">
          <circle cx="16" cy="16" r="15" fill="#E2001A" />
          <path d="M9 19 Q9 22 12 22 L20 22 Q23 22 23 19" stroke="#FFF" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
          <ellipse cx="16" cy="13" rx="4.2" ry="3.6" fill="#FFF"/>
          <polygon points="16,15.5 19,17 16,18.5" fill="#F0A500"/>
          <ellipse cx="9" cy="15" rx="2.6" ry="3.8" fill="#FFF" opacity="0.85" transform="rotate(-18 9 15)"/>
          <ellipse cx="23" cy="15" rx="2.6" ry="3.8" fill="#FFF" opacity="0.85" transform="rotate(18 23 15)"/>
        </svg>
        <div className="hidden sm:block leading-none">
          <p className="text-white font-black text-sm tracking-tight">Nestlé Malaysia</p>
          <p className="text-neon-cyan text-[10px] font-bold tracking-widest uppercase opacity-75">SHE Day 2026 Tournament</p>
        </div>
      </Link>

      {pathname?.includes('/modules/') && (
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <span className="opacity-40">/</span>
          <span className="text-gray-300 capitalize">{pathname.split('/modules/')[1]?.replace(/-/g,' ')}</span>
        </div>
      )}

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
