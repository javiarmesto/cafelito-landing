// src/components/VoiceFAB.jsx
// Acceso permanente al mostrador desde la tienda
import { IconMic } from './Icons.jsx'
import styles from './VoiceFAB.module.css'

export default function VoiceFAB({ onClick }) {
  return (
    <button
      className={styles.fab}
      onClick={onClick}
      aria-label="Hablar con Cafelito"
    >
      <span className={styles.icon}><IconMic size={19} /></span>
      <span className={styles.label}>Cafelito</span>
      <span className={styles.pulse} aria-hidden="true" />
    </button>
  )
}
