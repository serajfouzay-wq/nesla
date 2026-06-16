'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import CameraCapture from '@/components/CameraCapture'
import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/i18n'

const PLASTIC_TYPES = [
  { id: 1, code: 'PET', en: 'Polyethylene Terephthalate', bm: 'Polietilena Tereftalat', example: '🍶 Water bottles', exBm: '🍶 Botol air' },
  { id: 2, code: 'HDPE', en: 'High-Density Polyethylene', bm: 'Polietilena Berketumpatan Tinggi', example: '🧴 Shampoo bottles', exBm: '🧴 Botol syampu' },
  { id: 3, code: 'PVC', en: 'Polyvinyl Chloride', bm: 'Polivinil Klorida', example: '🔧 Pipes', exBm: '🔧 Paip' },
  { id: 4, code: 'LDPE', en: 'Low-Density Polyethylene', bm: 'Polietilena Berketumpatan Rendah', example: '🛍️ Plastic bags', exBm: '🛍️ Beg plastik' },
  { id: 5, code: 'PP', en: 'Polypropylene', bm: 'Polipropilena', example: '🥡 Food containers', exBm: '🥡 Bekas makanan' },
  { id: 6, code: 'PS', en: 'Polystyrene', bm: 'Polistirena', example: '☕ Styrofoam cups', exBm: '☕ Cawan styrofoam' },
  { id: 7, code: 'Other', en: 'Other Plastics (PC, ABS…)', bm: 'Plastik Lain (PC, ABS…)', example: '💿 CDs, eyewear', exBm: '💿 CD, cermin mata' },
]
const SORT_ITEMS = [
  { id: 1, en: 'PET water bottle', bm: 'Botol air PET', recyclable: true, icon: '🍶' },
  { id: 2, en: 'Styrofoam takeaway box', bm: 'Kotak PS bawa balik', recyclable: false, icon: '🥡' },
  { id: 3, en: 'HDPE shampoo bottle', bm: 'Botol syampu HDPE', recyclable: true, icon: '🧴' },
  { id: 4, en: 'Plastic bag (LDPE)', bm: 'Beg plastik (LDPE)', recyclable: false, icon: '🛍️' },
  { id: 5, en: 'PP food container', bm: 'Bekas makanan PP', recyclable: true, icon: '🫙' },
  { id: 6, en: 'PVC pipe', bm: 'Paip PVC', recyclable: false, icon: '🔧' },
  { id: 7, en: 'Clear PET juice bottle', bm: 'Botol jus PET jernih', recyclable: true, icon: '🧃' },
  { id: 8, en: 'Greasy pizza box liner', bm: 'Lapisan kotak piza berlemak', recyclable: false, icon: '🍕' },
]

function MatchGame({ lang, onComplete }) {
  const [revealed, setRevealed] = useState([])
  function toggle(id) { setRevealed(r => r.includes(id) ? r.filter(x => x !== id) : [...r, id]) }
  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{lang === 'en' ? 'Tap each card to learn the plastic type' : 'Ketik setiap kad untuk mengetahui jenis plastik'}</p>
      <div className="grid grid-cols-2 gap-3">
        {PLASTIC_TYPES.map(p => (
          <button key={p.id} onClick={() => toggle(p.id)} className={`p-4 rounded-xl border text-left transition-all ${revealed.includes(p.id) ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white hover:border-green-400'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-black" style={{ color:'#00A35E' }}>{p.code}</span>
              {p.id <= 3 && <span className="badge-green text-xs">{lang === 'en' ? 'Common' : 'Biasa'}</span>}
            </div>
            {revealed.includes(p.id) ? (<><p className="text-xs font-semibold text-gray-800">{lang === 'en' ? p.en : p.bm}</p><p className="text-xs text-gray-500 mt-1">{lang === 'en' ? p.example : p.exBm}</p></>) : <p className="text-xs text-gray-500">{lang === 'en' ? 'Tap to reveal →' : 'Ketik untuk dedah →'}</p>}
          </button>
        ))}
      </div>
      {revealed.length === PLASTIC_TYPES.length && <button onClick={() => onComplete(PLASTIC_TYPES.length * 5)} className="btn-primary w-full mt-4">{lang === 'en' ? 'Complete! Claim points →' : 'Selesai! Ambil mata →'}</button>}
    </div>
  )
}

function SortGame({ lang, onComplete }) {
  const [assignments, setAssignments] = useState({})
  const [submitted, setSubmitted] = useState(false)

  function submit() {
    let correct = 0
    SORT_ITEMS.forEach(item => { if (assignments[item.id] !== undefined && assignments[item.id] === item.recyclable) correct++ })
    setSubmitted(true); onComplete(correct * 10)
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">{t(lang, 'plasticRecycling.sortInstruction')}</p>
      <div className="flex flex-col gap-3">
        {SORT_ITEMS.map(item => (
          <div key={item.id} className={`p-3 rounded-xl border flex items-center gap-3 ${submitted ? assignments[item.id] === item.recyclable ? 'border-green-500 bg-green-50' : 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'}`}>
            <span className="text-2xl">{item.icon}</span>
            <span className="flex-1 text-sm text-gray-800">{lang === 'en' ? item.en : item.bm}</span>
            <div className="flex gap-2">
              <button disabled={submitted} onClick={() => setAssignments(a => ({ ...a, [item.id]: true }))} className={`text-xs px-2 py-1 rounded-lg border transition-colors ${assignments[item.id] === true ? 'bg-green-600 border-green-500 text-white' : 'bg-gray-50 border-gray-300 hover:border-green-400 text-gray-700'}`}>♻️</button>
              <button disabled={submitted} onClick={() => setAssignments(a => ({ ...a, [item.id]: false }))} className={`text-xs px-2 py-1 rounded-lg border transition-colors ${assignments[item.id] === false ? 'bg-red-600 border-red-500 text-white' : 'bg-gray-50 border-gray-300 hover:border-red-400 text-gray-700'}`}>🗑️</button>
            </div>
            {submitted && assignments[item.id] !== item.recyclable && <span className="text-xs text-red-500">✗ {item.recyclable ? (lang === 'en' ? 'Recyclable' : 'Boleh kitar') : (lang === 'en' ? 'Not recyclable' : 'Tidak boleh')}</span>}
          </div>
        ))}
      </div>
      {!submitted && Object.keys(assignments).length === SORT_ITEMS.length && <button onClick={submit} className="btn-primary w-full mt-4">{t(lang, 'submit')}</button>}
    </div>
  )
}

const TABS = [
  { key: 'match', en: '🔢 7 Plastic Types', bm: '🔢 7 Jenis Plastik' },
  { key: 'sort', en: '♻️ Sort It!', bm: '♻️ Susun!' },
  { key: 'photo', en: '📷 Real Recycling', bm: '📷 Kitar Semula Sebenar' },
]

export default function PlasticRecyclingPage() {
  const { lang } = useApp()
  const [tab, setTab] = useState('match')
  const [matchScore, setMatchScore] = useState(null)
  const [sortScore, setSortScore] = useState(null)
  const [photoScore, setPhotoScore] = useState(null)
  const total = (matchScore ?? 0) + (sortScore ?? 0) + (photoScore ?? 0)
  const max = PLASTIC_TYPES.length * 5 + SORT_ITEMS.length * 10 + 30

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-20 pb-12 px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6"><span className="text-3xl">♻️</span><div><h1 className="text-2xl font-black text-gray-900">{t(lang, 'modules.plasticRecycling')}</h1><p className="text-sm text-gray-500">{t(lang, 'appTitle')} · Priority 2</p></div></div>
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(tb => <button key={tb.key} onClick={() => setTab(tb.key)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
            style={tab === tb.key ? { background:'#00703C', color:'white' } : { background:'rgba(0,0,0,0.05)', color:'#6B7280' }}>
            {tb[lang]}
          </button>)}
        </div>
        <div className="card">
          {tab === 'match' && (matchScore !== null ? <div className="text-center py-6 font-black text-2xl" style={{ color:'#00A35E' }}>✅ {matchScore} pts</div> : <MatchGame lang={lang} onComplete={setMatchScore} />)}
          {tab === 'sort' && (sortScore !== null ? <div className="text-center py-6 font-black text-2xl" style={{ color:'#00A35E' }}>✅ {sortScore} pts</div> : <SortGame lang={lang} onComplete={setSortScore} />)}
          {tab === 'photo' && (
            photoScore !== null ? (
              <div className="text-center py-6 font-black text-2xl" style={{ color:'#00A35E' }}>✅ {photoScore} pts</div>
            ) : (
              <div>
                <h3 className="font-bold mb-1 text-gray-900">{lang === 'en' ? 'Show Real Recycling!' : 'Tunjukkan Kitar Semula Sebenar!'}</h3>
                <p className="text-sm text-gray-500 mb-3">{lang === 'en' ? 'Take a photo of a real recyclable item near you, or yourself sorting items into a recycling bin.' : 'Ambil gambar item boleh kitar semula sebenar di sekitar anda, atau diri anda menyusun item ke tong kitar semula.'}</p>
                <CameraCapture label={lang === 'en' ? 'Capture a recyclable item' : 'Tangkap item boleh kitar semula'} maxPhotos={3} points={10}
                  onSubmit={(photos) => setPhotoScore(photos.length * 10)} />
              </div>
            )
          )}
        </div>
        {total > 0 && <div className="card mt-4"><p className="text-sm text-gray-500">{lang === 'en' ? 'Module total' : 'Jumlah modul'}</p><p className="text-2xl font-black text-nestle-gold">{total} / {max}</p><ScoreSubmit moduleSlug="plastic-recycling" score={total} maxScore={max} /></div>}
      </main>
    </div>
  )
}
