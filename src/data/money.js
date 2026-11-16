// src/data/money.js
// Business Central (Capsula US) works in US dollars: one formatter for every price on screen.
export const CURRENCY = 'USD'

const formatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: CURRENCY })

/** 19 → "19,00 US$" */
export function formatPrice(n) {
  return formatter.format(n)
}
