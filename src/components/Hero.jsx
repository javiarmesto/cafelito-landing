// src/components/Hero.jsx
import styles from './Hero.module.css'

export default function Hero({ onChatOpen }) {
  return (
    <section className={styles.hero}>
      {/* Background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.dot} />
          Cafelito · Asesor de café con IA
        </div>

        <h1 className={styles.title}>
          Tu café ideal,<br />
          <em>encontrado en segundos</em>
        </h1>

        <p className={styles.subtitle}>
          Habla con Cafelito — nuestro asesor de voz — y descubre el origen
          perfecto para tu paladar. Granos de especialidad de 8 orígenes, entregados en casa.
        </p>

        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={onChatOpen}>
            <span>☕</span> Hablar con Cafelito
          </button>
          <a href="#catalogue" className={styles.btnGhost}>
            Ver catálogo ↓
          </a>
        </div>

        <div className={styles.origins}>
          {['🇨🇴', '🇧🇷', '🇪🇹', '🇰🇪', '🇲🇽', '🇨🇷', '🇮🇩', '🌺'].map((f, i) => (
            <span key={i} className={styles.flag}>{f}</span>
          ))}
        </div>
      </div>

      {/* Decorative cup */}
      <div className={styles.cupWrap}>
        <div className={styles.cup}>
          <div className={styles.steam}>
            {[0, 1, 2].map(i => (
              <svg key={i} width="18" height="32" viewBox="0 0 18 32" fill="none"
                style={{ animationDelay: `${i * 0.4}s` }} className={styles.steamLine}>
                <path d={i === 1
                  ? 'M9 30 Q7 22 11 16 Q15 10 13 2'
                  : i === 0 ? 'M5 30 Q3 22 7 16 Q11 10 9 2'
                  : 'M13 30 Q11 22 15 16 Q19 10 17 2'}
                  stroke="#C8A97E" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
              </svg>
            ))}
          </div>
          <div className={styles.cupBody}>☕</div>
        </div>
      </div>
    </section>
  )
}
