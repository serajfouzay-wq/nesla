'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import NavBar from '@/components/NavBar'
import ScoreSubmit from '@/components/ScoreSubmit'
import { useApp } from '@/contexts/AppContext'
import { t } from '@/lib/i18n'

const PLATE_FOODS = [
  { id: 1, name: { en: 'Brown rice', bm: 'Nasi perang' }, icon: '🍚', section: 'carbs', kcal: 215 },
  { id: 2, name: { en: 'Grilled chicken', bm: 'Ayam bakar' }, icon: '🍗', section: 'protein', kcal: 165 },
  { id: 3, name: { en: 'Mixed vegetables', bm: 'Sayur campuran' }, icon: '🥦', section: 'veg', kcal: 50 },
  { id: 4, name: { en: 'Apple', bm: 'Epal' }, icon: '🍎', section: 'veg', kcal: 95 },
  { id: 5, name: { en: 'Fried noodles', bm: 'Mee goreng' }, icon: '🍜', section: 'carbs', kcal: 340 },
  { id: 6, name: { en: 'Tuna', bm: 'Tuna' }, icon: '🐟', section: 'protein', kcal: 120 },
  { id: 7, name: { en: 'French fries', bm: 'Kentang goreng' }, icon: '🍟', section: 'carbs', kcal: 365 },
  { id: 8, name: { en: 'Spinach', bm: 'Bayam' }, icon: '🥬', section: 'veg', kcal: 23 },
  { id: 9, name: { en: 'Egg', bm: 'Telur' }, icon: '🥚', section: 'protein', kcal: 78 },
  { id: 10, name: { en: 'Watermelon', bm: 'Tembikai' }, icon: '🍉', section: 'veg', kcal: 46 },
]

function CalorieCalculator({ lang, onComplete }) {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [result, setResult] = useState(null)

  function calculate() {
    const w = parseFloat(weight), h = parseFloat(height), a = parseInt(age)
    if (!w || !h || !a) return
    const bmr = gender === 'male' ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161
    const tdee = Math.round(bmr * 1.55)
    setResult(tdee); onComplete(20)
  }

  return (
    <div>
      <p className="text-sm text-gray-400 mb-4">{lang === 'en' ? 'Calculate your estimated daily calorie needs (Mifflin-St Jeor × activity factor)' : 'Kira anggaran keperluan kalori harian anda'}</p>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          {['male', 'female'].map(g => <button key={g} onClick={() => setGender(g)} className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors ${gender === g ? 'bg-blue-600 border-blue-400' : 'bg-gray-800 border-gray-700'}`}>{g === 'male' ? (lang === 'en' ? '♂ Male' : '♂ Lelaki') : (lang === 'en' ? '♀ Female' : '♀ Perempuan')}</button>)}
        </div>
        <input className="input" type="number" placeholder={t(lang, 'balancedDiet.weight')} value={weight} onChange={e => setWeight(e.target.value)} />
        <input className="input" type="number" placeholder={t(lang, 'balancedDiet.height')} value={height} onChange={e => setHeight(e.target.value)} />
        <input className="input" type="number" placeholder={lang === 'en' ? 'Age (years)' : 'Umur (tahun)'} value={age} onChange={e => setAge(e.target.value)} />
        <button onClick={calculate} className="btn-primary">{lang === 'en' ? 'Calculate' : 'Kira'} 🔢</button>
      </div>
      {result && (
        <div className="mt-4 p-5 bg-green-900/30 border border-green-700 rounded-xl text-center">
          <p className="text-sm text-gray-400">{t(lang, 'balancedDiet.dailyCalories')}</p>
          <p className="text-4xl font-black text-green-400 mt-1">{result} kcal</p>
          <div className="mt-3 text-xs text-gray-400 grid grid-cols-3 gap-2">
            <div className="bg-gray-800 rounded-lg p-2"><p className="font-bold text-blue-400">{lang === 'en' ? '¼ Carbs' : '¼ Karbohidrat'}</p><p>{Math.round(result * 0.25 / 4)}g</p></div>
            <div className="bg-gray-800 rounded-lg p-2"><p className="font-bold text-red-400">{lang === 'en' ? '¼ Protein' : '¼ Protein'}</p><p>{Math.round(result * 0.25 / 4)}g</p></div>
            <div className="bg-gray-800 rounded-lg p-2"><p className="font-bold text-green-400">{lang === 'en' ? '½ Veg/Fruit' : '½ Sayur/Buah'}</p><p>{Math.round(result * 0.5 / 4)}g</p></div>
          </div>
        </div>
      )}
    </div>
  )
}

function BuildPlate({ lang, onComplete }) {
  const [plate, setPlate] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const carbCount = plate.filter(f => f.section === 'carbs').length
  const proteinCount = plate.filter(f => f.section === 'protein').length
  const vegCount = plate.filter(f => f.section === 'veg').length
  const totalKcal = plate.reduce((s, f) => s + f.kcal, 0)
  const isBalanced = vegCount >= (carbCount + proteinCount) && carbCount >= 1 && proteinCount >= 1 && vegCount >= 2

  return (
    <div>
      <div className="mb-4 p-4 bg-gray-800 rounded-xl border border-gray-700">
        <p className="text-sm font-bold mb-2">{lang === 'en' ? '🍽️ Suku Suku Separuh (SSS) Guide:' : '🍽️ Panduan Suku Suku Separuh (SSS):'}</p>
        <div className="grid grid-cols-3 gap-2 text-xs text-center">
          <div className="bg-blue-900/40 border border-blue-700 rounded-lg p-2"><p className="font-bold text-blue-300">¼ {lang === 'en' ? 'Carbs' : 'Karbohidrat'}</p><p className="text-gray-400">{lang === 'en' ? 'Rice, bread, noodles' : 'Nasi, roti, mee'}</p></div>
          <div className="bg-red-900/40 border border-red-700 rounded-lg p-2"><p className="font-bold text-red-300">¼ {lang === 'en' ? 'Protein' : 'Protein'}</p><p className="text-gray-400">{lang === 'en' ? 'Meat, fish, eggs' : 'Daging, ikan, telur'}</p></div>
          <div className="bg-green-900/40 border border-green-700 rounded-lg p-2"><p className="font-bold text-green-300">½ {lang === 'en' ? 'Veg & Fruit' : 'Sayur & Buah'}</p><p className="text-gray-400">{lang === 'en' ? 'At least 2 types' : 'Sekurang-kurangnya 2 jenis'}</p></div>
        </div>
      </div>
      <p className="text-sm text-gray-400 mb-2">{lang === 'en' ? 'Tap to add to your plate:' : 'Ketik untuk tambah ke pinggan:'}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {PLATE_FOODS.map(food => {
          const inPlate = plate.find(f => f.id === food.id)
          return <button key={food.id} onClick={() => { if (!inPlate && !submitted) setPlate(p => [...p, food]) }} disabled={!!inPlate || submitted} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm transition-colors ${inPlate ? 'bg-gray-700 border-gray-600 opacity-40' : 'bg-gray-800 border-gray-700 hover:border-green-500'}`}>{food.icon} {food.name[lang]} <span className="text-xs text-gray-500">{food.kcal}kcal</span></button>
        })}
      </div>
      <div className="p-4 bg-gray-800 border-2 border-dashed border-gray-600 rounded-2xl min-h-24">
        <p className="text-xs text-gray-500 mb-2">{lang === 'en' ? 'Your plate:' : 'Pinggan anda:'}</p>
        {plate.length === 0 ? <p className="text-gray-600 text-sm text-center py-4">{lang === 'en' ? 'Add foods above →' : 'Tambah makanan di atas →'}</p> : (
          <div className="flex flex-wrap gap-2">
            {plate.map(f => <button key={f.id} onClick={() => { if (!submitted) setPlate(p => p.filter(x => x.id !== f.id)) }} className="flex items-center gap-1 bg-gray-700 border border-gray-600 rounded-lg px-2 py-1 text-sm hover:border-red-500 transition-colors">{f.icon} {f.name[lang]} <span className="text-red-400 text-xs ml-1">✕</span></button>)}
          </div>
        )}
        <div className="mt-3 flex gap-4 text-xs text-gray-400">
          <span>🔵 {lang === 'en' ? 'Carbs' : 'Karbo'}: {carbCount}</span>
          <span>🔴 {lang === 'en' ? 'Protein' : 'Protein'}: {proteinCount}</span>
          <span>🟢 {lang === 'en' ? 'Veg/Fruit' : 'Sayur/Buah'}: {vegCount}</span>
          <span className="ml-auto font-bold">{totalKcal} kcal</span>
        </div>
      </div>
      {plate.length >= 3 && !submitted && (
        <button onClick={() => { if (isBalanced) { setSubmitted(true); onComplete(30) } }} disabled={!isBalanced} className={`w-full mt-4 py-3 rounded-xl font-bold transition-colors ${isBalanced ? 'btn-primary' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
          {isBalanced ? (lang === 'en' ? '✅ Submit Balanced Plate!' : '✅ Hantar Pinggan Seimbang!') : (lang === 'en' ? '⚠️ Follow SSS ratio first' : '⚠️ Ikut nisbah SSS dahulu')}
        </button>
      )}
      {submitted && <p className="text-center text-green-400 font-bold mt-4">{lang === 'en' ? '🎉 Perfect balanced plate!' : '🎉 Pinggan seimbang sempurna!'}</p>}
    </div>
  )
}

const TABS = [{ key: 'calc', en: '🔢 Calorie Calculator', bm: '🔢 Kalkulator Kalori' }, { key: 'plate', en: '🍽️ Build Your Plate', bm: '🍽️ Bina Pinggan Anda' }]

export default function BalancedDietPage() {
  const { lang } = useApp()
  const [tab, setTab] = useState('calc')
  const [calcScore, setCalcScore] = useState(null)
  const [plateScore, setPlateScore] = useState(null)
  const total = (calcScore ?? 0) + (plateScore ?? 0)
 fanction (frameElement)

  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="pt-20 pb-12 px-4 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6"><span className="text-3xl">🥗</span><div><h1 className="text-2xl font-black">{t(lang, 'modules.balancedDiet')}</h1><p className="text-sm text-gray-400">{t(lang, 'appTitle')} · Priority 2</p></div></div>
        <div className="flex gap-2 mb-6">
          {TABS.map(tb => <button key={tb.key} onClick={() => setTab(tb.key)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === tb.key ? 'bg-lime-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>{tb[lang]}</button>)}
        </div>
        <div className="card">
          {tab === 'calc' && (calcScore !== null ? <div className="text-center py-6 text-green-400 font-black text-2xl">✅ {calcScore} pts</div> : <CalorieCalculator lang={lang} onComplete={setCalcScore} />)}
          {tab === 'plate' && (plateScore !== null ? <div className="text-center py-6 text-green-400 font-black text-2xl">✅ {plateScore} pts</div> : <BuildPlate lang={lang} onComplete={setPlateScore} />)}
        </div>
        {total > 0 && <div className="card mt-4"><p className="text-sm text-gray-400">{lang === 'en' ? 'Module total' : 'Jumlah modul'}</p><p className="text-2xl font-black text-nestle-gold">{total} / 50</p><ScoreSubmit moduleSlug="balanced-diet" score={total} maxScore={50} /></div>}
      </main>
    </div>
  )
}