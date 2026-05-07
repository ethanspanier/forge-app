import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { GROCERY, BUDGET_TARGET } from '../data/grocery.js'
import { useLocalStorage, weekKey } from '../hooks/useLocalStorage.js'

export default function Grocery() {
  const key = `grocery_week_${weekKey()}`
  const [groceryState, setGroceryState] = useLocalStorage(key, { checkedItems: [], customItems: [] })
  const [hideStaples, setHideStaples] = useState(false)
  const [newItem, setNewItem] = useState('')
  const [newCost, setNewCost] = useState('')

  const checkedSet = new Set(groceryState.checkedItems)

  const toggleItem = (id, cost) => {
    setGroceryState(prev => {
      const set = new Set(prev.checkedItems)
      if (set.has(id)) set.delete(id)
      else set.add(id)
      return { ...prev, checkedItems: [...set] }
    })
  }

  const addCustomItem = () => {
    if (!newItem.trim()) return
    const id = `custom_${Date.now()}`
    setGroceryState(prev => ({
      ...prev,
      customItems: [...prev.customItems, { id, name: newItem.trim(), cost: parseFloat(newCost) || 0, category: 'CUSTOM' }]
    }))
    setNewItem(''); setNewCost('')
  }

  const removeCustomItem = (id) => {
    setGroceryState(prev => ({
      ...prev,
      customItems: prev.customItems.filter(i => i.id !== id),
      checkedItems: prev.checkedItems.filter(c => c !== id)
    }))
  }

  // Calculate total spent
  let totalSpent = 0
  GROCERY.forEach(cat => cat.items.forEach(item => {
    if (checkedSet.has(item.id)) totalSpent += item.cost
  }))
  groceryState.customItems.forEach(item => {
    if (checkedSet.has(item.id)) totalSpent += item.cost
  })

  const budgetPct = Math.min((totalSpent / BUDGET_TARGET) * 100, 100)
  const budgetColor = budgetPct > 95 ? 'var(--red)' : budgetPct > 80 ? 'var(--orange)' : 'var(--accent)'

  const totalItems = GROCERY.reduce((s, c) => s + c.items.length, 0) + groceryState.customItems.length
  const checkedCount = groceryState.checkedItems.length

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 8 }}>
      <div style={{ marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: 2 }}>GROCERY</h2>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 2 }}>Aldi — Hugo, MN area prices</div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
        {[
          { val: checkedCount, lbl: 'Checked', color: 'var(--accent)' },
          { val: totalItems,   lbl: 'Total Items', color: 'var(--accent2)' },
          { val: '162g',       lbl: 'Protein Goal', color: 'var(--orange)' }
        ].map(({ val, lbl, color }) => (
          <div key={lbl} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', color, lineHeight: 1 }}>{val}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 3 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Budget tracker */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">BUDGET TRACKER</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
          <span style={{ color: budgetColor, fontWeight: 600 }}>${totalSpent.toFixed(2)} spent</span>
          <span style={{ color: 'var(--muted)' }}>${BUDGET_TARGET}.00 budget</span>
        </div>
        <div className="bar-track" style={{ height: 8, border: '1px solid var(--border)' }}>
          <div className="bar-fill" style={{ width: `${budgetPct}%`, background: budgetColor }} />
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 8 }}>
          Tap any item to check it off. Remaining: ${Math.max(0, BUDGET_TARGET - totalSpent).toFixed(2)}
        </div>
      </div>

      {/* Staples toggle */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button
          onClick={() => setHideStaples(p => !p)}
          style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: 20,
            padding: '4px 12px', fontSize: '0.72rem', color: 'var(--muted)',
            cursor: 'pointer', fontFamily: "'DM Sans', sans-serif'", transition: 'all 0.15s'
          }}
        >
          {hideStaples ? 'Show Staples' : 'Hide Staples'}
        </button>
      </div>

      {/* Shopping list */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="card-title">SHOPPING LIST</div>
        {GROCERY.map(cat => {
          if (hideStaples && cat.staples) return null
          return (
            <div key={cat.category}>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.85rem', letterSpacing: 2,
                color: 'var(--accent2)', padding: '8px 0 4px',
                borderBottom: '1px solid var(--border)', margin: '10px 0 4px'
              }}>{cat.category}</div>
              {cat.items.map(item => {
                const checked = checkedSet.has(item.id)
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id, item.cost)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 6px', borderRadius: 8, cursor: 'pointer',
                      opacity: checked ? 0.45 : 1, transition: 'opacity 0.2s, background 0.15s',
                      userSelect: 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                        border: `1.5px solid ${checked ? 'var(--accent)' : 'var(--border)'}`,
                        background: checked ? 'var(--accent)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', color: '#000', transition: 'all 0.2s'
                      }}>{checked ? '✓' : ''}</div>
                      <div>
                        <div style={{
                          fontSize: '0.85rem', fontWeight: 500,
                          textDecoration: checked ? 'line-through' : 'none'
                        }}>{item.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--muted)', marginTop: 1 }}>{item.note}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      {item.protein && (
                        <div style={{ fontSize: '0.68rem', color: 'var(--accent2)' }}>{item.protein}</div>
                      )}
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', color: 'var(--accent)', letterSpacing: '0.5px' }}>
                        ${item.cost.toFixed(2)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}

        {/* Custom items */}
        {groceryState.customItems.length > 0 && (
          <div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.85rem', letterSpacing: 2,
              color: 'var(--accent2)', padding: '8px 0 4px',
              borderBottom: '1px solid var(--border)', margin: '10px 0 4px'
            }}>CUSTOM ITEMS</div>
            {groceryState.customItems.map(item => {
              const checked = checkedSet.has(item.id)
              return (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 6px', gap: 8 }}>
                  <div
                    onClick={() => toggleItem(item.id, item.cost)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', opacity: checked ? 0.45 : 1 }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                      border: `1.5px solid ${checked ? 'var(--accent)' : 'var(--border)'}`,
                      background: checked ? 'var(--accent)' : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', color: '#000'
                    }}>{checked ? '✓' : ''}</div>
                    <div style={{ fontSize: '0.85rem', textDecoration: checked ? 'line-through' : 'none' }}>{item.name}</div>
                    {item.cost > 0 && (
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.9rem', color: 'var(--accent)', marginLeft: 'auto' }}>
                        ${item.cost.toFixed(2)}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeCustomItem(item.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 4 }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add custom item */}
      <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 14, padding: 16, marginBottom: 12 }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.9rem', letterSpacing: '1.5px', color: 'var(--muted)', marginBottom: 10 }}>
          ADD ITEM
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input style={{ flex: 2 }} placeholder="Item name" value={newItem} onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustomItem()} />
          <input style={{ flex: 1 }} type="number" placeholder="Cost" value={newCost} onChange={e => setNewCost(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCustomItem()} />
          <button className="accent-btn" onClick={addCustomItem}>
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
