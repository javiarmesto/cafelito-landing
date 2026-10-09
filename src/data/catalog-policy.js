const MAX_AGE_MS = 5 * 60 * 1000

export function catalogData(payload, now = Date.now()) {
  if (!payload || !Array.isArray(payload.items)) return null
  const stocks = new Map()
  for (const item of payload.items) {
    if (typeof item?.number === 'string' && Number.isFinite(item.stock) && item.stock >= 0) stocks.set(item.number, item.stock)
  }
  if (!stocks.size) return null
  const timestamp = typeof payload.generated_at === 'string' ? Date.parse(payload.generated_at) : NaN
  const dated = Number.isFinite(timestamp) && timestamp <= now + 30000
  const snapshot = payload.provenance?.type === 'snapshot' || /snapshot/i.test(payload.source ?? '')
  const live = !snapshot && payload.provenance?.type === 'live' && payload.provenance.live === true && dated && now - timestamp <= MAX_AGE_MS
  const date = dated ? new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium', timeZone: 'UTC' }).format(timestamp) : 'fecha desconocida'
  return {
    stocks, liveStock: live,
    expiresAt: live ? timestamp + MAX_AGE_MS : null,
    stockLabel: live ? 'stock reciente · Business Central' : `stock de referencia · ${date}`,
  }
}
