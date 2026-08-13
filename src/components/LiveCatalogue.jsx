// src/components/LiveCatalogue.jsx
// ─────────────────────────────────────────────
// Columna derecha del mostrador: el catálogo que
// reacciona a la conversación. Cuando Cafelito
// recomienda algo (show_product), esa referencia
// sube al frente y el resto se atenúa.
// ─────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react'
import { useAgentActions, useVocalBridge } from '@vocalbridgeai/react'
import { ConnectionState } from '@vocalbridgeai/sdk'
import { resolveCoffee } from '../data/coffees.js'
import { useCatalog } from '../context/CatalogContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useTelemetry } from '../context/TelemetryContext.jsx'
import styles from './LiveCatalogue.module.css'

const FOCUS_MS = 12000

function formatPrice(n) {
  return n.toFixed(2).replace('.', ',')
}

export default function LiveCatalogue({ onSelect }) {
  const { coffees, liveStock } = useCatalog()
  const { state } = useVocalBridge()
  const { onAction, sendAction } = useAgentActions()
  const { items, addItem } = useCart()
  const { track } = useTelemetry()

  const [focusedId, setFocusedId] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return onAction('show_product', payload => {
      const coffee = resolveCoffee(payload)
      if (!coffee) {
        console.error('[catalogue] show_product sin match:', JSON.stringify(payload))
        return
      }
      track('in', 'show_product', coffee.name)
      setFocusedId(coffee.id)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setFocusedId(null), FOCUS_MS)
    })
  }, [onAction, track])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const connected = state === ConnectionState.Connected

  const handleOpen = coffee => {
    onSelect?.(coffee)
    if (!connected) return
    track('out', 'view_product', coffee.name)
    sendAction('view_product', {
      id: coffee.id,
      bc_item_no: coffee.bcItemNo,
      name: coffee.name,
      price: coffee.price,
    }).catch(err => console.error('[catalogue] view_product:', err.message))
  }

  const qtyOf = id => items.find(i => i.id === id)?.qty || 0

  return (
    <section className={styles.wrap} aria-label="Catálogo">
      <header className={styles.head}>
        <h2 className={styles.title}>Catálogo</h2>
        <span className={`${styles.source} ${liveStock ? styles.sourceLive : ''}`}>
          <span className={styles.sourceDot} aria-hidden="true" />
          {liveStock ? 'stock en vivo · Business Central' : 'stock de respaldo'}
        </span>
      </header>

      <div className={styles.grid}>
        {coffees.map(coffee => {
          const qty = qtyOf(coffee.id)
          const focused = coffee.id === focusedId
          const dimmed = focusedId !== null && !focused
          const soldOut = coffee.stock === 0

          return (
            <article
              key={coffee.id}
              className={`${styles.card} ${focused ? styles.focused : ''} ${dimmed ? styles.dimmed : ''}`}
            >
              <div className={styles.cardBg} style={{ background: coffee.bg }} aria-hidden="true" />

              {focused && <span className={styles.pick}>Cafelito lo recomienda</span>}

              <button
                className={styles.cardMain}
                onClick={() => handleOpen(coffee)}
                aria-label={`Ver detalle de ${coffee.name}`}
              >
                <span className={styles.origin}>{coffee.region}</span>
                <span className={styles.name}>{coffee.name}</span>
                <span className={styles.notes}>{coffee.notes}</span>

                <span className={styles.meta}>
                  <span className={styles.sku}>{coffee.bcItemNo}</span>
                  <span className={soldOut ? styles.soldOut : styles.stock}>
                    {soldOut ? 'agotado' : `${coffee.stock} ud.`}
                  </span>
                </span>
              </button>

              <div className={styles.cardFoot}>
                <span className={styles.price}>{formatPrice(coffee.price)} €</span>
                <button
                  className={styles.addBtn}
                  onClick={() => addItem(coffee.id)}
                  disabled={soldOut}
                >
                  {qty > 0 ? `En carrito · ${qty}` : 'Añadir'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
