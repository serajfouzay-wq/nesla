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
  const skin = '#D9A77A'
  const shirt = good ? '#5B8A72' : '#B85C5C'
  const accent = good ? '#00A35E' : '#E2475A'

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect width="100" height="100" rx="8" fill="#FBF7EF" />
      <rect y="78" width="100" height="22" fill="#E8E0D2" />

      {kind === 'sit' && variant === 'A' && (
        <g>
          <rect x="38" y="58" width="26" height="4" fill="#7A6248" />
          <rect x="40" y="62" width="3" height="16" fill="#7A6248" />
          <rect x="59" y="62" width="3" height="16" fill="#7A6248" />
          <rect x="47" y="40" width="16" height="13" rx="1" fill="#2B2520" />
          <rect x="48" y="64" width="6" height="3" fill="#444" />
          <rect x="38" y="74" width="6" height="4" fill="#555" />
          <path d="M40,78 Q40,68 46,66" stroke="#555" strokeWidth="2" fill="none" />
          <rect x="44" y="60" width="12" height="20" rx="3" fill={shirt} />
          <circle cx="50" cy="50" r="7" fill={skin} />
          <rect x="46" y="64" width="14" height="4" fill={shirt} opacity="0.85" />
          <line x1="56" y1="66" x2="63" y2="64" stroke={skin} strokeWidth="3" strokeLinecap="round" />
          <rect x="44" y="78" width="5" height="14" fill="#3A3A3A" />
          <rect x="44" y="91" width="7" height="3" fill="#222" />
        </g>
      )}
      {kind === 'sit' && variant === 'B' && (
        <g>
          <rect x="36" y="62" width="24" height="4" fill="#7A6248" />
          <rect x="38" y="66" width="3" height="12" fill="#7A6248" />
          <rect x="55" y="66" width="3" height="12" fill="#7A6248" />
          <rect x="46" y="46" width="15" height="12" rx="1" fill="#2B2520" />
          <rect x="36" y="74" width="6" height="4" fill="#555" />
          <path d="M38,78 Q40,70 48,68" stroke="#555" strokeWidth="2" fill="none" />
          <path d="M42,80 Q40,64 50,58 Q53,56 50,52" stroke={shirt} strokeWidth="11" fill="none" strokeLinecap="round" />
          <circle cx="48" cy="46" r="6.5" fill={skin} />
          <line x1="50" y1="62" x2="60" y2="68" stroke={skin} strokeWidth="3" strokeLinecap="round" />
          <rect x="40" y="80" width="5" height="12" fill="#3A3A3A" />
          <rect x="38" y="91" width="9" height="3" fill="#222" />
        </g>
      )}
      {kind === 'lift' && variant === 'A' && (
        <g>
          <rect x="28" y="68" width="16" height="14" fill="#A9774A" />
          <path d="M48,40 Q60,55 50,68" stroke={shirt} strokeWidth="11" fill="none" strokeLinecap="round" />
          <circle cx="46" cy="36" r="6.5" fill={skin} />
          <line x1="44" y1="55" x2="36" y2="64" stroke={skin} strokeWidth="3" strokeLinecap="round" />
          <line x1="46" y1="66" x2="42" y2="92" stroke="#3A3A3A" strokeWidth="5" strokeLinecap="round" />
          <rect x="38" y="90" width="8" height="3" fill="#222" />
        </g>
      )}
      {kind === 'lift' && variant === 'B' && (
        <g>
          <rect x="32" y="58" width="16" height="14" fill="#A9774A" />
          <line x1="46" y1="38" x2="46" y2="58" stroke={shirt} strokeWidth="11" strokeLinecap="round" />
          <circle cx="46" cy="32" r="6.5" fill={skin} />
          <line x1="44" y1="50" x2="36" y2="58" stroke={skin} strokeWidth="3" strokeLinecap="round" />
          <path d="M44,58 L36,70 L36,92" stroke="#3A3A3A" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M48,58 L54,70 L54,92" stroke="#3A3A3A" strokeWidth="5" fill="none" strokeLinecap="round" />
          <rect x="32" y="90" width="8" height="3" fill="#222" />
          <rect x="50" y="90" width="8" height="3" fill="#222" />
        </g>
      )}
      {kind === 'monitor' && variant === 'A' && (
        <g>
          <circle cx="28" cy="42" r="6.5" fill={skin} />
          <rect x="24" y="48" width="8" height="22" rx="3" fill={shirt} />
          <rect x="55" y="32" width="26" height="18" rx="1" fill="#2B2520" stroke="#5A6B7D" strokeWidth="0.6" />
          <rect x="65" y="50" width="6" height="3" fill="#5A6B7D" />
          <line x1="34" y1="44" x2="55" y2="41" stroke="#C9BFAE" strokeWidth="1" strokeDasharray="2,1.5" />
          <rect x="20" y="70" width="20" height="3" fill="#7A6248" />
        </g>
      )}
      {kind === 'monitor' && variant === 'B' && (
        <g>
          <circle cx="28" cy="36" r="6.5" fill={skin} />
          <rect x="24" y="42" width="8" height="22" rx="3" fill={shirt} />
          <rect x="34" y="54" width="26" height="18" rx="1" fill="#2B2520" stroke="#5A6B7D" strokeWidth="0.6" />
          <rect x="44" y="72" width="6" height="3" fill="#5A6B7D" />
          <line x1="32" y1="38" x2="38" y2="58" stroke="#C9BFAE" strokeWidth="1" strokeDasharray="2,1.5" />
          <rect x="20" y="64" width="20" height="3" fill="#7A6248" />
        </g>
      )}

      <rect x="2" y="2" width="20" height="8" rx="4" fill={accent} opacity="0.15" />
      <text x="12" y="8" textAnchor="middle" fontSize="5" fontWeight="bold" fill={accent}>{good ? '✓' : '✗'}</text>
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
              borderColor: selected ? (letter === round.correct ? '#00A35E' : letter === selected ? '#E2001A' : '#E5E8EC') : '#D7DBE0',
              opacity: selected && letter !== round.correct && letter !== selected ? 0.4 : 1,
            }}>
            <PostureFigure variant={letter} kind={kind} />
            <div className="py-1 text-center text-xs font-bold text-gray-700">{letter}</div>
          </button>
        ))}
      </div>
      {selected && (
        <div className="mt-4 p-4 rounded-xl" style={{ background:'#FFFCF6', border:'1px solid #E5E8EC' }}>
          <p className="text-sm text-gray-700">{round.tip[lang]}</p>
          <button onClick={next} className="btn-primary mt-3 w-full">{idx+1 < ROUNDS.length ? (lang==='en'?'Next':'Seterusnya') : (lang==='en'?'See Results':'Lihat Keputusan')} →</button>
        </div>
      )}
    </div>
  )
}
