// src/components/CartDrawer.jsx
// ─────────────────────────────────────────────
// Drawer lateral del carrito. El checkout se hace
// por voz: con la llamada activa envía checkout_cart
// al agente (que crea el pedido en BC con
// create-sales-order); sin llamada, abre el widget.
// ─────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react'
import { cartSnapshot, quantityLimit } from '../data/action-policy.js'
import { useAgentActions, useVocalBridge } from '@vocalbridgeai/react'
import { ConnectionState } from '@vocalbridgeai/sdk'
import { useCart } from '../context/CartContext.jsx'
import { IconMic, IconClose, IconTrash, IconCart } from './Icons.jsx'
import styles from './CartDrawer.module.css'

function formatPrice(n) {
  return `${n.toFixed(2).replace('.', ',')} €`
}

export default function CartDrawer({ onClose, onOpenVoice }) {
  const { items, count, total, setQty, removeItem, clear } = useCart()
  const { state } = useVocalBridge()
  const { sendAction } = useAgentActions()
  const [checkout, setCheckout] = useState(null)
  const busy = useRef(false)
  const generation = useRef(0)
  const [error, setError] = useState('')

  const connected = state === ConnectionState.Connected
  const [wasConnected, setWasConnected] = useState(connected)
  if (wasConnected !== connected) {
    setWasConnected(connected)
    setCheckout(null)
  }
  useEffect(() => {
    const run = ++generation.current
    busy.current = false
    return () => { generation.current = run + 1; busy.current = false }
  }, [connected])
  const snapshot = cartSnapshot(items)
  const fingerprint = snapshot ? JSON.stringify(snapshot) : ''
  const checkoutSent = connected && checkout?.status === 'sent' && checkout.fingerprint === fingerprint
  const sending = checkout?.status === 'sending'

  const handleCheckout = async () => {
    if (!connected) {
      onOpenVoice()
      return
    }
    if (!snapshot || busy.current || checkoutSent) return
    busy.current = true
    const run = generation.current
    setError('')
    setCheckout({ fingerprint, status: 'sending' })
    try {
      await sendAction('checkout_cart', snapshot)
      if (run === generation.current) setCheckout({ fingerprint, status: 'sent' })
    } catch {
      if (run === generation.current) {
        setCheckout(null)
        setError('No se pudo compartir el carrito. Puedes volver a intentarlo.')
      }
    } finally { if (run === generation.current) busy.current = false }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <aside className={styles.drawer} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>Tu carrito</h3>
            <div className={styles.subtitle}>
              {count === 0 ? 'vacío' : `${count} ud. · ${items.length} orígenes`}
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar carrito"><IconClose size={14} /></button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}><IconCart size={30} /></div>
            <p className={styles.emptyText}>
              Aún no has añadido nada.<br />
              Explora el catálogo o pídele a Cafelito que te recomiende algo.
            </p>
          </div>
        ) : (
          <>
            <div className={styles.items}>
              {items.map(item => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemEmoji}>{item.id.slice(-3)}</div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemMeta}>{item.bcItemNo} · {formatPrice(item.price)} / 250g</div>
                  </div>
                  <div className={styles.qty}>
                    <button className={styles.qtyBtn} disabled={sending} aria-label={`Reducir ${item.name}`} onClick={() => setQty(item.id, item.qty - 1)}>−</button>
                    <span className={styles.qtyVal}>{item.qty}</span>
                    <button className={styles.qtyBtn} disabled={sending || item.qty >= quantityLimit(item)} aria-label={`Aumentar ${item.name}`} onClick={() => setQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <div className={styles.itemTotal}>{formatPrice(item.price * item.qty)}</div>
                  <button className={styles.removeBtn} disabled={sending} onClick={() => removeItem(item.id)} aria-label={`Quitar ${item.name}`}><IconTrash size={14} /></button>
                </div>
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Total</span>
                <span className={styles.totalVal}>{formatPrice(total)}</span>
              </div>

              {checkoutSent ? (
                <div className={styles.sentNote}>
                  Pedido enviado a Cafelito — confírmalo por voz
                </div>
              ) : (
                <button className={styles.checkoutBtn} disabled={sending || !snapshot} onClick={handleCheckout}>
                  <IconMic size={16} />
                  {sending ? 'Compartiendo carrito…' : connected ? 'Pedir con Cafelito' : 'Habla con Cafelito para pedir'}
                </button>
              )}

              <p className={styles.sentNote}>Total orientativo de la web. Stock y total final se comprueban en BC antes de confirmar.</p>
              {!snapshot ? <p role="alert">Revisa las cantidades con el stock de referencia actual.</p> : null}
              {error ? <p role="alert">{error}</p> : null}
              <button className={styles.clearBtn} disabled={sending} onClick={() => { clear(); setCheckout(null); setError('') }}>
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
