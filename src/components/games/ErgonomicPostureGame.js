'use client'
import { useState } from 'react'
import { sfx } from '@/lib/sounds'

const ROUNDS = [
  {
    id: 1,
    prompt: { en: 'Which sitting posture is correct?', bm: 'Postur duduk mana yang betul?' },
    correct: 'A',
    tip: { en: 'Sit back fully, feet flat on floor, screen at eye level, elbows at 90°.', bm: 'Duduk sepenuhnya, kaki rata di lantai, skrin pada paras mata, siku 90°.' },
  },
  {
    id: 2,
    prompt: { en: 'Which lifting technique is correct?', bm: 'Teknik mengangkat mana yang betul?' },
    correct: 'B',
    tip: { en: 'Squat down, keep your back straight, and lift with your legs — never bend from the waist.', bm: 'Squat, kekalkan belakang lurus, angkat dengan kaki — jangan bengkok dari pinggang.' },
  },
  {
    id: 3,
    prompt: { en: 'Which monitor distance/height is correct?', bm: 'Jarak/ketinggian monitor mana yang betul?' },
    correct: 'A',
    tip: { en: "Monitor should be arm's length away (50–70cm) with the top of the screen at eye level.", bm: 'Monitor sejauh lengan (50–70cm) dengan bahagian atas skrin pada paras mata.' },
  },
]

function PostureFigure({ variant, kind }) {
  const good = (kind === 'sit' && variant === 'A') || (kind === 'lift' && variant === 'B') || (kind === 'monitor' && variant === 'A')
  const stroke = good ? '#00FF88' : '#FF6080'
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" rx="8" fill="#0A1628" />
      {kind === 'sit' && variant === 'A' && (
        <g stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round">
          <line x1="30" y1="80" x2="70" y2="80" />
          <rect x="40" y="60" width="20" height="6" fill={stroke} opacity="0.3" />
          <line x1="45" y1="40" x2="45" y2="66" />
          <circle cx="45" cy="32" r="6" />
          <line x1="45" y1="48" x2="58" y2="50" />
          <line x1="58" y1="40" x2="58" y2="55" stroke={stroke} opacity="0.5" />
          <line x1="45" y1="66" x2="45" y2="80" />
          <line x1="45" y1="80" x2="55" y2="80" />
        </g>
      )}
      {kind === 'sit' && variant === 'B' && (
        <g stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round">
          <line x1="30" y1="80" x2="70" y2="80" />
          <rect x="38" y="62" width="18" height="6" fill={stroke} opacity="0.3" />
          <path d="M43 42 Q50 55 43 66" />
          <circle cx="40" cy="36" r="6" />
          <line x1="43" y1="50" x2="60" y2="58" />
          <line x1="43" y1="66" x2="40" y2="80" />
          <line x1="40" y1="80" x2="33" y2="78" />
        </g>
      )}
      {kind === 'lift' && variant === 'A' && (
        <g stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round">
          <line x1="20" y1="85" x2="80" y2="85" />
          <path d="M45 35 Q60 55 45 70" />
          <circle cx="42" cy="28" r="6" />
          <rect x="30" y="68" width="14" height="12" fill={stroke} opacity="0.3" />
          <line x1="42" y1="65" x2="42" y2="85" />
          <line x1="42" y1="85" x2="35" y2="85" />
        </g>
      )}
      {kind === 'lift' && variant === 'B' && (
        <g stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round">
          <line x1="20" y1="85" x2="80" y2="85" />
          <line x1="45" y1="35" x2="45" y2="58" />
          <circle cx="45" cy="28" r="6" />
          <rect x="32" y="58" width="14" height="12" fill={stroke} opacity="0.3" />
          <path d="M45 58 L38 70 L38 85" />
          <path d="M45 58 L52 70 L52 85" />
        </g>
      )}
      {kind === 'monitor' && variant === 'A' && (
        <g stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round">
          <circle cx="30" cy="40" r="6" />
          <line x1="30" y1="46" x2="30" y2="70" />
          <rect x="55" y="30" width="22" height="16" rx="1" stroke={stroke} />
          <line x1="36" y1="40" x2="55" y2="38" />
        </g>
      )}
      {kind === 'monitor' && variant === 'B' && (
        <g stroke={stroke} strokeWidth="2.5" fill="none" strokeLinecap="round">
          <circle cx="30" cy="35" r="6" />
          <line x1="30" y1="41" x2="30" y2="70" />
          <rect x="35" y="55" width="22" height="16" rx="1" stroke={stroke} />
          <line x1="33" y1="38" x2="38" y2="58" />
        </g>
      )}
    </svg>
  )
}

export default function ErgonomicPostureGame({ lang, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const round = ROUNDS[idx]
  const kindMap = { 1: 'sit', 2: 'lift', 3: 'monitor' }
  const kind = kindMap[round.id]

  function choose(letter) {
    if (selected) return
    setSelected(letter)
    if (letter === round.correct) { setScore(s => s + 15); sfx.correct() } else sfx.wrong()
  }
  function next() {
    if (idx + 1 >= ROUNDS.length) { setDone(true); sfx.complete(); onComplete?.(score); return }
    setIdx(i => i + 1); setSelected(null)
  }

  if (done) return <div className="text-center py-8"><div className="text-6xl mb-4">🏆</div><p className="text-3xl font-black text-nestle-gold">{score} / {ROUNDS.length * 15}</p></div>

  return (
    <div>
      <div className="flex justify-between mb-4"><span className="text-sm text-gray-500">{idx+1}/{ROUNDS.length}</span><span className="text-sm font-bold text-nestle-gold">{score} pts</span></div>
      <p className="font-semibold mb-4 text-gray-900">{round.prompt[lang]}</p>
      <div className="grid grid-cols-2 gap-3">
        {['A','B'].map(letter => (
          <button key={letter} onClick={() => choose(letter)}
            className="rounded-xl overflow-hidden border-2 transition-all aspect-square"
            style={{
              borderColor: selected ? (letter === round.correct ? '#00FF88' : letter === selected ? '#FF2244' : 'rgba(26,58,107,0.4)') : 'rgba(26,58,107,0.6)',
              opacity: selected && letter !== round.correct && letter !== selected ? 0.4 : 1,
            }}>
            <PostureFigure variant={letter} kind={kind} />
            <div className="py-1 text-center text-xs font-bold text-gray-700">{letter}</div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="mt-4 p-4 rounded-xl" style={{ background:'rgba(10,22,40,0.8)', border:'1px solid rgba(26,58,107,0.6)' }}>
          <p className="text-sm text-gray-700">{round.tip[lang]}</p>
          <button onClick={next} className="btn-primary mt-3 w-full">{idx+1 < ROUNDS.length ? (lang==='en'?'Next':'Seterusnya') : (lang==='en'?'See Results':'Lihat Keputusan')} →</button>
        </div>
      )}
    </div>
  )
}
