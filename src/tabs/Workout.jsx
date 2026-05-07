import { useState } from 'react'
import { SCHEDULE, WORKOUTS, DAYS_SHORT } from '../data/workouts.js'
import { useLocalStorage, todayKey, workoutKey, dateForDow } from '../hooks/useLocalStorage.js'

function SetDot({ done, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 12, height: 12, borderRadius: '50%',
        border: `1.5px solid ${done ? 'var(--accent)' : 'var(--border)'}`,
        background: done ? 'var(--accent)' : 'none',
        cursor: 'pointer',
        transition: 'all 0.15s',
        flexShrink: 0
      }}
    />
  )
}

function ExerciseRow({ ex, exIdx, setsDone, onTickSet, onToggle, completed }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto auto',
      alignItems: 'center',
      gap: 10,
      padding: '10px 8px',
      borderRadius: 8,
      opacity: completed ? 0.45 : 1,
      transition: 'opacity 0.2s',
      background: completed ? 'rgba(200,245,62,0.03)' : 'none'
    }}>
      <div>
        <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{ex.name}</div>
        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>
          {ex.sets} sets × {ex.reps}{ex.meta ? ` — ${ex.meta}` : ''}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: ex.sets }, (_, s) => (
          <SetDot key={s} done={s < setsDone} onClick={() => onTickSet(exIdx, s, ex.sets)} />
        ))}
      </div>
      <button
        onClick={() => onToggle(exIdx, ex.sets)}
        style={{
          width: 24, height: 24, borderRadius: '50%',
          border: `1.5px solid ${completed ? 'var(--accent)' : 'var(--border)'}`,
          background: completed ? 'var(--accent)' : 'none',
          color: completed ? '#000' : 'var(--muted)',
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', transition: 'all 0.2s', flexShrink: 0
        }}
      >✓</button>
    </div>
  )
}

export default function Workout() {
  const dow = new Date().getDay()
  const [selectedDow, setSelectedDow] = useState(dow)
  const dateStr = todayKey()

  const [workoutLog, setWorkoutLog] = useLocalStorage(workoutKey(dateStr), {
    completed: false,
    exercises: {},
    completedExArr: [],
    run: { distance: '', time: '' }
  })

  // Derive UI state from workoutLog — only restore today's progress when viewing today
  const setsDone    = selectedDow === dow ? (workoutLog.exercises    || {}) : {}
  const completedEx = new Set(selectedDow === dow ? (workoutLog.completedExArr || []) : [])
  const runDistance = selectedDow === dow ? (workoutLog.run?.distance ?? '') : ''
  const runTime     = selectedDow === dow ? (workoutLog.run?.time     ?? '') : ''

  // Per-day completion status for the week selector (today's from reactive state)
  const weekCompletions = Array.from({ length: 7 }, (_, i) => {
    if (i === dow) return workoutLog.completed
    try {
      const stored = localStorage.getItem(workoutKey(dateForDow(i)))
      return stored ? JSON.parse(stored).completed : false
    } catch { return false }
  })

  const sched = SCHEDULE[selectedDow]
  const workout = sched.workout ? WORKOUTS[sched.workout] : null

  const handleSelectDay = (d) => {
    setSelectedDow(d)
  }

  const handleTickSet = (exIdx, setIdx, totalSets) => {
    const newCount = setIdx + 1
    setWorkoutLog(prev => ({
      ...prev,
      exercises: { ...prev.exercises, [exIdx]: newCount },
      completedExArr: newCount >= totalSets
        ? [...new Set([...(prev.completedExArr || []), exIdx])]
        : (prev.completedExArr || [])
    }))
  }

  const handleToggle = (exIdx, totalSets) => {
    setWorkoutLog(prev => {
      const arr = prev.completedExArr || []
      const isCompleted = arr.includes(exIdx)
      return {
        ...prev,
        exercises: { ...prev.exercises, [exIdx]: isCompleted ? 0 : totalSets },
        completedExArr: isCompleted ? arr.filter(i => i !== exIdx) : [...arr, exIdx]
      }
    })
  }

  const handleMarkComplete = () => {
    setWorkoutLog(prev => ({
      ...prev,
      completed: true,
      type: sched.workout,
      date: dateStr
    }))
  }

  const tagClass = `tag-${sched.type}`

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 8 }}>
      <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: 2, color: 'var(--text)' }}>
          WORKOUT
        </h2>
      </div>

      {/* Week selector */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">SELECT DAY</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
          {DAYS_SHORT.map((d, i) => {
            const s = SCHEDULE[i]
            const isToday = i === dow
            const isSelected = i === selectedDow
            return (
              <div
                key={d}
                onClick={() => handleSelectDay(i)}
                style={{
                  background: isSelected ? 'rgba(62,232,245,0.08)' : isToday ? 'rgba(200,245,62,0.06)' : 'var(--surface2)',
                  border: `1px solid ${isSelected ? 'var(--accent2)' : isToday ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: 10, padding: '8px 4px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s'
                }}
              >
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.78rem', letterSpacing: 1,
                  color: isSelected ? 'var(--accent2)' : isToday ? 'var(--accent)' : 'var(--muted)',
                  marginBottom: 3
                }}>{d}</div>
                <div style={{ fontSize: '1rem' }}>{s.icon}</div>
                {weekCompletions[i] && s.workout && (
                  <div style={{ fontSize: '0.55rem', color: 'var(--green)', marginTop: 2 }}>✓</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Workout detail */}
      {workout ? (
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 18px', borderBottom: '1px solid var(--border)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: 1 }}>
                {workout.name}
              </h3>
              <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>{workout.duration}</div>
            </div>
            <div className={`workout-tag ${tagClass}`}
              style={{ fontSize: '0.68rem', padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
              {sched.label}
            </div>
          </div>

          {/* Run log fields */}
          {sched.workout === 'run' && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 4 }}>Distance (miles)</div>
                <input
                  type="number" step="0.1" placeholder="2.5"
                  value={runDistance}
                  onChange={e => setWorkoutLog(prev => ({ ...prev, run: { ...prev.run, distance: e.target.value } }))}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 4 }}>Time (min)</div>
                <input
                  type="number" placeholder="22"
                  value={runTime}
                  onChange={e => setWorkoutLog(prev => ({ ...prev, run: { ...prev.run, time: e.target.value } }))}
                />
              </div>
            </div>
          )}

          {/* Exercise list */}
          <div style={{ padding: '8px 12px' }}>
            {workout.exercises.map((ex, i) => (
              <ExerciseRow
                key={i}
                ex={ex}
                exIdx={i}
                setsDone={setsDone[i] || 0}
                onTickSet={handleTickSet}
                onToggle={handleToggle}
                completed={completedEx.has(i)}
              />
            ))}
          </div>

          {/* Mark complete */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
            {workoutLog.completed && selectedDow === dow ? (
              <div style={{
                padding: '10px 16px', background: 'rgba(62,245,135,0.1)',
                border: '1px solid rgba(62,245,135,0.3)', borderRadius: 8,
                fontSize: '0.85rem', color: 'var(--green)', fontWeight: 500, textAlign: 'center'
              }}>
                ✓ Workout logged for today!
              </div>
            ) : selectedDow === dow ? (
              <button className="accent-btn" style={{ width: '100%' }} onClick={handleMarkComplete}>
                Mark Workout Complete
              </button>
            ) : (
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', textAlign: 'center' }}>
                Select today's date to log a workout
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>{sched.icon}</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: 1, marginBottom: 6 }}>
            {sched.label}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
            {sched.type === 'rest' ? 'Rest day — enjoy the recovery.' : 'Enjoy your activity today.'}
          </div>
        </div>
      )}
    </div>
  )
}
