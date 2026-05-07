export const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const DAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const SCHEDULE = {
  0: { label: 'Rest / Recovery', icon: '🧘', type: 'rest',     workout: null },
  1: { label: 'Upper Body',      icon: '💪', type: 'lift',     workout: 'upper' },
  2: { label: 'Run 2–3 mi',      icon: '🏃', type: 'cardio',   workout: 'run' },
  3: { label: 'Softball',        icon: '⚾', type: 'activity', workout: null },
  4: { label: 'Lower Body + Core', icon: '🦵', type: 'lift',   workout: 'lower' },
  5: { label: 'Rest / Bball',    icon: '🏀', type: 'rest',     workout: null },
  6: { label: 'Run or Full Body', icon: '⚡', type: 'flex',    workout: 'full' },
}

export const WORKOUTS = {
  upper: {
    name: 'Upper Body',
    duration: '~45 min',
    exercises: [
      { name: 'Bench Press',        meta: 'flat or incline', sets: 3, reps: '8–10' },
      { name: 'Dumbbell Rows',      meta: '10 each side',   sets: 3, reps: '10' },
      { name: 'Pull-Ups',           meta: 'max reps',       sets: 3, reps: 'Max' },
      { name: 'Shoulder Press',     meta: 'dumbbells',      sets: 3, reps: '10–12' },
      { name: 'Bicep Curls',        meta: 'curl bar',       sets: 3, reps: '10–12' },
      { name: 'Tricep Dips',        meta: 'bench',          sets: 2, reps: '12–15' },
    ]
  },
  lower: {
    name: 'Lower Body + Core',
    duration: '~45 min',
    exercises: [
      { name: 'Goblet Squats',      meta: 'dumbbells',      sets: 3, reps: '12' },
      { name: 'Romanian Deadlifts', meta: 'dumbbells',      sets: 3, reps: '10' },
      { name: 'Dumbbell Lunges',    meta: '10 each leg',    sets: 3, reps: '10' },
      { name: 'Step-Ups',           meta: 'bench, 10 each leg', sets: 2, reps: '10' },
      { name: 'Plank',              meta: '',               sets: 3, reps: '30–45 sec' },
      { name: 'Bicycle Crunches',   meta: '',               sets: 3, reps: '20' },
    ]
  },
  full: {
    name: 'Full Body',
    duration: '~40 min',
    exercises: [
      { name: 'Pull-Ups',           meta: 'max reps',       sets: 3, reps: 'Max' },
      { name: 'Incline DB Press',   meta: 'dumbbells',      sets: 3, reps: '10' },
      { name: 'Dumbbell Deadlifts', meta: '',               sets: 3, reps: '10' },
      { name: 'Curl Bar Curls',     meta: '',               sets: 2, reps: '12' },
      { name: 'Lateral Raises',     meta: 'dumbbells',      sets: 2, reps: '12' },
      { name: 'Core Circuit',       meta: 'plank + crunches', sets: 2, reps: '30s / 15' },
    ]
  },
  run: {
    name: '2–3 Mile Run',
    duration: '~25 min',
    exercises: [
      { name: 'Easy Pace Run', meta: '~8:30/mi target pace', sets: 1, reps: '2–3 miles' },
    ]
  }
}
