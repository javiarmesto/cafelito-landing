// src/components/Hero.jsx
import { IconMic } from './Icons.jsx'
import styles from './Hero.module.css'
import HeroVoiceCard from './HeroVoiceCard.jsx'

export default function Hero({ onChatOpen }) {
  return (
    <section className={styles.hero}>
      {/* Background image + gradient overlay */}
      <div className={styles.bgImage} />
      <div className={styles.bgOverlay} />
      <div className={styles.orb1} />

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
          Habla con Cafelito, nuestro asesor de voz, y descubre el origen
          perfecto para tu paladar. Granos de especialidad, con stock consultado en tiempo real.
        </p>

        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={onChatOpen}>
            <IconMic size={17} /> Hablar con Cafelito
          </button>
          <a href="#catalogue" className={styles.btnGhost}>
            Ver catálogo ↓
          </a>
        </div>

        <div className={styles.origins}>
          {['COL', 'BRA', 'ETH', 'KEN', 'MEX', 'CRI', 'IDN', 'HAW'].map(code => (
            <span key={code} className={styles.flag}>{code}</span>
          ))}
        </div>
      </div>

      <div className={styles.voiceSlot}>
        <HeroVoiceCard onActivate={onChatOpen} />
      </div>

    </section>
  )
}
