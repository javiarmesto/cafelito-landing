// src/context/CatalogContext.jsx
// ─────────────────────────────────────────────
// Catálogo con stock real: parte de los datos
// estáticos (coffees.js) y superpone el stock que
// devuelve el backend (/api/catalog, datos de BC).
// Solo stock — los precios de BC tienen unidades
// pendientes de corregir (ver docs/cafelito-agent-prompt.md).
// ─────────────────────────────────────────────
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { coffees as staticCoffees } from '../data/coffees.js'

const TOKEN_URL = import.meta.env.VITE_TOKEN_URL || 'http://localhost:3001/api/voice-token'
const CATALOG_URL = TOKEN_URL.replace(/\/api\/voice-token\/?$/, '/api/catalog')

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const [bcStock, setBcStock] = useState(null)   // Map bcItemNo → stock

  useEffect(() => {
    const controller = new AbortController()
    fetch(CATALOG_URL, { signal: controller.signal })
      .then(res => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then(data => {
        const stockByNumber = new Map(
          (data.items || []).map(item => [item.number, item.stock])
        )
        setBcStock(stockByNumber)
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('[catalog] usando stock estático:', err.message)
        }
      })
    return () => controller.abort()
  }, [])

  const coffees = useMemo(() => {
    if (!bcStock) return staticCoffees
    return staticCoffees.map(coffee =>
      bcStock.has(coffee.bcItemNo)
        ? { ...coffee, stock: bcStock.get(coffee.bcItemNo) }
        : coffee
    )
  }, [bcStock])

  const value = useMemo(
    () => ({ coffees, liveStock: bcStock !== null }),
    [coffees, bcStock]
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook + provider conviven por cohesión
export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within a CatalogProvider')
  return ctx
}
