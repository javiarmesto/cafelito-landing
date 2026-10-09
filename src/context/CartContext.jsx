// src/context/CartContext.jsx
// ─────────────────────────────────────────────
// Estado global del carrito. El pedido real lo
// crea Cafelito en Business Central con la tool
// create-sales-order al hacer checkout por voz.
// ─────────────────────────────────────────────
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useCatalog } from './CatalogContext.jsx'
import { changeEntries } from '../data/action-policy.js'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { coffees } = useCatalog()
  const [entries, setEntries] = useState([])   // [{ id, qty }]
  const [lastOrder, setLastOrder] = useState(null)   // { order_number, total } del agente

  const addItem = useCallback((id, qty = 1) => {
    setEntries(prev => changeEntries(prev, coffees, id, qty, true))
  }, [coffees])

  const setQty = useCallback((id, qty) => {
    setEntries(prev => changeEntries(prev, coffees, id, qty))
  }, [coffees])

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
    [entries, coffees]
  )

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items])
  const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items])

  const value = useMemo(
    () => ({ items, count, total, addItem, setQty, removeItem, clear, lastOrder, setLastOrder }),
    [items, count, total, addItem, setQty, removeItem, clear, lastOrder]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook + provider conviven por cohesión
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
