import { useState } from 'react'
import { Home, Dumbbell, Apple, ShoppingCart, UtensilsCrossed, BarChart3 } from 'lucide-react'
import Today from './tabs/Today.jsx'
import Workout from './tabs/Workout.jsx'
import Nutrition from './tabs/Nutrition.jsx'
import Grocery from './tabs/Grocery.jsx'
import MealPlan from './tabs/MealPlan.jsx'
import Stats from './tabs/Stats.jsx'

const TABS = [
  { id: 'today',    label: 'Today',    Icon: Home },
  { id: 'workout',  label: 'Workout',  Icon: Dumbbell },
  { id: 'nutrition',label: 'Nutrition',Icon: Apple },
  { id: 'grocery',  label: 'Grocery',  Icon: ShoppingCart },
  { id: 'mealplan', label: 'Meals',    Icon: UtensilsCrossed },
  { id: 'stats',    label: 'Stats',    Icon: BarChart3 },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('today')

  const navigate = (tab) => setActiveTab(tab)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'var(--bg)' }}>
      {/* Scrollable content area */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ padding: '16px 16px 0', maxWidth: 480, margin: '0 auto' }}>
          {activeTab === 'today'     && <Today navigate={navigate} />}
          {activeTab === 'workout'   && <Workout />}
          {activeTab === 'nutrition' && <Nutrition />}
          {activeTab === 'grocery'   && <Grocery />}
          {activeTab === 'mealplan'  && <MealPlan />}
          {activeTab === 'stats'     && <Stats />}
        </div>
        {/* Spacer for bottom nav */}
        <div style={{ height: 72 }} />
      </div>

      {/* Fixed bottom nav */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        zIndex: 50
      }}>
        {TABS.map(({ id, label, Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px 2px',
                border: 'none',
                background: active ? 'rgba(200,245,62,0.06)' : 'none',
                color: active ? 'var(--accent)' : 'var(--muted)',
                cursor: 'pointer',
                gap: 3,
                transition: 'color 0.15s, background 0.15s',
                fontFamily: "'DM Sans', sans-serif",
                borderTop: active ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
              <span style={{ fontSize: '0.6rem', fontWeight: active ? 600 : 400, letterSpacing: '0.3px' }}>
                {label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
