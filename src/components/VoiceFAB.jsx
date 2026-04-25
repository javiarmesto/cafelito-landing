// src/components/VoiceFAB.jsx
// Floating Action Button — siempre visible en la esquina
import styles from './VoiceFAB.module.css'

export default function VoiceFAB({ onClick, isOpen }) {
  return (
    <button
      className={`${styles.fab} ${isOpen ? styles.active : ''}`}
      onClick={onClick}
      title="Hablar con Cafelito"
      aria-label="Abrir asistente de voz"
    >
      <span className={styles.icon}>{isOpen ? '✕' : '☕'}</span>
      {!isOpen && <span className={styles.label}>Cafelito</span>}
      {!isOpen && <div className={styles.pulse} />}
    </button>
  )
}
