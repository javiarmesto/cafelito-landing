// src/components/CartDrawer.jsx
// ─────────────────────────────────────────────
// Drawer lateral del carrito. El checkout se hace
// por voz: con la llamada activa envía checkout_cart
// al agente (que crea el pedido en BC con
// create-sales-order); sin llamada, abre el widget.
// ─────────────────────────────────────────────
import { useState } from 'react'
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
  const [checkoutSent, setCheckoutSent] = useState(false)

  const connected = state === ConnectionState.Connected

  const handleCheckout = () => {
    if (!connected) {
      onOpenVoice()
      return
    }
    sendAction('checkout_cart', {
      items: items.map(i => ({ id: i.id, bc_item_no: i.bcItemNo, name: i.name, qty: i.qty, price: i.price })),
      total: Number(total.toFixed(2)),
    })
      .then(() => setCheckoutSent(true))
      .catch(err => console.error('[cart] checkout_cart:', err.message))
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
                    <button className={styles.qtyBtn} onClick={() => setQty(item.id, item.qty - 1)}>−</button>
                    <span className={styles.qtyVal}>{item.qty}</span>
                    <button className={styles.qtyBtn} onClick={() => setQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <div className={styles.itemTotal}>{formatPrice(item.price * item.qty)}</div>
                  <button className={styles.removeBtn} onClick={() => removeItem(item.id)} aria-label={`Quitar ${item.name}`}><IconTrash size={14} /></button>
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
                <button className={styles.checkoutBtn} onClick={handleCheckout}>
                  <IconMic size={16} />
                  {connected ? 'Pedir con Cafelito' : 'Habla con Cafelito para pedir'}
                </button>
              )}

              <button className={styles.clearBtn} onClick={() => { clear(); setCheckoutSent(false) }}>
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
