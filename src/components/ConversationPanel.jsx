// src/components/ConversationPanel.jsx
// ─────────────────────────────────────────────
// Columna izquierda del mostrador: la conversación
// con Cafelito, siempre visible. Ya no es un modal
// que tapa el catálogo — es la mitad del escenario.
// ─────────────────────────────────────────────
import { useEffect, useRef } from 'react'
import { useVocalBridge, useTranscript } from '@vocalbridgeai/react'
import { ConnectionState } from '@vocalbridgeai/sdk'
import { IconBean, IconMic, IconMicOff, IconClose } from './Icons.jsx'
import styles from './ConversationPanel.module.css'

// Lo que Cafelito puede hacer de verdad contra el ERP: en reposo la columna
// quedaba vacía, y este es el mejor sitio para contar de qué va la demo.
const CAPABILITIES = [
  ['Te recomienda', 'según cuerpo, acidez o si lo quieres sin cafeína'],
  ['Consulta stock', 'en tiempo real contra Business Central'],
  ['Crea el pedido', 'en el ERP, con tus líneas y tu cliente'],
]

const OPENERS = [
  'Algo con mucho cuerpo',
  'Sin cafeína, para la noche',
  'Que sea frutal y suave',
  '¿Qué me recomiendas?',
]

function formatTime(timestamp) {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function Entry({ role, text, timestamp }) {
  const isUser = role === 'user'
  return (
    <div className={`${styles.entry} ${isUser ? styles.entryUser : styles.entryAgent}`}>
      {!isUser && (
        <span className={styles.entryAvatar}><IconBean size={13} /></span>
      )}
      <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAgent}`}>
        {text}
        <span className={styles.time}>{formatTime(timestamp)}</span>
      </div>
    </div>
  )
}

export default function ConversationPanel() {
  const {
    state, connect, disconnect,
    isMicrophoneEnabled, toggleMicrophone,
    agentMode, error,
  } = useVocalBridge()
  const { transcript } = useTranscript()
  const scrollRef = useRef(null)

  const isConnected    = state === ConnectionState.Connected
  const isWaiting      = state === ConnectionState.WaitingForAgent
  const isReconnecting = state === ConnectionState.Reconnecting
  const isConnecting   = state === ConnectionState.Connecting || isWaiting
  const inSession      = isConnected || isReconnecting || isConnecting

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [transcript])

  const listening = isConnected && isMicrophoneEnabled

  return (
    <section className={styles.panel} aria-label="Conversación con Cafelito">

      <header className={styles.head}>
        <span className={`${styles.mark} ${isConnected ? styles.markLive : ''}`}>
          <IconBean size={17} />
        </span>
        <div className={styles.headText}>
          <h2 className={styles.name}>Cafelito</h2>
          <p className={styles.role}>
            {agentMode ? `asesor · ${agentMode}` : 'asesor de café'}
          </p>
        </div>
      </header>

      {error && (
        <p className={styles.error} role="alert">{error.message}</p>
      )}

      <div className={styles.stream} ref={scrollRef}>
        {transcript.length === 0 ? (
          <div className={styles.opening}>
            <p className={styles.openingLead}>
              {isConnecting
                ? (isWaiting ? 'Cafelito se está preparando…' : 'Abriendo el micrófono…')
                : 'Cuéntame qué te apetece y te busco el origen que encaja.'}
            </p>
            {!inSession && (
              <>
                <p className={styles.openingHint}>Puedes empezar por aquí:</p>
                <div className={styles.chips}>
                  {OPENERS.map(o => (
                    <button key={o} className={styles.chip} onClick={connect}>
                      {o}
                    </button>
                  ))}
                </div>

                <ul className={styles.caps}>
                  {CAPABILITIES.map(([what, how]) => (
                    <li key={what} className={styles.cap}>
                      <span className={styles.capWhat}>{what}</span>
                      <span className={styles.capHow}>{how}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ) : (
          transcript.map((entry, i) => (
            <Entry key={i} role={entry.role} text={entry.text} timestamp={entry.timestamp} />
          ))
        )}
      </div>

      <footer className={styles.controls}>
        {!inSession ? (
          <button className={styles.talkBtn} onClick={connect}>
            <IconMic size={18} />
            Hablar con Cafelito
          </button>
        ) : (
          <>
            <button
              className={`${styles.micBtn} ${listening ? styles.micLive : ''}`}
              onClick={toggleMicrophone}
              disabled={!isConnected}
              aria-pressed={isMicrophoneEnabled}
              aria-label={isMicrophoneEnabled ? 'Silenciar micrófono' : 'Activar micrófono'}
            >
              {listening && <span className={styles.ring} aria-hidden="true" />}
              {isMicrophoneEnabled ? <IconMic size={22} /> : <IconMicOff size={22} />}
            </button>

            <p className={styles.micLabel}>
              {isReconnecting ? 'reconectando…'
                : isConnecting ? 'conectando…'
                : listening ? 'te escucho' : 'micrófono silenciado'}
            </p>

            <button className={styles.endBtn} onClick={disconnect}>
              <IconClose size={14} />
              Terminar
            </button>
          </>
        )}
      </footer>
    </section>
  )
}
