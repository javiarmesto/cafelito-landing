// src/components/OrderToast.jsx
// ─────────────────────────────────────────────
// Confirmación visual cuando Cafelito crea el
// pedido en BC (acción order_created del agente).
// ─────────────────────────────────────────────
import { useEffect } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { IconCheck, IconClose } from './Icons.jsx'
import styles from './OrderToast.module.css'

const AUTO_HIDE_MS = 12000

export default function OrderToast() {
  const { lastOrder, setLastOrder } = useCart()

  useEffect(() => {
    if (!lastOrder) return
    const timer = setTimeout(() => setLastOrder(null), AUTO_HIDE_MS)
    return () => clearTimeout(timer)
  }, [lastOrder, setLastOrder])

  if (!lastOrder) return null

  return (
    <div className={styles.toast} role="status">
      <span className={styles.icon}><IconCheck size={15} /></span>
      <div className={styles.text}>
        <div className={styles.title}>Pedido creado en Business Central</div>
        <div className={styles.detail}>
          {lastOrder.order_number}
          {lastOrder.total != null && ` · ${lastOrder.total.toFixed(2).replace('.', ',')} €`}
        </div>
      </div>
      <button className={styles.closeBtn} onClick={() => setLastOrder(null)} aria-label="Cerrar aviso"><IconClose size={13} /></button>
    </div>
  )
}
