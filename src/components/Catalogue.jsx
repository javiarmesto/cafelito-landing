// src/components/Catalogue.jsx
// ─────────────────────────────────────────────
// Catálogo + acciones bidireccionales del agente:
//  · agente → UI: 'show_product' resalta y hace scroll a la tarjeta
//  · UI → agente: 'view_product' al pulsar una tarjeta estando en llamada
// ─────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react'
import { useAgentActions, useVocalBridge } from '@vocalbridgeai/react'
import { ConnectionState } from '@vocalbridgeai/sdk'
import { coffees } from '../data/coffees.js'
import CoffeeCard from './CoffeeCard.jsx'
import styles from './Catalogue.module.css'

const HIGHLIGHT_MS = 6000

// El payload de show_product puede llegar con distintas claves según
// cómo lo emita el agente — aceptamos id/sku/nombre indistintamente
function resolveCoffee(payload = {}) {
  const ref = String(
    payload.id ?? payload.item_id ?? payload.product_id ?? payload.sku ?? payload.name ?? ''
  ).trim().toLowerCase()
  if (!ref) return null
  return (
    coffees.find(c => c.id.toLowerCase() === ref) ||
    coffees.find(c => c.name.toLowerCase() === ref) ||
    coffees.find(c => c.name.toLowerCase().includes(ref)) ||
    null
  )
}

export default function Catalogue() {
  const { state } = useVocalBridge()
  const { onAction, sendAction } = useAgentActions()
  const [highlightedId, setHighlightedId] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return onAction('show_product', payload => {
      const coffee = resolveCoffee(payload)
      if (!coffee) {
        console.error('[catalogue] show_product sin match:', JSON.stringify(payload))
        return
      }
      setHighlightedId(coffee.id)
      document.getElementById(`coffee-${coffee.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setHighlightedId(null), HIGHLIGHT_MS)
    })
  }, [onAction])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const handleView = coffee => {
    if (state !== ConnectionState.Connected) return
    sendAction('view_product', {
      id: coffee.id,
      name: coffee.name,
      price: coffee.price,
    }).catch(err => console.error('[catalogue] view_product:', err.message))
  }

  return (
    <section id="catalogue" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.label}>{`// catálogo · ${coffees.length} orígenes`}</div>
        <h2 className={styles.title}>Granos de especialidad</h2>
        <p className={styles.sub}>
          Pregúntale a Cafelito cuál se adapta mejor a tu paladar,
          o explora el catálogo tú mismo.
        </p>
      </div>

      <div className={styles.grid}>
        {coffees.map(coffee => (
          <CoffeeCard
            key={coffee.id}
            coffee={coffee}
            highlighted={coffee.id === highlightedId}
            onView={handleView}
          />
        ))}
      </div>
    </section>
  )
}
