# FORGE — Project Handoff

## What This Is
FORGE is a mobile-first Progressive Web App (PWA) for workout tracking, nutrition logging, meal planning, and grocery management. It was built from two HTML prototypes and is live at:

**https://ethanspanier.github.io/forge-app/**

The app is installable on iOS (Safari → Add to Home Screen) and Android (Chrome → Install App).

---

## Tech Stack
- **React 18** + **Vite 5** — component framework + build tool
- **Tailwind CSS 3** — utility classes (used sparingly; most styling is inline with CSS variables)
- **vite-plugin-pwa** — service worker + manifest for PWA install
- **lucide-react** — icons in the bottom nav
- **localStorage** — all data persistence, no backend

---

## Running Locally
```powershell
cd "C:\Users\espanier\Claude Code Projects\Workout.Meal Prep Project\forge-app"
npm run dev
# Opens at http://localhost:5173
```

## Deploying to GitHub Pages (after any change)
```powershell
cd "C:\Users\espanier\Claude Code Projects\Workout.Meal Prep Project\forge-app"
npm run deploy
# Builds + pushes to gh-pages branch → live in ~60 seconds
```

---

## File Structure
```
forge-app/
├── src/
│   ├── App.jsx                  # Shell: 6-tab bottom nav, tab routing
│   ├── index.css                # Design system (CSS vars, .card, .accent-btn, etc.)
│   ├── main.jsx                 # React entry point
│   ├── data/
│   │   ├── workouts.js          # SCHEDULE (DOW→workout), WORKOUTS (exercise lists)
│   │   ├── foods.js             # QUICK_FOODS (15 items), MACRO_GOALS
│   │   ├── grocery.js           # GROCERY categories + 23 Aldi items, BUDGET_TARGET
│   │   └── mealPlan.js          # MEAL_DAYS (Sun–Sat meals), PREP_STEPS, DAILY_TIPS
│   ├── hooks/
│   │   └── useLocalStorage.js   # useLocalStorage hook + key helpers (todayKey, weekKey, etc.)
│   └── tabs/
│       ├── Today.jsx            # Dashboard: protein ring, macro bars, week strip
│       ├── Workout.jsx          # Day selector, exercise logger, set dots
│       ├── Nutrition.jsx        # Calorie ring, food log, quick-add pills, custom entry
│       ├── Grocery.jsx          # Aldi checklist, budget tracker, custom items
│       ├── MealPlan.jsx         # Day-by-day meals + Prep Schedule sub-tabs
│       └── Stats.jsx            # Weekly protein chart, weight log, profile
├── public/
│   ├── icon-192.png             # PWA icon (green "F" on dark bg)
│   └── icon-512.png
├── vite.config.js               # base: '/forge-app/', PWA manifest config
├── package.json                 # scripts: dev, build, deploy
└── INSTALL.md                   # Step-by-step Node.js + install instructions
```

---

## Design System
All colors are CSS variables in `src/index.css`. **Never hardcode hex values — always use the vars.**

```css
--bg: #0e0f13          /* page background */
--surface: #16181f     /* cards */
--surface2: #1e2029    /* secondary surfaces, inputs */
--border: #2a2d38      /* all borders */
--accent: #c8f53e      /* green-yellow: headlines, protein, CTAs, lift days */
--accent2: #3ee8f5     /* cyan: carbs, cardio, secondary data */
--text: #f0f1f5        /* body text */
--muted: #6b7280       /* labels, placeholders, secondary text */
--red: #f53e3e         /* errors, over-budget */
--orange: #f5903e      /* fat macros, warnings */
--green: #3ef587       /* goal achieved */
```

**Fonts:**
- `'Bebas Neue', sans-serif` — all section labels, stat numbers, headers (letter-spacing: 1.5–2px)
- `'DM Sans', sans-serif` — body, buttons, inputs (weights 300/400/500/600)

**Reusable CSS classes** (defined in index.css, use directly):
- `.card` — dark surface card with border and 14px radius
- `.card-title` — Bebas Neue section label in muted color
- `.accent-btn` — green-yellow filled button with black text
- `.bar-track` / `.bar-fill` — macro progress bar shell + fill
- `.tag-lift`, `.tag-cardio`, `.tag-rest`, `.tag-activity`, `.tag-flex` — workout day badge styles
- `.animate-fade-in` — 0.3s fade+slide on mount

---

## Data Architecture (localStorage)

| Key | Contents |
|---|---|
| `nutrition_YYYY-MM-DD` | `{ breakfast, lunch, dinner, snacks }` — arrays of `{ name, cal, protein, carbs, fat }` |
| `workout_YYYY-MM-DD` | `{ completed: bool, type: string, date: string }` |
| `weight_log` | `[{ date: 'YYYY-MM-DD', weight: number }]` |
| `grocery_week_YYYY-WNN` | `{ checkedItems: [id, ...], customItems: [{ id, name, cost }] }` |
| `user_profile` | `{ age, weight, heightIn, proteinGoal, calGoal }` |

The `useLocalStorage(key, initialValue)` hook handles all reads/writes. Key helpers:
- `todayKey()` → `'2026-05-07'`
- `weekKey()` → `'2026-W19'`
- `nutritionKey(dateStr)` → `'nutrition_2026-05-07'`
- `workoutKey(dateStr)` → `'workout_2026-05-07'`

---

## Tab-by-Tab Summary

### Today (`src/tabs/Today.jsx`)
- Reads today's nutrition log and workout log from localStorage
- Animated SVG protein ring (r=44, circumference=276.5) + 3 macro bars
- Weekly strip: 7 day cells built from `SCHEDULE` in workouts.js
- "Log Workout" button calls `navigate('workout')` prop from App.jsx

### Workout (`src/tabs/Workout.jsx`)
- `SCHEDULE[dow]` drives which workout shows for each day
- Set dots: local state `setsDone` (object) + `completedEx` (Set)
- "Mark Workout Complete" saves `{ completed: true, type, date }` to localStorage
- Run days (DOW=2,6 with `workout:'run'`) show distance + time inputs instead of set dots
- Rest/activity days show a placeholder card

### Nutrition (`src/tabs/Nutrition.jsx`)
- Calorie ring same SVG pattern as Today's protein ring
- Quick-add pills built from `QUICK_FOODS` in foods.js (one tap adds to selected meal)
- Custom food entry: 5 fields (name, cal, protein, carbs, fat)
- All changes persist instantly via `useLocalStorage`

### Grocery (`src/tabs/Grocery.jsx`)
- `GROCERY` from grocery.js: 5 categories, 23 items, each with `{ id, name, note, cost, protein }`
- Budget bar color: accent → orange at 80% → red at 95% of $100
- "Staples" category (`staples: true` flag on the category object) can be hidden via toggle
- Custom items stored in `groceryState.customItems`, weekly key resets every Sunday

### Meal Plan (`src/tabs/MealPlan.jsx`)
- Two sub-tabs: "Meal Plan" and "Prep Schedule" (local state `subTab`)
- Meal Plan: horizontal scroll of 7 day pills → `MealDayDetail` component renders full day
- Prep Schedule: `PREP_STEPS_SUNDAY` + `PREP_STEPS_MIDWEEK` arrays rendered as timelines
- Protein color logic: green ≥162g, accent ≥140g, orange <140g

### Stats (`src/tabs/Stats.jsx`)
- Protein chart reads directly from localStorage in a loop (no hook — reads 7 days)
- Weight log: appends `{ date, weight }` to `weight_log` array, shows last 10 entries reversed
- Workouts this week: loops Sun→today checking `workout_YYYY-MM-DD.completed`
- Profile values hardcoded from `user_profile` localStorage key (defaults: age 23, 175lbs, 6'1")

---

## Common Edit Patterns

### Add a food to the quick-add list
Edit `src/data/foods.js` → add to `QUICK_FOODS` array:
```js
{ name: 'Tuna Can (3oz)', cal: 90, protein: 20, carbs: 0, fat: 1 }
```

### Add/change a workout exercise
Edit `src/data/workouts.js` → find the workout key (`upper`, `lower`, `full`, `run`) and edit its `exercises` array.

### Change the weekly schedule
Edit `src/data/workouts.js` → `SCHEDULE` object, keyed 0 (Sun) through 6 (Sat).

### Add a grocery item
Edit `src/data/grocery.js` → find the right category and add to its `items` array:
```js
{ id: 'g24', name: 'String Cheese — 12 pack', note: 'Quick protein snack', cost: 3.99, protein: '7g per stick' }
```

### Change macro goals
Edit `src/data/foods.js` → `MACRO_GOALS` object: `{ cal, protein, carbs, fat }`.

### Change user profile defaults
Edit `src/tabs/Stats.jsx` line with `useLocalStorage('user_profile', { ... })` — update the default object.

---

## GitHub Setup
- **Repo:** https://github.com/ethanspanier/forge-app
- **Live URL:** https://ethanspanier.github.io/forge-app/
- **Deploy branch:** `gh-pages` (auto-managed by `gh-pages` npm package)
- **Source branch:** `main`

To deploy any change: edit files → `npm run deploy` — that's it.

To push source code changes to GitHub as well:
```powershell
git add .
git commit -m "describe your change"
git push
npm run deploy
```

---

## User Profile
- 23M, 6'1", 175 lbs, St. Paul/Hugo MN
- Goal: maintain 170–175 lbs, reduce body fat, add lean muscle
- Daily targets: 2,400 kcal, 162g protein, 250g carbs, 65g fat
- Workouts: 3–4x/week with dumbbells, incline bench, pull-up bar, curl bar
- Primary grocery store: Aldi (Hugo, MN area, ~$100 budget)

---

## Phase 2 Features (not yet built)
Per the original brief — do not build unless asked:
- Garmin Connect API (steps, heart rate, sleep)
- Editable meal plan (swap meals per day)
- Custom workout builder
- Push notifications
- Barcode scanner for food logging
- iCloud/Google sync
- Progress photos
