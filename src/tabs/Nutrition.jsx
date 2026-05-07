import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { QUICK_FOODS, MACRO_GOALS } from '../data/foods.js'
import { useLocalStorage, todayKey, nutritionKey } from '../hooks/useLocalStorage.js'

const CIRCUMFERENCE = 2 * Math.PI * 44

const MEALS = ['breakfast', 'lunch', 'dinner', 'snacks']
const MEAL_LABELS = { breakfast: 'BREAKFAST', lunch: 'LUNCH', dinner: 'DINNER', snacks: 'SNACKS' }

function CalRing({ cal, goal }) {
  const ringRef = useRef(null)
  const pct = Math.min(cal / goal, 1)
  const offset = CIRCUMFERENCE * (1 - pct)
  const color = pct >= 1 ? 'var(--green)' : 'var(--accent)'

  useEffect(() => {
    if (ringRef.current) ringRef.current.style.strokeDashoffset = offset
  }, [offset])

  return (
    <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
      <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="55" cy="55" r="44" fill="none" stroke="var(--surface2)" strokeWidth="10" />
        <circle ref={ringRef} cx="55" cy="55" r="44" fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE} strokeDashoffset={CIRCUMFERENCE}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', color, lineHeight: 1 }}>{Math.round(cal)}</div>
        <div style={{ fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.5px' }}>KCAL</div>
        <div style={{ fontSize: '0.6rem', color: 'var(--muted)' }}>/ {goal}</div>
      </div>
    </div>
  )
}

function MacroBar({ label, current, goal, color }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
        <span style={{ color: 'var(--muted)' }}>{label}</span>
        <span style={{ fontWeight: 500 }}>{Math.round(current)}g / {goal}g</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${Math.min(current/goal*100,100)}%`, background: color }} />
      </div>
    </div>
  )
}

export default function Nutrition() {
  const dateStr = todayKey()
  const [log, setLog] = useLocalStorage(nutritionKey(dateStr), {
    breakfast: [], lunch: [], dinner: [], snacks: []
  })
  const [selectedMeal, setSelectedMeal] = useState('breakfast')
  const [customName, setCustomName] = useState('')
  const [customCal, setCustomCal] = useState('')
  const [customProtein, setCustomProtein] = useState('')
  const [customCarbs, setCustomCarbs] = useState('')
  const [customFat, setCustomFat] = useState('')

  const allFoods = MEALS.flatMap(m => log[m])
  const totals = allFoods.reduce(
    (acc, f) => ({ cal: acc.cal+(f.cal||0), protein: acc.protein+(f.protein||0), carbs: acc.carbs+(f.carbs||0), fat: acc.fat+(f.fat||0) }),
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const addFood = (food) => {
    setLog(prev => ({ ...prev, [selectedMeal]: [...prev[selectedMeal], { ...food }] }))
  }

  const removeFood = (meal, idx) => {
    setLog(prev => ({ ...prev, [meal]: prev[meal].filter((_, i) => i !== idx) }))
  }

  const handleCustomAdd = () => {
    if (!customName.trim()) return
    addFood({
      name: customName.trim(),
      cal: parseFloat(customCal) || 0,
      protein: parseFloat(customProtein) || 0,
      carbs: parseFloat(customCarbs) || 0,
      fat: parseFloat(customFat) || 0
    })
    setCustomName(''); setCustomCal(''); setCustomProtein(''); setCustomCarbs(''); setCustomFat('')
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 8 }}>
      <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: 2 }}>NUTRITION</h2>
      </div>

      {/* Macro summary */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">TODAY'S MACROS</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <CalRing cal={totals.cal} goal={MACRO_GOALS.cal} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <MacroBar label="Protein" current={totals.protein} goal={MACRO_GOALS.protein} color="var(--accent)" />
            <MacroBar label="Carbs"   current={totals.carbs}   goal={MACRO_GOALS.carbs}   color="var(--accent2)" />
            <MacroBar label="Fat"     current={totals.fat}     goal={MACRO_GOALS.fat}      color="var(--orange)" />
          </div>
        </div>
      </div>

      {/* Food log */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">FOOD LOG</div>
        {MEALS.map(meal => (
          <div key={meal} style={{ marginBottom: 18 }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.9rem',
              letterSpacing: '1.5px', color: 'var(--muted)',
              paddingBottom: 6, marginBottom: 6,
              borderBottom: '1px solid var(--border)'
            }}>{MEAL_LABELS[meal]}</div>
            {log[meal].length === 0 ? (
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', padding: '4px 0' }}>No items logged</div>
            ) : log[meal].map((f, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '7px 0', borderBottom: '1px solid rgba(42,45,56,0.5)'
              }}>
                <div>
                  <div style={{ fontSize: '0.85rem' }}>{f.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 1 }}>
                    {f.cal} kcal · {f.carbs}g carbs · {f.fat||0}g fat
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)' }}>{f.protein}g</span>
                  <button
                    onClick={() => removeFood(meal, i)}
                    style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: '2px 4px', borderRadius: 4, display: 'flex', alignItems: 'center' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Add food */}
      <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.9rem', letterSpacing: '1.5px', color: 'var(--muted)', marginBottom: 12 }}>
          ADD FOOD
        </div>

        {/* Meal selector */}
        <div style={{ marginBottom: 10 }}>
          <select value={selectedMeal} onChange={e => setSelectedMeal(e.target.value)} style={{ width: 'auto' }}>
            {MEALS.map(m => <option key={m} value={m}>{MEAL_LABELS[m]}</option>)}
          </select>
        </div>

        {/* Quick add pills */}
        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 6 }}>Quick add:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {QUICK_FOODS.map((f, i) => (
            <button
              key={i}
              onClick={() => addFood(f)}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20,
                padding: '4px 12px', fontSize: '0.73rem', color: 'var(--text)',
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s'
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor='var(--accent)'; e.currentTarget.style.color='var(--accent)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text)' }}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* Custom food entry */}
        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 6 }}>Custom food:</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <input style={{ flex: '2 1 120px' }} placeholder="Food name" value={customName} onChange={e => setCustomName(e.target.value)} />
          <input style={{ flex: '1 1 55px' }} type="number" placeholder="Cal" value={customCal} onChange={e => setCustomCal(e.target.value)} />
          <input style={{ flex: '1 1 55px' }} type="number" placeholder="Pro" value={customProtein} onChange={e => setCustomProtein(e.target.value)} />
          <input style={{ flex: '1 1 55px' }} type="number" placeholder="Carbs" value={customCarbs} onChange={e => setCustomCarbs(e.target.value)} />
          <input style={{ flex: '1 1 55px' }} type="number" placeholder="Fat" value={customFat} onChange={e => setCustomFat(e.target.value)} />
          <button className="accent-btn" onClick={handleCustomAdd} style={{ flex: '0 0 auto' }}>+ Add</button>
        </div>
      </div>
    </div>
  )
}
