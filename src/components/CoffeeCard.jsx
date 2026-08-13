// src/components/CoffeeCard.jsx
import styles from './CoffeeCard.module.css'

function IntensityDots({ value }) {
  return (
    <div className={styles.dots} role="img" aria-label={`Intensidad ${value} de 5`}>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`${styles.dot} ${i <= value ? styles.active : ''}`} />
      ))}
    </div>
  )
}

export default function CoffeeCard({ coffee, highlighted = false, onView, onAdd }) {
  const lowStock = coffee.stock > 0 && coffee.stock < 20
  const soldOut  = coffee.stock === 0

  return (
    <article
      id={`coffee-${coffee.id}`}
      className={`${styles.card} ${highlighted ? styles.highlighted : ''}`}
    >
      <div className={styles.bg} style={{ background: coffee.bg }} aria-hidden="true" />

      <div className={styles.typeBadge}>
        {coffee.type === 'Whole Decaf Beans' ? 'Descafeinado' : 'Tueste medio'}
      </div>

      {soldOut ? (
        <div className={styles.soldBadge}>Agotado</div>
      ) : lowStock && (
        <div className={styles.stockBadge}>Últimas {coffee.stock} ud.</div>
      )}

      <button
        className={styles.body}
        onClick={() => onView?.(coffee)}
        aria-label={`Ver detalle de ${coffee.name}`}
      >
        <span className={styles.origin}>{coffee.region}</span>
        <span className={styles.name}>{coffee.name}</span>
        <span className={styles.notes}>{coffee.notes}</span>

        <span className={styles.meta}>
          <span className={styles.metaRow}>
            <span className={styles.metaLabel}>Intensidad</span>
            <IntensityDots value={coffee.intensity} />
          </span>
          <span className={styles.metaRow}>
            <span className={styles.metaLabel}>Acidez</span>
            <span className={styles.metaVal}>{coffee.acidity}</span>
          </span>
          <span className={styles.metaRow}>
            <span className={styles.metaLabel}>Cuerpo</span>
            <span className={styles.metaVal}>{coffee.body}</span>
          </span>
        </span>
      </button>

      <div className={styles.footer}>
        <div className={styles.price}>
          {coffee.price.toFixed(2).replace('.', ',')} €
          <span className={styles.per}> / 250g</span>
        </div>
        <button
          className={styles.btn}
          onClick={() => onAdd?.(coffee)}
          disabled={soldOut}
        >
          Añadir
        </button>
      </div>
    </article>
  )
}
