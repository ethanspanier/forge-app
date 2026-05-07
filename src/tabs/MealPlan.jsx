import { useState } from 'react'
import { MEAL_DAYS, PREP_STEPS_SUNDAY, PREP_STEPS_MIDWEEK, DAILY_TIPS } from '../data/mealPlan.js'

const SECTIONS = ['breakfast', 'lunch', 'dinner', 'snacks']
const SECTION_LABELS = { breakfast: 'BREAKFAST', lunch: 'LUNCH', dinner: 'DINNER', snacks: 'SNACKS' }

function PrepDot({ type }) {
  const colors = {
    cook:    { border: 'var(--accent)',  bg: 'rgba(200,245,62,0.2)' },
    midweek: { border: 'var(--accent2)', bg: 'rgba(62,232,245,0.2)' },
    note:    { border: 'var(--orange)',  bg: 'rgba(245,144,62,0.2)' }
  }
  const c = colors[type] || colors.note
  return (
    <div style={{
      position: 'absolute', left: -21, top: 4,
      width: 12, height: 12, borderRadius: '50%',
      border: `2px solid ${c.border}`, background: c.bg
    }} />
  )
}

function MealDayDetail({ day }) {
  let totalCal = 0, totalProtein = 0
  SECTIONS.forEach(s => day.meals[s].forEach(m => { totalCal += m.cal; totalProtein += m.protein }))
  const proteinColor = totalProtein >= 162 ? 'var(--green)' : totalProtein >= 140 ? 'var(--accent)' : 'var(--orange)'
  const tagClass = `tag-${day.tag}`

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginTop: 12 }}>
      <div style={{
        padding: '14px 18px', borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'var(--surface2)'
      }}>
        <div>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: 1 }}>
            {day.icon} {day.day} — {day.date}
          </h3>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>{day.type}</div>
        </div>
        <div className={`workout-tag ${tagClass}`}
          style={{ fontSize: '0.68rem', padding: '3px 10px', borderRadius: 20, fontWeight: 600, flexShrink: 0 }}>
          {day.tagLabel}
        </div>
      </div>

      <div style={{ padding: '14px 18px' }}>
        {SECTIONS.map(section => (
          <div key={section} style={{ marginBottom: 16 }}>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.82rem',
              letterSpacing: 2, color: 'var(--muted)',
              paddingBottom: 4, marginBottom: 6, borderBottom: '1px solid var(--border)'
            }}>{SECTION_LABELS[section]}</div>
            {day.meals[section].map((m, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '5px 0'
              }}>
                <div>
                  <div style={{ fontSize: '0.83rem' }}>{m.food}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 1 }}>{m.cal} kcal</div>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent)', flexShrink: 0, marginLeft: 10 }}>
                  {m.protein}g
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{
        padding: '12px 18px', background: 'var(--surface2)', borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Daily Total</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{totalCal} kcal estimated</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>Protein</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', color: proteinColor, letterSpacing: 1 }}>
            {totalProtein}g
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MealPlan() {
  const [subTab, setSubTab] = useState('meals')
  const [activeDay, setActiveDay] = useState(0)

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 8 }}>
      <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: 2 }}>MEAL PLAN</h2>
      </div>

      {/* Sub-tab pills */}
      <div style={{
        display: 'flex', gap: 4, marginBottom: 16,
        background: 'var(--surface)', borderRadius: 12, padding: 4, border: '1px solid var(--border)'
      }}>
        {[['meals', 'Meal Plan'], ['prep', 'Prep Schedule']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            style={{
              flex: 1, padding: '8px', textAlign: 'center', borderRadius: 8,
              border: subTab === id ? '1px solid var(--border)' : 'none',
              background: subTab === id ? 'var(--surface2)' : 'none',
              color: subTab === id ? 'var(--accent)' : 'var(--muted)',
              cursor: 'pointer', fontSize: '0.82rem', fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s'
            }}
          >{label}</button>
        ))}
      </div>

      {subTab === 'meals' && (
        <>
          {/* Day pills horizontal scroll */}
          <div style={{ overflowX: 'auto', paddingBottom: 4, marginBottom: 4 }}>
            <div style={{ display: 'flex', gap: 8, width: 'max-content' }}>
              {MEAL_DAYS.map((d, i) => (
                <div
                  key={d.day}
                  onClick={() => setActiveDay(i)}
                  style={{
                    background: i === activeDay ? 'rgba(200,245,62,0.06)' : 'var(--surface2)',
                    border: `1px solid ${i === activeDay ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 10, padding: '10px 14px', cursor: 'pointer',
                    textAlign: 'center', transition: 'all 0.2s', minWidth: 78
                  }}
                >
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: 1, color: i === activeDay ? 'var(--accent)' : 'var(--text)' }}>{d.day}</div>
                  <div style={{ fontSize: '1.1rem', margin: '3px 0' }}>{d.icon}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--muted)' }}>{d.date}</div>
                </div>
              ))}
            </div>
          </div>
          <MealDayDetail day={MEAL_DAYS[activeDay]} />
        </>
      )}

      {subTab === 'prep' && (
        <>
          {/* Sunday bulk prep */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-title">SUNDAY BULK PREP — ~90 min</div>
            <div style={{ position: 'relative', paddingLeft: 28 }}>
              <div style={{
                position: 'absolute', left: 10, top: 6, bottom: 6,
                width: 2, background: 'var(--border)', borderRadius: 2
              }} />
              {PREP_STEPS_SUNDAY.map((step, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: i < PREP_STEPS_SUNDAY.length - 1 ? 20 : 0 }}>
                  <PrepDot type={step.type} />
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.82rem', letterSpacing: 1, color: 'var(--accent)', marginBottom: 3 }}>
                    {step.time}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 500, marginBottom: 3 }}>{step.task}</div>
                  <div style={{ fontSize: '0.77rem', color: 'var(--muted)', lineHeight: 1.5 }}>{step.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Midweek refresh */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-title">MIDWEEK REFRESH — ~20 min</div>
            <div style={{ position: 'relative', paddingLeft: 28 }}>
              <div style={{
                position: 'absolute', left: 10, top: 6, bottom: 6,
                width: 2, background: 'var(--border)', borderRadius: 2
              }} />
              {PREP_STEPS_MIDWEEK.map((step, i) => (
                <div key={i} style={{ position: 'relative', marginBottom: i < PREP_STEPS_MIDWEEK.length - 1 ? 20 : 0 }}>
                  <PrepDot type={step.type} />
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.82rem', letterSpacing: 1, color: 'var(--accent2)', marginBottom: 3 }}>
                    {step.time}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 500, marginBottom: 3 }}>{step.task}</div>
                  <div style={{ fontSize: '0.77rem', color: 'var(--muted)', lineHeight: 1.5 }}>{step.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily tips */}
          <div className="card" style={{ marginBottom: 12 }}>
            <div className="card-title">DAILY REMINDERS & TIPS</div>
            {DAILY_TIPS.map((tip, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, padding: '10px 0',
                borderBottom: i < DAILY_TIPS.length - 1 ? '1px solid rgba(42,45,56,0.5)' : 'none'
              }}>
                <div style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: 1 }}>{tip.icon}</div>
                <div style={{ fontSize: '0.82rem', lineHeight: 1.5, color: 'var(--text)' }}>{tip.text}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
