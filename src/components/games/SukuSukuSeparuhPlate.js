'use client'
import { useState } from 'react'

const FOODS = [
  { id: 'c1', zone: 'carb',    name: { en: 'Steamed rice (1 cup)', bm: 'Nasi putih (1 cawan)' }, icon: '🍚', price: 1.0, kcal: 205 },
  { id: 'c2', zone: 'carb',    name: { en: 'Wholemeal bread (2 slices)', bm: 'Roti gandum (2 keping)' }, icon: '🍞', price: 1.5, kcal: 180 },
  { id: 'c3', zone: 'carb',    name: { en: 'Mee (noodles)', bm: 'Mee' }, icon: '🍜', price: 2.0, kcal: 220 },
  { id: 'p1', zone: 'protein', name: { en: 'Fried egg', bm: 'Telur goreng' }, icon: '🍳', price: 1.0, kcal: 90 },
  { id: 'p2', zone: 'protein', name: { en: 'Grilled chicken (small)', bm: 'Ayam panggang (kecil)' }, icon: '🍗', price: 3.0, kcal: 165 },
  { id: 'p3', zone: 'protein', name: { en: 'Ikan kembung (fried fish)', bm: 'Ikan kembung goreng' }, icon: '🐟', price: 2.5, kcal: 140 },
  { id: 'p4', zone: 'protein', name: { en: 'Tempe / tofu', bm: 'Tempe / tauhu' }, icon: '🧈', price: 1.5, kcal: 120 },
  { id: 'v1', zone: 'veg',     name: { en: 'Mixed kerabu salad', bm: 'Kerabu campur' }, icon: '🥗', price: 1.5, kcal: 60 },
  { id: 'v2', zone: 'veg',     name: { en: 'Stir-fried kangkung', bm: 'Kangkung goreng' }, icon: '🥬', price: 1.5, kcal: 70 },
  { id: 'v3', zone: 'veg',     name: { en: 'Banana', bm: 'Pisang' }, icon: '🍌', price: 0.5, kcal: 105 },
  { id: 'v4', zone: 'veg',     name: { en: 'Sliced cucumber & tomato', bm: 'Timun & tomato' }, icon: '🥒', price: 0.5, kcal: 30 },
]

const ZONE_META = {
  carb:    { label: { en: '¼ Carbohydrates', bm: '¼ Karbohidrat' }, color: '#F0A500', bg: 'rgba(240,165,0,0.1)' },
  protein: { label: { en: '¼ Protein', bm: '¼ Protein' }, color: '#FF6080', bg: 'rgba(226,0,26,0.1)' },
  veg:     { label: { en: '½ Vegetables & Fruit', bm: '½ Sayur & Buah' }, color: '#00FF88', bg: 'rgba(0,255,136,0.1)' },
}

const BUDGET = 10
const CAL_TARGET = 700
const CAL_TOLERANCE = 150

export default function SukuSukuSeparuhPlate({ lang, onComplete }) {
  const [plate, setPlate] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [dragId, setDragId] = useState(null)

  const placedFoods = plate.map(id => FOODS.find(f => f.id === id))
  const totalPrice = placedFoods.reduce((s, f) => s + f.price, 0)
  const totalKcal = placedFoods.reduce((s, f) => s + f.kcal, 0)

  const zoneHas = (zone) => placedFoods.some(f => f.zone === zone)
  const hasAllZones = zoneHas('carb') && zoneHas('protein') && zoneHas('veg')
  const withinBudget = totalPrice <= BUDGET
  const withinCalories = Math.abs(totalKcal - CAL_TARGET) <= CAL_TOLERANCE
  const isValid = hasAllZones && withinBudget && withinCalories && plate.length >= 3

  function addFood(id) {
    if (submitted) return
    if (plate.includes(id)) return
    setPlate(p => [...p, id])
  }
  function removeFood(id) {
    if (submitted) return
    setPlate(p => p.filter(x => x !== id))
  }
  function dropOnZone(zone) {
    if (!dragId || submitted) return
    const food = FOODS.find(f => f.id === dragId)
    if (food.zone === zone) addFood(dragId)
    setDragId(null)
  }

  function submit() {
    if (!isValid) return
    const score = 40
    setSubmitted(true)
    onComplete?.(score)
  }

  return (
    <div>
      <div className="card-hud mb-4">
        <p className="hud-label mb-2">🍽️ {lang === 'en' ? 'Suku Suku Separuh Guide' : 'Panduan Suku Suku Separuh'}</p>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          {Object.entries(ZONE_META).map(([k, z]) => (
            <div key={k} className="rounded-lg p-2" style={{ background: z.bg, border: `1px solid ${z.color}40` }}>
              <p className="font-bold" style={{ color: z.color }}>{z.label[lang]}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          {lang === 'en'
            ? `🎯 Target: budget ≤ RM${BUDGET}, ~${CAL_TARGET} kcal (Malaysian food only)`
            : `🎯 Sasaran: bajet ≤ RM${BUDGET}, ~${CAL_TARGET} kcal (makanan Malaysia sahaja)`}
        </p>
      </div>

      <div className="relative mx-auto mb-5" style={{ width: '220px', height: '220px' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="48" fill="#0A1628" stroke="rgba(26,58,107,0.6)" strokeWidth="1" />
          <path d="M50,50 L50,2 A48,48 0 0 0 50,98 Z" fill={zoneHas('veg') ? ZONE_META.veg.bg.replace('0.1','0.25') : 'rgba(0,255,136,0.06)'} stroke={ZONE_META.veg.color} strokeWidth="0.6" strokeOpacity="0.5" />
          <path d="M50,50 L50,2 A48,48 0 0 1 98,50 Z" fill={zoneHas('carb') ? ZONE_META.carb.bg.replace('0.1','0.25') : 'rgba(240,165,0,0.06)'} stroke={ZONE_META.carb.color} strokeWidth="0.6" strokeOpacity="0.5" />
          <path d="M50,50 L98,50 A48,48 0 0 1 50,98 Z" fill={zoneHas('protein') ? ZONE_META.protein.bg.replace('0.1','0.25') : 'rgba(226,0,26,0.06)'} stroke={ZONE_META.protein.color} strokeWidth="0.6" strokeOpacity="0.5" />
          <line x1="50" y1="2" x2="50" y2="98" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          <line x1="50" y1="50" x2="98" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
          <text x="25" y="52" textAnchor="middle" fontSize="6" fill={ZONE_META.veg.color} fontWeight="bold">½</text>
          <text x="72" y="28" textAnchor="middle" fontSize="6" fill={ZONE_META.carb.color} fontWeight="bold">¼</text>
          <text x="72" y="74" textAnchor="middle" fontSize="6" fill={ZONE_META.protein.color} fontWeight="bold">¼</text>
        </svg>
        <div onDragOver={e=>e.preventDefault()} onDrop={()=>dropOnZone('veg')} className="absolute" style={{ left:0, top:0, width:'50%', height:'100%' }} />
        <div onDragOver={e=>e.preventDefault()} onDrop={()=>dropOnZone('carb')} className="absolute" style={{ right:0, top:0, width:'50%', height:'50%' }} />
        <div onDragOver={e=>e.preventDefault()} onDrop={()=>dropOnZone('protein')} className="absolute" style={{ right:0, bottom:0, width:'50%', height:'50%' }} />
      </div>

      <p className="text-sm text-gray-400 mb-2">{lang === 'en' ? 'Drag food onto the matching plate zone, or tap to add:' : 'Seret makanan ke zon pinggan yang sepadan, atau ketik untuk tambah:'}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        {Object.entries(ZONE_META).map(([zoneKey, z]) => (
          <div key={zoneKey} className="rounded-xl p-2" style={{ background: z.bg, border: `1px dashed ${z.color}50` }}>
            <p className="text-xs font-bold mb-1.5" style={{ color: z.color }}>{z.label[lang]}</p>
            <div className="flex flex-col gap-1">
              {FOODS.filter(f => f.zone === zoneKey).map(f => {
                const placed = plate.includes(f.id)
                return (
                  <button key={f.id} draggable={!submitted} onDragStart={() => setDragId(f.id)}
                    onClick={() => !submitted && (placed ? removeFood(f.id) : addFood(f.id))}
                    disabled={submitted}
                    className="flex items-center justify-between gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-left transition-all"
                    style={{
                      background: placed ? `${z.color}25` : 'rgba(10,22,40,0.7)',
                      border: `1px solid ${placed ? z.color : 'rgba(26,58,107,0.5)'}`,
                      opacity: placed ? 1 : 0.85,
                    }}>
                    <span>{f.icon} {f.name[lang]}</span>
                    <span className="text-gray-500 flex-shrink-0">RM{f.price.toFixed(1)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="card-hud text-center py-3">
          <p className="hud-label mb-1">{lang === 'en' ? 'Budget' : 'Bajet'}</p>
          <p className="text-xl font-black" style={{ color: withinBudget ? '#00FF88' : '#FF2244' }}>RM{totalPrice.toFixed(2)} / RM{BUDGET}</p>
        </div>
        <div className="card-hud text-center py-3">
          <p className="hud-label mb-1">{lang === 'en' ? 'Calories' : 'Kalori'}</p>
          <p className="text-xl font-black" style={{ color: withinCalories ? '#00FF88' : '#F0A500' }}>{totalKcal} kcal</p>
        </div>
      </div>

      {!submitted ? (
        <button onClick={submit} disabled={!isValid} className="btn-primary w-full" style={{ opacity: isValid ? 1 : 0.5 }}>
          {isValid
            ? (lang === 'en' ? '✅ Submit Balanced Plate!' : '✅ Hantar Pinggan Seimbang!')
            : !hasAllZones
              ? (lang === 'en' ? 'Add food to all 3 zones' : 'Tambah makanan ke semua 3 zon')
              : !withinBudget
                ? (lang === 'en' ? 'Over RM10 budget' : 'Lebih bajet RM10')
                : (lang === 'en' ? 'Adjust to hit ~700 kcal' : 'Laraskan untuk capai ~700 kcal')}
        </button>
      ) : (
        <p className="text-center font-bold text-2xl" style={{ color:'#00FF88' }}>✅ 40 pts</p>
      )}
    </div>
  )
}
