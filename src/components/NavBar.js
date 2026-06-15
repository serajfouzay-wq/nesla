'use client'
import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'

export default function NavBar() {
  const { lang, toggleLang, team } = useApp()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-nestle-red rounded-lg flex items-center justify-center font-black text-sm">SHE</div>
        <span className="font-bold text-white hidden sm:block">SHE Day 2026</span>
      </Link>
      <div className="flex items-center gap-3">
        {team && <span className="text-xs text-gray-400 hidden sm:block">👥 {team.groupName}</span>}
        <Link href="/leaderboard" className="text-xs text-gray-400 hover:text-white transition-colors">
          🏆 {lang === 'en' ? 'Leaderboard' : 'Papan Markah'}
        </Link>
        <button onClick={toggleLang} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors">
          {lang === 'en' ? '🇲🇾 BM' : '🇬🇧 EN'}
        </button>
      </div>
    </nav>
  )
}