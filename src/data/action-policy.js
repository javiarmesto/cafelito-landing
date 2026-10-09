export const MAX_LINE_QTY = 99 // UI limit; not a Business Central stock guarantee.

export function actionQuantity(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null
  const value = payload.qty !== undefined ? payload.qty : payload.quantity !== undefined ? payload.quantity : 1
  const qty = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value
  return Number.isSafeInteger(qty) && qty > 0 && qty <= MAX_LINE_QTY ? qty : null
}

export function quantityLimit(coffee) {
  return Number.isFinite(coffee?.stock) && coffee.stock >= 0
    ? Math.min(MAX_LINE_QTY, Math.floor(coffee.stock)) : 0
}

export function changeEntries(entries, catalog, id, qty, add = false) {
  if (!Number.isSafeInteger(qty) || qty < 0 || qty > MAX_LINE_QTY) return entries
  const coffee = catalog.find(item => item.id === id)
  if (!coffee) return entries
  if (qty === 0) return add ? entries : entries.filter(item => item.id !== id)
  const existing = entries.find(item => item.id === id)
  const next = Math.min(quantityLimit(coffee), qty + (add ? existing?.qty ?? 0 : 0))
  if (!next) return entries
  return existing ? entries.map(item => item.id === id ? { ...item, qty: next } : item) : [...entries, { id, qty: next }]
}

export function cartSnapshot(items) {
  if (!items.length || items.some(item => !Number.isSafeInteger(item.qty) || item.qty < 1 ||
    item.qty > quantityLimit(item) || typeof item.bcItemNo !== 'string' || !item.bcItemNo ||
    !Number.isFinite(item.price) || item.price < 0)) return null
  return {
    items: items.map(item => ({ id: item.id, bc_item_no: item.bcItemNo, name: item.name, qty: item.qty, price: item.price })),
    total: Math.round(items.reduce((sum, item) => sum + item.price * item.qty, 0) * 100) / 100,
  }
}

/** A well-formed action is still a report from the model, not a BC receipt. */
export function reportedOrder(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null
  const number = payload.order_number ?? payload.orderNumber
  if (typeof number !== 'string' || !number.trim() || number.length > 80 || [...number].some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127) ||
    typeof payload.total !== 'number' || !Number.isFinite(payload.total) || payload.total < 0) return null
  return { order_number: number.trim(), total: payload.total, verification: 'pending' }
}
