'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useApp } from '@/contexts/AppContext'
import { usePathname } from 'next/navigation'

export default function NavBar() {
  const { lang, toggleLang, team } = useApp()
  const pathname = usePathname()

  return (
    <nav className="nav-gaming px-4 py-0 h-14 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5 group">
        <Image src="/nestle-logo.png" alt="Nestlé" width={32} height={32} className="flex-shrink-0 rounded-full" />
        <div className="hidden sm:block leading-none">
          <p className="text-gray-900 font-black text-sm tracking-tight">Nestlé Malaysia</p>
          <p className="text-xs font-bold tracking-widest uppercase opacity-60" style={{ color:'#0084B5' }}>SHE Day 2026 Tournament</p>
        </div>
      </Link>

      {pathname?.includes('/modules/') && (
        <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-gray-800 transition-colors">Home</Link>
          <span className="opacity-40">/</span>
          <span className="text-gray-700 capitalize">{pathname.split('/modules/')[1]?.replace(/-/g,' ')}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        {team && (
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-gray-700 max-w-[100px] truncate">{team.groupName}</span>
          </div>
        )}
        <Link href="/leaderboard"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
          style={{ background:'rgba(240,165,0,0.1)', border:'1px solid rgba(240,165,0,0.3)', color:'#A86A00' }}>
          🏆 <span className="hidden sm:inline">{lang === 'en' ? 'Board' : 'Papan'}</span>
        </Link>
        <button onClick={toggleLang}
          className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100">
          {lang === 'en' ? '🇲🇾 BM' : '🇬🇧 EN'}
        </button>
      </div>
    </nav>
  )
}
