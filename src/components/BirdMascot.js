'use client'
import { useState, useEffect } from 'react'

const MESSAGES = {
  idle:     "Ready to play? Let's learn safety together! 🐦",
  correct:  "Excellent! You got it right! Safety champion! 🏆",
  wrong:    "Not quite — but every mistake is a lesson! Here's the safe answer:",
  complete: "Amazing work! You've completed this challenge! 🎉",
  start:    "Welcome to SHE Day 2026! I'll guide you through every module!",
  drag:     "Drag the items into the correct order!",
  camera:   "Time to scout your environment — spot those hazards!",
  warning:  "⚠️ Safety Alert! Pay close attention to this.",
}

export default function BirdMascot({ state = 'idle', message = '', onDismiss, className = '' }) {
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    setAnimKey(k => k + 1)
    if ((state === 'correct' || state === 'complete') && onDismiss) {
      const timer = setTimeout(onDismiss, 4000)
      return () => clearTimeout(timer)
    }
  }, [state, message])

  const isSuccess = state === 'correct' || state === 'complete'
  const isError = state === 'wrong' || state === 'warning'
  const displayMsg = message || MESSAGES[state] || MESSAGES.idle

  const birdColor = isSuccess ? '#00FF88' : isError ? '#FF2244' : '#00D4FF'
  const glowColor = isSuccess ? 'rgba(0,255,136,0.3)' : isError ? 'rgba(255,34,68,0.3)' : 'rgba(0,212,255,0.2)'
  const borderColor = isSuccess ? 'rgba(0,255,136,0.35)' : isError ? 'rgba(255,34,68,0.35)' : 'rgba(0,212,255,0.25)'
  const bgColor = isSuccess ? 'rgba(0,255,136,0.05)' : isError ? 'rgba(255,34,68,0.05)' : 'rgba(0,212,255,0.04)'

  return (
    <div key={animKey} className={`animate-slide-up flex items-start gap-4 p-4 rounded-2xl ${className}`}
      style={{ background: bgColor, border: `1px solid ${borderColor}`, boxShadow: `0 0 20px ${glowColor}` }}>

      {/* Bird SVG */}
      <div className={`flex-shrink-0 ${isSuccess ? 'animate-bird-fly' : state === 'idle' ? 'animate-float' : ''}`}>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Glow ring */}
          <circle cx="28" cy="28" r="26" fill={birdColor} opacity="0.06" />

          {/* Body */}
          <ellipse cx="28" cy="36" rx="15" ry="13" fill={birdColor} opacity="0.92"/>
          {/* Head */}
          <circle cx="28" cy="20" r="11" fill={birdColor} opacity="0.92"/>
          {/* Beak */}
          <polygon points="28,23 35,27 28,31" fill="#F0A500"/>
          {/* Eye */}
          <circle cx="31" cy="18" r="3" fill="#071020"/>
          <circle cx="32" cy="17" r="1.2" fill="white"/>
          {/* Wings */}
          <ellipse cx="14" cy="34" rx="7" ry="10" fill={birdColor} opacity="0.72" transform="rotate(-18 14 34)"/>
          <ellipse cx="42" cy="34" rx="7" ry="10" fill={birdColor} opacity="0.72" transform="rotate(18 42 34)"/>
          {/* Tail */}
          <polygon points="14,48 22,41 28,48 22,53" fill={birdColor} opacity="0.8"/>
          {/* Feet */}
          <line x1="22" y1="48" x2="19" y2="53" stroke={birdColor} strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="22" y1="48" x2="15" y2="52" stroke={birdColor} strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="33" y1="48" x2="36" y2="53" stroke={birdColor} strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="33" y1="48" x2="39" y2="52" stroke={birdColor} strokeWidth="2.5" strokeLinecap="round"/>

          {/* Success: shield */}
          {isSuccess && (
            <g className="animate-shield-flash">
              <path d="M28 4 L37 8.5 L37 17 C37 23 28 29 28 29 C28 29 19 23 19 17 L19 8.5 Z"
                fill="none" stroke="#00FF88" strokeWidth="2.5" opacity="0.9" strokeLinejoin="round"/>
              <polyline points="23,17 27,21 34,13" stroke="#00FF88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
          )}

          {/* Error: warning triangle */}
          {isError && (
            <g>
              <polygon points="28,3 40,22 16,22" fill="none" stroke="#FF2244" strokeWidth="2.5" strokeLinejoin="round"/>
              <line x1="28" y1="10" x2="28" y2="17" stroke="#FF2244" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="28" cy="20" r="1.5" fill="#FF2244"/>
            </g>
          )}

          {/* Stars on complete */}
          {state === 'complete' && (
            <>
              <text x="4" y="14" fontSize="8">⭐</text>
              <text x="44" y="14" fontSize="8">⭐</text>
            </>
          )}
        </svg>
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-black uppercase tracking-widest mb-1.5" style={{ color: birdColor }}>
          {isSuccess ? '🏆 Safety Bird' : isError ? '⚠️ Safety Bird' : '🐦 Safety Bird'}
        </p>
        <p className="text-sm text-gray-200 leading-relaxed">{displayMsg}</p>
      </div>

      {onDismiss && (
        <button onClick={onDismiss}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-300 hover:bg-white/10 transition-all text-lg leading-none">
          ×
        </button>
      )}
    </div>
  )
}