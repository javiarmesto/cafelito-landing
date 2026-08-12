// src/components/SessionPill.jsx
// ─────────────────────────────────────────────
// Si hay una conversación abierta y el usuario está
// navegando la tienda, esto lo recuerda y le devuelve
// al mostrador. Antes, al cerrar el modal, no quedaba
// ni rastro de que Cafelito seguía al teléfono.
// ─────────────────────────────────────────────
import { useVocalBridge } from '@vocalbridgeai/react'
import { ConnectionState } from '@vocalbridgeai/sdk'
import { IconMic } from './Icons.jsx'
import styles from './SessionPill.module.css'

export default function SessionPill({ onResume }) {
  const { state } = useVocalBridge()
  if (state === ConnectionState.Disconnected) return null

  const connected = state === ConnectionState.Connected

  return (
    <button className={styles.pill} onClick={onResume}>
      <span className={`${styles.dot} ${connected ? styles.live : ''}`} aria-hidden="true" />
      <IconMic size={13} />
      {connected ? 'en conversación' : 'conectando…'}
    </button>
  )
}
