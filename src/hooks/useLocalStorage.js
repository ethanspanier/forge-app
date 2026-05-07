import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage full or unavailable — fail silently
    }
  }, [key, value])

  return [value, setValue]
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function weekKey() {
  const now = new Date()
  const jan1 = new Date(now.getFullYear(), 0, 1)
  const week = Math.ceil(((now - jan1) / 86400000 + jan1.getDay() + 1) / 7)
  return `${now.getFullYear()}-W${String(week).padStart(2, '0')}`
}

export function workoutKey(dateStr) {
  return `workout_${dateStr}`
}

export function nutritionKey(dateStr) {
  return `nutrition_${dateStr}`
}
