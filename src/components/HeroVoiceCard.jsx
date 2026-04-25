// src/components/HeroVoiceCard.jsx
import styles from './HeroVoiceCard.module.css'

const SUGGESTIONS = [
  'Algo con cuerpo',
  'Sin cafeína',
  'Bajo de 20€',
  'Frutal y suave',
]

export default function HeroVoiceCard({ onActivate }) {
  return (
    <div className={styles.card}>
      <span className={styles.eyebrow}>Hola, soy Cafelito</span>

      <button
        className={styles.bigButton}
        onClick={onActivate}
        aria-label="Hablar con Cafelito"
      >
        <span className={styles.pulseRing} />
        <span className={`${styles.pulseRing} ${styles.pulseRing2}`} />
        ☕
      </button>

      <div className={styles.label}>Pulsa y cuéntame</div>

      <div className={styles.wave} aria-hidden>
        {[0.1, 0.25, 0.4, 0.55, 0.7, 0.55, 0.4, 0.25, 0.1].map((d, i) => (
          <span
            key={i}
            className={styles.waveBar}
            style={{ animationDelay: `${d}s` }}
          />
        ))}
      </div>

      <p className={styles.hint}>
        Te recomiendo el café perfecto en segundos, consultando el catálogo en tiempo real.
      </p>

      <div className={styles.suggestions}>
        {SUGGESTIONS.map(s => (
          <button key={s} className={styles.chip} onClick={onActivate}>
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
