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
import { catalogData } from '../data/catalog-policy.js'

const TOKEN_URL = import.meta.env.VITE_TOKEN_URL || 'http://localhost:3001/api/voice-token'
const CATALOG_URL = TOKEN_URL.replace(/\/api\/voice-token\/?$/, '/api/catalog')

const CatalogContext = createContext(null)

export function CatalogProvider({ children }) {
  const [catalog, setCatalog] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(CATALOG_URL, { signal: controller.signal })
      .then(res => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then(data => {
        setCatalog(catalogData(data))
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('[catalog] usando stock estático:', err.message)
        }
      })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    if (!catalog?.expiresAt) return
    const timer = setTimeout(() => setCatalog(current => current === catalog
      ? { ...current, liveStock: false, expiresAt: null, stockLabel: 'stock de referencia · requiere actualización' } : current), Math.max(0, catalog.expiresAt - Date.now()))
    return () => clearTimeout(timer)
  }, [catalog])

  const coffees = useMemo(() => {
    if (!catalog) return staticCoffees
    return staticCoffees.map(coffee =>
      catalog.stocks.has(coffee.bcItemNo)
        ? { ...coffee, stock: catalog.stocks.get(coffee.bcItemNo) }
        : coffee
    )
  }, [catalog])

  const value = useMemo(
    () => ({ coffees, liveStock: catalog?.liveStock ?? false, stockLabel: catalog?.stockLabel ?? 'stock de respaldo · sin comprobar' }),
    [coffees, catalog]
  )

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook + provider conviven por cohesión
export function useCatalog() {
  const ctx = useContext(CatalogContext)
  if (!ctx) throw new Error('useCatalog must be used within a CatalogProvider')
  return ctx
}
