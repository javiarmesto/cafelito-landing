// src/components/VoiceWidget.jsx
// ─────────────────────────────────────────────
// Integración real con @vocalbridgeai/react
// SDK docs: https://vocalbridgeai.com/docs/developer-guide
// ─────────────────────────────────────────────
import { useEffect, useRef } from 'react'
import { useVocalBridge, useTranscript } from '@vocalbridgeai/react'
import { ConnectionState } from '@vocalbridgeai/sdk'
import styles from './VoiceWidget.module.css'

// ── Sound wave ──────────────────────────────
function SoundWave({ active }) {
  const heights = [0.6, 1, 0.7, 0.95, 0.5, 0.85, 0.65]
  return (
    <div className={styles.wave}>
      {heights.map((h, i) => (
        <div
          key={i}
          className={`${styles.waveBar} ${active ? styles.waveActive : ''}`}
          style={{
            '--h': `${h * 26}px`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  )
}

// ── Transcript entry ─────────────────────────
function formatTime(timestamp) {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

function Entry({ role, text, timestamp }) {
  const isUser = role === 'user'
  return (
    <div className={`${styles.entry} ${isUser ? styles.entryUser : styles.entryAgent}`}>
      {!isUser && <div className={styles.entryAvatar}>☕</div>}
      <div className={`${styles.bubble} ${isUser ? styles.bubbleUser : styles.bubbleAgent}`}>
        {text}
        <span className={styles.bubbleTime}>{formatTime(timestamp)}</span>
      </div>
    </div>
  )
}

// ── Main widget ──────────────────────────────
export default function VoiceWidget({ onClose }) {
  const {
    state,
    connect,
    disconnect,
    isMicrophoneEnabled,
    toggleMicrophone,
    agentMode,
    error,
  } = useVocalBridge()

  const { transcript, clear } = useTranscript()
  const transcriptRef = useRef(null)

  const isConnected    = state === ConnectionState.Connected
  const isReconnecting = state === ConnectionState.Reconnecting
  const isWaiting      = state === ConnectionState.WaitingForAgent
  const isConnecting   = state === ConnectionState.Connecting || isWaiting
  const inSession      = isConnected || isReconnecting

  const statusLabel = {
    [ConnectionState.Connected]:       'en línea',
    [ConnectionState.Connecting]:      'conectando',
    [ConnectionState.WaitingForAgent]: 'esperando agente',
    [ConnectionState.Reconnecting]:    'reconectando',
    [ConnectionState.Disconnecting]:   'cerrando',
    [ConnectionState.Disconnected]:    'inactivo',
  }[state] ?? 'inactivo'

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
  }, [transcript])

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.widget} onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>
              ☕
              {isConnected && <div className={styles.avatarOnline} />}
            </div>
            <div>
              <div className={styles.name}>Cafelito</div>
              <div className={styles.sub}>
                Asesor de café · {agentMode || 'BC MCP'}
              </div>
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.statusRow}>
              <span className={styles.statusText}>{statusLabel}</span>
              <div className={`${styles.statusDot} ${isConnected ? styles.online : ''} ${(isConnecting || isReconnecting) ? styles.busy : ''}`} />
            </div>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* ── Error banner ── */}
        {error && (
          <div className={styles.errorBanner}>
            ⚠ {error.message}
          </div>
        )}

        {/* ── Transcript ── */}
        <div className={styles.transcript} ref={transcriptRef}>
          {transcript.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>☕</div>
              <div className={styles.emptyText}>
                {isWaiting
                  ? 'Cafelito se está preparando...'
                  : isConnecting
                    ? 'Conectando con Cafelito...'
                    : 'Pulsa conectar y empieza a hablar'}
              </div>
              {isConnecting && <div className={styles.spinner} />}
            </div>
          ) : (
            transcript.map((entry, i) => (
              <Entry key={i} role={entry.role} text={entry.text} timestamp={entry.timestamp} />
            ))
          )}
        </div>

        {/* ── Controls ── */}
        <div className={styles.controls}>

          {/* Wave + mic + clear (solo en sesión) */}
          {inSession && (
            <div className={styles.controlRow}>
              <SoundWave active={isMicrophoneEnabled} />
              <div className={styles.btnRow}>
                <button
                  className={`${styles.micBtn} ${!isMicrophoneEnabled ? styles.muted : ''}`}
                  onClick={toggleMicrophone}
                  title={isMicrophoneEnabled ? 'Silenciar' : 'Activar micrófono'}
                >
                  {isMicrophoneEnabled ? '🎤' : '🔇'}
                </button>
                <button className={styles.clearBtn} onClick={clear} title="Limpiar transcript">
                  🗑
                </button>
              </div>
            </div>
          )}

          {/* Connect / Disconnect */}
          {!inSession ? (
            <button
              className={styles.connectBtn}
              onClick={connect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <><div className={styles.spinnerSmall} /> {isWaiting ? 'Esperando a Cafelito...' : 'Conectando...'}</>
              ) : (
                <><span>☕</span> Hablar con Cafelito</>
              )}
            </button>
          ) : (
            <button className={styles.disconnectBtn} onClick={disconnect}>
              ✕ Finalizar conversación
            </button>
          )}

          {/* BC tools indicator */}
          {inSession && (
            <div className={styles.tools}>
              <div className={styles.toolsLabel}>// herramientas BC activas</div>
              <div className={styles.chips}>
                {['get-items', 'get-customers', 'get-sales-invoices', 'create-incident'].map(t => (
                  <span key={t} className={styles.chip}>{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
