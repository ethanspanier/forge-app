import { useState } from 'react'
import { DAYS_SHORT } from '../data/workouts.js'
import { MACRO_GOALS } from '../data/foods.js'
import { useLocalStorage, todayKey, weekKey, nutritionKey, workoutKey } from '../hooks/useLocalStorage.js'

const GOAL_PROTEIN = MACRO_GOALS.protein

function WeekProteinChart() {
  const dow = new Date().getDay()
  const weekProtein = DAYS_SHORT.map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - dow + i)
    const key = nutritionKey(date.toISOString().slice(0, 10))
    try {
      const stored = localStorage.getItem(key)
      if (!stored) return 0
      const log = JSON.parse(stored)
      return ['breakfast','lunch','dinner','snacks'].flatMap(m => log[m] || []).reduce((s, f) => s + (f.protein||0), 0)
    } catch { return 0 }
  })

  const max = Math.max(...weekProtein, GOAL_PROTEIN)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 90, marginTop: 12, position: 'relative' }}>
      {/* Goal line */}
      <div style={{
        position: 'absolute', left: 0, right: 0,
        bottom: `${(GOAL_PROTEIN / max) * 90}px`,
        borderTop: '1px dashed rgba(200,245,62,0.3)',
        pointerEvents: 'none'
      }} />
      {weekProtein.map((v, i) => {
        const isToday = i === dow
        const metGoal = v >= GOAL_PROTEIN
        const barColor = isToday ? 'var(--accent)' : metGoal ? 'var(--accent2)' : 'var(--surface2)'
        const barBorder = (!isToday && !metGoal) ? '1px solid var(--border)' : 'none'
        const height = v > 0 ? Math.round((v / max) * 80) : 3
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ fontSize: '0.6rem', color: isToday ? 'var(--accent)' : 'var(--muted)' }}>
              {v > 0 ? `${Math.round(v)}` : ''}
            </div>
            <div style={{
              width: '100%', height: height, background: barColor,
              border: barBorder, borderRadius: '4px 4px 0 0', transition: 'height 0.5s ease'
            }} />
            <div style={{ fontSize: '0.62rem', color: isToday ? 'var(--accent)' : 'var(--muted)' }}>
              {DAYS_SHORT[i]}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Stats() {
  const dateStr = todayKey()
  const [weightLog, setWeightLog] = useLocalStorage('weight_log', [])
  const [profile] = useLocalStorage('user_profile', { age: 23, weight: 175, heightIn: 73, proteinGoal: 162, calGoal: 2400 })
  const [newWeight, setNewWeight] = useState('')

  // Count workouts this week
  const dow = new Date().getDay()
  let workoutsThisWeek = 0
  for (let i = 0; i <= dow; i++) {
    const date = new Date()
    date.setDate(date.getDate() - dow + i)
    const key = workoutKey(date.toISOString().slice(0, 10))
    try {
      const stored = localStorage.getItem(key)
      if (stored && JSON.parse(stored).completed) workoutsThisWeek++
    } catch {}
  }

  const currentWeight = weightLog.length > 0 ? weightLog[weightLog.length - 1].weight : profile.weight

  const logWeight = () => {
    const w = parseFloat(newWeight)
    if (!w || w < 50 || w > 500) return
    setWeightLog(prev => [...prev, { date: dateStr, weight: w }])
    setNewWeight('')
  }

  const heightFt = Math.floor(profile.heightIn / 12)
  const heightIn = profile.heightIn % 12

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 8 }}>
      <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: 2 }}>STATS</h2>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
        {[
          { val: workoutsThisWeek, lbl: 'Workouts This Week', color: 'var(--accent)' },
          { val: `${currentWeight}`, lbl: 'Weight (lbs)', color: 'var(--accent2)' },
          { val: workoutsThisWeek, lbl: 'Active Streak', color: 'var(--orange)' }
        ].map(({ val, lbl, color }) => (
          <div key={lbl} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', color, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 4 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Weekly protein chart */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">WEEKLY PROTEIN (g)</div>
        <WeekProteinChart />
        <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: '0.7rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, background: 'var(--accent)', borderRadius: 2 }} />
            <span style={{ color: 'var(--muted)' }}>Today</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, background: 'var(--accent2)', borderRadius: 2 }} />
            <span style={{ color: 'var(--muted)' }}>Goal met</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 2 }} />
            <span style={{ color: 'var(--muted)' }}>Below goal</span>
          </div>
        </div>
      </div>

      {/* Weight log */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">WEIGHT LOG</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <input
            type="number" step="0.1" placeholder="Today's weight (lbs)"
            value={newWeight} onChange={e => setNewWeight(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && logWeight()}
            style={{ flex: 1 }}
          />
          <button className="accent-btn" onClick={logWeight}>Log</button>
        </div>
        {weightLog.length === 0 ? (
          <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>No weight entries yet</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[...weightLog].reverse().slice(0, 10).map((entry, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '7px 0', borderBottom: '1px solid rgba(42,45,56,0.5)', fontSize: '0.85rem'
              }}>
                <span style={{ color: 'var(--muted)' }}>{entry.date}</span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', color: 'var(--accent2)', letterSpacing: 1 }}>
                  {entry.weight} lbs
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile card */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">PROFILE</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '0.85rem' }}>
          {[
            ['Age', `${profile.age}`],
            ['Height', `${heightFt}'${heightIn}"`],
            ['Current Weight', `${currentWeight} lbs`],
            ['Goal Weight', '170–175 lbs'],
            ['Protein Goal', `${profile.proteinGoal}g/day`],
            ['Calorie Goal', `${profile.calGoal} kcal`],
            ['Workouts/week', '3–4'],
            ['Location', 'St. Paul, MN'],
          ].map(([label, val]) => (
            <div key={label}>
              <span style={{ color: 'var(--muted)' }}>{label}: </span>
              <span style={{ fontWeight: 500 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
