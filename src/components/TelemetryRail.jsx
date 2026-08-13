// src/components/TelemetryRail.jsx
// ─────────────────────────────────────────────
// Franja inferior del mostrador: el canal de datos
// entre la web y el agente, a la vista.
//
// Solo muestra eventos que han ocurrido de verdad
// (acciones recibidas y enviadas). Nada decorativo:
// si aparece en pantalla, ha pasado.
// ─────────────────────────────────────────────
import { useState } from 'react'
import { useVocalBridge } from '@vocalbridgeai/react'
import { ConnectionState } from '@vocalbridgeai/sdk'
import { useTelemetry } from '../context/TelemetryContext.jsx'
import { useCatalog } from '../context/CatalogContext.jsx'
import { IconPlug } from './Icons.jsx'
import styles from './TelemetryRail.module.css'

function clock(at) {
  return new Date(at).toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

export default function TelemetryRail() {
  const { traces } = useTelemetry()
  const { state } = useVocalBridge()
  const { liveStock } = useCatalog()
  const [open, setOpen] = useState(true)

  const connected = state === ConnectionState.Connected

  return (
    <aside className={styles.rail} aria-label="Canal de datos con el agente">
      <div className={styles.bar}>
        <span className={styles.brand}>
          <IconPlug size={13} />
          canal de datos
        </span>

        <span className={`${styles.stat} ${connected ? styles.statOk : ''}`}>
          <span className={styles.dot} aria-hidden="true" />
          agente {connected ? 'conectado' : 'en reposo'}
        </span>

        <span className={`${styles.stat} ${liveStock ? styles.statOk : ''}`}>
          <span className={styles.dot} aria-hidden="true" />
          business central {liveStock ? 'ok' : 'respaldo'}
        </span>

        <span className={styles.count}>{traces.length} eventos</span>

        <button
          className={styles.toggle}
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
        >
          {open ? 'ocultar' : 'ver trazas'}
        </button>
      </div>

      {open && (
        <div className={styles.traces}>
          {traces.length === 0 ? (
            <p className={styles.idle}>
              Sin eventos todavía. Las acciones entre Cafelito y esta página aparecerán aquí.
            </p>
          ) : (
            traces.map(t => (
              <span key={t.id} className={styles.trace}>
                <span className={styles.time}>{clock(t.at)}</span>
                <span className={t.direction === 'in' ? styles.arrowIn : styles.arrowOut}>
                  {t.direction === 'in' ? '←' : '→'}
                </span>
                <span className={styles.action}>{t.action}</span>
                {t.detail && <span className={styles.detail}>{t.detail}</span>}
              </span>
            ))
          )}
        </div>
      )}
    </aside>
  )
}
