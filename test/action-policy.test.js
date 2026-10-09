import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { actionQuantity, changeEntries, cartSnapshot, reportedOrder } from '../src/data/action-policy.js'
import { coffees, resolveCoffee } from '../src/data/coffees.js'
import { catalogData } from '../src/data/catalog-policy.js'

describe('acciones de Cafelito', () => {
  it('resuelve bc_item_no y rechaza referencias vacías, malformadas o ambiguas', () => {
    assert.equal(resolveCoffee({ bc_item_no: 'WRB-1000' }).id, 'WRB-COL')
    assert.equal(resolveCoffee({ name: 'Colombia' }).id, 'WRB-COL')
    assert.equal(resolveCoffee({ name: 'Colom' }), null) // Colombia and Colombia Decaf
    for (const value of [null, [], {}, { id: 'inexistente' }]) assert.equal(resolveCoffee(value), null)
  })
  it('no convierte negativos, decimales, basura o cantidades excesivas en una compra de una unidad', () => {
    for (const qty of [null, -1, 0, 1.5, '2 cafés', '1e2', NaN, Infinity, 100]) assert.equal(actionQuantity({ qty }), null)
    assert.equal(actionQuantity({ qty: '2' }), 2)
    assert.equal(actionQuantity({}), 1)
  })
  it('aplica el límite por stock al añadir repetidamente y no añade agotados', () => {
    const catalog = coffees.map(item => ({ ...item, stock: item.id === 'WRB-COL' ? 3 : 0 }))
    let entries = changeEntries([], catalog, 'WRB-COL', 2, true)
    entries = changeEntries(entries, catalog, 'WRB-COL', 2, true)
    assert.deepEqual(entries, [{ id: 'WRB-COL', qty: 3 }])
    assert.equal(changeEntries(entries, catalog, 'WRB-BRA', 1, true), entries)
    assert.equal(changeEntries(entries, catalog, 'WRB-COL', -1), entries)
    assert.deepEqual(changeEntries(entries, catalog, 'WRB-COL', 0), [])
  })
  it('impide checkout si cambia el stock, conserva códigos BC y calcula el total en céntimos', () => {
    const item = { ...coffees[0], qty: 2 }
    assert.equal(cartSnapshot([{ ...item, stock: 1 }]), null)
    assert.equal(cartSnapshot([]), null)
    const snapshot = cartSnapshot([item])
    assert.equal(snapshot.items[0].bc_item_no, 'WRB-1000')
    assert.equal(snapshot.total, 35)
  })
  it('ni un payload bien formado puede acreditar una operación en BC', () => {
    for (const value of [null, {}, { order_number: '', total: 10 }, { order_number: 'DEMO', total: '10' }, { order_number: 'DEMO', total: Infinity }]) assert.equal(reportedOrder(value), null)
    assert.deepEqual(reportedOrder({ order_number: ' DEMO-1 ', total: 0, verified: true }), { order_number: 'DEMO-1', total: 0, verification: 'pending' })
  })
  it('mantiene las ocho declaraciones y los dos notify frente a un respond', () => {
    const actions = JSON.parse(readFileSync(new URL('../config/client-actions.json', import.meta.url), 'utf8'))
    assert.equal(actions.length, 8)
    assert.equal(new Set(actions.map(action => action.name)).size, 8)
    assert.equal(actions.find(action => action.name === 'view_product').behavior, 'notify')
    assert.equal(actions.find(action => action.name === 'cart_updated').behavior, 'notify')
    assert.equal(actions.find(action => action.name === 'checkout_cart').behavior, 'respond')
  })
})

describe('fecha y procedencia del catálogo', () => {
  const now = Date.parse('2026-10-09T15:00:00Z')
  const base = { items: [{ number: 'WRB-1000', stock: 5 }], generated_at: '2026-08-08T09:40:00Z', source: 'snapshot manual' }
  it('un catálogo HTTP correcto no es stock en vivo ni renueva su fecha', () => {
    assert.equal(catalogData(base, now).liveStock, false)
    assert.match(catalogData(base, now).stockLabel, /8 ago 2026/)
    assert.equal(catalogData({ ...base, provenance: { type: 'live' } }, now).liveStock, false)
  })
  it('solo marca reciente una fuente declarada live, con fecha válida y fresca', () => {
    const fresh = { ...base, source: 'Business Central', generated_at: '2026-10-09T14:59:00Z', provenance: { type: 'live', live: true } }
    assert.equal(catalogData(fresh, now).liveStock, true)
    assert.equal(catalogData({ ...fresh, provenance: { type: 'live', live: false } }, now).liveStock, false)
    assert.equal(catalogData(fresh, now + 6 * 60000).liveStock, false)
    assert.equal(catalogData({ ...fresh, generated_at: '2026-10-10T14:59:00Z' }, now).liveStock, false)
  })
  it('descarta stocks inválidos y conserva el cero sin inventar existencias', () => {
    assert.equal(catalogData({ items: [{ number: 'WRB-1000', stock: -1 }] }), null)
    assert.equal(catalogData({ items: [{ number: 'WRB-1000', stock: '5' }] }), null)
    assert.equal(catalogData({ items: [{ number: 'WRB-1000', stock: 0 }] }).stocks.get('WRB-1000'), 0)
  })
})
