// src/components/AgentCartBridge.jsx
// ─────────────────────────────────────────────
// Puente carrito ↔ agente (sin UI):
//  · agente → UI: add_to_cart / remove_from_cart / clear_cart
//  · UI → agente: cart_updated en cada cambio con la llamada activa
// ─────────────────────────────────────────────
import { useEffect, useRef } from 'react'
import { useAgentActions, useVocalBridge } from '@vocalbridgeai/react'
import { ConnectionState } from '@vocalbridgeai/sdk'
import { resolveCoffee } from '../data/coffees.js'
import { useCart } from '../context/CartContext.jsx'
import { useTelemetry } from '../context/TelemetryContext.jsx'

export default function AgentCartBridge() {
  const { state } = useVocalBridge()
  const { onAction, sendAction } = useAgentActions()
  const { items, total, addItem, removeItem, clear, setLastOrder } = useCart()
  const { track } = useTelemetry()

  useEffect(() => {
    return onAction('add_to_cart', payload => {
      const coffee = resolveCoffee(payload)
      if (!coffee) {
        console.error('[cart] add_to_cart sin match:', JSON.stringify(payload))
        return
      }
      const qty = Math.max(1, parseInt(payload.qty ?? payload.quantity, 10) || 1)
      track('in', 'add_to_cart', `${coffee.name} ×${qty}`)
      addItem(coffee.id, qty)
    })
  }, [onAction, addItem, track])

  useEffect(() => {
    return onAction('remove_from_cart', payload => {
      const coffee = resolveCoffee(payload)
      if (!coffee) return
      track('in', 'remove_from_cart', coffee.name)
      removeItem(coffee.id)
    })
  }, [onAction, removeItem, track])

  useEffect(() => {
    return onAction('clear_cart', () => {
      track('in', 'clear_cart')
      clear()
    })
  }, [onAction, clear, track])

  // El agente confirma que el pedido se creó en BC → vaciar carrito + aviso visual
  useEffect(() => {
    return onAction('order_created', payload => {
      track('in', 'order_created', String(payload.order_number ?? ''))
      setLastOrder({
        order_number: String(payload.order_number ?? payload.orderNumber ?? ''),
        total: Number(payload.total) || null,
      })
      clear()
    })
  }, [onAction, setLastOrder, clear, track])

  // Snapshot del carrito al agente en cada cambio durante la llamada
  const connected = state === ConnectionState.Connected
  const lastSentRef = useRef(null)
  useEffect(() => {
    if (!connected) {
      lastSentRef.current = null   // re-enviar el estado al (re)conectar
      return
    }
    const snapshot = JSON.stringify({
      items: items.map(i => ({ id: i.id, bc_item_no: i.bcItemNo, name: i.name, qty: i.qty, price: i.price })),
      total: Number(total.toFixed(2)),
    })
    if (snapshot === lastSentRef.current) return
    lastSentRef.current = snapshot
    track('out', 'cart_updated', `${items.length} líneas · ${total.toFixed(2)} €`)
    sendAction('cart_updated', JSON.parse(snapshot))
      .catch(err => console.error('[cart] cart_updated:', err.message))
  }, [connected, items, total, sendAction, track])

  return null
}
