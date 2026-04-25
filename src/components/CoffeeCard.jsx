// src/components/CoffeeCard.jsx
import styles from './CoffeeCard.module.css'

function IntensityDots({ value }) {
  return (
    <div className={styles.dots}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`${styles.dot} ${i <= value ? styles.active : ''}`} />
      ))}
    </div>
  )
}

export default function CoffeeCard({ coffee }) {
  const lowStock = coffee.stock < 20

  return (
    <div className={styles.card}>
      {/* Background gradient */}
      <div className={styles.bg} style={{ background: coffee.bg }} />

      {/* Type badge */}
      <div className={styles.typeBadge}>
        {coffee.type === 'Whole Decaf Beans' ? '🌙 Decaf' : '☀️ Tostado'}
      </div>

      {/* Stock warning */}
      {lowStock && (
        <div className={styles.stockBadge}>
          ⚡ Últimas {coffee.stock} ud.
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.flag}>{coffee.emoji}</div>
        <h3 className={styles.name}>{coffee.name}</h3>
        <p className={styles.notes}>{coffee.notes}</p>

        <div className={styles.meta}>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Intensidad</span>
            <IntensityDots value={coffee.intensity} />
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Acidez</span>
            <span className={styles.metaVal}>{coffee.acidity}</span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Cuerpo</span>
            <span className={styles.metaVal}>{coffee.body}</span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.price}>
          {coffee.price.toFixed(2)} €
          <span className={styles.per}> / 250g</span>
        </div>
        <button className={styles.btn}>Añadir</button>
      </div>
    </div>
  )
}
