import { useEffect, useRef } from 'react'
import { SCHEDULE, DAYS_SHORT, WORKOUTS } from '../data/workouts.js'
import { MACRO_GOALS } from '../data/foods.js'
import { useLocalStorage, todayKey, nutritionKey, workoutKey, dateForDow } from '../hooks/useLocalStorage.js'

const CIRCUMFERENCE = 2 * Math.PI * 44 // r=44

function ProteinRing({ logged, goal }) {
  const ringRef = useRef(null)
  const pct = Math.min(logged / goal, 1)
  const offset = CIRCUMFERENCE * (1 - pct)

  useEffect(() => {
    if (ringRef.current) {
      ringRef.current.style.strokeDashoffset = offset
    }
  }, [offset])

  const color = pct >= 1 ? 'var(--green)' : 'var(--accent)'

  return (
    <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
      <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="55" cy="55" r="44" fill="none" stroke="var(--surface2)" strokeWidth="10" />
        <circle
          ref={ringRef}
          cx="55" cy="55" r="44"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', color, lineHeight: 1 }}>
          {logged}g
        </div>
        <div style={{ fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.5px', marginTop: 2 }}>
          PROTEIN
        </div>
        <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>/ {goal}g</div>
      </div>
    </div>
  )
}

function MacroBar({ label, current, goal, color }) {
  const pct = Math.min((current / goal) * 100, 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
        <span style={{ color: 'var(--muted)' }}>{label}</span>
        <span style={{ color: 'var(--text)', fontWeight: 500 }}>{current}g / {goal}g</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export default function Today({ navigate }) {
  const now = new Date()
  const dow = now.getDay()
  const dateStr = todayKey()
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
  const dateDisplay = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const [nutrition] = useLocalStorage(nutritionKey(dateStr), { breakfast: [], lunch: [], dinner: [], snacks: [] })
  const [workoutLog] = useLocalStorage(workoutKey(dateStr), { completed: false })

  const sched = SCHEDULE[dow]

  const allFoods = [
    ...nutrition.breakfast,
    ...nutrition.lunch,
    ...nutrition.dinner,
    ...nutrition.snacks
  ]
  const totals = allFoods.reduce(
    (acc, f) => ({ cal: acc.cal + (f.cal||0), protein: acc.protein + (f.protein||0), carbs: acc.carbs + (f.carbs||0), fat: acc.fat + (f.fat||0) }),
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const tagClass = `tag-${sched.type}`

  // Per-day completion status for this week (today's from reactive state)
  const weekCompletions = Array.from({ length: 7 }, (_, i) => {
    if (i === dow) return workoutLog?.completed || false
    try {
      const stored = localStorage.getItem(workoutKey(dateForDow(i)))
      return stored ? JSON.parse(stored).completed : false
    } catch { return false }
  })

  // Build this-week summary (Sun = 0 … Sat = 6)
  const weekCells = DAYS_SHORT.map((d, i) => {
    const s = SCHEDULE[i]
    const isToday = i === dow
    return (
      <div key={d} style={{
        background: isToday ? 'rgba(200,245,62,0.06)' : 'var(--surface2)',
        border: `1px solid ${isToday ? 'var(--accent)' : 'var(--border)'}`,
        borderRadius: 10,
        padding: '8px 4px',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '0.8rem',
          letterSpacing: 1,
          color: isToday ? 'var(--accent)' : 'var(--muted)',
          marginBottom: 4
        }}>{d}</div>
        <div style={{ fontSize: '1.1rem', marginBottom: 2 }}>{s.icon}</div>
        <div style={{ fontSize: '0.58rem', color: 'var(--muted)', lineHeight: 1.2 }}>{s.label.split(' ')[0]}</div>
        {weekCompletions[i] && s.workout && (
          <div style={{ fontSize: '0.55rem', color: 'var(--green)', marginTop: 2 }}>✓</div>
        )}
      </div>
    )
  })

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 8 }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        marginBottom: 20, paddingBottom: 16,
        borderBottom: '1px solid var(--border)'
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '2.6rem', letterSpacing: 2, lineHeight: 1,
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
          }}>FORGE</h1>
          <div style={{ color: 'var(--muted)', fontSize: '0.78rem', marginTop: 2, fontWeight: 300 }}>
            Workout & Nutrition Tracker
          </div>
        </div>
        <div style={{
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '8px 14px', textAlign: 'right'
        }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: 1, color: 'var(--accent)' }}>
            {dayName}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>{dateDisplay}</div>
        </div>
      </div>

      {/* Activity card */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">TODAY'S ACTIVITY</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: '2.2rem' }}>{sched.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 4 }}>{sched.label}</div>
            <div className={`workout-tag ${tagClass}`}
              style={{ display: 'inline-block', fontSize: '0.68rem', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
              {sched.type === 'lift' ? 'LIFT DAY' :
               sched.type === 'cardio' ? 'CARDIO' :
               sched.type === 'activity' ? 'ACTIVITY' :
               sched.type === 'flex' ? 'FLEX DAY' : 'REST DAY'}
            </div>
          </div>
          {sched.workout && (
            <button className="accent-btn" onClick={() => navigate('workout')} style={{ flexShrink: 0 }}>
              Log Workout
            </button>
          )}
        </div>
        {workoutLog?.completed && (
          <div style={{
            marginTop: 10, padding: '6px 12px', background: 'rgba(62,245,135,0.1)',
            border: '1px solid rgba(62,245,135,0.3)', borderRadius: 8,
            fontSize: '0.78rem', color: 'var(--green)', fontWeight: 500
          }}>
            ✓ Workout logged today
          </div>
        )}
      </div>

      {/* Protein ring + macro bars */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">NUTRITION TODAY</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <ProteinRing logged={Math.round(totals.protein)} goal={MACRO_GOALS.protein} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <MacroBar label="Protein" current={Math.round(totals.protein)} goal={MACRO_GOALS.protein} color="var(--accent)" />
            <MacroBar label="Carbs"   current={Math.round(totals.carbs)}   goal={MACRO_GOALS.carbs}   color="var(--accent2)" />
            <MacroBar label="Fat"     current={Math.round(totals.fat)}     goal={MACRO_GOALS.fat}     color="var(--orange)" />
          </div>
        </div>

        {/* Meals summary */}
        <div
          onClick={() => navigate('nutrition')}
          style={{
            marginTop: 14, padding: '10px 14px',
            background: 'var(--surface2)', border: '1px solid var(--border)',
            borderRadius: 10, cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 500 }}>
              {allFoods.length > 0 ? `${allFoods.length} items logged` : 'No meals logged yet'}
            </div>
            {allFoods.length > 0 && (
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>
                {Math.round(totals.cal)} kcal · {Math.round(totals.protein)}g protein
              </div>
            )}
          </div>
          <div style={{ color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 600 }}>Log food →</div>
        </div>
      </div>

      {/* Weekly strip */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">THIS WEEK</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {weekCells}
        </div>
      </div>
    </div>
  )
}
