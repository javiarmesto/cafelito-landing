// src/context/CartContext.jsx
// ─────────────────────────────────────────────
// Estado global del carrito. El pedido real lo
// crea Cafelito en Business Central con la tool
// create-sales-order al hacer checkout por voz.
// ─────────────────────────────────────────────
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { coffees } from '../data/coffees.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [entries, setEntries] = useState([])   // [{ id, qty }]

  const addItem = useCallback((id, qty = 1) => {
    setEntries(prev => {
      const found = prev.find(e => e.id === id)
      if (found) {
        return prev.map(e => e.id === id ? { ...e, qty: e.qty + qty } : e)
      }
      return [...prev, { id, qty }]
    })
  }, [])

  const setQty = useCallback((id, qty) => {
    setEntries(prev => qty <= 0
      ? prev.filter(e => e.id !== id)
      : prev.map(e => e.id === id ? { ...e, qty } : e))
  }, [])

  const removeItem = useCallback(id => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  const clear = useCallback(() => setEntries([]), [])

  const items = useMemo(() =>
    entries
      .map(({ id, qty }) => {
        const coffee = coffees.find(c => c.id === id)
        return coffee ? { ...coffee, qty } : null
      })
      .filter(Boolean),
    [entries]
  )

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])
  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items])

  const value = useMemo(
    () => ({ items, count, total, addItem, setQty, removeItem, clear }),
    [items, count, total, addItem, setQty, removeItem, clear]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook + provider conviven por cohesión
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
