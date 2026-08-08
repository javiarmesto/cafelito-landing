// src/App.jsx
// ─────────────────────────────────────────────
// TOKEN_URL apunta al backend Express que ya tienes.
// En desarrollo: http://localhost:3001/api/voice-token
// En producción: https://tu-dominio.com/api/voice-token
// ─────────────────────────────────────────────
import { useState } from 'react'
import { VocalBridgeProvider } from '@vocalbridgeai/react'
import { CartProvider } from './context/CartContext.jsx'
import { CatalogProvider } from './context/CatalogContext.jsx'
import Hero         from './components/Hero.jsx'
import OriginsMap   from './components/OriginsMap.jsx'
import Catalogue    from './components/Catalogue.jsx'
import ThemeToggle  from './components/ThemeToggle.jsx'
import VoiceWidget from './components/VoiceWidget.jsx'
import VoiceFAB  from './components/VoiceFAB.jsx'
import CartButton from './components/CartButton.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import ProductDetail from './components/ProductDetail.jsx'
import AgentCartBridge from './components/AgentCartBridge.jsx'
import OrderToast from './components/OrderToast.jsx'
import './index.css'

const TOKEN_URL = import.meta.env.VITE_TOKEN_URL || 'http://localhost:3001/api/voice-token'

export default function App() {
  const [widgetOpen, setWidgetOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedCoffee, setSelectedCoffee] = useState(null)

  return (
    <VocalBridgeProvider options={{ auth: { tokenUrl: TOKEN_URL } }}>
    <CatalogProvider>
    <CartProvider>
      <AgentCartBridge />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--surface-strong)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 20, fontWeight: 700, color: 'var(--gold)',
        }}>
          ☕ Cafelito
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: 11, color: 'var(--muted)',
            letterSpacing: '0.08em',
          }}>
            single origin · specialty coffee
          </span>
          <CartButton onClick={() => setCartOpen(o => !o)} />
          <ThemeToggle />
        </div>
      </nav>

      {/* Page */}
      <Hero onChatOpen={() => setWidgetOpen(true)} />
      <OriginsMap />
      <Catalogue onSelect={setSelectedCoffee} />

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid var(--border)',
        padding: '28px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--muted)' }}>
          © 2026 Cafelito · powered by VocalBridge AI + Business Central
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--muted)', opacity: 0.7 }}>
          showcase demo · VS Sistemas
        </span>
      </footer>

      {/* Product detail (modal) */}
      {selectedCoffee && (
        <ProductDetail
          coffee={selectedCoffee}
          onClose={() => setSelectedCoffee(null)}
        />
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <CartDrawer
          onClose={() => setCartOpen(false)}
          onOpenVoice={() => { setCartOpen(false); setWidgetOpen(true) }}
        />
      )}

      {/* Voice widget (modal) */}
      {widgetOpen && (
        <VoiceWidget onClose={() => setWidgetOpen(false)} />
      )}

      {/* Confirmación de pedido creado en BC */}
      <OrderToast />

      {/* Floating button */}
      <VoiceFAB
        onClick={() => setWidgetOpen(o => !o)}
        isOpen={widgetOpen}
      />

    </CartProvider>
    </CatalogProvider>
    </VocalBridgeProvider>
  )
}
