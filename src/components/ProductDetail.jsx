// src/components/ProductDetail.jsx
// ─────────────────────────────────────────────
// Modal de detalle expandido de un café.
// Se abre al hacer click en una tarjeta del
// catálogo (o cerrando el círculo con Cafelito).
// ─────────────────────────────────────────────
import { useEffect } from 'react'
import { useCart } from '../context/CartContext.jsx'
import styles from './ProductDetail.module.css'

function IntensityDots({ value }) {
  return (
    <div className={styles.dots}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`${styles.dot} ${i <= value ? styles.dotActive : ''}`} />
      ))}
    </div>
  )
}

export default function ProductDetail({ coffee, onClose }) {
  const { addItem } = useCart()

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!coffee) return null

  const lowStock = coffee.stock < 20

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.banner} style={{ background: coffee.bg }}>
          <span className={styles.bannerEmoji}>{coffee.emoji}</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          <div className={styles.typeLabel}>
            {coffee.type === 'Whole Decaf Beans' ? '🌙 Decaf' : '☀️ Tostado'} · {coffee.id}
          </div>
          <h2 className={styles.name}>{coffee.name}</h2>
          <p className={styles.notes}>{coffee.notes}</p>

          <p className={styles.description}>{coffee.description}</p>

          <div className={styles.grid}>
            <div className={styles.cell}>
              <span className={styles.cellLabel}>Región</span>
              <span className={styles.cellVal}>{coffee.region}</span>
            </div>
            <div className={styles.cell}>
              <span className={styles.cellLabel}>Altitud</span>
              <span className={styles.cellVal}>{coffee.altitude}</span>
            </div>
            <div className={styles.cell}>
              <span className={styles.cellLabel}>Proceso</span>
              <span className={styles.cellVal}>{coffee.process}</span>
            </div>
            <div className={styles.cell}>
              <span className={styles.cellLabel}>Intensidad</span>
              <IntensityDots value={coffee.intensity} />
            </div>
            <div className={styles.cell}>
              <span className={styles.cellLabel}>Acidez</span>
              <span className={styles.cellVal}>{coffee.acidity}</span>
            </div>
            <div className={styles.cell}>
              <span className={styles.cellLabel}>Cuerpo</span>
              <span className={styles.cellVal}>{coffee.body}</span>
            </div>
          </div>

          {lowStock && (
            <div className={styles.stockNote}>⚡ Quedan solo {coffee.stock} unidades</div>
          )}

          <div className={styles.footer}>
            <div className={styles.price}>
              {coffee.price.toFixed(2).replace('.', ',')} €
              <span className={styles.per}> / 250g</span>
            </div>
            <button
              className={styles.addBtn}
              onClick={() => { addItem(coffee.id); onClose() }}
            >
              Añadir al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
