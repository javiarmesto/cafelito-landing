// src/context/TelemetryContext.jsx
// ─────────────────────────────────────────────
// Registro de los eventos REALES del canal de datos
// con el agente (acciones recibidas y enviadas) para
// mostrarlos en la barra de telemetría.
//
// Importante: aquí solo se registran eventos que
// ocurren de verdad. Nada de trazas decorativas —
// si algo aparece en pantalla, ha pasado.
// ─────────────────────────────────────────────
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const MAX_TRACES = 40

const TelemetryContext = createContext(null)

let nextId = 1

export function TelemetryProvider({ children }) {
  const [traces, setTraces] = useState([])

  /**
   * Registra un evento del canal.
   * @param {'in'|'out'} direction  'in' = del agente, 'out' = de la web
   * @param {string} action         nombre de la acción
   * @param {string} [detail]       resumen corto para la traza
   */
  const track = useCallback((direction, action, detail = '') => {
    setTraces(prev => [
      { id: nextId++, direction, action, detail, at: Date.now() },
      ...prev,
    ].slice(0, MAX_TRACES))
  }, [])

  const clear = useCallback(() => setTraces([]), [])

  const value = useMemo(() => ({ traces, track, clear }), [traces, track, clear])

  return <TelemetryContext.Provider value={value}>{children}</TelemetryContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook + provider conviven por cohesión
export function useTelemetry() {
  const ctx = useContext(TelemetryContext)
  if (!ctx) throw new Error('useTelemetry must be used within a TelemetryProvider')
  return ctx
}
