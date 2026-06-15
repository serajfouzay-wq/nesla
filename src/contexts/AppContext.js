'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [lang, setLang] = useState('en')
  const [team, setTeam] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('she_team')
    if (saved) setTeam(JSON.parse(saved))
    const savedLang = localStorage.getItem('she_lang')
    if (savedLang) setLang(savedLang)
  }, [])

  function saveTeam(teamData) {
    setTeam(teamData)
    localStorage.setItem('she_team', JSON.stringify(teamData))
  }

  function toggleLang() {
    const next = lang === 'en' ? 'bm' : 'en'
    setLang(next)
    localStorage.setItem('she_lang', next)
  }

  return (
    <AppContext.Provider value={{ lang, toggleLang, team, saveTeam }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}