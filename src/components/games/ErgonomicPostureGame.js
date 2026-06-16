'use client'
import { useState } from 'react'
import Image from 'next/image'
import { sfx } from '@/lib/sounds'

const ROUNDS = [
  {
    id: 1,
    kind: 'sitting',
    prompt: { en: 'Which sitting posture is correct?', bm: 'Postur duduk mana yang betul?' },
    correctImg: 'good',
    tip: { en: 'Sit back fully, feet flat on floor, screen at eye level, elbows at 90°.', bm: 'Duduk sepenuhnya, kaki rata di lantai, skrin pada paras mata, siku 90°.' },
  },
  {
    id: 2,
    kind: 'lifting',
    prompt: { en: 'Which lifting technique is correct?', bm: 'Teknik mengangkat mana yang betul?' },
    correctImg: 'good',
    tip: { en: 'Squat down, keep your back straight, and lift with your legs — never bend from the waist.', bm: 'Squat, kekalkan belakang lurus, angkat dengan kaki — jangan bengkok dari pinggang.' },
  },
  {
    id: 3,
    kind: 'monitor',
    prompt: { en: 'Which monitor distance/height is correct?', bm: 'Jarak/ketinggian monitor mana yang betul?' },
    correctImg: 'good',
    tip: { en: "Monitor should be arm's length away (50–70cm) with the top of the screen at eye level.", bm: 'Monitor sejauh lengan (50–70cm) dengan bahagian atas skrin pada paras mata.' },
  },
]

export default function ErgonomicPostureGame({ lang, onComplete }) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const round = ROUNDS[idx]

  const [order] = useState(() => ROUNDS.map(() => (Math.random() > 0.5 ? ['good', 'bad'] : ['bad', 'good'])))
  const [imgA, imgB] = order[idx]

  function choose(which) {
    if (selected) return
    setSelected(which)
    if (which === round.correctImg) { setScore(s => s + 15); sfx.correct() } else sfx.wrong()
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
        {[imgA, imgB].map((which, i) => {
          const letter = i === 0 ? 'A' : 'B'
          return (
            <button key={which + i} onClick={() => choose(which)}
              className="rounded-xl overflow-hidden border-2 transition-all relative"
              style={{
                borderColor: selected ? (which === round.correctImg ? '#00A35E' : which === selected ? '#E2001A' : '#E5E8EC') : '#D7DBE0',
                opacity: selected && which !== round.correctImg && which !== selected ? 0.4 : 1,
                aspectRatio: round.kind === 'sitting' ? '459/504' : round.kind === 'lifting' ? '459/496' : '464/344',
              }}>
              <Image src={`/images/${round.kind}_${which}.png`} alt={`${round.kind} ${which}`} fill style={{ objectFit: 'cover' }} />
              <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white" style={{ background:'rgba(0,0,0,0.55)' }}>{letter}</div>
              {selected && which === round.correctImg && (
                <div className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background:'#00A35E' }}>✓</div>
              )}
              {selected === which && which !== round.correctImg && (
                <div className="absolute bottom-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center text-sm font-black text-white" style={{ background:'#E2001A' }}>✗</div>
              )}
            </button>
          )
        })}
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
